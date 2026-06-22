import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos sobre arquitectura de software, IA y desarrollo web.",
};

export default async function BlogPage() {
  let posts: Post[] = [];
  let error = false;

  try {
    posts = await getPosts();
  } catch {
    error = true;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Artículos sobre arquitectura de software, IA y desarrollo web.
        </p>
      </header>

      {error ? (
        <p className="text-sm text-destructive">
          No se pudieron cargar los posts. Revisa la conexión con Firebase.
        </p>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Aún no hay posts publicados.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Los nuevos artículos aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}