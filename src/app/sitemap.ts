import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import type { Post } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jdinamarca.dev";

  // Rutas estáticas principales de la web
  const routes = ["", "/blog", "/projects", "/lab"];
  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Obtener artículos y experimentos dinámicos de Firestore
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch (e) {
    console.error("Error al obtener posts para sitemap:", e);
  }

  const dynamicRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}