#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génération automatique d'un article de blog — SUD Diagnostic Bâtiment.

Adaptation pour Next.js du générateur utilisé sur les sites statiques de
Caza Comm. Même logique (sujets dans BLOG_WORKFLOW.md, réserve
auto-réapprovisionnée, contenu structuré en JSON, validation, rattrapages),
mais la sortie est un simple fichier de contenu :

    content/blog/<slug>.json

La page, les métadonnées, les JSON-LD, le sitemap, le flux RSS et llms.txt
sont fabriqués par Next.js au build (src/lib/blog.ts, src/app/blog/…). Le
modèle n'écrit donc aucune ligne de HTML et ne peut rien casser.

Codes de sortie :
   0  succès
   1  erreur (rien n'a été écrit)
  78  aucun nouveau sujet à traiter (arrêt propre)

Options :
  --dry-run       n'écrit aucun fichier, affiche le résultat
  --mock          n'appelle pas l'API (contenu de démonstration)
  --rewrite SLUG  régénère un article existant et écrase son fichier
  --topics-only   réapprovisionne UNIQUEMENT la réserve de sujets
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "blog-config.json"
WORKFLOW_PATH = ROOT / "BLOG_WORKFLOW.md"
# Un article = un fichier JSON. La page, le sitemap, le flux RSS, llms.txt et
# les JSON-LD sont fabriqués par Next.js au build (src/lib/blog.ts).
CONTENT_DIR = ROOT / "content" / "blog"
SRC_LIB = ROOT / "src" / "lib"

EXIT_OK, EXIT_ERROR, EXIT_NOTHING_TODO = 0, 1, 78

# Volume du corps rédigé, FAQ exclue, compté sur le contenu et non sur le HTML.
#  · PROMPT_MIN/MAX_WORDS : la cible, annoncée au modèle et seuil de rattrapage.
#  · MIN/MAX_WORDS        : bornes de validation, plus larges (tolérance ±30 %).
# Le contournement « annoncer 1600 pour obtenir 1200 » n'a plus lieu d'être :
# le modèle ne dépense plus ses tokens en balisage, la consigne redevient tenable.
MIN_WORDS, MAX_WORDS = 900, 1900
PROMPT_MIN_WORDS, PROMPT_MAX_WORDS = 1200, 1500

# Nombre maximal d'appels OpenAI pour un article, rattrapages compris.
# Le modèle rend ~600 mots en première passe et gagne 60 à 75 % à chaque
# reprise : deux appels plafonnent vers 1000-1100 mots, trois franchissent 1200.
MAX_CALLS = 3

# Réserve de sujets. Le pipeline ne doit jamais s'arrêter faute de matière :
# dès qu'il reste moins de TOPIC_RESERVE_MIN sujets non traités dans
# BLOG_WORKFLOW.md, un nouveau lot est généré, ajouté au tableau et committé
# à part — avant la rédaction, pour que les sujets survivent à un échec
# d'article. TOPIC_MAX_CALLS borne les relances quand le modèle rend trop de
# doublons. Les sujets sont générés par gpt-4o, indépendamment du modèle de
# rédaction configuré dans blog-config.json.
TOPIC_RESERVE_MIN = 8
TOPIC_BATCH = 40
TOPIC_MAX_CALLS = 2
TOPICS_MODEL = "gpt-4o"

MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin",
             "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
DAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

# Mots vides écartés de la construction des slugs.
STOPWORDS = {
    "le", "la", "les", "un", "une", "des", "du", "de", "d", "l", "et", "ou", "a", "au",
    "aux", "en", "dans", "sur", "pour", "par", "avec", "sans", "que", "qui", "quoi",
    "ce", "cet", "cette", "ces", "se", "sa", "son", "ses", "nos", "notre", "votre",
    "vos", "est", "ne", "pas", "plus", "tout", "tous", "toute", "toutes", "y", "il",
    "elle", "on", "vraiment", "bien",
}


# ─────────────────────────────────────────────────────────────
# Utilitaires
# ─────────────────────────────────────────────────────────────

def log(msg: str) -> None:
    print(f"[blog] {msg}", flush=True)


def fail(msg: str) -> None:
    print(f"[blog][ERREUR] {msg}", file=sys.stderr, flush=True)


def strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text)
                   if unicodedata.category(c) != "Mn")


def slugify(title: str, max_words: int = 7) -> str:
    """Slug déterministe : même titre => même slug (garantit l'idempotence)."""
    text = strip_accents(title.lower())
    text = text.replace("'", " ").replace("’", " ")
    text = re.sub(r"[^a-z0-9]+", " ", text)
    words = [w for w in text.split() if w and w not in STOPWORDS]
    if not words:
        words = [w for w in text.split() if w]
    words = words[:max_words]
    # Un slug ne doit pas se terminer sur un interrogatif orphelin
    # (« …-tarbes-arsenal-comment ») quand la troncature tombe au mauvais endroit.
    while len(words) > 3 and words[-1] in {"comment", "pourquoi", "quand", "quel",
                                           "quelle", "quels", "quelles", "combien"}:
        words.pop()
    return "-".join(words)


def esc(text: str) -> str:
    """Échappement HTML. Tout le contenu du modèle passe par là : il fournit du
    texte brut, jamais du markup, ce qui rend une injection HTML impossible."""
    return (text.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace('"', "&quot;"))


def inline(text: str) -> str:
    """Rend le balisage inline autorisé dans le texte du modèle, après
    échappement : **gras** et [libellé](/chemin-interne).

    Les liens sont restreints aux chemins commençant par « / » : le maillage
    interne reste possible, un lien externe devient structurellement impossible."""
    out = esc(text)
    out = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", out)
    # Le site utilise des chemins relatifs partout : un article vit à
    # /blog/<slug>/, d'où le préfixe « ../.. ».
    out = re.sub(r"\[([^\]]+)\]\((/[^)\s]*)\)", r'<a href="../..\2">\1</a>', out)
    return out


def plain(text: str) -> str:
    """Texte débarrassé du balisage inline — pour les JSON-LD et les meta."""
    out = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    return re.sub(r"\[([^\]]+)\]\((/[^)\s]*)\)", r"\1", out)


