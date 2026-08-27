import type { Metadata } from "next";
import { PageHero, Section, Eyebrow, H2 } from "@/components/ui";
import { CtaBand } from "@/components/blocks";
import { site } from "@/lib/site";
import { IconPin } from "@/components/icons";

export const metadata: Metadata = {
  title: "Secteur d’intervention",
  description:
    "SUD Diagnostic Bâtiment intervient à Tarbes, Lourdes, Bagnères-de-Bigorre, Argelès-Gazost, Lannemezan, Vic-en-Bigorre, Aureilhan, Séméac, Pau et Soumoulou.",
};

export default function SecteurPage() {
  return (
    <>
      <PageHero
        eyebrow="Secteur d’intervention"
        title="Les Hautes-Pyrénées et le nord du Béarn"
        intro="Basés à Tarbes et à Vielle-Adour, nous nous déplaçons dans tout le département 65 ainsi que sur une partie des Pyrénées-Atlantiques (64)."
        breadcrumb={[{ label: "Secteur" }]}
      />

      <Section>
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Communes desservies</Eyebrow>
          <H2 className="text-2xl sm:text-3xl">Où nous intervenons</H2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Cette liste n’est pas limitative. Si votre commune n’y figure pas,
            appelez-nous : elle est très probablement couverte par notre secteur.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
          {site.areas.map((a) => (
            <li
              key={a.cp}
              className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-white px-4 py-4 sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-5"
            >
              <IconPin className="h-6 w-6 shrink-0 text-brand-600" />
              <div>
                <p className="font-bold tracking-tight">{a.name}</p>
                <p className="text-sm text-ink-soft">{a.cp}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-sand-100 pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Bien connaître le territoire</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">Un bâti local, des règles locales.</H2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-ink-soft">
            <p>
              Entre l’Atlantique et la Méditerranée, Tarbes est une commune dont
              l’histoire reste tournée vers l’industrie, notamment aéronautique.
              L’offre immobilière y est importante, et les acquéreurs comme les
              locataires s’appuient sur des diagnostics réalisés ou actualisés par
              un expert certifié.
            </p>
            <p>
              Le département des Hautes-Pyrénées est déclaré totalement termité par
              arrêté préfectoral : le diagnostic termites est donc systématique
              avant une vente. Les zones de plans de prévention des risques et les
              secteurs à potentiel radon influent également sur le contenu de
              l’État des risques et pollutions.
            </p>
            <p>
              Connaître ces spécificités évite les oublis dans le dossier de
              diagnostic technique et les retards à la signature chez le notaire.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
