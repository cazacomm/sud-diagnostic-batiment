import { Button, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section className="pt-40 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-500">
        Erreur 404
      </p>
      <h1 className="mx-auto mt-4 max-w-xl text-balance text-4xl font-extrabold leading-tight tracking-tight">
        Cette page n’existe pas ou a été déplacée.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg text-ink-soft">
        Retournez à l’accueil ou consultez la liste complète de nos diagnostics.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/">Accueil</Button>
        <Button href="/diagnostics" variant="outline">
          Nos diagnostics
        </Button>
      </div>
    </Section>
  );
}