def content_word_count(data: dict) -> int:
    """Volume rédactionnel du corps, FAQ exclue — compté sur le contenu lui-même
    et non sur du HTML : plus de balises ni de boilerplate dans le total."""
    words = len(plain(data.get("lede", "")).split())
    for section in data.get("sections", []):
        words += len(plain(section.get("h2", "")).split())
        for block in section.get("content", []):
            words += len(plain(block.get("text", "")).split())
            for item in block.get("items", []) or []:
                words += len(plain(item).split())
    return words

def fr_date(d: dt.date) -> str:
    return f"{d.day} {MONTHS_FR[d.month - 1]} {d.year}"


def rfc822(d: dt.date, hour: str = "09:00:00") -> str:
    return f"{DAYS_EN[d.weekday()]}, {d.day:02d} {MONTHS_EN[d.month - 1]} {d.year} {hour} +0200"


# ─────────────────────────────────────────────────────────────
# Lecture de la configuration et du workflow
# ─────────────────────────────────────────────────────────────

def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"Configuration introuvable : {CONFIG_PATH}")
    cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    for key in ("site_name", "site_url", "sector", "location", "author",
                "categories", "internal_link_targets", "facts"):
        if not cfg.get(key):
            raise ValueError(f"Clé manquante ou vide dans blog-config.json : {key}")
    cfg["site_url"] = cfg["site_url"].rstrip("/")
    return cfg


def parse_topics(workflow: str) -> list[dict]:
    """Extrait les sujets de la section « sujets d'articles suggérés ».

    Deux écritures sont acceptées, pour que le script suive la convention du
    BLOG_WORKFLOW.md du site sans qu'on ait à retoucher ce dernier :
      · liste numérotée      1. **Titre** — angle
      · tableau markdown     | 1 | Titre | Angle |
    """
    section = re.split(r"^##\s+\d+\.\s+.*sujets d'articles suggérés.*$",
                       workflow, flags=re.M | re.I)
    if len(section) < 2:
        raise ValueError("Section des sujets suggérés introuvable dans BLOG_WORKFLOW.md")
    block = re.split(r"^##\s", section[1], flags=re.M)[0]

    topics: list[dict] = []

    # Forme 1 — liste numérotée avec titre en gras.
    for num, line in re.findall(r"^(\d+)\.\s+(.*)$", block, flags=re.M):
        title_m = re.search(r"\*\*(.+?)\*\*", line)
        if not title_m:
            continue
        title = title_m.group(1).strip()
        rest = line[title_m.end():].lstrip(" —-–").strip()
        published_m = re.search(r"`([a-z0-9\-]+)`", line)
        topics.append({
            "num": int(num),
            "title": title,
            "brief": re.sub(r"[`*✅]", "", rest).strip(),
            "declared_slug": published_m.group(1) if published_m else None,
            "declared_published": "publié" in line.lower(),
        })

    # Forme 2 — tableau markdown | n | Sujet | Angle |, en ignorant l'en-tête
    # et la ligne de séparation.
    if not topics:
        for line in block.splitlines():
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) < 2 or not cells[0].isdigit():
                continue
            title = re.sub(r"\*\*(.+?)\*\*", r"\1", cells[1]).strip()
            if not title:
                continue
            brief = cells[2] if len(cells) > 2 else ""
            published_m = re.search(r"`([a-z0-9\-]+)`", line)
            topics.append({
                "num": int(cells[0]),
                "title": title,
                "brief": re.sub(r"[`*✅]", "", brief).strip(),
                "declared_slug": published_m.group(1) if published_m else None,
                "declared_published": "publié" in line.lower(),
            })

    if not topics:
        raise ValueError("Aucun sujet exploitable trouvé dans BLOG_WORKFLOW.md")
    topics.sort(key=lambda t: t["num"])
    return topics


def parse_editorial_rules(workflow: str) -> str:
    """Récupère la section « Règles éditoriales » pour l'injecter dans le prompt."""
    m = re.search(r"^##\s+\d+\.\s+Règles éditoriales.*?$(.*?)^##\s",
                  workflow, flags=re.M | re.S)
    return m.group(1).strip() if m else ""


# ─────────────────────────────────────────────────────────────
# État du blog
# ─────────────────────────────────────────────────────────────

def scan_blog(marker_prefix: str = "") -> tuple[set[int], set[str]]:
    """Retourne (numéros de sujets déjà traités, slugs existants).

    Chaque article JSON porte son numéro de sujet dans le champ « topic » :
    c'est le marqueur d'idempotence (équivalent du commentaire HTML des sites
    statiques)."""
    done_nums: set[int] = set()
    slugs: set[str] = set()
    if not CONTENT_DIR.exists():
        return done_nums, slugs
    for path in sorted(CONTENT_DIR.glob("*.json")):
        slugs.add(path.stem)
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if isinstance(data.get("topic"), int):
            done_nums.add(data["topic"])
    return done_nums, slugs


def site_paths() -> set[str]:
    """Chemins internes qui existent réellement sur le site.

    Le modèle ne peut lier qu'à ces pages : un lien vers une page inventée
    donnerait un 404, ce qui nuit au référencement. La liste est relue dans le
    code du site à chaque exécution, elle suit donc les ajouts de pages."""
    paths = {"/", "/blog", "/devis", "/contact", "/secteur", "/diagnostics",
             "/avant-vente", "/avant-location", "/avant-travaux",
             "/diagnostic-immobilier", "/mentions-legales"}
    diag = (SRC_LIB / "diagnostics.ts").read_text(encoding="utf-8")
    paths |= {f"/diagnostics/{s}" for s in re.findall(r'^\s+slug: "([a-z0-9-]+)"', diag, re.M)}
    comm = (SRC_LIB / "communes.ts").read_text(encoding="utf-8")
    paths |= {f"/diagnostic-immobilier/{s}"
              for s in re.findall(r'^\s+slug: "([a-z0-9-]+)"', comm, re.M)}
    _, slugs = scan_blog()
    paths |= {f"/blog/{s}" for s in slugs}
    return paths


