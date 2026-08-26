export type IconName =
  | "dpe" | "erp" | "carrez" | "boutin" | "gaz"
  | "electricite" | "plomb" | "amiante" | "termites" | "dta" | "dtg";

export type Diagnostic = {
  slug: string;
  title: string;
  short: string;
  icon: IconName;
  image: string;
  intro: string;
  body: string[];
  facts: { label: string; value: string }[];
  contexts: ("vente" | "location" | "travaux" | "copropriete")[];
};

export const diagnostics: Diagnostic[] = [
  {
    slug: "dpe",
    title: "DPE / Audit énergétique",
    short: "Performance énergétique",
    icon: "dpe",
    image: "/img/dpe.jpg",
    intro:
      "Le diagnostic de performance énergétique classe votre bien de A à G et chiffre sa consommation. Il est obligatoire pour toute vente ou location, et son étiquette doit figurer dans l’annonce.",
    body: [
      "La performance énergétique d’un logement découle d’une évaluation menée par un diagnostiqueur certifié. Le DPE donne un aperçu de l’efficacité énergétique via une étiquette énergie intégrée dans l’annonce immobilière.",
      "Le rapport mentionne les caractéristiques techniques du bien, une estimation des coûts annuels d’énergie, ainsi que les travaux d’amélioration recommandés par l’expert. Les futurs occupants peuvent ainsi anticiper leur budget énergie.",
      "Le DPE accompagne les contrats de vente et de location pendant 10 ans, sauf en cas de travaux de rénovation énergétique ou de modification importante du bien entre-temps.",
    ],
    facts: [
      { label: "Validité", value: "10 ans" },
      { label: "Concerne", value: "Vente et location" },
      { label: "À fournir", value: "Dès la mise en annonce" },
    ],
    contexts: ["vente", "location"],
  },
  {
    slug: "erp",
    title: "État des risques et pollutions (ERP)",
    short: "Risques naturels, miniers, technologiques",
    icon: "erp",
    image: "/img/erp.jpg",
    intro:
      "L’ERP informe l’acquéreur ou le locataire des risques auxquels le bien est exposé : inondation, séisme, radon, pollution des sols, risques technologiques.",
    body: [
      "Vendeurs et bailleurs d’un bien immobilier, quel qu’il soit, doivent présenter un État des risques et pollutions si le bâtiment ou le terrain est localisé dans une zone à risques.",
      "Par zone à risques, on entend la prise en compte des plans de prévention des risques (miniers, naturels, technologiques), la situation au regard du gaz radon ou encore l’information sur la pollution des sols.",
      "Ce document, autrefois nommé ERNT, ERNMT puis ESRIS, est établi à partir des données fournies par la préfecture et la mairie. Sa réalisation doit avoir lieu dans les six mois précédant la vente ou la location afin de fournir une information à jour.",
    ],
    facts: [
      { label: "Validité", value: "6 mois" },
      { label: "Concerne", value: "Vente et location" },
      { label: "Source", value: "Données préfecture / mairie" },
    ],
    contexts: ["vente", "location"],
  },
  {
    slug: "loi-carrez",
    title: "Mesurage Loi Carrez",
    short: "Superficie privative en copropriété",
    icon: "carrez",
    image: "/img/loi-carrez.jpg",
    intro:
      "Le mesurage Loi Carrez certifie la superficie privative d’un lot de copropriété mis en vente. Une erreur de mesure supérieure à 5 % expose le vendeur à une réduction du prix.",
    body: [
      "Afin de garantir la bonne information de l’acheteur d’un lot de copropriété, le mesurage de la superficie privative est requis avant la vente. C’est également obligatoire quand plusieurs lots sont vendus ensemble.",
      "Cette superficie se calcule en prenant la surface de plancher construite après en avoir soustrait, entre autres, les murs, cloisons, gaines et marches d’escalier. Certaines surfaces non habitables sont d’emblée exclues, par exemple les sous-sols et les terrasses.",
      "Suite à une erreur de mesure, l’acheteur qui la constate peut obtenir la diminution du prix de vente. Outre les appareils de mesure dont dispose un spécialiste, confier cette expertise à un professionnel protège le vendeur.",
    ],
    facts: [
      { label: "Validité", value: "Illimitée sauf travaux" },
      { label: "Concerne", value: "Vente d’un lot de copropriété" },
      { label: "Enjeu", value: "Réduction du prix au-delà de 5 % d’écart" },
    ],
    contexts: ["vente"],
  },
  {
    slug: "loi-boutin",
    title: "Surface habitable Loi Boutin",
    short: "Surface habitable en location",
    icon: "boutin",
    image: "/img/loi-boutin.jpg",
    intro:
      "Tout bail d’habitation doit mentionner la surface habitable du logement. Depuis avril 2017, elle figure également dans les petites annonces.",
    body: [
      "Un bail d’habitation doit systématiquement contenir la mention de la surface habitable, à moins qu’il ne s’agisse d’une location saisonnière. Cette obligation date de la loi Boutin de mars 2009.",
      "Par surface habitable Loi Boutin, on désigne la surface de plancher construite après avoir déduit les surfaces, superficies, volumes et parties de locaux indiqués dans le texte de loi.",
      "L’opérateur prend toutes les mesures nécessaires pour livrer un diagnostic fiable. Lui confier cette tâche évite au bailleur d’être contraint de diminuer le loyer suite à une erreur de mesure. Sauf travaux, le rapport reste valable dans le temps.",
    ],
    facts: [
      { label: "Validité", value: "Illimitée sauf travaux" },
      { label: "Concerne", value: "Location (hors saisonnier)" },
      { label: "Depuis", value: "Loi du 25 mars 2009" },
    ],
    contexts: ["location"],
  },
  {
    slug: "gaz",
    title: "Diagnostic gaz",
    short: "Installations de plus de 15 ans",
    icon: "gaz",
    image: "/img/gaz.jpg",
    intro:
      "Le diagnostic gaz contrôle l’état des installations intérieures de gaz de plus de 15 ans et signale les anomalies présentant un risque pour les occupants.",
    body: [
      "Dans le cadre d’une vente ou d’une location, l’installation au gaz du logement est soumise à un diagnostic si son ancienneté excède 15 ans.",
      "Le diagnostiqueur inspecte les parties visibles et accessibles de l’installation : équipements fixes utilisés pour l’alimentation en gaz, conformité du système de ventilation, mesure du monoxyde de carbone à proximité de la chaudière.",
      "Toutes les anomalies sont mentionnées et leur gravité précisée. Cette information est primordiale pour la protection des futurs occupants. Le diagnostic gaz est ensuite annexé au dossier de diagnostic technique.",
    ],
    facts: [
      { label: "Validité", value: "3 ans (vente) · 6 ans (location)" },
      { label: "Concerne", value: "Installations de plus de 15 ans" },
      { label: "Points contrôlés", value: "Alimentation, ventilation, combustion" },
    ],
    contexts: ["vente", "location"],
  },
  {
    slug: "electricite",
    title: "Diagnostic électricité",
    short: "Installations de plus de 15 ans",
    icon: "electricite",
    image: "/img/electricite.jpg",
    intro:
      "Le diagnostic électrique identifie les anomalies des installations de plus de 15 ans susceptibles de compromettre la sécurité des occupants.",
    body: [
      "Le diagnostic électricité répond à deux objectifs : informer les acquéreurs et locataires des défauts présents dans les installations de plus de 15 ans, et repérer ce qui peut compromettre la santé et la sécurité des futurs occupants afin d’intervenir à temps.",
      "Il découle de contrôles visuels, d’essais et de mesures effectués par un professionnel détenteur d’une certification. La présence d’un disjoncteur accessible, le respect des distances de sécurité dans les salles de bain ou encore l’existence de matériels vétustes sont autant de points de contrôle.",
      "Le compte-rendu est particulièrement détaillé et peut comprendre des recommandations de travaux.",
    ],
    facts: [
      { label: "Validité", value: "3 ans (vente) · 6 ans (location)" },
      { label: "Concerne", value: "Installations de plus de 15 ans" },
      { label: "Méthode", value: "Contrôles visuels, essais et mesures" },
    ],
    contexts: ["vente", "location"],
  },
  {
    slug: "plomb",
    title: "Diagnostic plomb (CREP)",
    short: "Bâtiments construits avant 1949",
    icon: "plomb",
    image: "/img/plomb.jpg",
    intro:
      "Le constat de risque d’exposition au plomb concerne les logements dont le permis de construire est antérieur au 1ᵉʳ janvier 1949. Il prévient le risque de saturnisme.",
    body: [
      "De nombreux logements exposent leurs occupants à un risque d’ingestion et d’inhalation de plomb. Ce métal a fait partie des revêtements, et en particulier des peintures des bâtiments, jusqu’en 1949.",
      "L’expert certifié détermine si la concentration en plomb, l’état de dégradation du revêtement et les éventuels facteurs de dégradation entraînent un risque de saturnisme pour les futurs occupants. L’utilisation d’un analyseur à fluorescence X permet de mener à bien cette expertise.",
      "Le diagnostic plomb est attendu avant la vente ou la location des bâtiments anciens. En cas de diagnostic positif, il conviendra de procéder à des travaux pour sécuriser les lieux.",
    ],
    facts: [
      { label: "Validité", value: "1 an (vente) · 6 ans (location) · illimitée si négatif" },
      { label: "Concerne", value: "Permis de construire avant janvier 1949" },
      { label: "Matériel", value: "Analyseur à fluorescence X" },
    ],
    contexts: ["vente", "location"],
  },
  {
    slug: "amiante",
    title: "Diagnostic amiante",
    short: "Constructions autorisées avant juillet 1997",
    icon: "amiante",
    image: "/img/amiante.jpg",
    intro:
      "Le repérage amiante protège les occupants d’un bien des maladies graves provoquées par cette substance cancérigène. Il concerne toute construction autorisée avant le 1ᵉʳ juillet 1997.",
    body: [
      "Le diagnostic amiante permet de protéger les occupants d’un bien des graves maladies provoquées par cette substance cancérigène. C’est également l’une des informations obligatoires à communiquer aux acheteurs d’un logement, ainsi qu’aux locataires qui en font la demande.",
      "Plusieurs bâtiments renferment encore de l’amiante car leur construction est antérieure à juillet 1997. Le permis de construire du bien dicte donc la conduite à tenir.",
      "L’opérateur certifié examine les matériaux connus pour contenir de l’amiante. Si besoin, il procède à des prélèvements pour les faire analyser en laboratoire. Le rapport permet de connaître l’état de conservation des matériaux et les précautions à prendre.",
    ],
    facts: [
      { label: "Validité", value: "Illimitée si absence (rapports après 2013)" },
      { label: "Concerne", value: "Permis de construire avant juillet 1997" },
      { label: "Si besoin", value: "Prélèvements et analyse en laboratoire" },
    ],
    contexts: ["vente", "location", "travaux", "copropriete"],
  },
  {
    slug: "termites",
    title: "Diagnostic termites",
    short: "Hautes-Pyrénées : département termité",
    icon: "termites",
    image: "/img/termites.jpg",
    intro:
      "Les Hautes-Pyrénées sont déclarées totalement termitées par arrêté préfectoral : le diagnostic termites est donc obligatoire pour toute vente dans le département.",
    body: [
      "Dans les départements déclarés termités par arrêté préfectoral, les propriétaires sont obligés de transmettre un diagnostic termites à l’acquéreur de leur bien immobilier. C’est le cas dans les Hautes-Pyrénées, département totalement termité.",
      "L’expertise porte sur les pièces accessibles ainsi que sur une partie du terrain alentour. La réalisation du diagnostic comporte un examen visuel et des sondages manuels au poinçon.",
      "Le rapport mentionne les parties du bien visitées ou non, jusqu’au signalement des éléments infestés. En cas d’infestation par ces insectes xylophages, des travaux de désinsectisation seront prescrits et la mairie devra être informée.",
    ],
    facts: [
      { label: "Validité", value: "6 mois" },
      { label: "Concerne", value: "Toute vente dans le 65" },
      { label: "Méthode", value: "Examen visuel et sondages au poinçon" },
    ],
    contexts: ["vente", "travaux"],
  },
  {
    slug: "amiante-avant-travaux",
    title: "Repérage amiante avant travaux / démolition",
    short: "Protection des intervenants sur chantier",
    icon: "amiante",
    image: "/img/amiante-avant-travaux.jpg",
    intro:
      "Avant tout chantier de rénovation ou de démolition, le repérage amiante avant travaux (RAAT) est obligatoire pour protéger les entreprises intervenantes et organiser le traitement des déchets.",
    body: [
      "Avant d’effectuer des travaux sur un bâtiment ou d’entreprendre sa démolition, certains contrôles sont exigés pour protéger les travailleurs et l’environnement. L’objectif est également de mener à bien le traitement des déchets dus au chantier.",
      "Repérer les matériaux ou produits renfermant de l’amiante permet au donneur d’ordre et au maître d’ouvrage de connaître les risques encourus.",
      "Les entreprises intervenantes peuvent alors prendre les mesures préventives indispensables pour protéger leurs employés et éviter des retards dans les travaux.",
    ],
    facts: [
      { label: "Obligatoire", value: "Avant travaux et démolition" },
      { label: "Demandeur", value: "Donneur d’ordre / maître d’ouvrage" },
      { label: "Objectif", value: "Sécurité des intervenants et gestion des déchets" },
    ],
    contexts: ["travaux"],
  },
  {
    slug: "plomb-avant-travaux",
    title: "Repérage plomb avant travaux / démolition",
    short: "Poussières et écailles toxiques",
    icon: "plomb",
    image: "/img/plomb-avant-travaux.jpg",
    intro:
      "Les chantiers menés dans les bâtiments anciens libèrent des poussières et écailles de peinture au plomb. Le repérage préalable permet de protéger les intervenants et de trier les déchets.",
    body: [
      "Les travaux et les chantiers de démolition, surtout dans les bâtiments construits avant 1949, peuvent provoquer l’ingestion ou l’inhalation accidentelle de poussières et d’écailles toxiques.",
      "Il faut donc repérer au préalable s’il y a présence de plomb à cause de peintures anciennes et, le cas échéant, déterminer la concentration. Même dans les constructions relativement récentes, le contrôle plomb avant travaux s’avère conseillé.",
      "Le résultat du diagnostic mené par l’opérateur certifié permet d’informer les personnes concernées par les travaux et de prendre les précautions nécessaires. Il est également indispensable pour gérer les déchets en fonction de leur nature et de leur teneur en plomb.",
    ],
    facts: [
      { label: "Recommandé", value: "Avant tout chantier" },
      { label: "Prioritaire", value: "Bâtiments avant 1949" },
      { label: "Objectif", value: "Sécurité chantier et tri des déchets" },
    ],
    contexts: ["travaux"],
  },
  {
    slug: "dta",
    title: "Dossier technique amiante (DTA)",
    short: "Copropriétés, ERP et locaux de travail",
    icon: "dta",
    image: "/img/dta.jpg",
    intro:
      "Le DTA recense la présence d’amiante dans les immeubles collectifs, les établissements recevant du public et les locaux de travail construits avant juillet 1997. Il doit être tenu à jour.",
    body: [
      "Comme l’ensemble des bâtiments construits avant juillet 1997, les immeubles d’habitation en copropriété, les établissements recevant du public et les locaux de travail s’exposent au risque amiante. Le DTA est effectué dans ces différents types de bâtiments, hors transaction immobilière.",
      "Repérages amiante, travaux et opérations de retrait des matériaux et produits renfermant de l’amiante y sont mentionnés, avec une mise à jour obligatoire des différentes informations.",
      "Ainsi, des occupants aux médecins du travail en passant par les entreprises intervenant pour des travaux d’entretien, chacun peut connaître les dangers relatifs à la présence d’amiante et les recommandations de sécurité.",
    ],
    facts: [
      { label: "Concerne", value: "Parties communes, ERP, locaux de travail" },
      { label: "Construction", value: "Permis avant juillet 1997" },
      { label: "Mise à jour", value: "Obligatoire après travaux ou retrait" },
    ],
    contexts: ["copropriete"],
  },
  {
    slug: "dtg",
    title: "Diagnostic technique global (DTG)",
    short: "État de l’immeuble et travaux à prévoir",
    icon: "dtg",
    image: "/img/dtg.jpg",
    intro:
      "Le DTG donne aux copropriétaires une vision d’ensemble de l’état de l’immeuble et des travaux à planifier sur les dix prochaines années.",
    body: [
      "Le DTG a été instauré pour donner aux copropriétaires et occupants une vision détaillée de l’état de l’immeuble et des possibilités d’amélioration, afin de mieux planifier les travaux.",
      "Lors d’une mise en copropriété, le DTG est exigé si l’immeuble est bâti depuis plus de 10 ans. C’est également un diagnostic souvent requis quand une procédure d’insalubrité est en cours.",
      "Dans les copropriétés existantes, le DTG doit être proposé aux copropriétaires lors de l’assemblée générale, sans obligation de vote positif. Il contient notamment l’efficacité énergétique (DPE ou audit énergétique) et des recommandations pour améliorer la gestion de l’immeuble.",
    ],
    facts: [
      { label: "Obligatoire", value: "Mise en copropriété d’un immeuble de plus de 10 ans" },
      { label: "Volontaire", value: "Proposé en assemblée générale" },
      { label: "Contient", value: "État du bâti, DPE collectif, travaux à prévoir" },
    ],
    contexts: ["copropriete"],
  },
];

export const bySlug = (slug: string) => diagnostics.find((d) => d.slug === slug);
export const byContext = (ctx: Diagnostic["contexts"][number]) =>
  diagnostics.filter((d) => d.contexts.includes(ctx));
