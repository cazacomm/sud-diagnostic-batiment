import type { Metadata } from "next";
import { PageHero, Section, Eyebrow, H2 } from "@/components/ui";
import { CtaBand } from "@/components/blocks";
import { CoverageRadar } from "@/components/coverage-radar";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Secteur d’intervention",
  description:
    "SUD Diagnostic Bâtiment intervient dans les Hautes-Pyrénées (65), les Pyrénées-Atlantiques (64), le Gers (32), la Haute-Garonne (31) et les Landes (40).",
};

export default function SecteurPage() {
  return (
    <>
      <PageHero
        eyebrow="Secteur d’intervention"
        title="Cinq départements couverts"
        intro="Basés à Tarbes et à Vielle-Adour, nous nous déplaçons largement : Hautes-Pyrénées, Pyrénées-Atlantiques, Gers, Haute-Garonne et Landes."
        breadcrumb={[{ label: "Secteur" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Sur mobile, le radar passe en premier : on accroche l'œil
              avant d'expliquer. */}
          <div className="lg:order-2">
            <CoverageRadar />
          </div>

          <div className="lg:order-1">
            <Eyebrow>Où nous intervenons</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">
              Nous raisonnons par département, pas par commune.
            </H2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              Nous nous déplaçons dans l’ensemble des cinq départements
              ci-dessous, sans distinction de commune. Inutile de vérifier si
              votre village figure sur une liste : s’il est dans l’un de ces
              départements, nous venons.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              {site.departments.map((d) => (
                <li
                  key={d.code}
                  className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-white px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-extrabold text-brand-700 sm:h-10 sm:w-10">
                    {d.code}
                  </span>
                  <span className="text-sm font-bold leading-tight tracking-tight sm:text-base">
                    {d.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-sand-100 pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Bien connaître le territoire</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">Un bâti local, des règles locales.</H2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            <p>
              Le département des Hautes-Pyrénées est déclaré totalement termité
              par arrêté préfectoral : le diagnostic termites est donc
              systématique avant une vente.
            </p>
            <p>
              Les zones de plans de prévention des risques et les secteurs à
              potentiel radon influent également sur le contenu de l’État des
              risques et pollutions, qui change d’une commune à l’autre.
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
