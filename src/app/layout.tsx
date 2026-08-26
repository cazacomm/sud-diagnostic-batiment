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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sud-diagnostic.fr"),
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
