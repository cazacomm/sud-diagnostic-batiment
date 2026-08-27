import Link from "next/link";
import { site } from "@/lib/site";
import { diagnostics } from "@/lib/diagnostics";
import { Button, Eyebrow, H2, Section } from "@/components/ui";
import { CtaBand, DiagnosticCard, SituationCard } from "@/components/blocks";
import { CountUp, HeroGlow, Reveal } from "@/components/motion";
import {
  IconCheck,
  IconClock,
  IconPhone,
  IconPin,
  IconShield,
  IconUser,
} from "@/components/icons";

const years = new Date().getFullYear() - site.since;

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <div className="brand-grid relative overflow-hidden bg-brand-600 px-5 pb-24 pt-36 text-white sm:pb-32 sm:pt-44">
        <HeroGlow />

        <div className="relative mx-auto w-full max-w-6xl">
          <div
            className="rise inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide"
            style={{ "--d": "60ms" } as React.CSSProperties}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-200" />
            Diagnostiqueur certifié à Tarbes depuis {site.since}
          </div>

          <h1 className="mt-7 max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="rise block" style={{ "--d": "140ms" } as React.CSSProperties}>
              Tous vos diagnostics immobiliers
            </span>
            <span className="rise block" style={{ "--d": "220ms" } as React.CSSProperties}>
              dans les Hautes-Pyrénées,
            </span>
            <span
              className="rise block text-brand-200"
              style={{ "--d": "300ms" } as React.CSSProperties}
            >
              avec un seul interlocuteur.
            </span>
          </h1>

          <p
            className="rise mt-7 max-w-2xl text-lg leading-relaxed text-brand-100 sm:text-xl"
            style={{ "--d": "390ms" } as React.CSSProperties}
          >
            Vente, location, chantier ou mise en copropriété : {site.contact.name}{" "}
            réalise vos repérages et rapports d’expertise sur Tarbes, Lourdes, Pau
            et tout le département 65.
          </p>

          <div
            className="rise mt-10 flex flex-wrap gap-3"
            style={{ "--d": "470ms" } as React.CSSProperties}
          >
            <Button href="/devis" variant="light">
              Devis gratuit
            </Button>
            <a
              href={site.contact.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <IconPhone className="h-4 w-4" />
              {site.contact.phone}
            </a>
          </div>

          <div
            className="sweep mt-16 h-px w-full max-w-3xl bg-white/20"
            style={{ "--d": "550ms" } as React.CSSProperties}
          />

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {[
              { n: years, suffix: " ans", v: "d’expérience terrain" },
              { n: diagnostics.length, suffix: "", v: "diagnostics réalisés" },
              { n: null, label: "65 · 64", v: "départements couverts" },
              { n: 24, suffix: " h", v: "pour votre devis" },
            ].map((s, i) => (
              <div
                key={s.v}
                className="rise"
                style={{ "--d": `${620 + i * 70}ms` } as React.CSSProperties}
              >
                <dt className="text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">
                  {s.n === null ? s.label : <CountUp to={s.n} suffix={s.suffix} />}
                </dt>
                <dd className="mt-1 text-sm text-brand-200">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---------- SITUATIONS ---------- */}
      <Section>
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <Eyebrow>Par où commencer</Eyebrow>
            <H2>Quelles sont vos obligations&nbsp;?</H2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              La liste des diagnostics dépend de votre projet et de l’âge du
              bâtiment. Choisissez votre situation : on vous dit exactement ce qui
              est exigé.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              index: "01",
              href: "/avant-vente",
              title: "Vous vendez",
              text: "DPE, ERP, gaz, électricité, plomb, amiante, termites, loi Carrez.",
              image: "/img/vente.jpg",
            },
            {
              index: "02",
              href: "/avant-location",
              title: "Vous louez",
              text: "DPE, ERP, gaz, électricité, plomb, amiante, loi Boutin.",
              image: "/img/location.jpg",
            },
            {
              index: "03",
              href: "/avant-travaux",
              title: "Vous lancez un chantier",
              text: "Repérages amiante et plomb avant travaux ou démolition.",
              image: "/img/amiante-avant-travaux.jpg",
            },
            {
              index: "04",
              href: "/copropriete",
              title: "Vous divisez un immeuble",
              text: "DTA, DTG et diagnostics de mise en copropriété.",
              image: "/img/copropriete.jpg",
            },
          ].map((c, i) => (
            <Reveal key={c.href} delay={i * 110} className="h-full">
              <SituationCard {...c} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- DIAGNOSTICS ---------- */}
      <Section className="bg-sand-100">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>Nos prestations</Eyebrow>
              <H2>Un cabinet, tous les diagnostics.</H2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                Vous n’avez qu’un rendez-vous à prendre et qu’un seul rapport à
                recevoir. Chaque expertise est réalisée par un opérateur certifié
                et couverte par notre assurance responsabilité civile
                professionnelle.
              </p>
            </div>
            <Button href="/diagnostics" variant="outline">
              Voir le détail
            </Button>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {diagnostics.slice(0, 9).map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 110} className="h-full">
              <DiagnosticCard d={d} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- POURQUOI NOUS ---------- */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal from="left">
            <div>
              <Eyebrow>Le cabinet</Eyebrow>
              <H2>Un expert du bâtiment, pas un centre d’appel.</H2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                SUD Diagnostic Bâtiment est un bureau d’expertise en techniques du
                bâtiment installé dans les Hautes-Pyrénées. Depuis {site.since},{" "}
                {site.contact.name} intervient personnellement sur chaque mission :
                prise de rendez-vous, visite, rapport et explications.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Que vous soyez propriétaire, bailleur, syndic, agent immobilier,
                notaire ou maître d’ouvrage, vous obtenez un devis gratuit et
                détaillé avant toute intervention.
              </p>
              <div className="mt-8">
                <Button href="/contact">
                  Parler à {site.contact.name.split(" ")[0]}
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                Icon: IconUser,
                t: "Un seul interlocuteur",
                d: "Le diagnostiqueur qui visite votre bien est celui qui rédige le rapport et qui vous répond au téléphone.",
              },
              {
                Icon: IconShield,
                t: "Certifié et assuré",
                d: "Opérateur certifié Qualixpert, diagnostics couverts par une assurance responsabilité civile professionnelle.",
              },
              {
                Icon: IconClock,
                t: "Rapports rapides",
                d: "Devis sous 24 h, intervention planifiée rapidement et rapport transmis par e-mail dès sa validation.",
              },
              {
                Icon: IconPin,
                t: "Ancré dans le 65",
                d: "Basé à Tarbes et Vielle-Adour, nous connaissons le bâti local, les arrêtés préfectoraux et les zones à risques.",
              },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 110} className="h-full">
                <div className="h-full rounded-3xl border border-sand-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_50px_-24px_rgba(114,64,47,0.45)]">
                  <f.Icon className="h-7 w-7 text-brand-600" />
                  <h3 className="mt-4 font-bold tracking-tight">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- DEROULEMENT ---------- */}
      <Section className="bg-brand-900 text-white">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-300">
              Comment ça se passe
            </p>
            <H2>Quatre étapes, zéro mauvaise surprise.</H2>
          </div>
        </Reveal>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Votre demande", d: "Formulaire ou appel. Vous décrivez le bien et votre projet." },
            { n: "02", t: "Devis sous 24 h", d: "Un tarif ferme et détaillé, tous diagnostics obligatoires compris." },
            { n: "03", t: "La visite", d: "Intervention sur place avec les appareils de mesure adaptés." },
            { n: "04", t: "Votre rapport", d: "Rapport complet par e-mail, opposable et prêt pour le notaire." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 130}>
              <li className="border-t border-white/15 pt-6">
                <span className="text-xs font-bold tracking-[0.2em] text-brand-300">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg font-bold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-200">{s.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ---------- SECTEUR ---------- */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal from="left">
            <div>
              <Eyebrow>Secteur d’intervention</Eyebrow>
              <H2>Tarbes, la Bigorre et le Béarn.</H2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                Nous intervenons dans l’ensemble des Hautes-Pyrénées (65) et sur
                une partie des Pyrénées-Atlantiques (64). Votre commune ne figure
                pas dans la liste&nbsp;? Appelez-nous, elle est probablement
                couverte.
              </p>
              <div className="mt-8">
                <Button href="/secteur" variant="outline">
                  Voir le secteur détaillé
                </Button>
              </div>
            </div>
          </Reveal>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {site.areas.map((a, i) => (
              <Reveal key={a.cp} delay={i * 55} from="right" className="h-full">
                <li className="h-full">
                  <Link
                    href="/secteur"
                    className="flex h-full flex-col rounded-2xl border border-sand-200 bg-white px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50"
                  >
                    <span className="text-sm font-bold">{a.name}</span>
                    <span className="text-xs text-ink-soft">{a.cp}</span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------- TARBES / SEO ---------- */}
      <Section className="bg-sand-100 pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal from="left">
            <div>
              <Eyebrow>Diagnostic immobilier Tarbes</Eyebrow>
              <H2 className="text-2xl sm:text-3xl">
                Votre spécialiste des diagnostics dans le 65.
              </H2>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                SUD Diagnostic Bâtiment, bureau constitué d’experts en techniques
                du bâtiment dans le département des Hautes-Pyrénées, intervient
                dans différents contextes : diagnostics immobiliers, expertises et
                contrôles préalables aux chantiers.
              </p>
              <p>
                Avant une transaction immobilière à Tarbes et dans les environs,
                nous constituons les rapports d’expertise pour la vente comme pour
                la location. Pour réussir la mise en copropriété d’un immeuble et
                sa gestion, comptez sur l’un de nos diagnostiqueurs. Et lorsque
                s’annonce un projet de rénovation ou de démolition, nous vous
                remettons les repérages amiante et plomb.
              </p>
              <ul className="grid gap-2 pt-2 sm:grid-cols-2">
                {[
                  "Opérateur certifié",
                  "Assurance RC professionnelle",
                  "Devis gratuit et détaillé",
                  "Rapports transmis par e-mail",
                ].map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm font-semibold text-ink"
                  >
                    <IconCheck className="h-4 w-4 shrink-0 text-brand-600" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
