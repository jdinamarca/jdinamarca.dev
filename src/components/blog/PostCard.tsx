import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types";

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const categoryLabel: Record<string, string> = {
  opinion: "Opinión",
  tutorial: "Tutorial",
  arquitectura: "Arquitectura",
  experimento: "Experimento",
};

const categoryColors: Record<string, { border: string; text: string }> = {
  opinion: { border: "border-purple-500/50", text: "text-purple-400" },
  tutorial: { border: "border-green-500/50", text: "text-green-400" },
  arquitectura: { border: "border-blue-500/50", text: "text-blue-400" },
  experimento: { border: "border-orange-500/50", text: "text-orange-400" },
};

const defaultCategoryColor = { border: "border-border", text: "text-muted-foreground" };

const levelLabel: Record<string, { label: string; emoji: string }> = {
  basico: { label: "Básico", emoji: "🌱" },
  medio: { label: "Medio", emoji: "🌿" },
  avanzado: { label: "Avanzado", emoji: "🌳" },
};

export function PostCard({ post }: { post: Post }) {
  const readingMins = post.readTime ?? estimateReadingMinutes(post.content);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <Card className="h-full transition-all duration-200 ring-foreground/10 group-hover:ring-brand/40 group-hover:-translate-y-0.5">
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {post.category && (
              <Badge variant="outline" className={`${(categoryColors[post.category] ?? defaultCategoryColor).border} ${(categoryColors[post.category] ?? defaultCategoryColor).text}`}>
                {categoryLabel[post.category] ?? post.category}
              </Badge>
            )}
            {post.level && (
              <Badge variant="secondary" className="font-mono lowercase">
                {levelLabel[post.level].emoji} {levelLabel[post.level].label}
              </Badge>
            )}
            <time dateTime={post.createdAt}>
              {dateFmt.format(new Date(post.createdAt))}
            </time>
            {readingMins > 0 && (
              <>
                <span aria-hidden>·</span>
                <span>{readingMins}m</span>
              </>
            )}
          </div>

          {post.series && (
            <div className="text-xs font-mono text-muted-foreground">
              {post.series}
              {post.seriesPart && post.seriesTotal && (
                <> · {post.seriesPart}/{post.seriesTotal}</>
              )}
            </div>
          )}

          <h2 className="font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-brand transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {post.tech && post.tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tech.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" className="font-normal text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}