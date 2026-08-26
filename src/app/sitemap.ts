import type { MetadataRoute } from "next";
import { diagnostics } from "@/lib/diagnostics";
import { situationSlugs } from "@/lib/situations";

const base = "https://www.sud-diagnostic.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/diagnostics", "/secteur", "/devis", "/contact", "/mentions-legales"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, priority: p === "" ? 1 : 0.7 })),
    ...situationSlugs.map((s) => ({ url: `${base}/${s}`, priority: 0.9 })),
    ...diagnostics.map((d) => ({ url: `${base}/diagnostics/${d.slug}`, priority: 0.8 })),
  ];
}

export const dynamic = "force-static";
