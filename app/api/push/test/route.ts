import { readPushToken } from "@/common/utils/push-cookie";
import { UserService } from "@/service/UserService";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ROLE = "ROLE_ADMIN";

/**
 * Proxy mismo origen del aviso de prueba push (RF-18, RF-20, RNF-2, RNF-7).
 * Verifica sesión admin con `UserService.getProfile()` y reenvía a
 * `POST BACKEND_URL/reservations/push/test` con `Cookie token` +
 * `User-Role: ROLE_ADMIN` (patrón ReservationService); el backend lo
 * difunde a todas las suscripciones administradoras vigentes. Sin
 * admin → 403 sin llamar al backend.
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
      `${process.env.BACKEND_URL}/reservations/push/test`,
      {
        method: "POST",
        headers: { Cookie: `token=${token}`, "User-Role": ADMIN_ROLE },
        cache: "no-store",
      },
    );
    if (response.ok) {
      return NextResponse.json({ ok: true }, { status: response.status });
    }
    return NextResponse.json(
      {
        error:
          "No se ha podido encargar el aviso de prueba. Inténtalo de nuevo.",
      },
      { status: response.status },
    );
  } catch {
    console.error(
      "No se ha podido contactar con el servidor de avisos (prueba).",
    );
    return NextResponse.json(
      {
        error:
          "No se ha podido encargar el aviso de prueba. Comprueba tu conexión e inténtalo de nuevo.",
      },
      { status: 502 },
    );
  }
}
