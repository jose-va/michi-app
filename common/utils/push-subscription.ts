import type { PushSubscriptionPayload } from "@/service/PushService";
import type { PushUiStatus } from "@/common/utils/push-status";

// Alta y baja de la suscripción push (T6: RF-9, RF-12, RF-13, RF-13b,
// RF-24). Lógica pura fuera de la UI (constitución, punto 3): orquesta la
// secuencia observable permiso → suscripción del navegador → POST mismo
// origen (alta) y baja local primero → POST mismo origen
// `.../subscriptions/delete` (baja directa, sin fallback). Las fronteras con el navegador y el backend se inyectan para probarlas sin
// depender de la UI. Solo la respuesta 2xx observable (`ok: true`) es
// éxito; cualquier otro caso informa en español sin estado falso
// («Avisos activados» solo con alta confirmada, RF-13b). Nunca registra la
// suscripción ni devuelve su contenido en el resultado (RF-24, RNF-2): el
// único dato del dispositivo que circula es el extremo hacia el DELETE.

export type PushActivateDeps = {
  supported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  getPublicKey: () => Promise<{ ok: true; key: string } | { ok: false; reason: string }>;
  decodeKey: (key: string) => Uint8Array | null;
  subscribeDevice: (
    applicationServerKey: Uint8Array,
  ) => Promise<PushSubscriptionPayload | null>;
  postSubscription: (
    sub: PushSubscriptionPayload,
  ) => Promise<{ ok: boolean; status: number }>;
};

export type PushActivateResult = {
  activated: boolean;
  status: PushUiStatus;
  message: string | null;
};

export type PushDeviceSubscription = {
  endpoint: string;
  unsubscribe: () => Promise<void>;
};

export type PushDeactivateDeps = {
  getCurrentSubscription: () => Promise<PushDeviceSubscription | null>;
  deleteSubscription: (
    endpoint: string,
  ) => Promise<{ ok: boolean; status: number }>;
};

export type PushDeactivateResult = {
  removed: boolean;
  status: PushUiStatus;
  message: string | null;
};

// Secuencia de alta (RF-9, RF-13b): permiso concedido → alta en el
// navegador con la clave oficial → POST `{endpoint, keys:{p256dh,auth}}`
// (upsert por extremo, 200/201). Cualquier interrupción devuelve el motivo
// en español con `activated: false` y sin estado falso.
export async function activatePushSubscription(
  deps: PushActivateDeps,
): Promise<PushActivateResult> {
  if (!deps.supported) {
    return {
      activated: false,
      status: "unsupported",
      message: "Este navegador no admite avisos. La web sigue funcionando con normalidad.",
    };
  }
  let permission: NotificationPermission;
  try {
    permission = await deps.requestPermission();
  } catch {
    return {
      activated: false,
      status: "unknown",
      message:
        "No se ha podido pedir el permiso de notificaciones. Inténtalo de nuevo.",
    };
  }
  if (permission !== "granted") {
    return {
      activated: false,
      status: "blocked",
      message:
        "El permiso de notificaciones no está concedido. Actívalo en el navegador e inténtalo de nuevo.",
    };
  }
  const keyResult = await deps.getPublicKey();
  if (!keyResult.ok) {
    return {
      activated: false,
      status: "unknown",
      message:
        "No se ha podido obtener la clave de avisos. Comprueba tu conexión e inténtalo de nuevo.",
    };
  }
  const applicationServerKey = deps.decodeKey(keyResult.key);
  if (!applicationServerKey) {
    return {
      activated: false,
      status: "unknown",
      message:
        "No se ha podido obtener la clave de avisos. Comprueba tu conexión e inténtalo de nuevo.",
    };
  }
  let deviceSub: PushSubscriptionPayload | null;
  try {
    deviceSub = await deps.subscribeDevice(applicationServerKey);
  } catch {
    deviceSub = null;
  }
  if (!deviceSub) {
    return {
      activated: false,
      status: "unknown",
      message:
        "No se ha podido crear la suscripción en este dispositivo. Inténtalo de nuevo.",
    };
  }
  try {
    const posted = await deps.postSubscription(deviceSub);
    if (posted.ok) {
      return { activated: true, status: "active", message: null };
    }
  } catch {
    // El fallo de red se informa abajo sin estado falso (RF-13b).
  }
  return {
    activated: false,
    status: "unknown",
    message:
      "No se ha podido activar los avisos. Comprueba tu conexión e inténtalo de nuevo.",
  };
}

// Secuencia de baja (RF-6, RF-7, CL-16): primero `unsubscribe()` en el
// navegador y después POST `.../subscriptions/delete` con el extremo en el
// cuerpo. La baja es éxito ante 2xx/204 (204 idempotente); si el POST falla
// por red o devuelve no-2xx, la baja local se mantiene e informa «pendiente
// de reintento manual». El frontend no intenta la vía DELETE `?endpoint`
// (queda en el backend solo por compatibilidad). Nunca registra la
// suscripción (RF-19, RNF-2).
export async function deactivatePushSubscription(
  deps: PushDeactivateDeps,
): Promise<PushDeactivateResult> {
  let current: PushDeviceSubscription | null;
  try {
    current = await deps.getCurrentSubscription();
  } catch {
    return {
      removed: false,
      status: "unknown",
      message:
        "No se ha podido desactivar los avisos en este dispositivo. Inténtalo de nuevo.",
    };
  }
  if (!current) return { removed: true, status: "unknown", message: null };
  try {
    await current.unsubscribe();
  } catch {
    return {
      removed: false,
      status: "unknown",
      message:
        "No se ha podido desactivar los avisos en este dispositivo. Inténtalo de nuevo.",
    };
  }
  const endpoint = current.endpoint;
  let primary: { ok: boolean; status: number };
  try {
    primary = await deps.deleteSubscription(endpoint);
  } catch {
    primary = { ok: false, status: 0 };
  }
  if (primary.ok) return { removed: true, status: "unknown", message: null };
  return {
    removed: true,
    status: "unknown",
    message:
      "Avisos desactivados en este dispositivo. La baja queda pendiente de reintento manual.",
  };
}
