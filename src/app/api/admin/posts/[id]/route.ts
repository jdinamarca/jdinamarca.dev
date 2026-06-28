import { NextResponse } from "next/server";
import type { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminAuth, adminStorage } from "@/lib/firebase-admin";
import type { Post } from "@/types";

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

async function verifyAdmin(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.email !== ADMIN_EMAIL) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const snap = await adminDb.collection("posts").doc(id).get();
  const data = snap.data();
  if (!data) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const post: Post = {
    id: snap.id,
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

  return NextResponse.json({ post });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    // 1. Obtener el post antes de eliminarlo para extraer las imágenes
    const snap = await adminDb.collection("posts").doc(id).get();
    const data = snap.data();
    if (!data) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    // 2. Extraer URLs de imágenes del cover y del contenido
    const bucket = adminStorage.bucket();
    const imageUrls: string[] = [];

    // Extraer coverImage
    if (data.coverImage) {
      imageUrls.push(data.coverImage);
    }

    // Extraer imágenes del contenido HTML
    if (data.content) {
      const imageMatches = data.content.match(/<img[^>]+src="([^"]+)"/g);
      if (imageMatches) {
        imageMatches.forEach((match: string) => {
          const url = match.match(/src="([^"]+)"/)?.[1];
          if (url) imageUrls.push(url);
        });
      }
    }

    // 3. Eliminar todas las imágenes de Storage
    const deletedImages: string[] = [];
    for (const imageUrl of imageUrls) {
      try {
        const decodedPath = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0]);
        await bucket.file(decodedPath).delete();
        deletedImages.push(decodedPath);
      } catch (error) {
        console.warn(`No se pudo eliminar imagen ${imageUrl}:`, error);
        // No fallar si una imagen no se puede borrar
      }
    }

    // 4. Eliminar el post
    await adminDb.collection("posts").doc(id).delete();
    
    return NextResponse.json({ 
      success: true, 
      deletedImages: deletedImages 
    });
  } catch (error) {
    console.error("Error eliminando post:", error);
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    // 1. Obtener el post actual antes de actualizar
    const snap = await adminDb.collection("posts").doc(id).get();
    const currentData = snap.data();
    if (!currentData) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    // 2. Preparar payload de actualización
    const updatePayload: Record<string, unknown> = {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      tags: body.tags,
      category: body.category,
      published: body.published,
      updatedAt: new Date(),
    };

    if (body.coverImage) {
      updatePayload.coverImage = body.coverImage;
    } else {
      updatePayload.coverImage = null;
    }

    if (body.level !== undefined) updatePayload.level = body.level;
    if (body.readTime !== undefined) updatePayload.readTime = body.readTime;
    if (body.tech !== undefined) updatePayload.tech = body.tech;
    if (body.series !== undefined) updatePayload.series = body.series;
    if (body.seriesPart !== undefined) updatePayload.seriesPart = body.seriesPart;
    if (body.seriesTotal !== undefined) updatePayload.seriesTotal = body.seriesTotal;
    if (body.repo !== undefined) updatePayload.repo = body.repo;
    if (body.demo !== undefined) updatePayload.demo = body.demo;

    // 3. Extraer URLs de imágenes del post actual y del nuevo contenido
    const bucket = adminStorage.bucket();
    const currentImageUrls: string[] = [];
    const newImageUrls: string[] = [];

    // Extraer coverImage actual
    if (currentData.coverImage) {
      currentImageUrls.push(currentData.coverImage);
    }

    // Extraer coverImage nuevo
    if (body.coverImage) {
      newImageUrls.push(body.coverImage);
    }

    // Extraer imágenes del contenido actual
    if (currentData.content) {
      const currentImageMatches = currentData.content.match(/<img[^>]+src="([^"]+)"/g);
      if (currentImageMatches) {
        currentImageMatches.forEach((match: string) => {
          const url = match.match(/src="([^"]+)"/)?.[1];
          if (url) currentImageUrls.push(url);
        });
      }
    }

    // Extraer imágenes del nuevo contenido
    if (body.content) {
      const newImageMatches = body.content.match(/<img[^>]+src="([^"]+)"/g);
      if (newImageMatches) {
        newImageMatches.forEach((match: string) => {
          const url = match.match(/src="([^"]+)"/)?.[1];
          if (url) newImageUrls.push(url);
        });
      }
    }

    // 4. Identificar imágenes que ya no se usan y eliminarlas
    const imagesToDelete: string[] = [];
    for (const url of currentImageUrls) {
      if (!newImageUrls.includes(url)) {
        imagesToDelete.push(url);
      }
    }

    // 5. Eliminar las imágenes que ya no se usan
    const deletedImages: string[] = [];
    for (const imageUrl of imagesToDelete) {
      try {
        const decodedPath = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0]);
        await bucket.file(decodedPath).delete();
        deletedImages.push(decodedPath);
      } catch (error) {
        console.warn(`No se pudo eliminar imagen ${imageUrl}:`, error);
        // No fallar si una imagen no se puede borrar
      }
    }

    // 6. Actualizar el post
    await adminDb.collection("posts").doc(id).update(updatePayload);
    
    return NextResponse.json({ 
      success: true, 
      deletedImages: deletedImages 
    });
  } catch (error) {
    console.error("Error actualizando post:", error);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}
