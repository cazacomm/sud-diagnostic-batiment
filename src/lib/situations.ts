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
  checklist: { label: string; note: string }[];
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
      "DPE, ERP, gaz, électricité, plomb, amiante, termites, loi Carrez : la liste des diagnostics obligatoires avant la vente d’un bien à Tarbes et dans les Hautes-Pyrénées.",
    intro:
      "Le vendeur doit informer l’acheteur en faisant réaliser un dossier de diagnostic technique (DDT) annexé à la promesse ou à l’acte de vente. Voici les expertises à prévoir.",
    body: [
      "La composition exacte du dossier dépend de la nature du bien, de son année de construction et de sa localisation. Nous établissons la liste précise de vos obligations lors de la demande de devis, sans engagement.",
      "Un dossier incomplet peut engager votre responsabilité après la vente : l’acquéreur peut demander une diminution du prix, voire l’annulation de la vente selon le diagnostic manquant.",
    ],
    checklist: [
      { label: "DPE", note: "Performance énergétique et travaux d’amélioration recommandés." },
      { label: "Diagnostic gaz", note: "Installations intérieures de plus de 15 ans." },
      { label: "Diagnostic électricité", note: "Installations de plus de 15 ans." },
      { label: "État des risques et pollutions (ERP)", note: "À jour, établi dans les 6 mois." },
      { label: "Diagnostic plomb", note: "Si le permis de construire est antérieur à janvier 1949." },
      { label: "Diagnostic amiante", note: "Bâtiments à risque, construits avant juillet 1997." },
      { label: "Mesurage loi Carrez", note: "Si l’objet de la vente est un lot de copropriété." },
      { label: "Diagnostic termites", note: "Le département 65 est déclaré totalement termité." },
    ],
  },

  "avant-location": {
    slug: "avant-location",
    context: "location",
    eyebrow: "Vous louez",
    h1: "Les obligations à prendre en compte pour sécuriser la location d’un bien",
    metaTitle: "Diagnostics avant location à Tarbes (65)",
    metaDescription:
      "DPE, ERP, gaz, électricité, plomb, amiante, loi Boutin : les diagnostics obligatoires à annexer au bail à Tarbes et dans les Hautes-Pyrénées.",
    intro:
      "Le bailleur doit renseigner le locataire grâce à la réalisation de plusieurs expertises, annexées au contrat de location.",
    body: [
      "Les durées de validité diffèrent de celles applicables à la vente : le diagnostic gaz et le diagnostic électricité sont par exemple valables 6 ans en location contre 3 ans en vente.",
      "Depuis avril 2017, l’étiquette du DPE et la surface habitable doivent également figurer dans les petites annonces de location.",
    ],
    checklist: [
      { label: "DPE", note: "Performance énergétique et améliorations envisageables." },
      { label: "Diagnostic gaz", note: "Anomalies des installations de plus de 15 ans." },
      { label: "Diagnostic électricité", note: "Installations âgées de plus de 15 ans." },
      { label: "État des risques et pollutions (ERP)", note: "Établi dans les 6 mois précédant la signature du bail." },
      { label: "Surface habitable loi Boutin", note: "À mentionner dans le bail et les annonces." },
      { label: "Diagnostic plomb", note: "Bâtiments construits avant janvier 1949." },
      { label: "Diagnostic amiante", note: "Constructions autorisées avant le 1ᵉʳ juillet 1997." },
    ],
  },

  "avant-travaux": {
    slug: "avant-travaux",
    context: "travaux",
    eyebrow: "Vous lancez un chantier",
    h1: "Amiante avant travaux, démolition et autres contrôles obligatoires",
    metaTitle: "Repérage amiante et plomb avant travaux — Tarbes (65)",
    metaDescription:
      "Repérage amiante avant travaux (RAAT), plomb et termites avant chantier ou démolition dans les Hautes-Pyrénées. Protection des intervenants et gestion des déchets.",
    intro:
      "Avant d’effectuer des travaux sur un bâtiment ou d’entreprendre sa démolition, certains contrôles sont exigés pour protéger les travailleurs et l’environnement.",
    body: [
      "L’objectif est également de mener à bien le traitement des déchets dus au chantier. Les repérages avant travaux ou démolition les plus fréquents s’appliquent à l’amiante, au plomb et à l’infestation de termites.",
      "Repérer les matériaux ou produits renfermant de l’amiante, rechercher le plomb et vérifier la présence de termites permettent au donneur d’ordre et au maître d’ouvrage de connaître les risques encourus.",
      "Les entreprises intervenantes peuvent alors prendre les mesures préventives indispensables pour protéger leurs employés et éviter, par la suite, des retards dans les travaux.",
    ],
    checklist: [
      { label: "Repérage amiante avant travaux (RAAT)", note: "Obligatoire avant travaux et démolition." },
      { label: "Repérage plomb avant travaux", note: "Prioritaire dans le bâti antérieur à 1949." },
      { label: "Recherche de termites", note: "Département 65 déclaré totalement termité." },
    ],
    note:
      "Le repérage doit être réalisé avant l’intervention des entreprises, et non pendant le chantier : anticipez-le dès la phase de conception.",
  },

  copropriete: {
    slug: "copropriete",
    context: "copropriete",
    eyebrow: "Vous divisez un immeuble",
    h1: "Les règles à connaître avant une mise en copropriété",
    metaTitle: "Mise en copropriété : DTA et DTG — Tarbes (65)",
    metaDescription:
      "Dossier technique amiante (DTA), diagnostic technique global (DTG) et relevés de surfaces pour la mise en copropriété d’un immeuble à Tarbes et dans les Hautes-Pyrénées.",
    intro:
      "La division d’un immeuble en plusieurs lots doit s’effectuer en plusieurs étapes. Rappelons d’abord que le bâtiment ne doit pas être déclaré insalubre.",
    body: [
      "Il faudra ensuite faire le relevé des surfaces et rédiger les plans d’intérieur de l’immeuble, puis procéder à l’état descriptif de division : désignation des parties privatives et communes, calcul des tantièmes de copropriété, charges et quotes-parts.",
      "Vient enfin la rédaction du règlement de copropriété que respecteront les copropriétaires.",
      "Des diagnostics techniques sont à prévoir selon l’ancienneté de la construction : dossier technique amiante (DTA), repérage plomb et diagnostic technique global (DTG).",
    ],
    checklist: [
      { label: "Relevé de surfaces et plans", note: "Base de l’état descriptif de division." },
      { label: "Dossier technique amiante (DTA)", note: "Parties communes des immeubles antérieurs à juillet 1997." },
      { label: "Diagnostic technique global (DTG)", note: "Exigé si l’immeuble est bâti depuis plus de 10 ans." },
      { label: "Repérage plomb", note: "Selon l’ancienneté de la construction." },
    ],
  },
};

export const situationSlugs = Object.keys(situations);