def norm_path(href: str) -> str:
    """/devis/ et /devis désignent la même page ; on ignore l'ancre."""
    href = href.split("#")[0]
    return href.rstrip("/") or "/"


def topic_is_pending(topic: dict, done_nums: set[int], slugs: set[str]) -> bool:
    """Définition UNIQUE de « sujet non traité ».

    Elle sert à la fois à compter la réserve (pending_topics) et à choisir le
    sujet du jour (pick_topic) : les deux ne peuvent donc pas diverger, et on
    ne risque pas de croire la réserve pleine alors qu'il n'y a plus rien à
    rédiger — ou l'inverse.
    """
    if topic["num"] in done_nums:
        return False
    # Sujet déclaré publié dans BLOG_WORKFLOW.md avec un slug existant.
    if topic["declared_slug"] and topic["declared_slug"] in slugs:
        return False
    # Le dossier existe déjà : on considère le sujet traité (idempotence).
    if slugify(topic["title"]) in slugs:
        return False
    return True


def pending_topics(topics: list[dict], done_nums: set[int],
                   slugs: set[str]) -> list[dict]:
    """Sujets restant à traiter, dans l'ordre de la liste."""
    return [t for t in topics if topic_is_pending(t, done_nums, slugs)]


def pick_topic(topics: list[dict], done_nums: set[int], slugs: set[str]) -> dict | None:
    """Premier sujet non traité, dans l'ordre de la liste."""
    for topic in pending_topics(topics, done_nums, slugs):
        topic["slug"] = slugify(topic["title"])
        return topic
    return None


# ─────────────────────────────────────────────────────────────
# Réserve de sujets : réapprovisionnement automatique
# ─────────────────────────────────────────────────────────────

TOPICS_HEADING_RE = re.compile(
    r"^(##\s+)(\d+)(\.\s+)(.*sujets d'articles suggérés.*)$", re.M | re.I)


