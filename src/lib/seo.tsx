import { site } from "@/lib/site";
import { communes } from "@/lib/communes";

export const SITE_URL = "https://www.sud-diagnostic.fr";

/** URL absolue canonique (avec la barre finale, comme l'export statique). */
export function absUrl(path: string) {
  const clean = path === "/" ? "" : path.replace(/\/?$/, "/");
  return `${SITE_URL}${clean || "/"}`;
}

/** Injecte un bloc JSON-LD. Le contenu est sérialisé par nous, jamais saisi. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Échappe « < » pour qu'aucune chaîne ne puisse fermer la balise script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const BUSINESS_ID = `${SITE_URL}/#entreprise`;

/** Fiche entreprise locale, présente sur toutes les pages. */
export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: site.name,
    description:
      "Diagnostiqueur immobilier certifié à Tarbes : DPE, amiante, plomb, termites, gaz, électricité, loi Carrez et Boutin, ERP, repérages avant travaux et démolition.",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/brand/logo-sud-diagnostic.png`,
    image: `${SITE_URL}/brand/logo-sud-diagnostic.png`,
    telephone: "+33562349736",
    email: site.contact.email,
    founder: { "@type": "Person", name: site.contact.name },
    foundingDate: String(site.since),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Résidence Foch, 24 Cours Gambetta",
      postalCode: "65000",
      addressLocality: "Tarbes",
      addressRegion: "Hautes-Pyrénées",
      addressCountry: "FR",
    },
    areaServed: [
      ...site.departments.map((d) => ({
        "@type": "AdministrativeArea",
        name: `${d.name} (${d.code})`,
      })),
      ...communes.map((c) => ({ "@type": "City", name: c.name })),
    ],
    knowsAbout: [
      "Diagnostic de performance énergétique (DPE)",
      "Audit énergétique",
      "Diagnostic amiante",
      "Diagnostic plomb (CREP)",
      "Diagnostic termites",
      "Diagnostic gaz",
      "Diagnostic électricité",
      "Mesurage loi Carrez",
      "Surface habitable loi Boutin",
      "État des risques et pollutions (ERP)",
      "Repérage amiante avant travaux et démolition",
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
