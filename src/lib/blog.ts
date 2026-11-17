import fs from "node:fs";
import path from "node:path";

/**
 * Articles du blog : un fichier JSON par article dans `content/blog/`.
 *
 * Ils sont écrits chaque semaine par `scripts/generate-article.py`
 * (workflow GitHub Actions `blog-auto.yml`), qui ne produit que du contenu :
 * la mise en page, les métadonnées, le JSON-LD, le sitemap et le flux RSS
 * sont fabriqués ici, au build. Le modèle ne peut donc ni casser la page ni
 * injecter de HTML.
 *
 * Balisage inline autorisé dans les textes : **gras** et [libellé](/chemin).
 */

export type Block =
  | { type: "p" | "h3" | "strong"; text: string }
  | { type: "ul" | "ol"; items: string[] };

export type Article = {
  topic: number;
  slug: string;
  /** AAAA-MM-JJ */
  date: string;
  updated?: string;
  category: string;
  title: string;
  h1: string;
  subtitle?: string;
  breadcrumb: string;
  meta_description: string;
  lede: string;
  sections: { h2: string; content: Block[] }[];
  faq: { question: string; answer: string }[];
};

const DIR = path.join(process.cwd(), "content", "blog");

let cache: Article[] | null = null;

export function getArticles(): Article[] {
  if (cache) return cache;
  const files = fs.existsSync(DIR)
    ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json"))
    : [];
  cache = files
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Article;
      return { ...data, slug: data.slug || f.replace(/\.json$/, "") };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.topic - a.topic));
  return cache;
}

export const getArticle = (slug: string) => getArticles().find((a) => a.slug === slug);

/** Texte débarrassé du balisage inline (meta, JSON-LD, RSS). */
export function plain(text: string) {
  return nbsp(
    text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, "$1"),
  );
}

/** Typographie française : espace insécable avant « : ; ? ! », pour que la
 *  ponctuation ne parte jamais seule en début de ligne. */
export function nbsp(text: string) {
  return text.replace(/ ([:;?!»])/g, "\u00a0$1").replace(/« /g, "«\u00a0");
}

export function wordCount(a: Article) {
  const parts = [a.lede];
  for (const s of a.sections) {
    parts.push(s.h2);
    for (const b of s.content) {
      if ("items" in b) parts.push(...b.items);
      else parts.push(b.text);
    }
  }
  return plain(parts.join(" ")).split(/\s+/).filter(Boolean).length;
}

export const readingTime = (a: Article) => Math.max(1, Math.round(wordCount(a) / 220));

const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function frDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
