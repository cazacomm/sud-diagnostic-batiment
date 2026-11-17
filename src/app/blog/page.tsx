import type { Metadata } from "next";
import Link from "next/link";
import { frDate, getArticles, plain, readingTime } from "@/lib/blog";
import { PageHero, Section } from "@/components/ui";
import { CtaBand } from "@/components/blocks";
import { IconArrow } from "@/components/icons";
import { JsonLd, SITE_URL, absUrl, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

const description =
  "Conseils et actualité du diagnostic immobilier à Tarbes et dans les Hautes-Pyrénées : DPE, amiante, plomb, termites, vente, location et travaux.";

export const metadata: Metadata = {
  title: "Blog — conseils en diagnostic immobilier",
  description,
  alternates: {
    canonical: absUrl("/blog/"),
    types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
  },
};

export default function BlogPage() {
  const articles = getArticles();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `Blog ${site.name}`,
          url: absUrl("/blog/"),
          description,
          blogPost: articles.map((a) => ({
            "@type": "BlogPosting",
            headline: plain(a.h1),
            url: absUrl(`/blog/${a.slug}/`),
            datePublished: a.date,
          })),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Blog", path: "/blog/" }])} />

      <PageHero
        eyebrow="Blog"
        title="Conseils en diagnostic immobilier"
        intro="Vente, location, travaux : nos explications pour comprendre vos obligations et préparer sereinement votre projet à Tarbes et dans les Hautes-Pyrénées."
        breadcrumb={[{ label: "Blog" }]}
      />

      <Section>
        {articles.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex flex-col rounded-3xl border border-sand-200 bg-white p-7 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <span className="self-start rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                  {a.category}
                </span>
                <h2 className="mt-4 text-xl font-extrabold leading-snug tracking-tight group-hover:text-brand-700">
                  {plain(a.h1)}
                </h2>
                <p className="mt-2 text-xs font-semibold text-ink-soft">
                  <time dateTime={a.date}>{frDate(a.date)}</time> · Lecture {readingTime(a)} min
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                  {plain(a.meta_description)}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                  Lire l’article
                  <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-lg text-ink-soft">Les premiers articles arrivent bientôt.</p>
        )}
      </Section>

      <CtaBand />
    </>
  );
}
