import { site } from "@/lib/site";
import { IconPin } from "./icons";

/**
 * Radar de couverture : un balayage tourne sur des cercles concentriques,
 * des ondes partent de Tarbes et les cinq départements sont disposés
 * autour. Tout est en CSS, donc aucun coût côté client.
 *
 * Positions calculées sur un cercle de rayon 38 %, un point tous les 72°
 * en partant du haut.
 */
const positions = [
  { left: "50%", top: "11%" },
  { left: "86%", top: "38%" },
  { left: "72%", top: "81%" },
  { left: "28%", top: "81%" },
  { left: "14%", top: "38%" },
];

export function CoverageRadar() {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="radar relative aspect-square w-full">
        {/* Cercles fixes */}
        {[100, 70, 42].map((size) => (
          <span
            key={size}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-200"
            style={{ width: `${size * 0.76}%`, height: `${size * 0.76}%` }}
          />
        ))}

        {/* Deux faisceaux : le principal tourne régulièrement, le second
            part en sens inverse à une autre vitesse — les deux se croisent
            sans jamais se synchroniser. */}
        <span
          aria-hidden="true"
          className="radar-sweep radar-sweep--main absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
        <span
          aria-hidden="true"
          className="radar-sweep radar-sweep--second absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />

        {/* Ondes qui partent du centre */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="radar-ping absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-400"
            style={{ animationDelay: `${i * 1.6}s` }}
          />
        ))}

        {/* Base : Tarbes */}
        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
          <span className="radar-core inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30">
            <IconPin className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">
            Tarbes
          </span>
        </span>

        {/* Départements */}
        {site.departments.map((d, i) => (
          <span
            key={d.code}
            style={{ ...positions[i], animationDelay: `${300 + i * 140}ms` }}
            className="radar-node absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-200 bg-white text-base font-extrabold text-brand-700 shadow-sm sm:h-14 sm:w-14 sm:text-lg">
              {d.code}
            </span>
            <span className="mt-1.5 max-w-[92px] text-center text-[10px] font-semibold leading-tight text-ink-soft sm:text-[11px]">
              {d.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
