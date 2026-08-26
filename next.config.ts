import type { NextConfig } from "next";

/**
 * Aperçu client hébergé sur GitHub Pages :
 *   NEXT_PUBLIC_BASE_PATH=/sud-diagnostic-batiment npm run build
 * Laisser la variable vide pour un déploiement à la racine d'un domaine.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
