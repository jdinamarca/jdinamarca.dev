import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Aquí iría la lógica para suscribir al usuario en Buttondown
    // Por ahora, solo simulamos el éxito
    console.log("Suscripción a newsletter:", email);

    return NextResponse.json({
      success: true,
      message: "Suscripción exitosa"
    });
  } catch (error) {
    console.error("Error en suscripción:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}