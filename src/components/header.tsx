"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { IconPhone } from "./icons";
import { site } from "@/lib/site";
import { diagnostics } from "@/lib/diagnostics";

const situations = [
  { href: "/avant-vente", label: "Avant vente" },
  { href: "/avant-location", label: "Avant location" },
  { href: "/avant-travaux", label: "Avant travaux" },
  { href: "/copropriete", label: "Copropriété" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* Toutes les pages démarrent par un bandeau brand-600 :
     tant qu'on n'a pas scrollé, l'en-tête passe en version claire. */
  const solid = scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solid
          ? "border-b border-sand-200 bg-sand-50/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-6 px-5">
        <Link href="/" aria-label={site.name}>
          <Logo variant={solid ? "dark" : "light"} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {situations.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`rounded-full whitespace-nowrap px-3.5 py-2 text-sm font-semibold transition ${
                solid
                  ? pathname === s.href
                    ? "bg-brand-100 text-brand-700"
                    : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                  : "text-brand-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              {s.label}
            </Link>
          ))}
          <Link
            href="/diagnostics"
            className={`rounded-full whitespace-nowrap px-3.5 py-2 text-sm font-semibold transition ${
              solid
                ? pathname.startsWith("/diagnostics")
                  ? "bg-brand-100 text-brand-700"
                  : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                : "text-brand-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            Diagnostics
          </Link>
          <Link
            href="/secteur"
            className={`rounded-full whitespace-nowrap px-3.5 py-2 text-sm font-semibold transition ${
              solid
                ? pathname === "/secteur"
                  ? "bg-brand-100 text-brand-700"
                  : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                : "text-brand-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            Secteur
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.contact.phoneHref}
            className={`hidden items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-bold transition sm:inline-flex ${
              solid
                ? "border-brand-200 text-brand-700 hover:border-brand-400 hover:bg-brand-50"
                : "border-white/40 text-white hover:bg-white/10"
            }`}
          >
            <IconPhone className="h-4 w-4" />
            {site.contact.phone}
          </a>
          <Link
            href="/devis"
            className={`hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition sm:inline-flex ${
              solid
                ? "bg-brand-600 text-white hover:bg-brand-700"
                : "bg-white text-brand-700 hover:bg-brand-50"
            }`}
          >
            Devis gratuit
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition lg:hidden ${
              solid ? "border-brand-200 text-brand-700" : "border-white/40 text-white"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-sand-200 bg-sand-50 px-5 py-6 lg:hidden">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
            Votre situation
          </p>
          <ul className="mb-6 grid gap-1">
            {situations.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="block rounded-xl px-3 py-2.5 font-semibold hover:bg-brand-50">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
            Diagnostics
          </p>
          <ul className="mb-6 grid gap-1 sm:grid-cols-2">
            {diagnostics.map((d) => (
              <li key={d.slug}>
                <Link href={`/diagnostics/${d.slug}`} className="block rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-brand-50">
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/devis" className="rounded-full bg-brand-600 px-5 py-3 text-center text-sm font-bold text-white">
              Demander un devis
            </Link>
            <a href={site.contact.phoneHref} className="rounded-full border border-brand-200 px-5 py-3 text-center text-sm font-bold text-brand-700">
              {site.contact.phone}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
