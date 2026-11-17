import Link from "next/link";
import { Fragment } from "react";

/**
 * Rend le balisage inline autorisé dans les articles : **gras** et
 * [libellé](/chemin-interne). Tout le reste est du texte brut, échappé par
 * React : aucun HTML ne peut passer. Les liens externes sont impossibles
 * (seuls les chemins commençant par « / » sont reconnus).
 */
const TOKEN = /(\*\*.+?\*\*|\[[^\]]+\]\(\/[^)\s]*\))/g;

export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*(.+)\*\*$/);
        if (bold) return <strong key={i} className="font-bold text-ink">{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\((\/[^)\s]*)\)$/);
        if (link)
          return (
            <Link
              key={i}
              href={link[2]}
              className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600"
            >
              {link[1]}
            </Link>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