def clean_line(text: str) -> str:
    """Nettoie un libellé rendu par le modèle pour qu'il tienne sur une ligne
    de tableau markdown : ni pipe (qui casserait la colonne), ni balisage, ni
    retour à la ligne, ni numérotation parasite en tête."""
    text = text.replace("|", "/").replace("\n", " ").replace("\r", " ")
    text = re.sub(r"[`*_✅]", "", text)
    text = re.sub(r"^\s*\d+\s*[.)\-–—]\s*", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip(" -–—:").strip()


def dedupe_topics(candidates: list[dict], known_slugs: set[str]) -> list[dict]:
    """Écarte les doublons.

    La clé de comparaison est le SLUG, pas le titre : c'est lui qui nomme le
    dossier de l'article et qui sert de clé d'idempotence. Deux titres
    différents qui produisent le même slug produiraient le même dossier — ils
    sont donc bien des doublons, même si les chaînes ne sont pas égales.
    """
    seen = set(known_slugs)
    kept: list[dict] = []
    for topic in candidates:
        title = clean_line(topic.get("title", ""))
        if not title:
            continue
        slug = slugify(title)
        if not slug or slug in seen:
            continue
        seen.add(slug)
        kept.append({"title": title, "brief": clean_line(topic.get("brief", ""))})
    return kept


def build_topics_prompt(cfg: dict, existing: list[str], count: int) -> tuple[str, str]:
    """Prompt de génération de sujets, ancré sur le secteur et la zone du site."""
    geo = ", ".join(cfg.get("geo_keywords", [])) or cfg["location"]
    listing = "\n".join(f"- {t}" for t in existing) or "(aucun)"

    system = (
        "Tu es consultant en stratégie de contenu SEO local pour des sites de "
        "proximité en France. Tu proposes des sujets d'articles concrets, "
        "actionnables et réellement recherchés par les clients du secteur. "
        "Tu réponds exclusivement par un objet JSON valide."
    )

    user = f"""Site : {cfg['site_name']} ({cfg['site_url']})
Secteur : {cfg['sector']}
Zone desservie : {cfg['location']}
Mots-clés géographiques : {geo}
Ton éditorial : {cfg.get('tone', 'clair et professionnel')}

Propose {count} NOUVEAUX sujets d'articles de blog pour ce site.

Sujets DÉJÀ prévus ou publiés — n'en propose aucun équivalent, même reformulé :
{listing}

Contraintes :
- chaque sujet est concret et actionnable : il répond à une question que se
  pose réellement un client, pas à un thème vague ;
- ancrage local explicite ou implicite sur {cfg['location']} et sa zone, sans
  répéter mécaniquement le nom de la ville dans les {count} titres ;
- chaque sujet vise une intention de recherche identifiable (comparaison,
  décision, mode d'emploi, saisonnier, réassurance, checklist) ;
- angle conseil : le lecteur doit repartir avec quelque chose d'utile ;
- titres de 40 à 90 caractères, sans numérotation, sans guillemets ;
- varie les formats et les intentions, n'enchaîne pas {count} guides identiques ;
- aucun chiffre, tarif, pourcentage ni texte réglementaire dans les titres.

Format de réponse EXACT :
{{
  "topics": [
    {{"title": "Le titre du sujet", "brief": "Angle / intention de recherche en une ligne"}}
  ]
}}

Réponds par le seul objet JSON, avec exactement {count} entrées."""

    return system, user


def parse_topics_response(payload: object) -> list[dict]:
    """Extrait la liste de sujets de la réponse du modèle, en tolérant les
    formes approchantes (clé différente, liste nue, entrées en texte brut)."""
    items: object = payload
    if isinstance(payload, dict):
        for key in ("topics", "sujets", "items", "results", "data"):
            if isinstance(payload.get(key), list):
                items = payload[key]
                break
        else:
            items = next((v for v in payload.values() if isinstance(v, list)), [])
    if not isinstance(items, list):
        raise ValueError("réponse de génération de sujets inexploitable")

    topics: list[dict] = []
    for item in items:
        if isinstance(item, str):
            title, _, brief = item.partition(" — ")
            if not brief:
                title, _, brief = item.partition(" - ")
            topics.append({"title": title, "brief": brief})
        elif isinstance(item, dict):
            title = item.get("title") or item.get("titre") or item.get("sujet") or ""
            brief = (item.get("brief") or item.get("angle")
                     or item.get("intention") or item.get("description") or "")
            topics.append({"title": str(title), "brief": str(brief)})
    return topics


def generate_topics(cfg: dict, existing: list[str], count: int) -> list[dict]:
    """Un appel OpenAI (gpt-4o) rendant un lot de sujets bruts, non dédupliqués."""
    system, user = build_topics_prompt(cfg, existing, count)
    data = generate_content(cfg, system, user, model=TOPICS_MODEL)
    return parse_topics_response(data)


def mock_topics(cfg: dict, existing: list[str], count: int) -> list[dict]:
    """Lot de sujets fabriqué localement : --mock ne doit appeler aucune API."""
    angles = ["Comparatif, intention « choix »", "Mode d'emploi pratique",
              "Réassurance des vendeurs", "Contenu saisonnier",
              "Checklist actionnable", "Contenu 100 % local"]
    start = len(existing) + 1
    return [{"title": f"Sujet de démonstration n°{start + i} à {cfg['location']}",
             "brief": angles[i % len(angles)]} for i in range(count)]


def append_topics_to_workflow(workflow: str, new_topics: list[dict]) -> str:
    """Ajoute les sujets à la fin de la section, au format local du fichier.

    Le format n'est pas imposé : il est relu dans le fichier. Ce
    BLOG_WORKFLOW.md-ci utilise un tableau `| n | Sujet | Angle |` sans colonne
    de slug ; un autre site peut utiliser la liste numérotée en gras, ou
    déclarer un slug explicite. On recopie la forme trouvée, colonne pour
    colonne, et la numérotation reprend au dernier numéro existant.
    """
    heading = TOPICS_HEADING_RE.search(workflow)
    if not heading:
        raise ValueError("Section des sujets suggérés introuvable dans BLOG_WORKFLOW.md")

    block_start = heading.end()
    rest = workflow[block_start:]
    next_section = re.search(r"^##\s", rest, flags=re.M)
    block_end = block_start + (next_section.start() if next_section else len(rest))
    block = workflow[block_start:block_end]

    lines = block.splitlines()
    table_idx = [i for i, ln in enumerate(lines)
                 if re.match(r"^\s*\|\s*\d+\s*\|", ln)]
    list_idx = [i for i, ln in enumerate(lines)
                if re.match(r"^\s*\d+\.\s+.*\*\*.+\*\*", ln)]

    nums = [int(m.group(1)) for m in
            (re.match(r"^\s*\|\s*(\d+)\s*\|", ln) or re.match(r"^\s*(\d+)\.\s", ln)
             for ln in lines) if m]
    next_num = (max(nums) + 1) if nums else 1

    if table_idx:
        last = table_idx[-1]
        # Nombre de colonnes du tableau local, en-tête faisant foi.
        header = next((ln for ln in lines if re.match(r"^\s*\|\s*#\s*\|", ln)),
                      lines[last])
        columns = len([c for c in header.strip().strip("|").split("|")])
        # Certains sites déclarent un slug explicite en 4ᵉ colonne : on le
        # remplit alors, sinon on s'en tient aux colonnes existantes.
        rows = []
        for topic in new_topics:
            cells = [str(next_num), topic["title"], topic.get("brief", "")]
            if columns >= 4:
                cells.append(f"`{slugify(topic['title'])}`")
            cells = cells[:columns]
            while len(cells) < columns:
                cells.append("")
            rows.append("| " + " | ".join(cells) + " |")
            next_num += 1
        insert_at = last + 1
    elif list_idx:
        last = list_idx[-1]
        rows = []
        for topic in new_topics:
            brief = topic.get("brief", "")
            rows.append(f"{next_num}. **{topic['title']}**"
                        + (f" — {brief}" if brief else ""))
            next_num += 1
        insert_at = last + 1
    else:
        raise ValueError("Format des sujets non reconnu dans BLOG_WORKFLOW.md")

    lines[insert_at:insert_at] = rows
    new_block = "\n".join(lines)
    if block.endswith("\n"):
        new_block += "\n"

    # Le titre de section ne peut plus annoncer un décompte figé (« Douze
    # sujets… ») dès lors que la liste s'allonge toute seule.
    new_heading = f"{heading.group(1)}{heading.group(2)}{heading.group(3)}Sujets d'articles suggérés"
    return workflow[:heading.start()] + new_heading + new_block + workflow[block_end:]


def git_commit_file(path: Path, message: str) -> bool:
    """Committe UN seul fichier. Retourne False s'il n'y avait rien à committer.

    Les sujets sont committés séparément de l'article : s'ils sont poussés puis
    que la rédaction échoue, le travail de réapprovisionnement est déjà acquis.
    """
    rel = str(path.relative_to(ROOT))
    status = subprocess.run(["git", "status", "--porcelain", "--", rel],
                            cwd=ROOT, capture_output=True, text=True, check=True)
    if not status.stdout.strip():
        log(f"Rien à committer pour {rel}.")
        return False
    subprocess.run(["git", "add", "--", rel], cwd=ROOT, check=True,
                   capture_output=True, text=True)
    subprocess.run(["git", "commit", "-m", message, "--", rel], cwd=ROOT,
                   check=True, capture_output=True, text=True)
    log(f"Commit : {message}")
    return True


def replenish_topics(cfg: dict, topics: list[dict], done_nums: set[int],
                     slugs: set[str], *, mock: bool = False,
                     commit: bool = True) -> int:
    """Regarnit la réserve si elle passe sous TOPIC_RESERVE_MIN.

    Retourne le nombre de sujets réellement ajoutés (0 si la réserve suffit).
    """
    reserve = len(pending_topics(topics, done_nums, slugs))
    if reserve >= TOPIC_RESERVE_MIN:
        log(f"Réserve de sujets : {reserve} non traités (seuil {TOPIC_RESERVE_MIN}) "
            "— pas de réapprovisionnement.")
        return 0

    log(f"Réserve basse : {reserve} sujet(s) non traité(s) pour un seuil de "
        f"{TOPIC_RESERVE_MIN} — génération de {TOPIC_BATCH} nouveaux sujets.")

    existing_titles = [t["title"] for t in topics]
    # Les slugs déjà pris : ceux des sujets listés ET ceux des articles en ligne.
    known = {slugify(t["title"]) for t in topics} | set(slugs)
    known |= {t["declared_slug"] for t in topics if t["declared_slug"]}

    fresh: list[dict] = []
    for attempt in range(1, TOPIC_MAX_CALLS + 1):
        missing = TOPIC_BATCH - len(fresh)
        if missing <= 0:
            break
        if mock:
            raw = mock_topics(cfg, existing_titles + [t["title"] for t in fresh], missing)
        else:
            raw = generate_topics(cfg, existing_titles + [t["title"] for t in fresh],
                                  missing)
        kept = dedupe_topics(raw, known | {slugify(t["title"]) for t in fresh})
        log(f"Lot {attempt}/{TOPIC_MAX_CALLS} : {len(raw)} sujets rendus, "
            f"{len(kept)} retenus après déduplication.")
        fresh.extend(kept)
        if len(fresh) >= TOPIC_BATCH:
            break

    fresh = fresh[:TOPIC_BATCH]
    if not fresh:
        raise ValueError("Aucun sujet exploitable rendu par le modèle.")

    workflow = WORKFLOW_PATH.read_text(encoding="utf-8")
    updated = append_topics_to_workflow(workflow, fresh)
    WORKFLOW_PATH.write_text(updated, encoding="utf-8")
    log(f"{len(fresh)} sujets ajoutés à BLOG_WORKFLOW.md "
        f"(réserve : {reserve} → {reserve + len(fresh)}).")

    if commit:
        git_commit_file(WORKFLOW_PATH,
                        f"chore(blog): {len(fresh)} nouveaux sujets en reserve")
    return len(fresh)


# ─────────────────────────────────────────────────────────────
# Rédaction : le modèle ne produit QUE du contenu éditorial
# ─────────────────────────────────────────────────────────────

def volume_rank(errors: list[str], wc: int) -> tuple[int, int]:
    """Clé de comparaison entre deux copies : celle qui a le moins d'erreurs
    prime, puis on préfère celle qui approche le mieux la cible. Compter les
    erreurs plutôt que leur seule présence départage deux copies invalides."""
    deficit = max(0, PROMPT_MIN_WORDS - wc)
    excess = max(0, wc - MAX_WORDS)
    return (len(errors), deficit + excess)


def build_correction(cfg: dict, errors: list[str], wc: int) -> str:
    """Message de reprise adressé au modèle. Il ne porte plus seulement sur le
    volume : toute erreur de validation que le modèle peut corriger lui-même
    (maillage interne, nombre de questions, longueur du title) y passe, tant
    qu'il reste des appels au budget."""
    demands = []
    if wc < PROMPT_MIN_WORDS:
        demands.append(
            f"Tu as généré {wc} mots pour le corps (FAQ exclue), il en faut au moins "
            f"{PROMPT_MIN_WORDS}. Développe chaque section : ajoute des paragraphes, "
            "des exemples concrets, du contexte local, des nuances. Ne retire aucune "
            "section.")
    elif wc > MAX_WORDS:
        demands.append(
            f"Tu as généré {wc} mots pour le corps (FAQ exclue), c'est trop : il en "
            f"faut au plus {PROMPT_MAX_WORDS}. Resserre chaque section sans en "
            "supprimer aucune.")

    if any("maillage" in e for e in errors):
        targets = "\n".join(f"  {t}" for t in cfg["internal_link_targets"])
        demands.append(
            "Il manque des liens internes, c'est rédhibitoire. Insère dans le corps "
            "au moins DEUX liens markdown vers ces chemins exacts, placés dans deux "
            f"sections différentes :\n{targets}\net au moins UN lien vers /blog/. "
            f"Écris-les sous la forme [libellé descriptif]({cfg['internal_link_targets'][0]}), "
            "en recopiant le chemin tel quel. Ne touche à rien d'autre.")

    others = [e for e in errors if "maillage" not in e and "volume" not in e]
    if others:
        demands.append("Corrige aussi ces points : " + " ; ".join(others) + ".")

    if not demands:
        demands.append("Reprends ton JSON en respectant toutes les consignes.")
    return " ".join(demands) + " Réponds par le seul objet JSON complet."


def build_prompt(cfg: dict, topic: dict, rules: str,
                 paths: set[str] | None = None) -> tuple[str, str]:
    """Prompt court : plus de gabarit HTML à recopier, plus de contraintes de
    balisage. Le modèle écrit, le script fabrique la page."""
    targets = cfg["internal_link_targets"]
    targets_bullets = "\n".join(f"    {t}" for t in targets)

    system = f"""Tu es rédacteur SEO/GEO senior pour une entreprise locale française.
Tu écris du CONTENU, jamais du HTML : la mise en page est faite par ailleurs.

Tu réponds UNIQUEMENT par un objet JSON valide, sans bloc de code markdown,
respectant exactement ce schéma :

{{
  "title": "titre de la page, 55 à 60 caractères, sans le nom du site",
  "h1": "titre affiché en haut de l'article, court et percutant",
  "subtitle": "sous-titre affiché sous le h1, 6 à 12 mots, qui situe le sujet",
  "breadcrumb": "libellé court pour le fil d'Ariane (2 à 4 mots)",
  "category": "une catégorie parmi : {{categories}}",
  "meta_description": "résumé de moins de 155 caractères",
  "lede": "chapô d'introduction, 60 à 90 mots, qui plante une situation concrète",
  "sections": [
    {{"h2": "titre de section",
      "content": [
        {{"type": "p", "text": "paragraphe"}},
        {{"type": "h3", "text": "sous-titre"}},
        {{"type": "ul", "items": ["élément", "élément"]}},
        {{"type": "ol", "items": ["étape", "étape"]}}
      ]}}
  ],
  "faq": [{{"question": "…", "answer": "…"}}]
}}

RÈGLES DE CONTENU
- Volume : le corps (lede + sections, FAQ exclue) fait entre {PROMPT_MIN_WORDS} et
  {PROMPT_MAX_WORDS} mots. Compte les mots avant de répondre. C'est la contrainte
  la plus importante : en dessous de {PROMPT_MIN_WORDS} mots, la réponse est rejetée.
- Vise 5 à 7 sections « h2 », chacune avec 3 à 5 paragraphes nourris. Un paragraphe
  fait 60 à 110 mots : développe, donne des exemples concrets, du contexte local,
  des nuances. Ne fais jamais de paragraphe d'une seule phrase.
- FAQ : exactement {{faq_count}} questions, avec des réponses de 40 à 70 mots.
  Elles ne comptent pas dans le volume du corps.
- Balisage inline autorisé dans les textes, et lui seul :
  **gras** et [libellé](/chemin). Les liens sont forcément internes.
- Maillage interne — OBLIGATOIRE, la réponse est rejetée sans cela :
  place AU MOINS DEUX liens markdown vers ces chemins exacts, dans deux
  sections différentes du corps :
{targets_bullets}
  et AU MOINS UN lien vers /blog/.
  Forme attendue, à recopier telle quelle : [libellé descriptif]({targets[0]})
  Recopie les chemins sans les modifier, sans domaine et sans rien y ajouter.
- Ancres de liens : les libellés des liens internes doivent être descriptifs et
  se lire naturellement dans la phrase. Interdit : les libellés secs d'un seul
  mot comme « ici », « blog », « carte », « contact ».

GARDE-FOUS — NON NÉGOCIABLES
N'invente AUCUN prix, AUCUN chiffre d'affaires ou de fréquentation, AUCUN nom de
client, AUCUNE date de fondation, AUCUNE norme ou réglementation, AUCUN label,
AUCUN avis client, AUCUN horaire, AUCUNE adresse autre que ceux fournis ci-dessous.
Si une information te manque, reformule pour t'en passer.
N'affirme RIEN de propre à une commune : ni risque (inondation, séisme…), ni
démographie, ni état du marché, ni climat local, ni ancienneté du bâti d'une
commune précise. Les noms de communes servent UNIQUEMENT à situer le lecteur
(« que votre bien soit à Tarbes, à Lourdes ou à Vic-en-Bigorre »).
Quand tu listes les diagnostics obligatoires d'une situation (vente, location,
travaux), la liste doit être COMPLÈTE au regard des faits autorisés ci-dessous :
n'en oublie aucun (amiante compris pour les biens d'avant juillet 1997).
Plomb : ne conseille jamais de gratter, poncer ou « éliminer » le plomb ; la
consigne est de le rendre inaccessible sans faire de poussière.
Titres h2 en casse française (seule la première lettre en majuscule).

FAITS AUTORISÉS (seule source de faits chiffrés, d'adresses et d'horaires)
{{facts}}
""".replace("{categories}", ", ".join(cfg["categories"])).replace(
        "{faq_count}", str(cfg["faq_questions_count"])).replace(
        "{facts}", "\n".join(f"- {f}" for f in cfg.get("facts", [])))

    user = f"""Sujet n°{topic['num']} : {topic['title']}
Angle : {topic['brief'] or "à développer librement dans le cadre des règles"}

Entreprise : {cfg['site_name']} — {cfg['sector']}.
Zone : {cfg['location']}.
Ton : {cfg['tone']}. Langue : français.

Mots-clés géographiques à faire vivre naturellement (pas de bourrage) :
{', '.join(cfg['geo_keywords'])}.

RÈGLES ÉDITORIALES DU BLOG
{rules}

PAGES DU SITE — les seuls chemins autorisés dans les liens, recopiés tels quels :
{chr(10).join(sorted(paths or site_paths()))}

Réponds par le seul objet JSON."""

    return system, user


def generate_content(cfg: dict, system: str, user: str,
                     followup: list[dict] | None = None,
                     model: str | None = None) -> dict:
    try:
        from openai import OpenAI
    except ImportError as exc:
        raise RuntimeError(
            "Le paquet 'openai' n'est pas installé (pip install openai).") from exc

    if not os.environ.get("OPENAI_API_KEY"):
        raise RuntimeError("Variable d'environnement OPENAI_API_KEY absente.")

    # La génération de sujets passe un model= explicite : elle n'a pas à suivre
    # le modèle de rédaction configuré pour les articles.
    model = model or cfg["model"]
    client = OpenAI()
    log(f"Appel OpenAI (modèle {model}, temperature {cfg['temperature']})…")
    response = client.chat.completions.create(
        model=model,
        temperature=cfg["temperature"],
        max_tokens=9000,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
            *(followup or []),
        ],
    )
    content = (response.choices[0].message.content or "").strip()
    usage = getattr(response, "usage", None)
    if usage:
        log(f"Tokens : {usage.prompt_tokens} entrée + "
            f"{usage.completion_tokens} sortie = {usage.total_tokens}")
    if not content:
        raise ValueError("réponse vide")
    return json.loads(content)


