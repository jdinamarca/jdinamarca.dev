"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { Trash2, ExternalLink, Loader2, Pencil } from "lucide-react";
import { getFirebaseDb } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Post } from "@/types";

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const categoryLabel: Record<NonNullable<Post["category"]>, string> = {
  opinion: "Opinión",
  tutorial: "Tutorial",
  arquitectura: "Arquitectura",
  experimento: "Experimento",
};

function toISO(value: unknown): string {
  if (value && typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate().toISOString();
  }
  if (typeof value === "string") return new Date(value).toISOString();
  return new Date(0).toISOString();
}

export function PostList({
  refreshKey,
  onRefresh,
  onEdit,
}: {
  refreshKey: number;
  onRefresh: () => void;
  onEdit: (post: Post) => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(getFirebaseDb(), "posts"), orderBy("createdAt", "desc"))
        );
        if (!active) return;
        const list: Post[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? "",
            slug: data.slug ?? "",
            excerpt: data.excerpt ?? "",
            content: data.content ?? "",
            coverImage: data.coverImage ?? undefined,
            tags: Array.isArray(data.tags) ? data.tags : [],
            category: data.category ?? "experimento",
            published: Boolean(data.published),
            createdAt: toISO(data.createdAt),
            updatedAt: toISO(data.updatedAt),
            level: data.level,
            readTime: data.readTime,
            tech: Array.isArray(data.tech) ? data.tech : undefined,
            series: data.series,
            seriesPart: data.seriesPart,
            seriesTotal: data.seriesTotal,
            repo: data.repo,
            demo: data.demo,
          };
        });
        setPosts(list);
      } catch (err) {
        console.error("Error cargando posts:", err);
        const code = (err as { code?: string }).code;
        toast.error(
          code ? `${code} (revisa las reglas de Firestore)` : "No se pudieron cargar los posts"
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleDelete = async (post: Post) => {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(post.id);
    try {
      await deleteDoc(doc(getFirebaseDb(), "posts", post.id));
      toast.success("Post eliminado");
      onRefresh();
    } catch (err) {
      console.error("Error eliminando post:", err);
      const code = (err as { code?: string }).code;
      toast.error(code ? code : "Error al eliminar el post");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Cargando posts...
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Todavía no hay posts. Crea el primero arriba.
      </p>
    );
  }

  const drafts = posts.filter((p) => !p.published);
  const published = posts.filter((p) => p.published);

  return (
    <div className="space-y-8">
      {drafts.length > 0 && (
        <Section title="Borradores" count={drafts.length}>
          {drafts.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              deleting={deletingId === post.id}
              onDelete={handleDelete}
              onEdit={onEdit}
            />
          ))}
        </Section>
      )}
      {published.length > 0 && (
        <Section title="Publicados" count={published.length}>
          {published.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              deleting={deletingId === post.id}
              onDelete={handleDelete}
              onEdit={onEdit}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {title} · {count}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function PostRow({
  post,
  deleting,
  onDelete,
  onEdit,
}: {
  post: Post;
  deleting: boolean;
  onDelete: (post: Post) => void;
  onEdit: (post: Post) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <Badge
        variant={post.published ? "default" : "outline"}
        className="font-mono lowercase shrink-0"
      >
        {post.published ? "publicado" : "borrador"}
      </Badge>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{post.title || "(sin título)"}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{categoryLabel[post.category ?? "experimento"]}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.createdAt}>
            {dateFmt.format(new Date(post.createdAt))}
          </time>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Editar post"
        className="shrink-0"
        onClick={() => onEdit(post)}
      >
        <Pencil />
      </Button>
      {post.published && (
        <Link href={`/blog/${post.slug}`} className="shrink-0">
          <Button variant="ghost" size="icon-sm" aria-label="Ver post">
            <ExternalLink />
          </Button>
        </Link>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Eliminar post"
        className="text-muted-foreground hover:text-destructive shrink-0"
        disabled={deleting}
        onClick={() => onDelete(post)}
      >
        {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
      </Button>
    </div>
  );
}
