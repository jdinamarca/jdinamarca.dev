import type { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { Post } from "@/types";

type DocSnap =
  | FirebaseFirestore.QueryDocumentSnapshot
  | FirebaseFirestore.DocumentSnapshot;

function toISO(value: unknown): string {
  if (!value) return new Date(0).toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  if (typeof (value as Timestamp)?.toDate === "function") {
    return (value as Timestamp).toDate().toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  return new Date(0).toISOString();
}

function serialize(doc: DocSnap): Post | null {
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
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
}

function toPosts(snapshot: FirebaseFirestore.QuerySnapshot): Post[] {
  return snapshot.docs
    .map(serialize)
    .filter((p): p is Post => p !== null);
}

/** Posts publicados, ordenados por fecha de creación descendente. */
export async function getPosts(): Promise<Post[]> {
  const snapshot = await adminDb
    .collection("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .get();
  return toPosts(snapshot);
}

/** Posts publicados filtrados por categoría (opinion | tutorial | arquitectura | experimento). */
export async function getPostsByCategory(
  category: NonNullable<Post["category"]>
): Promise<Post[]> {
  const snapshot = await adminDb
    .collection("posts")
    .where("published", "==", true)
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .get();
  return toPosts(snapshot);
}

/** Posts más recientes para la landing (limit configurable). */
export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const snapshot = await adminDb
    .collection("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return toPosts(snapshot);
}

/** Un post publicado por slug. null si no existe o no está publicado. */
export async function getPost(slug: string): Promise<Post | null> {
  const snapshot = await adminDb
    .collection("posts")
    .where("slug", "==", slug)
    .where("published", "==", true)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  return serialize(snapshot.docs[0]);
}

/** Todos los slugs publicados (para generateStaticParams / sitemap). */
export async function getPublishedSlugs(): Promise<string[]> {
  const snapshot = await adminDb
    .collection("posts")
    .where("published", "==", true)
    .select("slug")
    .get();
  return snapshot.docs
    .map((d) => d.get("slug") as string | undefined)
    .filter((s): s is string => Boolean(s));
}