def mock_content(cfg: dict, topic: dict) -> dict:
    """Contenu de démonstration pour --mock : même forme que la sortie du modèle,
    calibré pour dépasser la cible de volume. Aucun contenu éditorial réel."""
    targets = cfg["internal_link_targets"]
    filler = ("Contenu de démonstration sans valeur éditoriale. Il sert uniquement à "
              "vérifier la tuyauterie du script : choix du sujet, validation, écriture "
              "du fichier et idempotence. Entre Tarbes, Lourdes et Bagnères-de-Bigorre, "
              "les situations varient d'un bien à l'autre selon l'année de construction, "
              "les installations et la commune, ce qui justifie de détailler chaque cas "
              "plutôt que de donner une réponse unique valable pour tous les "
              "propriétaires et tous les types de logements rencontrés.")
    sections = []
    for i in range(7):
        content = [{"type": "p", "text": filler}, {"type": "p", "text": filler}]
        if i == 0:
            content.append({"type": "p", "text": f"Voir [la page dédiée]({targets[0]}) "
                                                 f"et [cette autre page]({targets[1]})."})
        if i == 2:
            content.append({"type": "p", "text": "D'autres conseils sur [le blog du "
                                                 "diagnostiqueur](/blog/)."})
        sections.append({"h2": f"Section de démonstration n°{i + 1}", "content": content})
    return {
        "title": (topic["title"] + " — démonstration")[:68],
        "h1": topic["title"],
        "subtitle": "Contenu de démonstration",
        "breadcrumb": topic["title"][:28],
        "category": cfg["categories"][0],
        "meta_description": f"{topic['title'][:110]} — démonstration.",
        "lede": filler,
        "sections": sections,
        "faq": [{"question": f"Question de démonstration n°{i + 1} ?",
                 "answer": filler[:220]} for i in range(cfg["faq_questions_count"])],
    }


