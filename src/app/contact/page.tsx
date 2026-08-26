import type { Metadata } from "next";
import { PageHero, Section, Button, Eyebrow, H2 } from "@/components/ui";
import { site } from "@/lib/site";
import { IconMail, IconPhone, IconPin, IconUser } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez SUD Diagnostic Bâtiment : 05 62 34 97 36 — 24 Cours Gambetta, 65000 Tarbes. Un seul interlocuteur, Christian Dulin.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Nous contacter"
        title="Une question ? Un conseil ? Un seul interlocuteur."
        intro={`${site.contact.name}, ${site.contact.role.toLowerCase()}, répond à vos questions et organise votre rendez-vous.`}
        breadcrumb={[{ label: "Contact" }]}
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-brand-600 p-8 text-white sm:col-span-2 lg:col-span-1">
            <IconUser className="h-8 w-8" />
            <p className="mt-5 text-xl font-extrabold tracking-tight">{site.contact.name}</p>
            <p className="mt-1 text-sm text-brand-100">{site.contact.role}</p>
            <div className="mt-7 space-y-3 text-sm">
              <a href={site.contact.phoneHref} className="flex items-center gap-3 font-bold">
                <IconPhone className="h-4 w-4 shrink-0" /> {site.contact.phone}
              </a>
              <a href={site.contact.mobileHref} className="flex items-center gap-3 text-brand-100">
                <IconPhone className="h-4 w-4 shrink-0" /> {site.contact.mobile}
              </a>
              <a href={`mailto:${site.contact.email}`} className="flex items-start gap-3 break-all text-brand-100">
                <IconMail className="mt-0.5 h-4 w-4 shrink-0" /> {site.contact.email}
              </a>
            </div>
          </div>

          {site.offices.map((o) => (
            <div key={o.label} className="rounded-3xl border border-sand-200 bg-white p-8">
              <IconPin className="h-8 w-8 text-brand-600" />
              <p className="mt-5 font-bold tracking-tight">{o.label}</p>
              <p className="mt-2 leading-relaxed text-ink-soft">
                {o.address}
                <br />
                {o.city}
              </p>
              <a
                className="mt-5 inline-block text-sm font-bold text-brand-600 underline underline-offset-4"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${o.address} ${o.city}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ouvrir dans Maps
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-sand-100">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Plus rapide</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">
              Décrivez votre bien, recevez un tarif ferme.
            </H2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Le formulaire de devis reprend toutes les informations nécessaires
              pour chiffrer votre dossier du premier coup : type de bien, surface,
              année de construction et nature du projet.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Button href="/devis">Demander un devis gratuit</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
