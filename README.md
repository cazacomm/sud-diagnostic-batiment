# SUD Diagnostic Bâtiment — refonte du site (brouillon v1)

Refonte du site [sud-diagnostic.fr](https://www.sud-diagnostic.fr) pour
**SUD Diagnostic Bâtiment** (Christian Dulin, diagnostiqueur immobilier à Tarbes).

> En ligne sur **https://www.sud-diagnostic.fr** (GitHub Pages, workflow
> `.github/workflows/pages.yml`, déployé à chaque push sur `main`).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- 28 pages 100 % statiques (SSG) — hébergement Vercel ou export statique

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Charte graphique

Reprise de la **nouvelle carte de visite** (`public/brand/carte-visite.pdf`) :

| Rôle | Couleur |
| --- | --- |
| Terracotta principal (carte de visite) | `#72402F` — `brand-600` |
| Terracotta clair (accents sur fond foncé) | `#D2AC9C` — `brand-300` |
| Brun profond (sections sombres) | `#2E1A15` — `brand-900` |
| Fond sable | `#FBFAF8` / `#F5F2ED` — `sand-50` / `sand-100` |
| Encre | `#1E1512` |

Typo : **Plus Jakarta Sans** (Google Fonts, chargée via `next/font`).
Logo : fichier Illustrator du client vectorisé en SVG (`public/brand/`).
Pictogrammes des diagnostics : SVG au trait redessinés dans l'esprit de ceux de
la carte de visite (`src/components/icons.tsx`).

## Arborescence des pages

| URL | Contenu |
| --- | --- |
| `/` | Accueil |
| `/avant-vente` · `/avant-location` · `/avant-travaux` | Obligations par situation |
| `/diagnostics` | Index des 11 prestations |
| `/diagnostics/[slug]` | Fiche détaillée par diagnostic |
| `/secteur` | Secteur d'intervention |
| `/devis` | Formulaire de demande de devis |
| `/contact` | Coordonnées |
| `/mentions-legales` | Mentions légales |
| `/diagnostic-immobilier` | Index des communes desservies |
| `/diagnostic-immobilier/[ville]` | Page locale SEO par commune (`src/lib/communes.ts`) |
| `/blog` · `/blog/[slug]` | Blog (articles dans `content/blog/*.json`) |
| `/rss.xml` · `/llms.txt` · `/sitemap.xml` | Générés au build |

## Référencement local

- Données structurées `ProfessionalService` sur toutes les pages (`src/lib/seo.tsx`),
  `Service` + `FAQPage` + `BreadcrumbList` sur les pages communes, `BlogPosting`
  sur les articles.
- Une page par commune avec un texte propre (bâti local, situation) : ajouter
  une commune = ajouter une entrée dans `src/lib/communes.ts`, le sitemap, le
  pied de page et llms.txt suivent.

## Blog hebdomadaire

Un article est rédigé et publié automatiquement chaque lundi par
`.github/workflows/blog-auto.yml` (secret `OPENAI_API_KEY` requis). Procédure,
règles éditoriales et réserve de sujets : [`BLOG_WORKFLOW.md`](BLOG_WORKFLOW.md).
Faits autorisés pour la rédaction : `blog-config.json`.

## Contenu

Les textes réglementaires sont repris et réécrits à partir de l'ancien site
(contenu validé par le client), enrichis des durées de validité et des seuils
réglementaires. Coordonnées et identité visuelle issues de la nouvelle carte de
visite.

## Points à traiter avant mise en ligne

- [ ] **Formulaire de devis** — prêt pour **Web3Forms**. Il suffit de créer la
      clé sur [web3forms.com](https://web3forms.com) avec l'adresse du client,
      puis de renseigner `NEXT_PUBLIC_WEB3FORMS_KEY` (voir `.env.example`, et
      dans le workflow GitHub Actions pour l'aperçu). Sans clé, le formulaire
      retombe automatiquement sur un `mailto:` pré-rempli — rien ne casse.
- [ ] **Photos** — les trois visuels de la section « Quelles sont vos
      obligations » sont des photos libres de droit (voir *Crédits* ci-dessous).
      Les vignettes des fiches diagnostic (`public/img/*.jpg`) proviennent
      encore de l'ancien site et sont en très basse définition (400 px de
      large) : à remplacer par des photos du client ou des visuels HD.
- [x] **Logo** — logo officiel du client intégré, vectorisé depuis le fichier
      Illustrator. Sources dans `public/brand/` (`.ai`, `.svg`, `.png`
      transparent) ; le tracé utilisé dans le site est
      `src/components/logo-mark.tsx`, en `currentColor` pour fonctionner sur
      fond clair comme sur fond foncé.
- [ ] **Mentions légales** — vérifier l'hébergeur définitif et publier la
      politique de confidentialité.
- [ ] **Chiffres de la home** — « 24 h pour votre devis » : à confirmer.
- [ ] **Redirections 301** depuis les anciennes URL (`*-i12.html`, `dpe-*.html`,
      `diagnostic-immobilier-*.html`) vers les nouvelles pages.
- [x] **Pages communes SEO** — 20 communes des Hautes-Pyrénées
      (`/diagnostic-immobilier/<commune>`).

## Crédits photo

Les trois visuels de la section « Quelles sont vos obligations » viennent
d'[Unsplash](https://unsplash.com). La licence Unsplash autorise l'usage
commercial sans autorisation ni attribution obligatoire ; les identifiants sont
conservés ici pour la traçabilité.

| Fichier | Identifiant Unsplash |
| --- | --- |
| `public/img/situation-vente.webp` | `photo-1784807786602-fc62efb23333` |
| `public/img/situation-location.webp` | `photo-1786096966317-2e7052a98733` |
| `public/img/situation-travaux.webp` | `photo-1634586648651-f1fb9ec10d90` |

Recadrés au carré et convertis en WebP (1000 × 1000, qualité 82) pour couvrir
l'affichage portrait sur mobile comme paysage sur grand écran.
