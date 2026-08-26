import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site SUD Diagnostic Bâtiment.",
  robots: { index: false },
};

export default function MentionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Informations"
        title="Mentions légales"
        breadcrumb={[{ label: "Mentions légales" }]}
      />
      <Section>
        <div className="max-w-2xl space-y-10">
          <Block title="Éditeur du site">
            <p>{site.name}</p>
            <p>
              {site.offices[1].address} — {site.offices[1].city}
            </p>
            <p>Téléphone : {site.contact.phone}</p>
            <p>E-mail : {site.contact.email}</p>
            <p>SIRET : {site.legal.siret}</p>
            <p>Activité : {site.legal.activity}</p>
            <p>Responsable de publication : {site.legal.publisher}</p>
          </Block>

          <Block title="Hébergement">
            <p>Vercel Inc.</p>
            <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
          </Block>

          <Block title="Propriété intellectuelle">
            <p>
              L’ensemble des contenus présents sur ce site (textes, images,
              pictogrammes, identité visuelle) est la propriété de {site.name} ou
              fait l’objet d’une autorisation d’utilisation. Toute reproduction,
              même partielle, est interdite sans accord écrit préalable.
            </p>
          </Block>

          <Block title="Données personnelles">
            <p>
              Les informations transmises via les formulaires de contact et de
              devis sont utilisées uniquement pour répondre à votre demande et
              organiser l’intervention. Elles ne sont ni cédées ni revendues à des
              tiers. Conformément au RGPD, vous disposez d’un droit d’accès, de
              rectification et de suppression de vos données en écrivant à{" "}
              {site.contact.email}.
            </p>
          </Block>
        </div>
      </Section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-extrabold tracking-tight">{title}</h2>
      <div className="space-y-1.5 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}
