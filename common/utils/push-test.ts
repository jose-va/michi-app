import type { PushStatusResult } from "@/service/PushService";

// Prueba de aviso en difusión a administración (T7: RF-23, RNF-1).
// Lógica pura fuera de la UI (constitución, punto 3): la frontera con el
// backend (`POST /api/push/test` mismo origen → `POST
// BACKEND_URL/reservations/push/test` en difusión a todas las
// suscripciones admin vigentes) se inyecta para probarla sin depender de
// la UI. Solo la respuesta 2xx observable (`ok: true`) encarga la prueba;
// cualquier otro caso informa en español sin estado falso.

export type PushTestDeps = {
  requestTest: () => Promise<PushStatusResult>;
};

export type PushTestResult = {
  sent: boolean;
  message: string | null;
};

// Encarga un aviso de prueba en difusión (RF-23): `sent: true` solo ante
// 2xx observable. Ante 403/5xx o fallo de red, `sent: false` con mensaje
// en español y reintento manual a petición explícita (sin estado falso).
export async function requestPushTest(
  deps: PushTestDeps,
): Promise<PushTestResult> {
  try {
    const result = await deps.requestTest();
    if (result.ok) {
      return {
        sent: true,
        message:
          "Aviso de prueba encargado. Llegará a todos los dispositivos administradores.",
      };
    }
  } catch {
    // El fallo de red se informa abajo sin estado falso (RF-13b).
  }
  return {
    sent: false,
    message:
      "No se ha podido encargar el aviso de prueba. Comprueba tu conexión e inténtalo de nuevo.",
  };
}
