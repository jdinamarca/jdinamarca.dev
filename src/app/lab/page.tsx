import type { Metadata } from "next";
import { getPostsByCategory } from "@/lib/posts";
import { LabCard } from "@/components/blog/LabCard";
import type { Post } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lab",
  description: "Experimentos técnicos con IA y desarrollo web.",
};

export default async function LabPage() {
  let posts: Post[] = [];
  let error = false;

  try {
    posts = await getPostsByCategory("experimento");
  } catch {
    error = true;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-radial-brand" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-16">
        <header className="mb-12 max-w-2xl space-y-4">
          <p className="font-mono text-sm text-brand">
            <span className="select-none text-muted-foreground">$ </span>
            ls ~/lab --experiments
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-gradient">AI Lab</span>
          </h1>
          <p className="text-muted-foreground">
            Prototipos, pruebas y experimentos con IA y desarrollo. Código en
            crudo y trabajo en curso — no artículos pulidos.
          </p>
          {posts.length > 0 && (
            <p className="font-mono text-xs text-muted-foreground">
              {posts.length} experimento{posts.length === 1 ? "" : "s"} ·
              ordenados del más reciente
            </p>
          )}
        </header>

        {error ? (
          <p className="font-mono text-sm text-destructive">
            ✗ error: no se pudieron cargar los experimentos. Revisa la conexión
            con Firebase.
          </p>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center font-mono">
            <p className="text-muted-foreground">
              <span className="select-none text-muted-foreground/60">$ </span>
              # aún no hay experimentos publicados
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Los nuevos experimentos aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((post, i) => (
              <LabCard key={post.id} post={post} index={posts.length - i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
