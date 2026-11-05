import { extractPushPublicKey } from "@/service/PushService";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy mismo origen de la clave pública VAPID (RF-3, RNF-2, RNF-8).
 * Ruta pública: no exige sesión (el gateway la permite sin auth) y no
 * envía credenciales al backend. Fuente oficial
 * `GET BACKEND_URL/reservations/push/public-key` con respaldo en la
 * variable pública del frontend; la privada nunca sale del backend
 * ni aparece aquí.
 */
export async function GET(_request?: NextRequest) {
  void _request;
  const fallback = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() || null;
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/reservations/push/public-key`,
      { method: "GET", cache: "no-store" },
    );
    if (response.ok) {
      const text = await response.text();
      let body: unknown = text;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      const key = extractPushPublicKey(body);
      if (key) return NextResponse.json({ key });
    }
  } catch {
    console.error(
      "No se ha podido obtener la clave pública de avisos del backend.",
    );
  }
  if (fallback) return NextResponse.json({ key: fallback });
  return NextResponse.json(
    {
      error:
        "No se ha podido obtener la clave de avisos. Comprueba tu conexión e inténtalo de nuevo.",
    },
    { status: 502 },
  );
}
