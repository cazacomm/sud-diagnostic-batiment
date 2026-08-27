import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

/* Aperçu client : le site ne doit jamais être indexé tant qu'il n'est pas
   publié sur le vrai domaine. */
const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sud-diagnostic.fr"),
  robots: isPreview ? { index: false, follow: false, nocache: true } : undefined,
  title: {
    default: `${site.name} — Diagnostic immobilier à Tarbes (65)`,
    template: `%s | ${site.name}`,
  },
  description:
    "Diagnostics immobiliers avant vente, location, travaux et mise en copropriété à Tarbes et dans les Hautes-Pyrénées. DPE, amiante, plomb, termites, gaz, électricité, loi Carrez. Devis gratuit.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        {/* Sans JavaScript, rien ne doit rester masqué par les animations. */}
        <noscript>
          <style>{`.reveal,.rise,.sweep{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-2 focus:text-sm focus:text-white"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
