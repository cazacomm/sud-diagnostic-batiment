/**
 * Préfixe un chemin de `public/` avec le basePath de déploiement.
 *
 * `next/image` en mode `unoptimized` (obligatoire avec `output: "export"`)
 * n'applique pas le basePath à l'attribut `src`, contrairement aux assets
 * `_next`. Sur l'aperçu GitHub Pages, servi depuis un sous-dossier, toutes
 * les images renvoyaient donc un 404. Ce helper rétablit le bon chemin, et
 * ne change rien quand le site est servi à la racine d'un domaine.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return `${basePath}${path}`;
}
