# Workflow blog — SUD Diagnostic Bâtiment

Publication des articles du blog de `www.sud-diagnostic.fr`.
Site Next.js en export statique, hébergé sur GitHub Pages.

---

## 1. Fonctionnement

```
content/blog/<slug>.json      → un article (contenu seul, aucun HTML)
src/lib/blog.ts               → lecture des articles au build
src/app/blog/page.tsx         → liste des articles
src/app/blog/[slug]/page.tsx  → page d'un article (meta, canonical, JSON-LD)
src/app/sitemap.ts            → sitemap.xml (articles inclus automatiquement)
src/app/rss.xml/route.ts      → flux RSS
src/app/llms.txt/route.ts     → llms.txt (moteurs de réponse IA)
```

Chaque lundi, le workflow `.github/workflows/blog-auto.yml` :

1. réapprovisionne la réserve de sujets ci-dessous si elle passe sous 8 ;
2. rédige le prochain sujet non traité (`scripts/generate-article.py`, OpenAI) ;
3. valide le contenu (volume, FAQ, maillage interne, liens existants) ;
4. committe `content/blog/<slug>.json` et relance le déploiement GitHub Pages.

Le sitemap, le flux RSS, llms.txt, la liste du blog et les données structurées
se mettent à jour tout seuls au build : il n'y a rien d'autre à toucher.

**URL canonique : `https://www.sud-diagnostic.fr/`** (avec `www`, avec `https`).

Pour publier un article à la main : créer `content/blog/<slug>.json` sur le
modèle de `quels-diagnostics-vendre-maison-tarbes.json`, puis pousser sur `main`.

---

## 2. Règles éditoriales

**Longueur** : 1200 à 1500 mots, plus une FAQ de 5 questions.

**Structure type** : chapô qui part d'une situation concrète → 5 à 7 `H2` → `H3`
en sous-parties → paragraphe de rattachement local → FAQ.

**Ancrage local** : Tarbes et son agglomération (Aureilhan, Séméac, Odos,
Laloubère, Juillan, Barbazan-Debat, Bordères-sur-l'Échez, Ibos, Soues), la
Bigorre (Lourdes, Bagnères-de-Bigorre, Argelès-Gazost, Vic-en-Bigorre,
Lannemezan) et plus largement les Hautes-Pyrénées et le Sud-Ouest. Citer deux
ou trois communes de façon naturelle, jamais en liste de mots-clés. Au moins
une mention du bureau de Tarbes (Cours Gambetta) par article.

**Interdits absolus** — ne jamais écrire :
- de prix, de tarif ou de fourchette de prix ;
- de délai d'intervention chiffré, de nombre de diagnostics réalisés, d'avis client ;
- de texte réglementaire, de seuil ou de date qui ne figure pas dans les faits
  de `blog-config.json` ;
- de liste figée de communes soumises au diagnostic termites : les arrêtés
  préfectoraux changent, toujours renvoyer à l'arrêté en vigueur ;
- la mise en copropriété (prestation abandonnée) ;
- une affirmation propre à une commune (risques, démographie, marché, climat) :
  les communes servent uniquement à situer le lecteur ;
- une liste d'obligations incomplète (vérifier vente / location / travaux contre
  les faits de `blog-config.json`, amiante compris) ;
- un conseil de gratter, poncer ou retirer le plomb : la consigne est de le
  rendre inaccessible sans faire de poussière ;
- pour la loi Carrez : la baisse de prix réclamée par l'acheteur ou la marge des 5 %.

En cas de doute : rester qualitatif et renvoyer vers la demande de devis.

**Ton** : expert-conseil, clair et rassurant. Vouvoiement. Chaque terme technique
(CREP, ERP, DDT, RAAT…) est expliqué à sa première apparition.

**Optimisation GEO (moteurs de réponse IA)** : chaque réponse de FAQ est
autoportante et citable hors contexte. Les durées de validité et les seuils
(1949, juillet 1997, 15 ans) apparaissent en clair dans le texte.

**Liens internes** : uniquement vers des pages qui existent (le script refuse
tout autre chemin). Au moins deux liens vers les pages de service et un vers
`/blog/`. Libellés descriptifs, jamais « ici » ou « cliquez ».

---

## 3. Sujets d'articles suggérés

