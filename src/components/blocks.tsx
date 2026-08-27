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
      className="group flex h-full flex-col justify-between rounded-2xl border border-sand-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_50px_-24px_rgba(114,64,47,0.45)] sm:rounded-3xl sm:p-6"
    >
      <div>
        <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white sm:mb-5 sm:h-12 sm:w-12 sm:rounded-2xl">
          <Icon name={d.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <h3 className="text-sm font-bold leading-snug tracking-tight text-balance sm:text-lg">
          {d.title}
        </h3>
        <p className="mt-1.5 text-xs leading-snug text-ink-soft sm:mt-2 sm:text-sm sm:leading-relaxed">
          {d.short}
        </p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 sm:mt-6 sm:gap-2 sm:text-sm">
        En savoir plus
        <IconArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
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
      className="group relative flex h-full min-h-[190px] flex-col justify-end overflow-hidden rounded-2xl bg-brand-800 p-4 text-white sm:min-h-[300px] sm:rounded-3xl sm:p-7"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, 25vw"
        className="object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/70 to-brand-900/10" />
      <div className="relative">
        <span className="text-[10px] font-bold tracking-[0.2em] text-brand-300 sm:text-xs">
          {index}
        </span>
        <h3 className="mt-1.5 text-base font-extrabold leading-tight tracking-tight text-balance sm:mt-2 sm:text-xl">
          {title}
        </h3>
        <p className="mt-1.5 text-[11px] leading-snug text-brand-100 sm:mt-2 sm:text-sm sm:leading-relaxed">
          {text}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold sm:mt-5 sm:gap-2 sm:text-sm">
          Vos obligations
          <IconArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
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
