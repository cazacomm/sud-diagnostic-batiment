export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const mark = variant === "light" ? "text-white" : "text-brand-600";
  const strong = variant === "light" ? "text-white" : "text-brand-700";
  const soft = variant === "light" ? "text-brand-200" : "text-brand-500";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className={`h-9 w-9 shrink-0 ${mark}`}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 18.5 20 6l15 12.5" />
        <path d="M9 16v17h22V16" />
        <path d="M16 33v-9h8v9" />
        <circle cx="20" cy="19" r="2.6" />
      </svg>
      <span className="leading-[1.05]">
        <span className={`block text-[13px] font-extrabold tracking-[0.2em] ${strong}`}>
          SUD
        </span>
        <span className={`block text-[11px] font-semibold tracking-[0.14em] ${soft}`}>
          DIAGNOSTIC
        </span>
      </span>
    </span>
  );
}
