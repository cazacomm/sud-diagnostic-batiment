import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { communeBySlug, communes, type Commune } from "@/lib/communes";
import { diagnostics } from "@/lib/diagnostics";
import { site } from "@/lib/site";
import { Eyebrow, H2, PageHero, Section } from "@/components/ui";
import { CtaBand, DiagnosticCard } from "@/components/blocks";
import { IconArrow, IconCheck, IconPin } from "@/components/icons";
import {
  BUSINESS_ID,
  JsonLd,
  absUrl,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";

type Params = { params: Promise<{ ville: string }> };

export function generateStaticParams() {
  return communes.map((c) => ({ ville: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { ville } = await params;
  const c = communeBySlug(ville);
  if (!c) return {};
  const path = `/diagnostic-immobilier/${c.slug}/`;
  const description = `Diagnostiqueur immobilier certifié à ${c.name} (${c.postcode}) : DPE, amiante, plomb, termites, gaz, électricité, Carrez, ERP. Vente, location, travaux. Devis gratuit.`;
  return {
    title: `Diagnostic immobilier à ${c.name} (${c.postcode})`,
    description,
    alternates: { canonical: absUrl(path) },
    openGraph: {
      title: `Diagnostic immobilier à ${c.name} — ${site.name}`,
      description,
      url: absUrl(path),
    },
  };
}

function buildFaq(c: Commune) {
  return [
    {
      question: `Quels diagnostics sont obligatoires pour vendre à ${c.name} ?`,
      answer: `Pour une vente à ${c.name}, le dossier comprend toujours le DPE et l’état des risques et pollutions (ERP). S’y ajoutent selon le bien : le plomb si le permis de construire date d’avant 1949, l’amiante s’il date d’avant juillet 1997, le gaz et l’électricité pour les installations de plus de 15 ans, le mesurage loi Carrez pour un lot de copropriété, et le diagnostic termites si l’arrêté préfectoral le prévoit.`,
    },
    {
      question: `Le diagnostic termites est-il obligatoire à ${c.name} ?`,
      answer: `Il est obligatoire dans les zones délimitées par arrêté préfectoral. Les Hautes-Pyrénées sont largement concernées, mais certaines communes, notamment d’altitude, en sont exemptées, et ces arrêtés évoluent. Nous vérifions l’arrêté en vigueur pour ${c.name} avant chaque intervention.`,
    },
    {
      question: "Combien de temps les diagnostics restent-ils valables ?",
      answer:
        "En vente : DPE 10 ans, gaz et électricité 3 ans, ERP et termites 6 mois, plomb 1 an en présence de plomb et à vie en son absence, amiante sans limite en l’absence d’amiante, loi Carrez sans limite de durée. En location : gaz et électricité 6 ans, plomb 6 ans en présence de plomb, ERP 6 mois, loi Boutin sans limite sauf travaux. Un DPE réalisé avant le 1ᵉʳ juillet 2021 doit être refait.",
    },
    {
      question: `Comment obtenir un devis pour un diagnostic à ${c.name} ?`,
      answer: `Remplissez le formulaire de demande de devis en indiquant le type de bien, sa surface approximative, son année de construction, la présence ou non du gaz et la commune, ou appelez le ${site.contact.mobile}. ${site.contact.name} vous répond avec un tarif ferme pour l’ensemble des diagnostics nécessaires.`,
    },
  ];
}

export default async function CommunePage({ params }: Params) {
  const { ville } = await params;
  const c = communeBySlug(ville);
  if (!c) notFound();

  const path = `/diagnostic-immobilier/${c.slug}/`;
  const faq = buildFaq(c);
  const neighbors = c.neighbors
    .map((s) => communeBySlug(s))
    .filter((n): n is Commune => Boolean(n));
  const highlighted = diagnostics.slice(0, 6);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Diagnostic immobilier à ${c.name}`,
          serviceType: "Diagnostic immobilier",
          url: absUrl(path),
          provider: { "@id": BUSINESS_ID },
          areaServed: {
            "@type": "City",
            name: c.name,
            address: {
              "@type": "PostalAddress",
              postalCode: c.postcode,
              addressLocality: c.name,
              addressRegion: "Hautes-Pyrénées",
              addressCountry: "FR",
            },
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Diagnostic immobilier", path: "/diagnostic-immobilier/" },
          { name: c.name, path },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <PageHero
        eyebrow={`${c.name} · ${c.postcode}`}
        title={`Diagnostic immobilier à ${c.name}`}
        intro={c.intro}
        breadcrumb={[
          { label: "Diagnostic immobilier", href: "/diagnostic-immobilier" },
          { label: c.name },
        ]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div>
            <Eyebrow>Le bâti à {c.name}</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">
              Les diagnostics adaptés aux biens de {c.name}
            </H2>
            <div className="mt-6 space-y-5">
              {c.local.map((p) => (
                <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
              <p className="text-lg leading-relaxed text-ink-soft">
                Basés à Tarbes et à Vielle-Adour, nous intervenons à {c.name} ({c.situation}),
                comme dans l’ensemble des Hautes-Pyrénées et des départements voisins.
              </p>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-sand-200 bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
                Selon votre projet
              </p>
              <ul className="mt-4 divide-y divide-sand-200">
                {[
                  { href: "/avant-vente", label: `Vendre à ${c.name}` },
                  { href: "/avant-location", label: `Louer à ${c.name}` },
                  { href: "/avant-travaux", label: "Travaux ou démolition" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group flex items-center justify-between gap-4 py-3.5 font-bold transition hover:text-brand-700"
                    >
                      {l.label}
                      <IconArrow className="h-4 w-4 text-brand-500 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-brand-600 p-7 text-white">
              <p className="text-lg font-extrabold leading-snug tracking-tight">
                Un bien à diagnostiquer à {c.name}&nbsp;?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">
                Devis gratuit, tarif ferme pour l’ensemble des diagnostics.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href="/devis"
                  className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-brand-700 transition hover:bg-brand-50"
                >
                  Demander un devis
                </Link>
                <a
                  href={site.contact.mobileHref}
                  className="rounded-full border border-white/40 px-5 py-3 text-center text-sm font-bold transition hover:bg-white/10"
                >
                  {site.contact.mobile}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="bg-sand-100">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Nos prestations à {c.name}</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">Les diagnostics que nous réalisons</H2>
          </div>
          <Link
            href="/diagnostics"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800"
          >
            Tous les diagnostics <IconArrow className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {highlighted.map((d) => (
            <DiagnosticCard key={d.slug} d={d} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>Questions fréquentes</Eyebrow>
            <H2 className="text-2xl sm:text-3xl">Diagnostics à {c.name}&nbsp;: vos questions</H2>
          </div>
          <div className="divide-y divide-sand-200 border-y border-sand-200">
            {faq.map((f) => (
              <details key={f.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-bold leading-snug">
                  {f.question}
                  <span
                    aria-hidden="true"
                    className="mt-0.5 text-brand-500 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {neighbors.length ? (
        <Section className="bg-sand-100 py-14 sm:py-16">
          <Eyebrow>À proximité</Eyebrow>
          <H2 className="text-2xl sm:text-3xl">Nous intervenons aussi près de {c.name}</H2>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {neighbors.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/diagnostic-immobilier/${n.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-sand-300 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-brand-400 hover:text-brand-700"
                >
                  <IconPin className="h-4 w-4 text-brand-500" />
                  Diagnostic immobilier {n.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/diagnostic-immobilier"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                <IconCheck className="h-4 w-4" />
                Toutes les communes
              </Link>
            </li>
          </ul>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
