import type { Metadata } from "next";
import Link from "next/link";
import { communes } from "@/lib/communes";
import { site } from "@/lib/site";
import { Eyebrow, H2, PageHero, Section } from "@/components/ui";
import { CtaBand } from "@/components/blocks";
import { IconArrow, IconPin } from "@/components/icons";
import { JsonLd, absUrl, breadcrumbJsonLd } from "@/lib/seo";

const description =
  "Diagnostic immobilier à Tarbes, Lourdes, Bagnères-de-Bigorre, Argelès-Gazost, Vic-en-Bigorre et dans toutes les Hautes-Pyrénées. DPE, amiante, plomb, termites. Devis gratuit.";

export const metadata: Metadata = {
  title: "Diagnostic immobilier dans les Hautes-Pyrénées (65)",
  description,
  alternates: { canonical: absUrl("/diagnostic-immobilier/") },
};

export default function CommunesPage() {
  const tarbes = communes.find((c) => c.slug === "tarbes");
  const others = communes
    .filter((c) => c.slug !== "tarbes")
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Diagnostic immobilier", path: "/diagnostic-immobilier/" },
        ])}
      />

      <PageHero
        eyebrow="Hautes-Pyrénées · 65"
        title="Diagnostic immobilier à Tarbes et dans les Hautes-Pyrénées"
        intro={`Depuis ${site.since}, ${site.contact.name} réalise les diagnostics immobiliers de Tarbes, de son agglomération et de toute la Bigorre, des vallées des Gaves au Val d’Adour.`}
        breadcrumb={[{ label: "Diagnostic immobilier" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>Près de chez vous</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">Les communes où nous intervenons</H2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              Nous nous déplaçons dans toutes les communes des Hautes-Pyrénées,
              des Pyrénées-Atlantiques, du Gers, de la Haute-Garonne et des
              Landes. Votre commune n’est pas dans la liste&nbsp;? Nous venons
              quand même&nbsp;: <Link href="/secteur" className="font-bold text-brand-700 underline underline-offset-4">voir notre secteur</Link>.
            </p>
          </div>

          <div>
            {tarbes ? (
              <Link
                href={`/diagnostic-immobilier/${tarbes.slug}`}
                className="group mb-4 flex items-center justify-between gap-4 rounded-3xl bg-brand-600 px-6 py-5 text-white transition hover:bg-brand-700"
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-brand-200">
                    Notre bureau
                  </span>
                  <span className="mt-1 block text-xl font-extrabold tracking-tight">
                    Diagnostic immobilier à Tarbes
                  </span>
                </span>
                <IconArrow className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/diagnostic-immobilier/${c.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-sand-200 bg-white px-4 py-3.5 transition hover:border-brand-400"
                  >
                    <IconPin className="h-4 w-4 shrink-0 text-brand-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold leading-tight group-hover:text-brand-700">
                        {c.name}
                      </span>
                      <span className="text-xs text-ink-soft">{c.postcode}</span>
                    </span>
                    <IconArrow className="h-4 w-4 shrink-0 text-brand-400 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
