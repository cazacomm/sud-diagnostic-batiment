/**
 * Pages locales « Diagnostic immobilier à <commune> ».
 *
 * Objectif SEO : se positionner sur « diagnostic immobilier <ville> »,
 * « DPE <ville> », etc. Chaque page porte un texte propre à la commune
 * (`intro` + `local`) : on évite les pages identiques où seul le nom change,
 * que Google traite comme des pages satellites.
 *
 * Règle de rédaction : rester sur des faits géographiques sûrs et sur la
 * nature du bâti, jamais sur une réglementation propre à la commune (zonage
 * termites, PPR…) — elle change, on renvoie à la vérification au cas par cas.
 */

export type Zone = "tarbes" | "agglo" | "plaine" | "piemont" | "vallee" | "plateau";

export type Commune = {
  slug: string;
  name: string;
  postcode: string;
  /** Situation par rapport à Tarbes, en clair (« à une vingtaine de kilomètres au sud-ouest »). */
  situation: string;
  zone: Zone;
  /** Accroche propre à la commune (2 à 3 phrases). */
  intro: string;
  /** Paragraphes sur le bâti et les situations rencontrées localement. */
  local: string[];
  /** Communes voisines (slugs) pour le maillage interne. */
  neighbors: string[];
};

export const communes: Commune[] = [
  {
    slug: "tarbes",
    name: "Tarbes",
    postcode: "65000",
    situation: "notre bureau est installé en centre-ville, Cours Gambetta",
    zone: "tarbes",
    intro:
      "Notre bureau est à Tarbes, Résidence Foch, 24 Cours Gambetta. Appartement en centre-ville, maison de quartier ou local professionnel : nous réalisons l’ensemble des diagnostics immobiliers obligatoires avant une vente, une location ou des travaux, avec un seul interlocuteur.",
    local: [
      "Le parc tarbais mêle des immeubles anciens du centre-ville, des maisons de ville et des quartiers pavillonnaires plus récents. Dans les immeubles construits avant 1949, le constat de risque d’exposition au plomb (CREP) est obligatoire. Pour les constructions autorisées avant juillet 1997, c’est le repérage amiante qui s’impose.",
      "Les nombreux lots en copropriété du centre-ville impliquent aussi un mesurage loi Carrez à la vente, ou loi Boutin à la location. Comme nous sommes sur place, nous intervenons rapidement dans tous les quartiers : centre-ville, Arsenal, Laubadère, Ormeau, Mouysset ou Solazur.",
    ],
    neighbors: ["aureilhan", "semeac", "borderes-sur-lechez", "ibos", "odos", "laloubere"],
  },
  {
    slug: "lourdes",
    name: "Lourdes",
    postcode: "65100",
    situation: "à une vingtaine de kilomètres au sud-ouest de Tarbes",
    zone: "piemont",
    intro:
      "À Lourdes, nous intervenons pour les particuliers, les investisseurs et les professionnels de l’hôtellerie. Vente d’un appartement, mise en location ou réhabilitation d’un immeuble : nous établissons le dossier de diagnostic technique complet.",
    local: [
      "La ville compte un patrimoine bâti ancien important : immeubles du centre, hôtels et pensions construits pour l’accueil des pèlerins, maisons de ville. Beaucoup de ces bâtiments sont antérieurs à 1949 ou à 1997, ce qui rend les diagnostics plomb et amiante incontournables à la vente.",
      "La reconversion d’hôtels en logements ou les rénovations lourdes demandent en outre des repérages amiante et plomb avant travaux ou avant démolition, pour protéger les entreprises intervenantes.",
    ],
    neighbors: ["argeles-gazost", "juillan", "ossun", "bagneres-de-bigorre"],
  },
  {
    slug: "bagneres-de-bigorre",
    name: "Bagnères-de-Bigorre",
    postcode: "65200",
    situation: "à une vingtaine de kilomètres au sud de Tarbes, au pied de la vallée de Campan",
    zone: "piemont",
    intro:
      "Ville thermale à l’entrée de la vallée de Campan, Bagnères-de-Bigorre compte un marché immobilier varié : appartements anciens, villas, maisons de village alentour et résidences secondaires. Nous y réalisons tous les diagnostics avant vente, location ou travaux.",
    local: [
      "Le centre ancien et les villas bourgeoises héritées de l’époque thermale sont souvent antérieurs à 1949 : le diagnostic plomb y est fréquent, de même que l’amiante pour les rénovations réalisées avant 1997.",
      "Dans les maisons chauffées au gaz ou au fioul, l’état des installations et le DPE pèsent lourd dans une vente. Un logement classé E, F ou G nécessite en plus un audit énergétique, à remettre à l’acquéreur dès la première visite.",
    ],
    neighbors: ["vielle-adour", "lourdes", "horgues", "barbazan-debat"],
  },
  {
    slug: "argeles-gazost",
    name: "Argelès-Gazost",
    postcode: "65400",
    situation: "à une trentaine de kilomètres au sud de Tarbes, dans le Lavedan",
    zone: "vallee",
    intro:
      "Au cœur du Lavedan, Argelès-Gazost et les villages des vallées des Gaves comptent de nombreuses maisons de montagne, granges rénovées et résidences secondaires. Nous nous déplaçons pour toute vente, location ou location saisonnière.",
    local: [
      "Le bâti de vallée est souvent ancien : murs en pierre, charpentes en bois, extensions successives. Plomb, amiante et électricité sont les points de vigilance les plus courants, en plus du DPE.",
      "En montagne, l’obligation du diagnostic termites dépend de l’arrêté préfectoral : certaines communes d’altitude en sont exemptées. Nous vérifions systématiquement l’arrêté en vigueur pour la commune du bien avant d’intervenir.",
    ],
    neighbors: ["lourdes", "juillan", "ossun"],
  },
  {
    slug: "vic-en-bigorre",
    name: "Vic-en-Bigorre",
    postcode: "65500",
    situation: "à une vingtaine de kilomètres au nord de Tarbes, dans la plaine de l’Adour",
    zone: "plaine",
    intro:
      "Au nord de la Bigorre, Vic-en-Bigorre et les villages du Val d’Adour comptent beaucoup de maisons de bourg et de corps de ferme. Nous y intervenons régulièrement pour les ventes, les locations et les projets de rénovation.",
    local: [
      "Les fermes et maisons anciennes de la plaine combinent souvent plusieurs époques de construction. Le repérage amiante porte alors sur les toitures et les bardages en fibrociment des dépendances, très répandus dans les bâtiments agricoles.",
      "Pour une maison ancienne, l’assainissement, le chauffage et l’isolation font varier fortement le DPE. Nous expliquons le classement obtenu et les pistes d’amélioration indiquées dans le rapport.",
    ],
    neighbors: ["maubourguet", "rabastens-de-bigorre", "borderes-sur-lechez", "tarbes"],
  },
  {
    slug: "lannemezan",
    name: "Lannemezan",
    postcode: "65300",
    situation: "à une trentaine de kilomètres à l’est de Tarbes, sur le plateau",
    zone: "plateau",
    intro:
      "Sur le plateau de Lannemezan, nous réalisons les diagnostics immobiliers des maisons, appartements et locaux professionnels, pour la vente comme pour la location.",
    local: [
      "Une grande partie des logements de la ville date du XXᵉ siècle, notamment des décennies d’après-guerre. Pour ces constructions antérieures à juillet 1997, le repérage amiante est obligatoire à la vente.",
      "Les locaux d’activité et bâtiments tertiaires demandent des repérages adaptés, notamment avant des travaux d’aménagement. Nous établissons un devis selon la nature et la surface du bâtiment.",
    ],
    neighbors: ["tarbes", "barbazan-debat", "soues"],
  },
  {
    slug: "juillan",
    name: "Juillan",
    postcode: "65290",
    situation: "à quelques kilomètres au sud-ouest de Tarbes, près de l’aéroport Tarbes-Lourdes-Pyrénées",
    zone: "agglo",
    intro:
      "À Juillan, entre Tarbes et Lourdes, nous réalisons les diagnostics des maisons individuelles, des lotissements et des logements anciens du bourg, avant vente, location ou travaux.",
    local: [
      "La commune associe un cœur de village ancien et des quartiers pavillonnaires. Pour les maisons construites avant juillet 1997, le repérage amiante est obligatoire à la vente. Les installations gaz et électricité de plus de 15 ans doivent aussi être diagnostiquées.",
      "Sa proximité avec l’aéroport et les grands axes en fait une commune prisée des actifs. Un dossier de diagnostics complet et prêt à l’avance facilite la signature chez le notaire.",
    ],
    neighbors: ["odos", "ibos", "ossun", "laloubere", "lourdes"],
  },
  {
    slug: "barbazan-debat",
    name: "Barbazan-Debat",
    postcode: "65690",
    situation: "aux portes de Tarbes, au sud-est",
    zone: "agglo",
    intro:
      "À Barbazan-Debat, aux portes de Tarbes, nous nous déplaçons rapidement pour les diagnostics avant vente, avant location et avant travaux, en maison comme en appartement.",
    local: [
      "Les maisons individuelles dominent, avec des constructions de toutes les époques. Selon l’année du permis de construire, le dossier comprend le plomb (avant 1949), l’amiante (avant juillet 1997) ainsi que le gaz et l’électricité si les installations ont plus de 15 ans.",
      "Vous préparez des travaux de rénovation ou une extension ? Le repérage amiante avant travaux protège les artisans et évite les arrêts de chantier.",
    ],
    neighbors: ["soues", "semeac", "horgues", "tarbes"],
  },
  {
    slug: "semeac",
    name: "Séméac",
    postcode: "65600",
    situation: "en première couronne, à l’est de Tarbes",
    zone: "agglo",
    intro:
      "Séméac, en première couronne de Tarbes, compte de nombreuses maisons individuelles et des résidences. Nous y réalisons tous les diagnostics obligatoires, avec un devis sous 24 heures.",
    local: [
      "Une part importante des pavillons date de la seconde moitié du XXᵉ siècle : le repérage amiante est alors systématique avant une vente si le permis de construire est antérieur à juillet 1997.",
      "Pour une mise en location, le DPE, l’état des risques et pollutions et le mesurage loi Boutin forment la base du dossier. S’y ajoutent les diagnostics gaz et électricité si les installations ont plus de 15 ans.",
    ],
    neighbors: ["aureilhan", "soues", "barbazan-debat", "tarbes"],
  },
  {
    slug: "aureilhan",
    name: "Aureilhan",
    postcode: "65800",
    situation: "en première couronne, au nord-est de Tarbes",
    zone: "agglo",
    intro:
      "À Aureilhan, au nord-est de Tarbes, nous intervenons pour les ventes et les locations de maisons et d’appartements, ainsi que pour les repérages avant travaux.",
    local: [
      "Entre le vieux bourg et les quartiers résidentiels, les époques de construction varient beaucoup. C’est l’année du permis de construire qui détermine la liste des diagnostics : nous la vérifions avec vous dès la demande de devis.",
      "Copropriétés et petits immeubles demandent un mesurage loi Carrez à la vente. En location, c’est la surface habitable loi Boutin qui doit figurer dans le bail.",
    ],
    neighbors: ["tarbes", "semeac", "borderes-sur-lechez"],
  },
  {
    slug: "borderes-sur-lechez",
    name: "Bordères-sur-l’Échez",
    postcode: "65320",
    situation: "à quelques kilomètres au nord de Tarbes",
    zone: "agglo",
    intro:
      "À Bordères-sur-l’Échez, au nord de Tarbes, nous réalisons les diagnostics des maisons du bourg et des lotissements, pour la vente, la location et les travaux.",
    local: [
      "Le bâti mêle maisons anciennes de village et pavillons plus récents. Pour les plus anciennes, plomb et amiante complètent le DPE. Pour les plus récentes, le dossier se concentre souvent sur le DPE, l’ERP et, au-delà de 15 ans, le gaz et l’électricité.",
      "En cas de doute sur l’année de construction, l’acte de propriété ou le permis de construire permettent de trancher. Nous vous aidons à vérifier ces documents avant l’intervention.",
    ],
    neighbors: ["tarbes", "aureilhan", "ibos", "vic-en-bigorre"],
  },
  {
    slug: "ibos",
    name: "Ibos",
    postcode: "65420",
    situation: "à l’ouest de Tarbes",
    zone: "agglo",
    intro:
      "À Ibos, à l’ouest de Tarbes, nous réalisons les diagnostics immobiliers des habitations comme des locaux professionnels, avant vente, location ou travaux.",
    local: [
      "La commune associe un village ancien, des quartiers résidentiels et une importante zone d’activités. Pour les bâtiments professionnels, les repérages amiante avant travaux sont fréquents lors des réaménagements.",
      "Côté habitations, le dossier de vente comprend au minimum le DPE et l’état des risques et pollutions. Il est complété selon l’âge du bien et de ses installations.",
    ],
    neighbors: ["tarbes", "juillan", "odos", "borderes-sur-lechez"],
  },
  {
    slug: "odos",
    name: "Odos",
    postcode: "65310",
    situation: "au sud de Tarbes",
    zone: "agglo",
    intro:
      "À Odos, au sud de Tarbes, nous intervenons rapidement pour les maisons individuelles et les logements anciens du bourg.",
    local: [
      "Beaucoup de maisons de la commune ont été construites ou agrandies en plusieurs fois. Le repérage amiante porte alors sur l’ensemble des parties, y compris les extensions et les annexes.",
      "Pour une vente, prévoyez un ERP de moins de six mois à la signature. Nous le mettons à jour si la vente prend du retard.",
    ],
    neighbors: ["laloubere", "juillan", "tarbes", "horgues"],
  },
  {
    slug: "laloubere",
    name: "Laloubère",
    postcode: "65310",
    situation: "au sud de Tarbes",
    zone: "agglo",
    intro:
      "À Laloubère, au sud de Tarbes, nous réalisons les diagnostics avant vente et avant location des maisons et appartements.",
    local: [
      "Dans cette commune résidentielle, les pavillons construits avant juillet 1997 doivent faire l’objet d’un repérage amiante avant la vente. Les installations gaz et électricité de plus de 15 ans sont également contrôlées.",
      "Le DPE reste le diagnostic le plus regardé par les acheteurs : nous expliquons le classement obtenu et les pistes d’amélioration figurant dans le rapport.",
    ],
    neighbors: ["odos", "horgues", "tarbes", "soues"],
  },
  {
    slug: "soues",
    name: "Soues",
    postcode: "65430",
    situation: "au sud-est de Tarbes",
    zone: "agglo",
    intro:
      "À Soues, au sud-est de Tarbes, nous réalisons les diagnostics des logements et des locaux d’activité, avant vente, location ou travaux.",
    local: [
      "Les quartiers d’habitation côtoient des zones d’activité. Pour les locaux professionnels, le DPE tertiaire et les repérages avant travaux sont les demandes les plus fréquentes.",
      "Pour une maison, le dossier dépend de l’année de construction et de l’âge des installations. Nous établissons la liste exacte dès la demande de devis.",
    ],
    neighbors: ["semeac", "barbazan-debat", "laloubere", "tarbes"],
  },
  {
    slug: "horgues",
    name: "Horgues",
    postcode: "65310",
    situation: "au sud de Tarbes",
    zone: "agglo",
    intro:
      "À Horgues, au sud de l’agglomération tarbaise, nous intervenons pour les ventes, les locations et les projets de rénovation.",
    local: [
      "Maisons de village et constructions plus récentes se partagent la commune. Pour les plus anciennes, le diagnostic plomb s’impose si le permis de construire est antérieur à 1949. Pour un projet de rénovation, il reste fortement recommandé jusqu’aux constructions d’avant 1994.",
      "Avant de lancer des travaux, un repérage amiante et plomb permet d’informer les entreprises et d’organiser le tri des déchets de chantier.",
    ],
    neighbors: ["odos", "laloubere", "barbazan-debat", "vielle-adour"],
  },
  {
    slug: "ossun",
    name: "Ossun",
    postcode: "65380",
    situation: "entre Tarbes et Lourdes",
    zone: "plaine",
    intro:
      "À Ossun, entre Tarbes et Lourdes, nous réalisons les diagnostics des maisons, fermes rénovées et logements du bourg.",
    local: [
      "Le bâti rural ancien y côtoie des constructions récentes. Pour une ferme ou une grange rénovée, le repérage amiante porte aussi sur les dépendances et les toitures.",
      "Pour une location, le dossier comprend au minimum le DPE, l’ERP et la surface habitable loi Boutin. Gaz et électricité s’ajoutent selon l’âge des installations.",
    ],
    neighbors: ["juillan", "lourdes", "ibos", "argeles-gazost"],
  },
  {
    slug: "vielle-adour",
    name: "Vielle-Adour",
    postcode: "65360",
    situation: "à une dizaine de kilomètres au sud de Tarbes, où se trouve notre siège",
    zone: "plaine",
    intro:
      "Notre siège social est à Vielle-Adour, 24 Route de Tarbes. Nous intervenons dans la commune et les villages voisins de la vallée de l’Adour pour tous les diagnostics immobiliers.",
    local: [
      "Maisons de village, fermes et pavillons composent le paysage local. L’âge du bâtiment détermine les diagnostics à réaliser : plomb avant 1949, amiante avant juillet 1997.",
      "Comme nous sommes sur place, nous pouvons intervenir rapidement, y compris pour mettre à jour un ERP ou un diagnostic termites arrivé à échéance avant la signature.",
    ],
    neighbors: ["horgues", "bagneres-de-bigorre", "barbazan-debat", "tarbes"],
  },
  {
    slug: "maubourguet",
    name: "Maubourguet",
    postcode: "65700",
    situation: "à une trentaine de kilomètres au nord de Tarbes, dans le Val d’Adour",
    zone: "plaine",
    intro:
      "À Maubourguet et dans le nord du Val d’Adour, nous réalisons les diagnostics immobiliers des maisons de bourg, des fermes et des logements locatifs.",
    local: [
      "Le bâti ancien y est très présent. Plomb pour les constructions d’avant 1949, amiante pour celles d’avant juillet 1997 : les deux reviennent souvent dans les dossiers de vente.",
      "Nous nous déplaçons aussi dans le Gers voisin, que nous couvrons comme le reste de nos cinq départements d’intervention.",
    ],
    neighbors: ["vic-en-bigorre", "rabastens-de-bigorre"],
  },
  {
    slug: "rabastens-de-bigorre",
    name: "Rabastens-de-Bigorre",
    postcode: "65140",
    situation: "à une vingtaine de kilomètres au nord-est de Tarbes",
    zone: "plaine",
    intro:
      "À Rabastens-de-Bigorre et dans les villages alentour, nous réalisons les diagnostics avant vente, location et travaux.",
    local: [
      "Cette ancienne bastide conserve un centre aux maisons alignées, souvent anciennes. Le diagnostic plomb y est fréquent, comme l’amiante dans les bâtiments rénovés avant 1997.",
      "Pour les corps de ferme et les maisons avec dépendances, nous précisons dès le devis les parties à diagnostiquer, afin d’éviter toute surprise le jour de la visite.",
    ],
    neighbors: ["vic-en-bigorre", "maubourguet", "tarbes"],
  },
];

export const communeBySlug = (slug: string) => communes.find((c) => c.slug === slug);

/** Communes mises en avant (pied de page, page secteur). */
export const featuredCommunes = [
  "tarbes",
  "lourdes",
  "bagneres-de-bigorre",
  "argeles-gazost",
  "vic-en-bigorre",
  "lannemezan",
  "juillan",
  "barbazan-debat",
  "semeac",
  "aureilhan",
];
