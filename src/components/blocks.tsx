import Link from "next/link";
import Image from "next/image";
import { Icon, IconArrow, IconPhone } from "./icons";
import { Button, H2, Section } from "./ui";
import { site } from "@/lib/site";
import type { Diagnostic } from "@/lib/diagnostics";

export function DiagnosticCard({ d }: { d: Diagnostic }) {
  return (
    <Link
      href={`/diagnostics/${d.slug}`}
      className="group flex flex-col justify-between rounded-3xl border border-sand-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_50px_-24px_rgba(114,64,47,0.45)]"
    >
      <div>
        <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
          <Icon name={d.icon} className="h-6 w-6" />
        </span>
        <h3 className="text-lg font-bold leading-snug tracking-tight">{d.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d.short}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-600">
        En savoir plus
        <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function SituationCard({
  href,
  title,
  text,
  image,
  index,
}: {
  href: string;
  title: string;
  text: string;
  image: string;
  index: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-3xl bg-brand-800 p-7 text-white"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className="object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/70 to-brand-900/10" />
      <div className="relative">
        <span className="text-xs font-bold tracking-[0.2em] text-brand-300">{index}</span>
        <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-100">{text}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
          Vos obligations
          <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function CtaBand() {
  return (
    <Section className="pb-24 pt-8">
      <div className="brand-grid overflow-hidden rounded-4xl bg-brand-600 px-7 py-14 text-white sm:px-14 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <H2>Un devis gratuit et détaillé sous 24 h.</H2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
              Décrivez votre bien en deux minutes : type, surface, année de
              construction et nature du projet. {site.contact.name} vous rappelle
              avec un tarif ferme, tous diagnostics compris.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button href="/devis" variant="light" className="justify-center">
              Demander mon devis
            </Button>
            <a
              href={site.contact.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <IconPhone className="h-4 w-4" />
              {site.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
