# SUD Diagnostic Bâtiment — refonte du site (brouillon v1)

Refonte du site [sud-diagnostic.fr](https://www.sud-diagnostic.fr) pour
**SUD Diagnostic Bâtiment** (Christian Dulin, diagnostiqueur immobilier à Tarbes).

> ⚠️ **Brouillon.** Version de travail en attente de validation client et de
> l'accès au nom de domaine. Rien n'est publié en production.

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
Pictogrammes : SVG au trait redessinés dans l'esprit de ceux de la carte de visite
(`src/components/icons.tsx`).

## Arborescence des pages

| URL | Contenu |
| --- | --- |
| `/` | Accueil |
| `/avant-vente` · `/avant-location` · `/avant-travaux` · `/copropriete` | Obligations par situation |
| `/diagnostics` | Index des 13 prestations |
| `/diagnostics/[slug]` | Fiche détaillée par diagnostic |
| `/secteur` | Secteur d'intervention |
| `/devis` | Formulaire de demande de devis |
| `/contact` | Coordonnées |
| `/mentions-legales` | Mentions légales |

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
- [ ] **Photos** — les visuels de `public/img/` proviennent de l'ancien site et
      sont en très basse définition (400 px de large). À remplacer par des
      photos du client ou des visuels HD.
- [ ] **Logo** — aucun logo n'accompagne la nouvelle charte. Le logotype actuel
      (`src/components/logo.tsx`) est une proposition à valider ; l'ancien logo
      bleu est conservé dans `public/brand/logo-ancien.png`.
- [ ] **Mentions légales** — vérifier l'hébergeur définitif et publier la
      politique de confidentialité.
- [ ] **Chiffres de la home** — « 13 diagnostics », « 24 h pour votre devis » :
      à confirmer avec le client.
- [ ] **Redirections 301** depuis les anciennes URL (`*-i12.html`, `dpe-*.html`,
      `diagnostic-immobilier-*.html`) vers les nouvelles pages.
- [ ] **Pages communes SEO** (DPE Tarbes, Diagnostic immobilier Lourdes…) —
      l'ancien site en comptait une vingtaine, à réintégrer si l'on veut
      conserver le référencement local.
