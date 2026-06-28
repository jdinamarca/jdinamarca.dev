import { NextResponse } from "next/server";
import { adminStorage, adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

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

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) ?? "posts";

    if (!file) {
      return NextResponse.json({ error: "no file provided" }, { status: 400 });
    }

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const candidates = [
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      projectId ? `${projectId}.firebasestorage.app` : null,
      projectId ? `${projectId}.appspot.com` : null,
    ].filter((v): v is string => Boolean(v));

    let bucketName: string | null = null;
    for (const candidate of candidates) {
      try {
        const bucket = adminStorage.bucket(candidate);
        const [exists] = await bucket.exists();
        if (exists) {
          bucketName = candidate;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!bucketName) {
      return NextResponse.json({
        error: `no bucket found. tried: ${candidates.join(", ")}`,
      }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = (file.name || "upload").replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${folder}/${Date.now()}_${safeName}`;
    const bucket = adminStorage.bucket(bucketName);
    const fileRef = bucket.file(filename);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || "application/octet-stream",
      },
    });

    const url = `https://storage.googleapis.com/${bucketName}/${filename.split("/").map(encodeURIComponent).join("/")}`;

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error("Error subiendo imagen:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
