"use client";

import { useEffect, useRef, useState } from "react";

/** Déclenche une classe dès que l'élément entre dans le viewport. */
function useInView<T extends HTMLElement>(once = true, fallbackMs?: number) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    io.observe(el);

    /* Filet de sécurité : si l'observateur ne répond jamais (environnement
       exotique), on affiche quand même au bout de `fallbackMs`. */
    const timer = fallbackMs
      ? window.setTimeout(() => setInView(true), fallbackMs)
      : undefined;

    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [once, fallbackMs]);

  return { ref, inView };
}

type RevealProps = {
  children: React.ReactNode;
  /** Retard en ms, pour créer un effet de cascade. */
  delay?: number;
  /** Direction d'entrée. */
  from?: "bottom" | "left" | "right" | "none";
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  from = "bottom",
  className = "",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const hidden = {
    bottom: "translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
    none: "",
  }[from];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        inView ? "translate-x-0 translate-y-0 opacity-100" : `opacity-0 ${hidden}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Compteur qui s'incrémente à l'apparition.
 * La valeur finale est rendue côté serveur : sans JavaScript, le chiffre
 * juste reste affiché.
 */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1400,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(true, 2000);
  const [value, setValue] = useState(to);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setValue(0);
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || !inView) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const safety = window.setTimeout(() => setValue(to), duration + 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [armed, inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

/** Léger déplacement du décor du hero au scroll. */
export function HeroGlow() {
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY * 0.18));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${y}px, 0)` }}
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-500/40 blur-3xl will-change-transform"
      />
      <div
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${-y * 0.6}px, 0)` }}
        className="pointer-events-none absolute -bottom-56 -left-32 h-[420px] w-[420px] rounded-full bg-brand-900/40 blur-3xl will-change-transform"
      />
    </>
  );
}
