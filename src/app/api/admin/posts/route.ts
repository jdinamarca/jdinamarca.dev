import { NextResponse } from "next/server";
import type { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import type { PostSummary } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

function toISO(value: unknown): string {
  if (!value) return new Date(0).toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  if (typeof (value as Timestamp)?.toDate === "function") {
    return (value as Timestamp).toDate().toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  return new Date(0).toISOString();
}

export async function GET(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const snapshot = await adminDb
    .collection("posts")
    .orderBy("createdAt", "desc")
    .select("title", "slug", "category", "published", "createdAt")
    .get();

  const posts: PostSummary[] = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      slug: data.slug ?? "",
      category: data.category ?? "experimento",
      published: Boolean(data.published),
      createdAt: toISO(data.createdAt),
    };
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const docRef = await adminDb.collection("posts").add({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      tags: body.tags,
      category: body.category,
      published: body.published,
      coverImage: body.coverImage ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error creando post:", error);
    return NextResponse.json({ error: "create failed" }, { status: 500 });
  }
}
