import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { frDate, getArticle, getArticles, plain, readingTime } from "@/lib/blog";
import { Breadcrumb, Section } from "@/components/ui";
import { CtaBand } from "@/components/blocks";
import { RichText } from "@/components/rich-text";
import { IconArrow } from "@/components/icons";
import {
  BUSINESS_ID,
  JsonLd,
  SITE_URL,
  absUrl,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const url = absUrl(`/blog/${a.slug}/`);
  return {
    title: { absolute: plain(a.title) },
    description: plain(a.meta_description),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: plain(a.title),
      description: plain(a.meta_description),
      url,
      publishedTime: a.date,
      modifiedTime: a.updated ?? a.date,
      authors: [site.contact.name],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const url = absUrl(`/blog/${a.slug}/`);
  const others = getArticles()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: plain(a.h1),
          description: plain(a.meta_description),
          datePublished: a.date,
          dateModified: a.updated ?? a.date,
          articleSection: a.category,
          inLanguage: "fr-FR",
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          author: { "@type": "Person", name: site.contact.name },
          publisher: {
            "@id": BUSINESS_ID,
            "@type": "Organization",
            name: site.name,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo-sud-diagnostic.png` },
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Blog", path: "/blog/" },
          { name: plain(a.breadcrumb), path: `/blog/${a.slug}/` },
        ])}
      />
      {a.faq.length ? <JsonLd data={faqJsonLd(a.faq.map((f) => ({ question: plain(f.question), answer: plain(f.answer) })))} /> : null}

      <div className="brand-grid bg-brand-600 px-5 pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <div className="mx-auto w-full max-w-3xl">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: plain(a.breadcrumb) }]} />
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-200">
            {a.category}
          </p>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            {plain(a.h1)}
          </h1>
          {a.subtitle ? (
            <p className="mt-5 text-lg leading-relaxed text-brand-100">{plain(a.subtitle)}</p>
          ) : null}
          <p className="mt-6 text-sm font-semibold text-brand-200">
            Par {site.contact.name} · <time dateTime={a.date}>{frDate(a.date)}</time> · Lecture{" "}
            {readingTime(a)} min
          </p>
        </div>
      </div>

      <article className="px-5 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-xl leading-relaxed text-ink sm:text-[1.35rem]">
            <RichText text={a.lede} />
          </p>

          {a.sections.map((s) => (
            <section key={s.h2} className="mt-12">
              <h2 className="text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                {plain(s.h2)}
              </h2>
              <div className="mt-5 space-y-5 text-lg leading-relaxed text-ink-soft">
                {s.content.map((b, i) => {
                  if ("items" in b) {
                    const List = b.type;
                    return (
                      <List
                        key={i}
                        className={`space-y-2 pl-6 ${b.type === "ul" ? "list-disc" : "list-decimal"} marker:text-brand-500`}
                      >
                        {b.items.map((it) => (
                          <li key={it}>
                            <RichText text={it} />
                          </li>
                        ))}
                      </List>
                    );
                  }
                  if (b.type === "h3")
                    return (
                      <h3 key={i} className="pt-3 text-xl font-bold tracking-tight text-ink">
                        {plain(b.text)}
                      </h3>
                    );
                  if (b.type === "strong")
                    return (
                      <p key={i} className="rounded-2xl border-l-4 border-brand-500 bg-brand-50 px-5 py-4 font-semibold text-ink">
                        <RichText text={b.text} />
                      </p>
                    );
                  return (
                    <p key={i}>
                      <RichText text={b.text} />
                    </p>
                  );
                })}
              </div>
            </section>
          ))}

          {a.faq.length ? (
            <section className="mt-16">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Questions fréquentes</h2>
              <div className="mt-6 divide-y divide-sand-200 border-y border-sand-200">
                {a.faq.map((f) => (
                  <div key={f.question} className="py-5">
                    <h3 className="font-bold leading-snug">{plain(f.question)}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">
                      <RichText text={f.answer} />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-14 rounded-3xl border border-sand-200 bg-sand-100 p-7">
            <p className="font-extrabold tracking-tight">{site.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {site.contact.name}, diagnostiqueur immobilier certifié depuis {site.since}. Bureau :
              Résidence Foch, 24 Cours Gambetta, 65000 Tarbes. Tél. {site.contact.phone} ·{" "}
              {site.contact.mobile}.
            </p>
          </div>
        </div>
      </article>

      {others.length ? (
        <Section className="bg-sand-100 py-16 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">À lire aussi</h2>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700">
              Tous les articles <IconArrow className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/blog/${o.slug}`}
                className="group rounded-3xl border border-sand-200 bg-white p-6 transition hover:border-brand-300"
              >
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-500">{o.category}</p>
                <p className="mt-2 font-extrabold leading-snug group-hover:text-brand-700">{plain(o.h1)}</p>
                <p className="mt-2 text-xs text-ink-soft">{frDate(o.date)}</p>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
