import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  /* Sur l'aperçu GitHub Pages, on bloque tous les robots pour ne pas
     concurrencer le site actuel du client dans les résultats de recherche. */
  if (process.env.NEXT_PUBLIC_PREVIEW === "1") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.sud-diagnostic.fr/sitemap.xml",
  };
}

export const dynamic = "force-static";