# ─────────────────────────────────────────────────────────────
# Validation du contenu
# ─────────────────────────────────────────────────────────────

CONTENT_TYPES = {"p", "h3", "ul", "ol", "strong"}


def validate_content(data: dict, cfg: dict, paths: set[str] | None = None) -> list[str]:
    """Contrôles bloquants sur le CONTENU. Tout ce que le script fabrique
    lui-même (canonical, OG, JSON-LD, marqueur, fil d'Ariane, structure) ne peut
    plus être erroné et n'est donc plus contrôlé ici."""
    errors: list[str] = []

    if not isinstance(data, dict):
        return ["la réponse n'est pas un objet JSON"]

    if data.get("category") not in cfg["categories"]:
        errors.append("catégorie absente ou hors liste (" + ", ".join(cfg["categories"]) + ")")

    for key in ("title", "h1", "breadcrumb", "meta_description", "lede"):
        if not isinstance(data.get(key), str) or not data[key].strip():
            errors.append(f"champ « {key} » absent ou vide")

    title = data.get("title", "")
    if isinstance(title, str) and not 40 <= len(title) <= 70:
        errors.append(f"title hors bornes : {len(title)} caractères (attendu 40–70)")

    desc = data.get("meta_description", "")
    if isinstance(desc, str) and len(desc) >= 155:
        errors.append(f"meta description trop longue ({len(desc)} caractères)")

    sections = data.get("sections")
    if not isinstance(sections, list) or not sections:
        errors.append("aucune section")
    else:
        for i, section in enumerate(sections, 1):
            if not isinstance(section, dict) or not section.get("h2"):
                errors.append(f"section n°{i} sans titre h2")
                continue
            blocks = section.get("content")
            if not isinstance(blocks, list) or not blocks:
                errors.append(f"section n°{i} sans contenu")
                continue
            for block in blocks:
                if not isinstance(block, dict):
                    errors.append(f"section n°{i} : bloc de contenu invalide")
                    continue
                kind = block.get("type")
                if kind not in CONTENT_TYPES:
                    errors.append(f"section n°{i} : type de bloc inconnu ({kind!r})")
                elif kind in ("ul", "ol"):
                    items = block.get("items") or block.get("text")
                    if not items:
                        errors.append(f"section n°{i} : liste {kind} vide")
                elif not block.get("text"):
                    errors.append(f"section n°{i} : bloc {kind} sans texte")

    faq = data.get("faq")
    if not isinstance(faq, list) or len(faq) != cfg["faq_questions_count"]:
        errors.append(f"{cfg['faq_questions_count']} questions attendues dans la FAQ "
                      f"(trouvé : {len(faq) if isinstance(faq, list) else 0})")
    else:
        for i, item in enumerate(faq, 1):
            if not isinstance(item, dict) or not item.get("question") or not item.get("answer"):
                errors.append(f"question de FAQ n°{i} incomplète")

    # Maillage interne : toujours dépendant du modèle, donc toujours contrôlé.
    body = " ".join(
        [data.get("lede", "")] +
        [b.get("text", "") + " " + " ".join(b.get("items") or [])
         for s in (sections if isinstance(sections, list) else [])
         if isinstance(s, dict)
         for b in (s.get("content") or []) if isinstance(b, dict)])
    faq_text = " ".join(f.get("answer", "") for f in (faq if isinstance(faq, list) else [])
                        if isinstance(f, dict))
    links = re.findall(r"\[[^\]]+\]\((/[^)\s]*)\)", body)
    all_links = links + re.findall(r"\[[^\]]+\]\((/[^)\s]*)\)", faq_text)
    known = paths if paths is not None else site_paths()
    unknown = sorted({h for h in all_links if norm_path(h) not in known})
    if unknown:
        errors.append("liens vers des pages inexistantes : " + ", ".join(unknown)
                      + " — n'utilise que les chemins de la liste PAGES DU SITE")
    targets = [norm_path(t) for t in cfg["internal_link_targets"]]
    if sum(1 for h in links
           if any(norm_path(h) == t or norm_path(h).startswith(t + "/") for t in targets)) < 2:
        errors.append("maillage interne : moins de deux liens vers "
                      + " ou ".join(targets))
    if not any(norm_path(h).startswith("/blog") for h in links):
        errors.append("maillage interne : aucun lien vers /blog/")

    wc = content_word_count(data)
    if not MIN_WORDS <= wc <= MAX_WORDS:
        errors.append(f"volume hors bornes : {wc} mots (attendu {MIN_WORDS}–{MAX_WORDS})")

    return errors