| # | Sujet | Angle / intention de recherche |
|---|-------|-------------------------------|
| 1 | Quels diagnostics pour vendre une maison à Tarbes | Intention « liste », requête locale prioritaire — `quels-diagnostics-vendre-maison-tarbes` publié |
| 2 | Diagnostics obligatoires pour louer un appartement à Tarbes | Propriétaires bailleurs, liste et validités en location |
| 3 | DPE réalisé avant juillet 2021 : pourquoi il faut le refaire | Vendeurs et bailleurs qui pensent avoir un DPE valable |
| 4 | Audit énergétique à la vente : quels logements sont concernés | Biens classés E, F, G, remise dès la première visite |
| 5 | Maison d'avant 1949 dans les Hautes-Pyrénées : le diagnostic plomb expliqué | Bâti ancien bigourdan, CREP, conduite à tenir si plomb |
| 6 | Amiante dans une maison d'avant 1997 : que vérifie le diagnostiqueur | Réassurance, déroulé du repérage, matériaux courants |
| 7 | Termites dans les Hautes-Pyrénées : quand le diagnostic est-il obligatoire | Arrêté préfectoral, communes d'altitude, validité 6 mois |
| 8 | Repérage amiante avant travaux : obligations du particulier | Maîtres d'ouvrage, rénovation, sécurité des artisans |
| 9 | Démolir une grange ou une dépendance en Bigorre : les repérages à prévoir | Avant démolition, bâti agricole, fibrociment |
| 10 | Loi Carrez ou loi Boutin : quelle différence pour votre bien | Comparatif vente / location, copropriété |
| 11 | Vendre un appartement en copropriété à Tarbes : le dossier complet | Centre-ville tarbais, Carrez, immeubles anciens |
| 12 | Diagnostic électricité : que contrôle-t-on dans une maison ancienne | Installations de plus de 15 ans, points contrôlés |
| 13 | Diagnostic gaz : à quoi s'attendre le jour de la visite | Chaudière, ventilation, déroulé, anomalies |
| 14 | État des risques et pollutions : comprendre les risques à Lourdes et dans les vallées | ERP, PPR, sismicité, risques naturels de montagne |
| 15 | Comment préparer la visite du diagnostiqueur immobilier | Checklist pratique : accès, documents, combles |
| 16 | Vendre une maison à Lourdes : les diagnostics à anticiper | Requête locale, bâti ancien, hôtels reconvertis |
| 17 | Louer un logement à Bagnères-de-Bigorre : ce que doit contenir le dossier | Requête locale, bailleurs, résidences secondaires |
| 18 | Location saisonnière en vallée d'Argelès-Gazost : quels diagnostics | Meublés de tourisme, maisons de montagne |
| 19 | Diagnostic immobilier d'un local professionnel ou commercial | DPE tertiaire, repérages, année de construction |
| 20 | Combien de temps sont valables les diagnostics immobiliers | Tableau récapitulatif vente / location, requête très recherchée |
| 21 | Diagnostics immobiliers et succession : ce que doivent savoir les héritiers | Vente d'un bien hérité, maison familiale |
| 22 | Vendre une ferme ou un corps de ferme dans le Val d'Adour | Vic-en-Bigorre, Maubourguet, dépendances, amiante |
| 23 | Que faire si le diagnostic révèle de l'amiante ou du plomb | Réassurance, obligations, suite à donner |
| 24 | Rénovation énergétique : comment le DPE oriente vos travaux | Lire les recommandations du rapport, gagner une classe |
| 25 | Diagnostics avant vente : qui paie et à quel moment les faire | Vendeur, calendrier, promesse de vente |
| 26 | Logement mal classé au DPE : ce que cela change pour un bailleur | Classes E, F, G, location, anticipation |
| 27 | Maison des années 1970 près de Tarbes : les diagnostics à prévoir | Pavillons de l'agglomération, amiante, électricité |
| 28 | Diagnostics immobiliers dans le Gers et les Landes : notre intervention | Couverture Sud-Ouest, 5 départements |
| 29 | Les erreurs qui retardent une vente chez le notaire | ERP périmé, DPE ancien, diagnostic manquant |
| 30 | Pourquoi confier tous ses diagnostics à un seul interlocuteur | Différenciation, une visite, dossier cohérent |

---

## 4. Commandes utiles

```bash
npm run dev                                       # aperçu local du site
python3 scripts/generate-article.py --mock --dry-run   # test sans API
python3 scripts/generate-article.py --dry-run          # simulation avec l'API
python3 scripts/generate-article.py                    # rédige le sujet suivant
python3 scripts/generate-article.py --rewrite <slug>   # réécrit un article
```

Le secret `OPENAI_API_KEY` doit être défini dans les réglages du dépôt GitHub
(Settings → Secrets and variables → Actions).
