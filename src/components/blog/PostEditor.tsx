"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Image from "next/image";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { toast } from "sonner";
import type { Post } from "@/types";

type Category = Post["category"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function PostEditor({
  post,
  onSaved,
}: {
  post?: Post | null;
  onSaved?: () => void;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [category, setCategory] = useState<Category>(post?.category ?? "experimento");
  const [coverImage, setCoverImage] = useState<string | undefined>(
    post?.coverImage
  );
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    // Este componente es client-only (detrás del gate de auth de /admin),
    // así que renderizamos el editor de inmediato sin esperar el mount.
    immediatelyRender: true,
    // Si llega un post a editar, cargamos su contenido HTML como estado inicial.
    // El remontaje vía `key={post.id}` en /admin garantiza que esto se aplique
    // cada vez que se cambia de post.
    content: post?.content ?? "",
    extensions: [
      StarterKit.configure({
        // StarterKit v3 ya incluye la extensión link; la configuramos aquí
        // para no duplicarla (duplicar lanza un warning y puede romper el editor).
        link: { openOnClick: false },
      }),
      TiptapImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: "Escribe el contenido del post..." }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[400px] focus:outline-none px-1",
      },
    },
  });

  const uploadImage = async (file: File, folder: string = "posts"): Promise<string> => {
    const token = await getFirebaseAuth().currentUser?.getIdToken();
    if (!token) throw new Error("No hay sesión activa");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { url } = (await res.json()) as { url: string };
    return url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      toast.error("Error subiendo imagen");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "covers");
      setCoverImage(url);
      toast.success("Cover image cargada");
    } catch {
      toast.error("Error subiendo la cover image");
    }
  };

  const handleSave = async (published: boolean) => {
    if (!title.trim() || !editor) return;
    setSaving(true);
    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      if (!token) throw new Error("No hay sesión activa");

      const payload = {
        title,
        excerpt,
        content: editor.getHTML(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        category,
        published,
        ...(coverImage ? { coverImage } : {}),
      };

      if (post) {
        const res = await fetch(`/api/admin/posts/${post.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...payload, slug: slugify(title) }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }

      toast.success(
        post
          ? published
            ? "Cambios publicados"
            : "Borrador actualizado"
          : published
            ? "Post publicado"
            : "Borrador guardado"
      );
      onSaved?.();
      if (!post) {
        setTitle("");
        setExcerpt("");
        setTags("");
        setCoverImage(undefined);
        editor.commands.clearContent();
      }
    } catch (err) {
      console.error("Error guardando post:", err);
      toast.error("Error al guardar el post");
    } finally {
      setSaving(false);
    }
  };

  const categories: NonNullable<Post["category"]>[] = ["opinion", "tutorial", "arquitectura", "experimento"];

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Título del post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground"
      />

      <input
        type="text"
        placeholder="Resumen / excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        className="w-full text-base bg-transparent border-b border-border pb-2 outline-none placeholder:text-muted-foreground"
      />

      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm text-muted-foreground">Categoría:</span>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <input
        type="text"
        placeholder="Tags separados por coma: nextjs, ia, react"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full text-sm bg-transparent border-b border-border pb-2 outline-none placeholder:text-muted-foreground"
      />

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Cover image</label>
        {coverImage ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
            <Image
              src={coverImage}
              alt="Cover preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <button
              type="button"
              onClick={() => setCoverImage(undefined)}
              className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity hover:opacity-100"
            >
              <X />
            </button>
          </div>
        ) : (
          <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:bg-muted/50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />
            <span className="text-sm text-muted-foreground">
              Subir cover image
            </span>
          </label>
        )}
      </div>

      <div className="border border-border rounded-lg p-4">
        <div className="flex gap-2 mb-3 border-b border-border pb-3 flex-wrap">
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleBold().run()}>B</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleCode().run()}>{"<>"}</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>Block</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleBulletList().run()}>List</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Button>
          <label className="cursor-pointer inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium hover:bg-muted hover:text-foreground transition-all">
            Imagen
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <EditorContent editor={editor} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => handleSave(true)} disabled={saving || !title.trim()}>
          {saving
            ? "Guardando..."
            : post
              ? "Guardar y publicar"
              : "Publicar"}
        </Button>
        <Button variant="outline" onClick={() => handleSave(false)} disabled={saving || !title.trim()}>
          {post ? "Guardar como borrador" : "Guardar borrador"}
        </Button>
      </div>
    </div>
  );
}
