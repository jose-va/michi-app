export type PushSubscriptionPayload = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export type PushServiceOverrides = {
  fetcher?: typeof fetch;
  baseUrl?: string;
};

export type PushPublicKeyResult =
  | { ok: true; key: string }
  | { ok: false; reason: string };

export type PushStatusResult = { ok: boolean; status: number };

function sameOriginUrl(
  overrides: PushServiceOverrides | undefined,
  path: string,
): string {
  return `${overrides?.baseUrl ?? ""}${path}`;
}

export function extractPushPublicKey(body: unknown): string | null {
  if (typeof body === "string" && body.trim().length > 0) return body.trim();
  if (body !== null && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const field of ["key", "publicKey"]) {
      const value = record[field];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
  }
  return null;
}

/**
 * Cliente push contra rutas Next.js del mismo origen (`/api/push/*`).
 * El proxy reenvía al backend real (`BACKEND_URL/reservations/push/*`).
 * Nunca registra la suscripción ni las llaves: los mensajes de error son
 * genéricos en español (RF-24, RNF-2).
 */
export class PushService {
  static async getPublicKey(
    overrides?: PushServiceOverrides,
  ): Promise<PushPublicKeyResult> {
    const fetcher = overrides?.fetcher ?? fetch;
    try {
      const response = await fetcher(
        sameOriginUrl(overrides, "/api/push/public-key"),
      );
      if (response.ok) {
        const key = extractPushPublicKey(
          await response.json().catch(() => null),
        );
        if (key) return { ok: true, key };
      }
    } catch {
      console.error(
        "No se ha podido obtener la clave de avisos. Comprueba tu conexión.",
      );
    }
    const fallback = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (fallback && fallback.trim().length > 0) {
      return { ok: true, key: fallback.trim() };
    }
    return {
      ok: false,
      reason:
        "No se ha podido obtener la clave de avisos. Comprueba tu conexión e inténtalo de nuevo.",
    };
  }

  static async subscribe(
    sub: PushSubscriptionPayload,
    overrides?: PushServiceOverrides,
  ): Promise<PushStatusResult> {
    const fetcher = overrides?.fetcher ?? fetch;
    try {
      const response = await fetcher(
        sameOriginUrl(overrides, "/api/push/subscriptions"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
          }),
        },
      );
      return { ok: response.ok, status: response.status };
    } catch {
      console.error(
        "No se ha podido activar los avisos. Comprueba tu conexión e inténtalo de nuevo.",
      );
      return { ok: false, status: 0 };
    }
  }

  static async unsubscribe(
    endpoint: string,
    overrides?: PushServiceOverrides,
  ): Promise<PushStatusResult> {
    const fetcher = overrides?.fetcher ?? fetch;
    try {
      const response = await fetcher(
        `${sameOriginUrl(overrides, "/api/push/subscriptions")}?endpoint=${encodeURIComponent(endpoint)}`,
        { method: "DELETE" },
      );
      return { ok: response.ok, status: response.status };
    } catch {
      console.error(
        "No se ha podido desactivar los avisos. La baja queda pendiente de reintento manual.",
      );
      return { ok: false, status: 0 };
    }
  }

  static async requestTest(
    overrides?: PushServiceOverrides,
  ): Promise<PushStatusResult> {
    const fetcher = overrides?.fetcher ?? fetch;
    try {
      const response = await fetcher(
        sameOriginUrl(overrides, "/api/push/test"),
        { method: "POST" },
      );
      return { ok: response.ok, status: response.status };
    } catch {
      console.error(
        "No se ha podido encargar el aviso de prueba. Comprueba tu conexión e inténtalo de nuevo.",
      );
      return { ok: false, status: 0 };
    }
  }
}
