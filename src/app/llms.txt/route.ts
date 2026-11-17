import { getArticles, plain } from "@/lib/blog";
import { communes } from "@/lib/communes";
import { diagnostics } from "@/lib/diagnostics";
import { SITE_URL, absUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/** llms.txt : résumé du site à destination des moteurs de réponse IA. */
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> Diagnostiqueur immobilier certifié à Tarbes (Hautes-Pyrénées) depuis ${site.since}. ${site.contact.name} réalise tous les diagnostics obligatoires avant vente, location et travaux, avec un seul interlocuteur.`,
    "",
    "## Coordonnées",
    "",
    `- Bureau : Résidence Foch, 24 Cours Gambetta, 65000 Tarbes`,
    `- Siège social : 24 Route de Tarbes, 65360 Vielle-Adour`,
    `- Téléphone : ${site.contact.phone} · Mobile : ${site.contact.mobile}`,
    `- E-mail : ${site.contact.email}`,
    `- Départements couverts : ${site.departments.map((d) => `${d.name} (${d.code})`).join(", ")}`,
    "",
    "## Pages principales",
    "",
    `- [Accueil](${SITE_URL}/)`,
    `- [Diagnostics avant vente](${absUrl("/avant-vente")})`,
    `- [Diagnostics avant location](${absUrl("/avant-location")})`,
    `- [Repérages avant travaux et démolition](${absUrl("/avant-travaux")})`,
    `- [Demande de devis](${absUrl("/devis")})`,
    `- [Secteur d’intervention](${absUrl("/secteur")})`,
    "",
    "## Diagnostics",
    "",
    ...diagnostics.map((d) => `- [${d.title}](${absUrl(`/diagnostics/${d.slug}`)}) : ${d.short}`),
    "",
    "## Communes",
    "",
    ...communes.map((c) => `- [Diagnostic immobilier à ${c.name} (${c.postcode})](${absUrl(`/diagnostic-immobilier/${c.slug}`)})`),
    "",
    "## Blog",
    "",
    ...getArticles().map((a) => `- [${plain(a.h1)}](${absUrl(`/blog/${a.slug}`)}) : ${plain(a.meta_description)}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
