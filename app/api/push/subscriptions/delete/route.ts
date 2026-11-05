import { readPushToken } from "@/common/utils/push-cookie";
import { UserService } from "@/service/UserService";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ROLE = "ROLE_ADMIN";

/**
 * Proxy mismo origen de la vía alternativa de baja push (RF-6, RF-7,
 * CL-16, RF-20, RNF-2, RNF-7). Se usa una única vez cuando la vía
 * principal DELETE devuelve 502. Reenvía a
 * `POST BACKEND_URL/reservations/push/subscriptions/delete` con cuerpo
 * `{ endpoint }`, `Cookie token` + `User-Role: ROLE_ADMIN`. Sin admin →
 * 403 sin llamar al backend. La vía principal DELETE queda intacta.
 * Éxito 2xx/204; la suscripción nunca se registra ni se expone.
 */
export async function POST(request: NextRequest) {
  const profile = await UserService.getProfile();
  if (profile?.role !== ADMIN_ROLE) {
    return NextResponse.json(
      {
        error:
          "Necesitas una sesión de administración para gestionar los avisos.",
      },
      { status: 403 },
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const endpoint =
    body !== null && typeof body === "object"
      ? (body as Record<string, unknown>).endpoint
      : null;
  if (typeof endpoint !== "string" || endpoint.trim().length === 0) {
    return NextResponse.json(
      { error: "Falta el extremo de la suscripción." },
      { status: 400 },
    );
  }
  const token = readPushToken(request);
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Necesitas una sesión de administración para gestionar los avisos.",
      },
      { status: 403 },
    );
  }
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/reservations/push/subscriptions/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
          "User-Role": ADMIN_ROLE,
        },
        body: JSON.stringify({ endpoint }),
        cache: "no-store",
      },
    );
    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }
    if (response.ok) {
      const text = await response.text();
      if (!text) return NextResponse.json({ ok: true }, { status: response.status });
      try {
        return NextResponse.json(JSON.parse(text) as unknown, {
          status: response.status,
        });
      } catch {
        return NextResponse.json({ ok: true }, { status: response.status });
      }
    }
    return NextResponse.json(
      { error: "No se ha podido desactivar los avisos. Inténtalo de nuevo." },
      { status: response.status },
    );
  } catch {
    console.error("No se ha podido contactar con el servidor de avisos (baja alternativa).");
    return NextResponse.json(
      {
        error:
          "No se ha podido desactivar los avisos. La baja queda pendiente de reintento manual.",
      },
      { status: 502 },
    );
  }
}
