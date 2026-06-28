import Link from "next/link";
import { ExternalLink, GitBranch, ArrowUpRight } from "lucide-react";
import type { Post } from "@/types";

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  month: "short",
  year: "numeric",
});

export function LabCard({ post, index }: { post: Post; index: number }) {
  const exp = String(index).padStart(3, "0");

  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-card/40 font-mono transition-all duration-200 hover:border-brand/50 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-ring">
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-red-500/60" />
          <span className="size-2.5 rounded-full bg-yellow-500/60" />
          <span className="size-2.5 rounded-full bg-green-500/60" />
        </span>
        <span className="truncate">exp_{exp}.ipynb</span>
        <ArrowUpRight className="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="space-y-3 p-4">
        <h2 className="flex items-start gap-2 text-base font-semibold leading-snug">
          <span className="select-none text-brand" aria-hidden>
            &gt;
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="font-heading text-foreground outline-none transition-colors after:absolute after:inset-0 group-hover:text-brand"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="line-clamp-2 pl-4 font-sans text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        {post.tech && post.tech.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pl-4 text-xs">
            <span className="select-none text-muted-foreground" aria-hidden>
              [run]
            </span>
            {post.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pl-4 pt-1 text-xs text-muted-foreground">
          <time dateTime={post.createdAt}>
            {dateFmt.format(new Date(post.createdAt))}
          </time>
          {post.repo && (
            <a
              href={post.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <GitBranch className="size-3.5" /> repo
            </a>
          )}
          {post.demo && (
            <a
              href={post.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3.5" /> demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
