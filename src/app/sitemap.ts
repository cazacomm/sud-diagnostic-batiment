import type { MetadataRoute } from "next";
import { diagnostics } from "@/lib/diagnostics";
import { situationSlugs } from "@/lib/situations";
import { communes } from "@/lib/communes";
import { getArticles } from "@/lib/blog";
import { absUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const lastPost = articles[0]?.updated ?? articles[0]?.date;
  const statics = ["/", "/diagnostics", "/secteur", "/devis", "/contact", "/mentions-legales"];

  return [
    ...statics.map((p) => ({ url: absUrl(p), priority: p === "/" ? 1 : 0.7 })),
    ...situationSlugs.map((s) => ({ url: absUrl(`/${s}`), priority: 0.9 })),
    ...diagnostics.map((d) => ({ url: absUrl(`/diagnostics/${d.slug}`), priority: 0.8 })),
    { url: absUrl("/diagnostic-immobilier"), priority: 0.8 },
    ...communes.map((c) => ({
      url: absUrl(`/diagnostic-immobilier/${c.slug}`),
      priority: c.slug === "tarbes" ? 0.9 : 0.7,
    })),
    { url: absUrl("/blog"), priority: 0.6, lastModified: lastPost, changeFrequency: "weekly" as const },
    ...articles.map((a) => ({
      url: absUrl(`/blog/${a.slug}`),
      priority: 0.6,
      lastModified: a.updated ?? a.date,
    })),
  ];
}

export const dynamic = "force-static";
