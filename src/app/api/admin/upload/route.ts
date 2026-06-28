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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = (file.name || "upload").replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${folder}/${Date.now()}_${safeName}`;
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(filename);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || "application/octet-stream",
      },
    });

    const url = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filename).replace(/%2F/g, "/")}`;

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error("Error subiendo imagen:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
