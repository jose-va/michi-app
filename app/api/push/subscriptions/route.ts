import { readPushToken } from "@/common/utils/push-cookie";
import { UserService } from "@/service/UserService";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ROLE = "ROLE_ADMIN";

function forbidden() {
  return NextResponse.json(
    {
      error:
        "Necesitas una sesión de administración para gestionar los avisos.",
    },
    { status: 403 },
  );
}

function badGateway(message: string) {
  return NextResponse.json({ error: message }, { status: 502 });
}

function forwardJson(data: unknown, status: number) {
  return NextResponse.json(data, { status });
}

async function forwardBackendBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function isValidSubscription(
  body: unknown,
): body is { endpoint: string; keys: { p256dh: string; auth: string } } {
  if (body === null || typeof body !== "object") return false;
  const { endpoint, keys } = body as Record<string, unknown>;
  if (typeof endpoint !== "string" || endpoint.trim().length === 0) {
    return false;
  }
  if (keys === null || typeof keys !== "object") return false;
  const { p256dh, auth } = keys as Record<string, unknown>;
  return (
    typeof p256dh === "string" &&
    p256dh.length > 0 &&
    typeof auth === "string" &&
    auth.length > 0
  );
}

/**
 * Proxy mismo origen del alta de suscripción push (RF-2, RF-5, RF-20,
 * RNF-2, RNF-7). Verifica sesión admin con `UserService.getProfile()`
 * y reenvía a `POST BACKEND_URL/reservations/push/subscriptions` con
 * `Cookie token` + `User-Role: ROLE_ADMIN` (patrón ReservationService).
 * Alta 200/201 como éxito (upsert por extremo). Sin admin → 403 sin
 * llamar al backend. La suscripción nunca se registra ni se expone.
 */
export async function POST(request: NextRequest) {
  const profile = await UserService.getProfile();
  if (profile?.role !== ADMIN_ROLE) return forbidden();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  if (!isValidSubscription(body)) {
    return NextResponse.json(
      { error: "La suscripción no es válida." },
      { status: 400 },
    );
  }
  const token = readPushToken(request);
  if (!token) return forbidden();
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/reservations/push/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
          "User-Role": ADMIN_ROLE,
        },
        body: JSON.stringify({
          endpoint: body.endpoint,
          keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
        }),
        cache: "no-store",
      },
    );
    if (response.ok) {
      return forwardJson((await forwardBackendBody(response)) ?? { ok: true }, response.status);
    }
    return NextResponse.json(
      { error: "No se ha podido activar los avisos. Inténtalo de nuevo." },
      { status: response.status },
    );
  } catch {
    console.error("No se ha podido contactar con el servidor de avisos (alta).");
    return badGateway(
      "No se ha podido activar los avisos. Comprueba tu conexión e inténtalo de nuevo.",
    );
  }
}

/**
 * Proxy mismo origen de la baja de suscripción push (RF-6, RF-7, RF-20,
 * RNF-2, RNF-7). Reenvía a
 * `DELETE BACKEND_URL/reservations/push/subscriptions?endpoint=...` con
 * `Cookie token` + `User-Role: ROLE_ADMIN`. Sin admin → 403 sin llamar
 * al backend.
 */
export async function DELETE(request: NextRequest) {
  const profile = await UserService.getProfile();
  if (profile?.role !== ADMIN_ROLE) return forbidden();
  const endpoint = new URL(request.url).searchParams.get("endpoint");
  if (!endpoint) {
    return NextResponse.json(
      { error: "Falta el extremo de la suscripción." },
      { status: 400 },
    );
  }
  const token = readPushToken(request);
  if (!token) return forbidden();
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/reservations/push/subscriptions?endpoint=${encodeURIComponent(endpoint)}`,
      {
        method: "DELETE",
        headers: { Cookie: `token=${token}`, "User-Role": ADMIN_ROLE },
        cache: "no-store",
      },
    );
    if (response.ok) {
      return forwardJson((await forwardBackendBody(response)) ?? { ok: true }, response.status);
    }
    return NextResponse.json(
      { error: "No se ha podido desactivar los avisos. Inténtalo de nuevo." },
      { status: response.status },
    );
  } catch {
    console.error("No se ha podido contactar con el servidor de avisos (baja).");
    return badGateway(
      "No se ha podido desactivar los avisos. La baja queda pendiente de reintento manual.",
    );
  }
}
