"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostEditor } from "@/components/blog/PostEditor";
import { PostList } from "@/components/blog/PostList";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types";

export default function AdminPage() {
  const { user, isAdmin, loading, login } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  const startNew = () => {
    setEditingPost(null);
    setShowEditor(true);
  };
  const startEdit = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };
  const closeEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };
  const handleSaved = () => {
    refresh();
    closeEditor();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-muted-foreground text-sm">Inicia sesión para continuar.</p>
        <Button onClick={login} className="w-full">Iniciar sesión con Google</Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-sm text-center space-y-2">
        <h1 className="text-2xl font-bold">Acceso denegado</h1>
        <p className="text-muted-foreground text-sm">Tu cuenta no tiene permisos de administrador.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <Button
          variant={showEditor ? "outline" : "default"}
          onClick={showEditor ? closeEditor : startNew}
        >
          {showEditor ? "Cerrar editor" : "Nuevo post"}
        </Button>
      </div>

      {showEditor && (
        <div className="mb-12">
          <p className="mb-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {editingPost ? `Editando: ${editingPost.title || "(sin título)"}` : "Nuevo post"}
          </p>
          {/* El `key` fuerza el remontaje al cambiar de post, para que el editor
              cargue el contenido correcto como estado inicial. */}
          <PostEditor
            key={editingPost?.id ?? "new"}
            post={editingPost}
            onSaved={handleSaved}
          />
        </div>
      )}

      <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        Todos los posts
      </h2>
      <PostList refreshKey={refreshKey} onRefresh={refresh} onEdit={startEdit} />
    </div>
  );
}
