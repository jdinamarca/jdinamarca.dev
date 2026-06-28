"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ExternalLink, Loader2, Pencil } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Post, PostSummary } from "@/types";

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const categoryLabel: Record<string, string> = {
  opinion: "Opinión",
  tutorial: "Tutorial",
  arquitectura: "Arquitectura",
  experimento: "Experimento",
};

export function PostList({
  refreshKey,
  onRefresh,
  onEdit,
}: {
  refreshKey: number;
  onRefresh: () => void;
  onEdit: (post: Post) => void;
}) {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const token = await getFirebaseAuth().currentUser?.getIdToken();
        if (!token) throw new Error("No hay sesión activa");
        const res = await fetch("/api/admin/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { posts: list } = (await res.json()) as { posts: PostSummary[] };
        if (!active) return;
        setPosts(list);
      } catch (err) {
        console.error("Error cargando posts:", err);
        toast.error("No se pudieron cargar los posts");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleEdit = async (summary: PostSummary) => {
    setEditingId(summary.id);
    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      if (!token) throw new Error("No hay sesión activa");
      const res = await fetch(`/api/admin/posts/${summary.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { post } = (await res.json()) as { post: Post };
      onEdit(post);
    } catch (err) {
      console.error("Error cargando el post:", err);
      toast.error("No se pudo abrir el post para editar");
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (post: PostSummary) => {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(post.id);
    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      if (!token) throw new Error("No hay sesión activa");
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Post eliminado");
      onRefresh();
    } catch (err) {
      console.error("Error eliminando post:", err);
      toast.error("Error al eliminar el post");
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
              editing={editingId === post.id}
              onDelete={handleDelete}
              onEdit={handleEdit}
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
              editing={editingId === post.id}
              onDelete={handleDelete}
              onEdit={handleEdit}
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
  editing,
  onDelete,
  onEdit,
}: {
  post: PostSummary;
  deleting: boolean;
  editing: boolean;
  onDelete: (post: PostSummary) => void;
  onEdit: (post: PostSummary) => void;
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
          <span className="font-mono">{categoryLabel[post.category ?? "experimento"] ?? post.category}</span>
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
        disabled={editing}
        onClick={() => onEdit(post)}
      >
        {editing ? <Loader2 className="animate-spin" /> : <Pencil />}
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
