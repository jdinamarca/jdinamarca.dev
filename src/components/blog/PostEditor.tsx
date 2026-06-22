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
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(getFirebaseStorage(), `posts/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
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
      const storageRef = ref(getFirebaseStorage(), `covers/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
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
      const common: {
        title: string;
        excerpt: string;
        content: string;
        tags: string[];
        category: Category;
        published: boolean;
        updatedAt: ReturnType<typeof serverTimestamp>;
        coverImage?: string;
      } = {
        title,
        excerpt,
        content: editor.getHTML(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        category,
        published,
        updatedAt: serverTimestamp(),
      };

      if (coverImage) {
        common.coverImage = coverImage;
      }

      if (post) {
        const updatePayload = {
          ...common,
          coverImage:
            !coverImage && post.coverImage ? deleteField() : common.coverImage,
        };
        await updateDoc(doc(getFirebaseDb(), "posts", post.id), updatePayload);
      } else {
        await addDoc(collection(getFirebaseDb(), "posts"), {
          ...common,
          slug: slugify(title),
          createdAt: serverTimestamp(),
        });
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
      const code = (err as { code?: string }).code;
      const hint =
        code === "permission-denied"
          ? " (revisa las reglas de Firestore)"
          : "";
      toast.error(code ? `${code}${hint}` : "Error al guardar el post");
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
