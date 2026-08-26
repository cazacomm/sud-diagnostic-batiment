"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { diagnostics } from "@/lib/diagnostics";

const projets = [
  { value: "vente", label: "Une vente" },
  { value: "location", label: "Une location" },
  { value: "travaux", label: "Des travaux / une démolition" },
  { value: "copropriete", label: "Une mise en copropriété" },
  { value: "autre", label: "Autre" },
];

const field =
  "w-full rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

const label = "mb-2 block text-xs font-bold uppercase tracking-wide text-brand-600";

export function DevisForm() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    const wanted = selected
      .map((s) => diagnostics.find((d) => d.slug === s)?.title)
      .filter(Boolean)
      .join(", ");

    const body = [
      `Nom : ${get("nom")}`,
      `Téléphone : ${get("tel")}`,
      `E-mail : ${get("email")}`,
      "",
      `Projet : ${projets.find((p) => p.value === get("projet"))?.label ?? get("projet")}`,
      `Type de bien : ${get("bien")}`,
      `Adresse du bien : ${get("adresse")}`,
      `Surface approximative : ${get("surface")} m²`,
      `Année de construction : ${get("annee")}`,
      "",
      `Diagnostics souhaités : ${wanted || "à définir avec le diagnostiqueur"}`,
      "",
      "Message :",
      get("message") || "—",
    ].join("\n");

    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
      `Demande de devis — ${get("nom") || "site web"}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <fieldset>
        <legend className={label}>Votre projet concerne</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {projets.map((p, i) => (
            <label
              key={p.value}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm font-semibold transition has-checked:border-brand-500 has-checked:bg-brand-50 has-checked:text-brand-700"
            >
              <input
                type="radio"
                name="projet"
                value={p.value}
                defaultChecked={i === 0}
                className="h-4 w-4 accent-brand-600"
              />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="bien">Type de bien</label>
          <input id="bien" name="bien" className={field} placeholder="Appartement, maison, local…" />
        </div>
        <div>
          <label className={label} htmlFor="surface">Surface approximative (m²)</label>
          <input id="surface" name="surface" inputMode="numeric" className={field} placeholder="85" />
        </div>
        <div>
          <label className={label} htmlFor="annee">Année de construction</label>
          <input id="annee" name="annee" inputMode="numeric" className={field} placeholder="1972" />
        </div>
        <div>
          <label className={label} htmlFor="adresse">Adresse du bien</label>
          <input id="adresse" name="adresse" className={field} placeholder="Commune ou adresse complète" />
        </div>
      </div>

      <fieldset>
        <legend className={label}>Diagnostics souhaités (optionnel)</legend>
        <div className="flex flex-wrap gap-2">
          {diagnostics.map((d) => {
            const on = selected.includes(d.slug);
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => toggle(d.slug)}
                aria-pressed={on}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                  on
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-sand-300 bg-white text-ink-soft hover:border-brand-400"
                }`}
              >
                {d.short}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          Vous ne savez pas ce qui est obligatoire&nbsp;? Laissez vide, nous
          établissons la liste pour vous.
        </p>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="nom">Nom et prénom *</label>
          <input id="nom" name="nom" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="tel">Téléphone *</label>
          <input id="tel" name="tel" type="tel" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="email">E-mail *</label>
          <input id="email" name="email" type="email" required className={field} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="message">Précisions</label>
        <textarea id="message" name="message" rows={4} className={field} placeholder="Délais souhaités, particularités du bien, accès…" />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          className="rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          Envoyer ma demande
        </button>
        <p className="max-w-sm text-xs leading-relaxed text-ink-soft">
          Les informations transmises sont utilisées uniquement pour établir votre
          devis et organiser le rendez-vous.
        </p>
      </div>
    </form>
  );
}
