import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { situations, situationSlugs } from "@/lib/situations";
import { byContext } from "@/lib/diagnostics";
import { Eyebrow, H2, PageHero, Section } from "@/components/ui";
import { CtaBand, DiagnosticCard } from "@/components/blocks";
import { IconCheck } from "@/components/icons";

type Params = { params: Promise<{ situation: string }> };

export function generateStaticParams() {
  return situationSlugs.map((situation) => ({ situation }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { situation } = await params;
  const s = situations[situation];
  if (!s) return {};
  return { title: s.metaTitle, description: s.metaDescription };
}

export default async function SituationPage({ params }: Params) {
  const { situation } = await params;
  const s = situations[situation];
  if (!s) notFound();

  const related = byContext(s.context);

  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        title={s.h1}
        intro={s.intro}
        breadcrumb={[{ label: s.eyebrow }]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Eyebrow>La check-list</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">Ce que nous réalisons pour vous</H2>
            <ul className="mt-8 divide-y divide-sand-200 border-y border-sand-200">
              {s.checklist.map((c) => (
                <li key={c.label} className="flex gap-4 py-4">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="font-bold leading-snug">{c.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 self-start rounded-3xl bg-sand-100 p-8">
            {s.body.map((p) => (
              <p key={p.slice(0, 24)} className="text-base leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
            {s.note ? (
              <p className="rounded-2xl border-l-4 border-brand-600 bg-white p-5 text-sm font-semibold leading-relaxed text-ink">
                {s.note}
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      <Section className="bg-sand-100">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Le détail</Eyebrow>
          <H2 className="text-2xl sm:text-3xl">Les diagnostics concernés</H2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((d) => (
            <DiagnosticCard key={d.slug} d={d} />
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
