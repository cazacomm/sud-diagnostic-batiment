import { getArticles, plain } from "@/lib/blog";
import { SITE_URL, absUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Date RFC 822 à 9h, heure de Paris approximée en UTC+1. */
const rfc822 = (iso: string) => new Date(`${iso}T09:00:00+01:00`).toUTCString();

export function GET() {
  const articles = getArticles();
  const items = articles
    .map(
      (a) => `    <item>
      <title>${xml(plain(a.h1))}</title>
      <link>${absUrl(`/blog/${a.slug}/`)}</link>
      <guid isPermaLink="true">${absUrl(`/blog/${a.slug}/`)}</guid>
      <pubDate>${rfc822(a.date)}</pubDate>
      <category>${xml(a.category)}</category>
      <description>${xml(plain(a.meta_description))}</description>
    </item>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`Blog ${site.name}`)}</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Conseils en diagnostic immobilier à Tarbes et dans les Hautes-Pyrénées.</description>
    <language>fr-FR</language>
    ${articles[0] ? `<lastBuildDate>${rfc822(articles[0].updated ?? articles[0].date)}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
