import type { IconName } from "@/lib/diagnostics";

type Props = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ className, children }: Props & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
      {children}
    </svg>
  );
}

/* Maison + loupe — état des risques et pollutions */
export const IconErp = (p: Props) => (
  <Svg {...p}>
    <path d="M5 15 16 6l11 9" />
    <path d="M8 13.5V26h16V13.5" />
    <rect x="13" y="17" width="6" height="6" />
    <circle cx="23.5" cy="7.5" r="3" />
    <path d="M25.7 9.7 28 12" />
  </Svg>
);

/* Mur / peinture écaillée — plomb */
export const IconPlomb = (p: Props) => (
  <Svg {...p}>
    <rect x="5" y="7" width="22" height="18" rx="1.5" />
    <path d="M5 13h22M5 19h22M13 7v6M20 13v6M11 19v6" />
  </Svg>
);

/* Termite */
export const IconTermites = (p: Props) => (
  <Svg {...p}>
    <path d="M16 6v20" />
    <ellipse cx="16" cy="11" rx="2.6" ry="3.2" />
    <ellipse cx="16" cy="19.5" rx="3.4" ry="5" />
    <path d="M13.4 9 9 6M18.6 9 23 6M12.6 16l-5 -2M19.4 16l5 -2M12.8 22l-4.5 3M19.2 22l4.5 3M15 6.5 13.5 4M17 6.5 18.5 4" />
  </Svg>
);

/* Fibres — amiante */
export const IconAmiante = (p: Props) => (
  <Svg {...p}>
    <circle cx="16" cy="16" r="10.5" />
    <path d="M16 5.5c-3 4-3 17 0 21M16 5.5c3 4 3 17 0 21M5.5 16c4-3 17-3 21 0M6.6 10.6c4.4-1 15 5 18.8 8.2M25.4 10.6c-4.4-1-15 5-18.8 8.2" />
  </Svg>
);

/* Règle / équerre — mesurage Carrez */
export const IconCarrez = (p: Props) => (
  <Svg {...p}>
    <path d="M6 26 26 26 6 6z" />
    <path d="M9.5 22.5h3M13.5 22.5h3M17.5 22.5h3M9 19v-3M9 15v-3" />
  </Svg>
);

/* Plan / surface habitable — Boutin */
export const IconBoutin = (p: Props) => (
  <Svg {...p}>
    <rect x="5" y="6" width="22" height="20" rx="1.5" />
    <path d="M14 6v9M14 15h13M14 20H5M19 15v11" />
  </Svg>
);

/* Flamme — gaz */
export const IconGaz = (p: Props) => (
  <Svg {...p}>
    <path d="M16 4c4 5 7 8 7 13a7 7 0 0 1-14 0c0-3 1.5-5 3-6.5.5 2 1.5 3 2.5 3 1.5 0 2-2 1.5-4-.3-1.6-.6-3.4 0-5.5z" />
  </Svg>
);

/* Étiquette énergie — DPE */
export const IconDpe = (p: Props) => (
  <Svg {...p}>
    <path d="M8 8h13l4 2.5L21 13H8z" />
    <path d="M8 15h9l4 2.5L17 20H8z" />
    <path d="M8 22h5l4 2.5L13 27H8z" />
  </Svg>
);

/* Ampoule — électricité */
export const IconElectricite = (p: Props) => (
  <Svg {...p}>
    <path d="M16 4a8 8 0 0 0-5 14.2c.8.7 1.3 1.7 1.3 2.8v1h7.4v-1c0-1.1.5-2.1 1.3-2.8A8 8 0 0 0 16 4z" />
    <path d="M12.8 25h6.4M13.8 28h4.4" />
    <path d="M16.8 10.5 14.5 15h3l-2.3 4.5" />
  </Svg>
);

/* Dossier — DTA */
export const IconDta = (p: Props) => (
  <Svg {...p}>
    <path d="M4 9h9l2.5 3H28v14a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 4 26z" />
    <path d="M4 9V6.5A1.5 1.5 0 0 1 5.5 5h6" />
    <path d="M11 18h10M11 22h7" />
  </Svg>
);

/* Immeuble — DTG */
export const IconDtg = (p: Props) => (
  <Svg {...p}>
    <path d="M6 27V8l10-4v23" />
    <path d="M16 13h10v14" />
    <path d="M4 27h24" />
    <path d="M9.5 10.5h3M9.5 15h3M9.5 19.5h3M19.5 17h3M19.5 21.5h3" />
  </Svg>
);

const map: Record<IconName, (p: Props) => React.ReactElement> = {
  dpe: IconDpe,
  erp: IconErp,
  carrez: IconCarrez,
  boutin: IconBoutin,
  gaz: IconGaz,
  electricite: IconElectricite,
  plomb: IconPlomb,
  amiante: IconAmiante,
  termites: IconTermites,
  dta: IconDta,
  dtg: IconDtg,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const C = map[name];
  return <C className={className} />;
}

/* --- icônes d'interface --- */

export const IconPhone = (p: Props) => (
  <Svg {...p}>
    <path d="M11 5.5H7a2 2 0 0 0-2 2c0 10.2 9.3 19.5 19.5 19.5a2 2 0 0 0 2-2v-4l-5.5-2-2.5 3a17 17 0 0 1-8-8l3-2.5z" />
  </Svg>
);

export const IconMail = (p: Props) => (
  <Svg {...p}>
    <rect x="4" y="7" width="24" height="18" rx="2" />
    <path d="m5 9 11 8 11-8" />
  </Svg>
);

export const IconPin = (p: Props) => (
  <Svg {...p}>
    <path d="M16 28s9-8.2 9-15A9 9 0 0 0 7 13c0 6.8 9 15 9 15z" />
    <circle cx="16" cy="12.8" r="3.4" />
  </Svg>
);

export const IconArrow = (p: Props) => (
  <Svg {...p}>
    <path d="M6 16h20M19 9l7 7-7 7" />
  </Svg>
);

export const IconCheck = (p: Props) => (
  <Svg {...p}>
    <path d="m6 17 6.5 6.5L26 9" />
  </Svg>
);

export const IconShield = (p: Props) => (
  <Svg {...p}>
    <path d="M16 4 6 8v8.5c0 6 4.3 10.6 10 12 5.7-1.4 10-6 10-12V8z" />
    <path d="m11.5 16 3 3 6-6" />
  </Svg>
);

export const IconClock = (p: Props) => (
  <Svg {...p}>
    <circle cx="16" cy="16" r="11.5" />
    <path d="M16 9v7.5l5 3" />
  </Svg>
);

export const IconUser = (p: Props) => (
  <Svg {...p}>
    <circle cx="16" cy="11" r="5" />
    <path d="M6 27c0-5.2 4.5-8.5 10-8.5S26 21.8 26 27" />
  </Svg>
);
