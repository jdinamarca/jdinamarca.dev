import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export async function GET() {
  try {
    const posts = await getPosts();

    const items = posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://jdinamarca.dev/blog/${post.slug}</link>
      <guid>https://jdinamarca.dev/blog/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>jdinamarca.dev</title>
    <link>https://jdinamarca.dev</link>
    <description>Dev + AI Lab — tecnología, IA y experimentos por Jason Dinamarca</description>
    <language>es</language>
    <atom:link href="https://jdinamarca.dev/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new Response(xml.trim(), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generando RSS:", error);
    return new Response("Error generando el feed RSS", { status: 500 });
  }
}
