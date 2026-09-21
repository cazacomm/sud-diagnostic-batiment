"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/* Renseigner NEXT_PUBLIC_WEB3FORMS_KEY (fichier .env.local ou variable de
   build) pour que le formulaire envoie directement dans la boîte mail du
   client. Tant que la clé est absente, on retombe sur un mailto pré-rempli. */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

/** Le type de bien commande les questions posées ensuite. */
const TYPES = [
  { value: "appartement", label: "Un appartement" },
  { value: "maison", label: "Une maison" },
  { value: "local", label: "Un local professionnel" },
  { value: "chantier", label: "Des travaux / une démolition" },
] as const;

type TypeBien = (typeof TYPES)[number]["value"];

const field =
  "w-full rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

const label = "mb-2 block text-xs font-bold uppercase tracking-wide text-brand-600";

export function DevisForm() {
  const [type, setType] = useState<TypeBien>("appartement");
  const [status, setStatus] = useState<Status>("idle");

  const estLogement = type === "appartement" || type === "maison";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    const typeLabel = TYPES.find((t) => t.value === type)?.label ?? type;

    /* Un seul jeu de champs est rempli selon le type de bien : on
       n'envoie que celui-là pour garder un e-mail lisible. */
    const details: Record<string, string> = estLogement
      ? {
          "Type de bien": typeLabel,
          "Vente ou location": get("transaction"),
          "Surface approximative (m²)": get("surface"),
          "Année du bien": get("annee"),
          "Présence de gaz": get("gaz"),
          "Ville du bien": get("ville"),
        }
      : {
          "Type de bien": typeLabel,
          "Année de construction": get("annee"),
          "Ville du bien": get("ville"),
        };

    if (WEB3FORMS_KEY) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Demande de devis — ${get("nom") || "site web"}`,
            from_name: "Site SUD Diagnostic Bâtiment",
            replyto: get("email"),
            Nom: get("nom"),
            Téléphone: get("tel"),
            "E-mail": get("email"),
            ...details,
            Message: get("message") || "—",
            botcheck: get("botcheck"),
          }),
        });
        setStatus(res.ok ? "sent" : "error");
      } catch {
        setStatus("error");
      }
      return;
    }

    const body = [
      `Nom : ${get("nom")}`,
      `Téléphone : ${get("tel")}`,
      `E-mail : ${get("email")}`,
      "",
      ...Object.entries(details).map(([k, v]) => `${k} : ${v || "—"}`),
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
        <legend className={label}>Votre demande concerne</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm font-semibold transition has-checked:border-brand-500 has-checked:bg-brand-50 has-checked:text-brand-700"
            >
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
                className="h-4 w-4 accent-brand-600"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      {estLogement ? (
        <>
          <fieldset>
            <legend className={label}>Vente ou location ?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {["Vente", "Location"].map((v, i) => (
                <label
                  key={v}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm font-semibold transition has-checked:border-brand-500 has-checked:bg-brand-50 has-checked:text-brand-700"
                >
                  <input
                    type="radio"
                    name="transaction"
                    value={v}
                    defaultChecked={i === 0}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {v}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="surface">
                Surface approximative (m²)
              </label>
              <input id="surface" name="surface" inputMode="numeric" className={field} placeholder="85" />
            </div>
            <div>
              <label className={label} htmlFor="annee">
                Année du bien
              </label>
              <input id="annee" name="annee" inputMode="numeric" className={field} placeholder="1972" />
            </div>
          </div>

          <fieldset>
            <legend className={label}>Y a-t-il du gaz dans le logement ?</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {["Oui", "Non", "Je ne sais pas"].map((v) => (
                <label
                  key={v}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm font-semibold transition has-checked:border-brand-500 has-checked:bg-brand-50 has-checked:text-brand-700"
                >
                  <input type="radio" name="gaz" value={v} className="h-4 w-4 accent-brand-600" />
                  {v}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className={label} htmlFor="ville">
              Ville du bien
            </label>
            <input id="ville" name="ville" className={field} placeholder="Tarbes" />
          </div>
        </>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="annee">
              Année de construction du bien
            </label>
            <input id="annee" name="annee" inputMode="numeric" className={field} placeholder="1972" />
          </div>
          <div>
            <label className={label} htmlFor="ville">
              Ville du bien
            </label>
            <input id="ville" name="ville" className={field} placeholder="Tarbes" />
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="nom">
            Nom et prénom *
          </label>
          <input id="nom" name="nom" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="tel">
            Téléphone *
          </label>
          <input id="tel" name="tel" type="tel" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="email">
            E-mail *
          </label>
          <input id="email" name="email" type="email" required className={field} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="message">
          Précisions
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={field}
          placeholder="Délais souhaités, particularités du bien, accès…"
        />
      </div>

      {/* Piège à robots : invisible pour un humain, rempli par les bots. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="shine rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending"
            ? "Envoi en cours…"
            : status === "sent"
              ? "Demande envoyée ✓"
              : "Envoyer ma demande"}
        </button>
        <p className="max-w-sm text-xs leading-relaxed text-ink-soft">
          Les informations transmises sont utilisées uniquement pour établir votre
          devis et organiser le rendez-vous.
        </p>
      </div>

      {status === "sent" ? (
        <p
          role="status"
          className="rounded-2xl border-l-4 border-brand-600 bg-brand-50 p-5 text-sm font-semibold leading-relaxed text-brand-700"
        >
          Merci, votre demande est bien partie. {site.contact.name} vous répond
          sous 24 h ouvrées.
        </p>
      ) : null}

      {status === "error" ? (
        <p
          role="alert"
          className="rounded-2xl border-l-4 border-red-600 bg-red-50 p-5 text-sm font-semibold leading-relaxed text-red-800"
        >
          L’envoi a échoué. Écrivez-nous à{" "}
          <a href={`mailto:${site.contact.email}`} className="underline">
            {site.contact.email}
          </a>{" "}
          ou appelez le{" "}
          <a href={site.contact.mobileHref} className="underline">
            {site.contact.mobile}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
