import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { DevisForm } from "@/components/devis-form";
import { site } from "@/lib/site";
import { IconClock, IconPhone, IconShield, IconUser } from "@/components/icons";

export const metadata: Metadata = {
  title: "Demande de devis gratuit",
  description:
    "Obtenez un devis gratuit et détaillé pour vos diagnostics immobiliers à Tarbes et dans les Hautes-Pyrénées. Réponse sous 24 h.",
};

export default function DevisPage() {
  return (
    <>
      <PageHero
        eyebrow="Devis gratuit"
        title="Recevez un tarif ferme sous 24 heures"
        intro="Quelques informations sur votre bien suffisent. Nous établissons la liste des diagnostics obligatoires et vous adressons un devis détaillé, sans engagement."
        breadcrumb={[{ label: "Devis" }]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="rounded-4xl border border-sand-200 bg-white p-7 sm:p-10">
            <DevisForm />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-brand-600 p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-200">
                Vous préférez appeler&nbsp;?
              </p>
              <a
                href={site.contact.phoneHref}
                className="mt-3 flex items-center gap-3 text-2xl font-extrabold tracking-tight"
              >
                <IconPhone className="h-6 w-6 shrink-0" />
                {site.contact.phone}
              </a>
              <a
                href={site.contact.mobileHref}
                className="mt-2 block text-sm font-semibold text-brand-100"
              >
                ou {site.contact.mobile}
              </a>
              <p className="mt-4 text-sm leading-relaxed text-brand-100">
                {site.contact.name} vous répond directement, sans intermédiaire.
              </p>
            </div>

            {[
              { Icon: IconClock, t: "Réponse sous 24 h", d: "Devis détaillé par e-mail, jours ouvrés." },
              { Icon: IconShield, t: "Sans engagement", d: "Le devis est gratuit et vous restez libre." },
              { Icon: IconUser, t: "Un seul interlocuteur", d: "De la demande au rapport final." },
            ].map((b) => (
              <div key={b.t} className="flex gap-4 rounded-3xl border border-sand-200 bg-white p-6">
                <b.Icon className="h-6 w-6 shrink-0 text-brand-600" />
                <div>
                  <p className="font-bold tracking-tight">{b.t}</p>
                  <p className="mt-1 text-sm text-ink-soft">{b.d}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </Section>
    </>
  );
}
