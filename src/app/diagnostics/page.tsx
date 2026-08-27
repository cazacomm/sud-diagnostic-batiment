import type { Metadata } from "next";
import { diagnostics } from "@/lib/diagnostics";
import { PageHero, Section } from "@/components/ui";
import { CtaBand, DiagnosticCard } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Tous nos diagnostics immobiliers",
  description:
    "DPE, ERP, amiante, plomb, termites, gaz, électricité, loi Carrez, loi Boutin, DTA, DTG : le détail de chaque diagnostic réalisé par SUD Diagnostic Bâtiment à Tarbes.",
};

export default function DiagnosticsIndex() {
  return (
    <>
      <PageHero
        eyebrow="Nos prestations"
        title="Tous nos diagnostics immobiliers"
        intro="Treize expertises réalisées par un opérateur certifié, du DPE au diagnostic technique global. Cliquez sur une prestation pour connaître son cadre réglementaire et sa durée de validité."
        breadcrumb={[{ label: "Diagnostics" }]}
      />
      <Section>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {diagnostics.map((d) => (
            <DiagnosticCard key={d.slug} d={d} />
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