# ─────────────────────────────────────────────────────────────
# Écriture
# ─────────────────────────────────────────────────────────────

def build_article(data: dict, topic: dict, today: str, previous: dict | None) -> dict:
    """Article final : contenu du modèle + champs fabriqués par le script."""
    article = {
        "topic": topic["num"],
        "slug": topic["slug"],
        "date": previous["date"] if previous else today,
        "category": data["category"],
        "title": data["title"].strip(),
        "h1": data["h1"].strip(),
        "subtitle": (data.get("subtitle") or "").strip(),
        "breadcrumb": data["breadcrumb"].strip(),
        "meta_description": data["meta_description"].strip(),
        "lede": data["lede"].strip(),
        "sections": [],
        "faq": [{"question": f["question"].strip(), "answer": f["answer"].strip()}
                for f in data["faq"]],
    }
    if previous:
        article["updated"] = today
    for s in data["sections"]:
        blocks = []
        for b in s["content"]:
            if b["type"] in ("ul", "ol"):
                items = b.get("items") or b.get("text")
                if isinstance(items, str):
                    items = [x.strip(" -•") for x in items.split("\n") if x.strip()]
                blocks.append({"type": b["type"], "items": [str(x) for x in items]})
            else:
                blocks.append({"type": b["type"], "text": str(b["text"])})
        article["sections"].append({"h2": s["h2"].strip(), "content": blocks})
    return article


