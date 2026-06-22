import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost, getPublishedSlugs } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post no encontrado" };

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
      publishedTime: post.createdAt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const readingMins = estimateReadingMinutes(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.title,
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "author": {
      "@type": "Person",
      "name": "Jason Dinamarca",
      "url": "https://jdinamarca.dev",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Jason Dinamarca",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jdinamarca.dev/favicon.ico",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://jdinamarca.dev/blog/${post.slug}`,
    },
    "keywords": post.tags?.join(", ") ?? "",
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog">
        <Button variant="ghost" size="sm" className="mb-8 -ml-2">
          <ArrowLeft />
          Volver al blog
        </Button>
      </Link>

      <header className="mb-10 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="font-mono lowercase">
            {post.category}
          </Badge>
          <time dateTime={post.createdAt}>
            {dateFmt.format(new Date(post.createdAt))}
          </time>
          {readingMins > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{readingMins} min de lectura</span>
            </>
          )}
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {post.coverImage && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl border border-border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-16 border-t border-border pt-8">
        <Link href="/blog">
          <Button variant="outline" size="sm">
            <ArrowLeft />
            Más artículos
          </Button>
        </Link>
      </div>
    </article>
  );
}

function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
