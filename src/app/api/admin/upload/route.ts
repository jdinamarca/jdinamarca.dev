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
      return NextResponse.json({ error: "no file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${folder}/${Date.now()}_${file.name}`;
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(filename);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    });

    await fileRef.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}
