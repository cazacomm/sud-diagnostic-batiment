import Link from "next/link";
import { IconArrow } from "./icons";

export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-5 py-20 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-500">
      {children}
    </p>
  );
}

export function H2({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-balance text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "light";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600",
    outline:
      "border border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50 focus-visible:outline-brand-600",
    light:
      "bg-white text-brand-700 hover:bg-brand-50 focus-visible:outline-white",
  }[variant];

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles} ${className}`}
    >
      {children}
      <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Fil d’Ariane" className="mb-6 text-xs text-brand-200">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-white">
            Accueil
          </Link>
        </li>
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {it.href ? (
              <Link href={it.href} className="hover:text-white">
                {it.label}
              </Link>
            ) : (
              <span className="text-white">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  return (
    <div className="brand-grid bg-brand-600 px-5 pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
      <div className="mx-auto w-full max-w-6xl">
        <Breadcrumb items={breadcrumb} />
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-200">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100">
            {intro}
          </p>
        ) : null}
      </div>
    </div>
  );
}
