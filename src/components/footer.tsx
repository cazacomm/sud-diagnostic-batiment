import Link from "next/link";
import { Logo } from "./logo";
import { site } from "@/lib/site";
import { diagnostics } from "@/lib/diagnostics";
import { IconMail, IconPhone, IconPin } from "./icons";

export function Footer() {
  return (
    <footer className="brand-grid bg-brand-800 text-brand-100">
      <div className="mx-auto w-full max-w-6xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">
              Diagnostics immobiliers et contrôles avant chantier à Tarbes et dans
              les Hautes-Pyrénées depuis {site.since}. Opérateur certifié, un seul
              interlocuteur.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href={site.contact.phoneHref} className="flex items-center gap-3 font-bold text-white hover:text-brand-200">
                <IconPhone className="h-4 w-4 shrink-0" />
                {site.contact.phone}
              </a>
              <a href={site.contact.mobileHref} className="flex items-center gap-3 text-brand-200 hover:text-white">
                <IconPhone className="h-4 w-4 shrink-0" />
                {site.contact.mobile}
              </a>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 break-all text-brand-200 hover:text-white">
                <IconMail className="h-4 w-4 shrink-0" />
                {site.contact.email}
              </a>
            </div>
          </div>

          <FooterCol title="Votre situation">
            <FooterLink href="/avant-vente">Avant une vente</FooterLink>
            <FooterLink href="/avant-location">Avant une location</FooterLink>
            <FooterLink href="/avant-travaux">Avant travaux / démolition</FooterLink>
            <FooterLink href="/copropriete">Mise en copropriété</FooterLink>
          </FooterCol>

          <FooterCol title="Diagnostics">
            {diagnostics.slice(0, 8).map((d) => (
              <FooterLink key={d.slug} href={`/diagnostics/${d.slug}`}>
                {d.short}
              </FooterLink>
            ))}
            <FooterLink href="/diagnostics">Tous les diagnostics</FooterLink>
          </FooterCol>

          <FooterCol title="Le cabinet">
            <FooterLink href="/secteur">Secteur d’intervention</FooterLink>
            <FooterLink href="/devis">Demande de devis</FooterLink>
            <FooterLink href="/contact">Nous contacter</FooterLink>
            <FooterLink href="/mentions-legales">Mentions légales</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
          {site.offices.map((o) => (
            <div key={o.label} className="flex gap-3 text-sm">
              <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              <div>
                <p className="font-bold text-white">{o.label}</p>
                <p className="text-brand-200">
                  {o.address}
                  <br />
                  {o.city}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} — {site.legal.rcs}
          </p>
          <p>Diagnostics assurés · Opérateur certifié</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white">{title}</p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-brand-200 transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}
