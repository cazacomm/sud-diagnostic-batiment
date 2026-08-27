import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug, diagnostics } from "@/lib/diagnostics";
import { Eyebrow, H2, PageHero, Section } from "@/components/ui";
import { CtaBand, DiagnosticCard } from "@/components/blocks";
import { Icon, IconArrow } from "@/components/icons";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return diagnostics.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = bySlug(slug);
  if (!d) return {};
  return {
    title: `${d.title} à Tarbes (65)`,
    description: d.intro.slice(0, 300),
  };
}

export default async function DiagnosticPage({ params }: Params) {
  const { slug } = await params;
  const d = bySlug(slug);
  if (!d) notFound();

  const others = diagnostics.filter((x) => x.slug !== d.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={d.short}
        title={d.title}
        intro={d.intro}
        breadcrumb={[{ label: "Diagnostics", href: "/diagnostics" }, { label: d.title }]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div>
            <span className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon name={d.icon} className="h-7 w-7" />
            </span>
            <div className="space-y-5">
              {d.body.map((p) => (
                <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {d.contexts.map((c) => (
                <Link
                  key={c}
                  href={
                    c === "copropriete"
                      ? "/copropriete"
                      : c === "travaux"
                        ? "/avant-travaux"
                        : c === "vente"
                          ? "/avant-vente"
                          : "/avant-location"
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-sand-300 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink-soft transition hover:border-brand-400 hover:text-brand-700"
                >
                  {c === "copropriete"
                    ? "Mise en copropriété"
                    : c === "travaux"
                      ? "Avant travaux"
                      : c === "vente"
                        ? "Avant vente"
                        : "Avant location"}
                  <IconArrow className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white">
              <div className="relative aspect-[4/3]">
                <Image
                  src={d.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover"
                />
              </div>
              <dl className="divide-y divide-sand-200">
                {d.facts.map((f) => (
                  <div key={f.label} className="flex gap-4 px-6 py-4">
                    <dt className="w-28 shrink-0 text-xs font-bold uppercase tracking-wide text-brand-500">
                      {f.label}
                    </dt>
                    <dd className="text-sm font-semibold leading-snug">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl bg-brand-600 p-7 text-white">
              <p className="text-lg font-extrabold leading-snug tracking-tight">
                Besoin de ce diagnostic&nbsp;?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">
                Devis gratuit sous 24 h, intervention sur Tarbes et tout le
                département 65.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href="/devis"
                  className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-brand-700 transition hover:bg-brand-50"
                >
                  Demander un devis
                </Link>
                <a
                  href={site.contact.phoneHref}
                  className="rounded-full border border-white/40 px-5 py-3 text-center text-sm font-bold transition hover:bg-white/10"
                >
                  {site.contact.phone}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="bg-sand-100">
        <div className="mb-10">
          <Eyebrow>Voir aussi</Eyebrow>
          <H2 className="text-2xl sm:text-3xl">Les autres diagnostics</H2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {others.map((o) => (
            <DiagnosticCard key={o.slug} d={o} />
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
