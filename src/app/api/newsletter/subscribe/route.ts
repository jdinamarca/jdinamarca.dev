import { NextResponse } from "next/server";

export const runtime = "edge";

const BUTTONDOWN_API = "https://api.buttondown.com/v1/subscribers";

export async function POST(request: Request) {
  let email: string | undefined;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    console.error("BUTTONDOWN_API_KEY no está configurada");
    return NextResponse.json(
      { error: "El newsletter no está configurado" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(BUTTONDOWN_API, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (res.ok) {
      return NextResponse.json({
        success: true,
        message: "¡Listo! Revisa tu correo para confirmar la suscripción.",
      });
    }

    const data = (await res.json().catch(() => null)) as
      | { code?: string; detail?: string; error?: string }
      | null;
    const code = (data?.code ?? "").toLowerCase();
    const detail = (data?.detail ?? data?.error ?? "").toLowerCase();

    if (res.status === 400 && (code.includes("exist") || detail.includes("already"))) {
      return NextResponse.json({ success: true, message: "Ya estás suscrito 🙌" });
    }

    console.error("Error de Buttondown:", res.status, data);
    return NextResponse.json(
      { error: "No se pudo completar la suscripción" },
      { status: 502 }
    );
  } catch (error) {
    console.error("Error en suscripción:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
