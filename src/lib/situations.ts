import type { Diagnostic } from "./diagnostics";

export type Situation = {
  slug: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  context: Diagnostic["contexts"][number];
  body: string[];
  /** `validity` s'affiche à droite du libellé, en évidence. */
  checklist: { label: string; note: string; validity?: string }[];
  note?: string;
};

export const situations: Record<string, Situation> = {
  "avant-vente": {
    slug: "avant-vente",
    context: "vente",
    eyebrow: "Vous vendez",
    h1: "Les obligations à respecter pour sécuriser la vente d’un bien",
    metaTitle: "Diagnostics avant vente à Tarbes (65)",
    metaDescription:
      "DPE, ERP, gaz, électricité, plomb, amiante, termites, loi Carrez : la liste des diagnostics obligatoires avant la vente d’un bien, avec leur durée de validité.",
    intro:
      "Le vendeur doit informer l’acheteur en faisant réaliser un dossier de diagnostic technique (DDT) annexé à la promesse ou à l’acte de vente. Voici les expertises à prévoir et leur durée de validité.",
    body: [
      "La composition exacte du dossier dépend de la nature du bien, de son année de construction et de sa localisation. Nous établissons la liste précise de vos obligations lors de la demande de devis, sans engagement.",
      "Un dossier incomplet peut engager votre responsabilité après la vente : l’acquéreur peut demander une diminution du prix, voire l’annulation de la vente selon le diagnostic manquant.",
    ],
    checklist: [
      {
        label: "DPE",
        validity: "10 ans",
        note: "Un DPE réalisé avant le 1ᵉʳ juillet 2021 n’est plus valable : il doit être entièrement refait.",
      },
      {
        label: "Diagnostic gaz",
        validity: "3 ans",
        note: "Installations intérieures de plus de 15 ans.",
      },
      {
        label: "Diagnostic électricité",
        validity: "3 ans",
        note: "Installations de plus de 15 ans.",
      },
      {
        label: "État des risques et pollutions (ERP)",
        validity: "6 mois",
        note: "À refaire s’il date de plus de six mois à la signature.",
      },
      {
        label: "Diagnostic plomb",
        validity: "3 ans si positif · illimité si négatif",
        note: "Si le permis de construire est antérieur à janvier 1949.",
      },
      {
        label: "Diagnostic amiante",
        validity: "Illimitée en l’absence d’amiante",
        note: "Bâtiments à risque, construits avant juillet 1997.",
      },
      {
        label: "Mesurage loi Carrez",
        validity: "Illimitée",
        note: "Si l’objet de la vente est un lot de copropriété.",
      },
      {
        label: "Diagnostic termites",
        validity: "6 mois",
        note: "Le département 65 est déclaré totalement termité.",
      },
    ],
  },

  "avant-location": {
    slug: "avant-location",
    context: "location",
    eyebrow: "Vous louez",
    h1: "Les obligations à prendre en compte pour sécuriser la location d’un bien",
    metaTitle: "Diagnostics avant location à Tarbes (65)",
    metaDescription:
      "DPE, ERP, gaz, électricité, plomb, amiante, loi Boutin : les diagnostics à annexer au bail, avec leur durée de validité.",
    intro:
      "Le bailleur doit renseigner le locataire grâce à la réalisation de plusieurs expertises, annexées au contrat de location. Les durées de validité diffèrent de celles applicables à la vente.",
    body: [
      "Le diagnostic gaz et le diagnostic électricité sont par exemple valables 6 ans en location, contre 3 ans en vente.",
      "Depuis avril 2017, l’étiquette du DPE et la surface habitable doivent également figurer dans les petites annonces de location.",
    ],
    checklist: [
      {
        label: "DPE",
        validity: "10 ans",
        note: "Un DPE réalisé avant le 1ᵉʳ juillet 2021 n’est plus valable : il doit être entièrement refait.",
      },
      {
        label: "Diagnostic gaz",
        validity: "6 ans",
        note: "Anomalies des installations de plus de 15 ans.",
      },
      {
        label: "Diagnostic électricité",
        validity: "6 ans",
        note: "Installations âgées de plus de 15 ans.",
      },
      {
        label: "État des risques et pollutions (ERP)",
        validity: "6 mois",
        note: "Établi dans les six mois précédant la signature du bail.",
      },
      {
        label: "Surface habitable loi Boutin",
        validity: "Illimitée, sauf travaux ou modification",
        note: "À mentionner dans le bail et les annonces.",
      },
      {
        label: "Diagnostic plomb",
        validity: "6 ans",
        note: "Bâtiments construits avant janvier 1949.",
      },
      {
        label: "Diagnostic amiante",
        validity: "Illimitée en l’absence d’amiante",
        note: "Constructions autorisées avant le 1ᵉʳ juillet 1997.",
      },
    ],
  },

  "avant-travaux": {
    slug: "avant-travaux",
    context: "travaux",
    eyebrow: "Vous lancez un chantier",
    h1: "Repérage amiante avant travaux et avant démolition",
    metaTitle: "Repérage amiante avant travaux et démolition — Tarbes (65)",
    metaDescription:
      "Repérage amiante avant travaux (RAAT) et avant démolition dans les Hautes-Pyrénées et les départements voisins. Protection des intervenants et gestion des déchets.",
    intro:
      "Avant d’effectuer des travaux sur un bâtiment ou d’entreprendre sa démolition, le repérage amiante est exigé pour protéger les travailleurs et l’environnement.",
    body: [
      "L’objectif est également de mener à bien le traitement des déchets dus au chantier. Repérer les matériaux ou produits renfermant de l’amiante permet au donneur d’ordre et au maître d’ouvrage de connaître les risques encourus.",
      "Les entreprises intervenantes peuvent alors prendre les mesures préventives indispensables pour protéger leurs employés et éviter, par la suite, des retards dans les travaux.",
      "Nous réalisons également le repérage plomb avant travaux, particulièrement recommandé dans le bâti antérieur à 1949.",
    ],
    checklist: [
      {
        label: "Repérage amiante avant travaux (RAAT)",
        note: "Obligatoire avant toute intervention sur un bâtiment autorisé avant juillet 1997.",
      },
      {
        label: "Repérage amiante avant démolition",
        note: "Obligatoire avant la démolition, quel que soit le type de bâtiment concerné.",
      },
      {
        label: "Repérage plomb avant travaux",
        note: "Prioritaire dans le bâti antérieur à 1949, conseillé au-delà.",
      },
    ],
    note:
      "Le repérage doit être réalisé avant l’intervention des entreprises, et non pendant le chantier : anticipez-le dès la phase de conception.",
  },
};

export const situationSlugs = Object.keys(situations);