def main() -> int:
    parser = argparse.ArgumentParser(description="Génère un article de blog SUD Diagnostic Bâtiment.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--mock", action="store_true")
    parser.add_argument("--rewrite", metavar="SLUG")
    parser.add_argument("--topics-only", action="store_true")
    args = parser.parse_args()

    if args.topics_only and args.rewrite:
        fail("--topics-only et --rewrite sont incompatibles.")
        return EXIT_ERROR
    if args.dry_run:
        log("Mode DRY-RUN : aucun fichier ne sera écrit.")

    try:
        cfg = load_config()
        log(f"Site : {cfg['site_name']} — {cfg['site_url']}")
        workflow = WORKFLOW_PATH.read_text(encoding="utf-8")
        topics = parse_topics(workflow)
        rules = parse_editorial_rules(workflow)
        log(f"{len(topics)} sujets listés dans BLOG_WORKFLOW.md.")

        done, slugs = scan_blog()
        log(f"Articles déjà en ligne : {len(slugs)} — sujets traités : "
            f"{sorted(done) if done else 'aucun'}")

        if args.topics_only:
            added = replenish_topics(cfg, topics, done, slugs, mock=args.mock,
                                     commit=not args.dry_run)
            log(f"Terminé — {added} sujet(s) ajouté(s) à la réserve.")
            return EXIT_OK

        if not args.dry_run and not args.rewrite:
            try:
                if replenish_topics(cfg, topics, done, slugs, mock=args.mock):
                    topics = parse_topics(WORKFLOW_PATH.read_text(encoding="utf-8"))
            except Exception as exc:                  # noqa: BLE001
                fail(f"Réapprovisionnement des sujets ignoré ({type(exc).__name__} : {exc}).")

        previous = None
        if args.rewrite:
            target_file = CONTENT_DIR / f"{args.rewrite}.json"
            if not target_file.exists():
                fail(f"Article introuvable : {target_file.relative_to(ROOT)}")
                return EXIT_ERROR
            previous = json.loads(target_file.read_text(encoding="utf-8"))
            topic = next((t for t in topics if t["num"] == previous.get("topic")), None)
            if topic is None:
                fail(f"Le sujet n°{previous.get('topic')} n'existe plus dans BLOG_WORKFLOW.md.")
                return EXIT_ERROR
            topic["slug"] = args.rewrite
            log(f"Mode RÉÉCRITURE : sujet n°{topic['num']} — {topic['title']}")
        else:
            topic = pick_topic(topics, done, slugs)
            if topic is None:
                log("Aucun sujet restant à traiter.")
                return EXIT_NOTHING_TODO
            log(f"Sujet retenu : n°{topic['num']} — {topic['title']}")
            target_file = CONTENT_DIR / f"{topic['slug']}.json"
            if target_file.exists():
                fail(f"Le fichier existe déjà : {target_file.relative_to(ROOT)}")
                return EXIT_NOTHING_TODO

        log(f"Slug : {topic['slug']}")
        paths = site_paths()
        today = dt.date.today().isoformat()

        system = user = None
        if args.mock:
            log("Mode MOCK : contenu de démonstration, aucun appel API.")
            data = mock_content(cfg, topic)
        else:
            system, user = build_prompt(cfg, topic, rules, paths)
            log(f"Prompt construit ({len(system)} + {len(user)} caractères).")
            data = generate_content(cfg, system, user)

        errors = validate_content(data, cfg, paths)
        wc = content_word_count(data)
        calls = 1
        while (not args.mock and calls < MAX_CALLS
               and (errors or not PROMPT_MIN_WORDS <= wc <= MAX_WORDS)):
            correction = build_correction(cfg, errors, wc)
            calls += 1
            log(f"Copie à reprendre ({wc} mots, {len(errors)} erreur(s)) — "
                f"tentative {calls}/{MAX_CALLS}.")
            try:
                retry = generate_content(cfg, system, user, followup=[
                    {"role": "assistant", "content": json.dumps(data, ensure_ascii=False)},
                    {"role": "user", "content": correction},
                ])
            except (ValueError, json.JSONDecodeError) as exc:
                fail(f"Tentative {calls} inexploitable : {exc}")
                break
            retry_errors = validate_content(retry, cfg, paths)
            retry_wc = content_word_count(retry)
            log(f"Tentative {calls} : {retry_wc} mots, {len(retry_errors)} erreur(s).")
            if volume_rank(retry_errors, retry_wc) < volume_rank(errors, wc):
                data, errors, wc = retry, retry_errors, retry_wc

        if errors:
            fail("Contenu rejeté par la validation — aucun fichier écrit :")
            for err in errors:
                fail(f"  · {err}")
            return EXIT_ERROR

        article = build_article(data, topic, today, previous)
        log("Validation OK.")
        log(f"  Titre       : {article['title']}")
        log(f"  Description : {article['meta_description']} "
            f"({len(article['meta_description'])} car.)")
        log(f"  Volume      : {wc} mots (corps hors FAQ)")

        if args.dry_run:
            print(json.dumps(article, ensure_ascii=False, indent=2))
            log("DRY-RUN terminé, rien n'a été modifié.")
            return EXIT_OK

        CONTENT_DIR.mkdir(parents=True, exist_ok=True)
        target_file.write_text(json.dumps(article, ensure_ascii=False, indent=2) + "\n",
                               encoding="utf-8")
        log(f"Écrit : {target_file.relative_to(ROOT)}")
        log(f"Terminé — {cfg['site_url']}/blog/{topic['slug']}/")
        return EXIT_OK

    except Exception as exc:                      # noqa: BLE001
        fail(f"{type(exc).__name__} : {exc}")
        return EXIT_ERROR


if __name__ == "__main__":
    sys.exit(main())
