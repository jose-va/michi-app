"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shadcn/components/button";
import { Badge } from "@/shadcn/components/badge";
import { Alert, AlertDescription } from "@/shadcn/components/alert";
import {
  canShowPushSettings,
  pushStatusText,
  resolvePushStatus,
  type PushUiStatus,
} from "@/common/utils/push-status";
import { isSecurePushContext } from "@/common/utils/push-environment";
import {
  bufferToBase64,
  publicKeyToUint8Array,
} from "@/common/utils/push-keys";
import {
  activatePushSubscription,
  deactivatePushSubscription,
} from "@/common/utils/push-subscription";
import { requestPushTest } from "@/common/utils/push-test";
import { PushService } from "@/service/PushService";

// Entorno compatible con avisos push (RF-21, RNF-6): notificaciones y
// push en contexto seguro (HTTPS salvo localhost de desarrollo).
// Protegido para SSR y sin lanzamientos
// (CL-6: sin soporte la web sigue navegable).
function readPushSupport(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof Notification === "undefined") return false;
  if (!("serviceWorker" in navigator && "PushManager" in window)) {
    return false;
  }
  try {
    return isSecurePushContext({
      isSecureContext:
        typeof window.isSecureContext === "boolean"
          ? window.isSecureContext
          : false,
      hostname: window.location?.hostname ?? "",
    });
  } catch {
    return false;
  }
}

// Foto completa del estado (solo lectura, sin efectos): soporte,
// permiso y suscripción vigente. Nunca lanza (CL-6: sin trabajador o
// sin almacenamiento la web sigue navegable sin estado falso).
async function readPushStatus(): Promise<PushUiStatus> {
  try {
    const supported = readPushSupport();
    if (!supported) return "unsupported";
    const permission: NotificationPermission = Notification.permission;
    if (permission === "denied") return "blocked";
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return resolvePushStatus({
      supported: true,
      permission,
      subscribed: subscription !== null,
    });
  } catch {
    return "unknown";
  }
}

// Alta real en el navegador con la clave oficial (RF-2): suscribe el
// dispositivo y comunica `{endpoint, keys:{p256dh,auth}}` al backend mismo
// origen. Nunca registra ni devuelve la suscripción (RF-19, RNF-2).
async function subscribeBrowserDevice(applicationServerKey: Uint8Array) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey as BufferSource,
  });
  const p256dhKey = subscription.getKey("p256dh");
  const authKey = subscription.getKey("auth");
  if (!p256dhKey || !authKey) {
    await subscription.unsubscribe().catch(() => {});
    return null;
  }
  return {
    endpoint: subscription.endpoint,
    keys: { p256dh: bufferToBase64(p256dhKey), auth: bufferToBase64(authKey) },
  };
}

// Control de avisos de nueva reserva, solo administración (RF-1, RF-2,
// RF-4, RF-6, RF-7, RF-18, RF-19, RF-21, RF-22, RNF-1, RNF-4): muestra un único
// estado en español y los botones «Activar avisos», «Probar aviso» y
// «Desactivar avisos».
// Solo la respuesta 2xx observable deja «Avisos activados»; cualquier fallo
// informa en español con reintento manual y sin estados falsos. Sin soporte
// muestra «Avisos no soportados» y el resto de la web sigue operativa.
export default function PushSettings({
  userRole,
}: {
  userRole: string | null;
}) {
  const [status, setStatus] = useState<PushUiStatus>("unknown");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void readPushStatus().then((next) => {
      if (!cancelled) setStatus(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const activate = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await activatePushSubscription({
        supported: readPushSupport(),
        requestPermission: () => Notification.requestPermission(),
        getPublicKey: () => PushService.getPublicKey(),
        decodeKey: publicKeyToUint8Array,
        subscribeDevice: subscribeBrowserDevice,
        postSubscription: (sub) => PushService.subscribe(sub),
      });
      setStatus(result.status);
      setMessage(result.message);
    } finally {
      setBusy(false);
    }
  }, []);

  const deactivate = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await deactivatePushSubscription({
        getCurrentSubscription: async () => {
          const registration = await navigator.serviceWorker.ready;
          const subscription =
            await registration.pushManager.getSubscription();
          if (!subscription) return null;
          return {
            endpoint: subscription.endpoint,
            unsubscribe: () => subscription.unsubscribe().then(() => {}),
          };
        },
        deleteSubscription: (endpoint) => PushService.unsubscribe(endpoint),
      });
      if (result.removed) {
        const next = await readPushStatus().catch(
          () => "unknown" as PushUiStatus,
        );
        // La baja local confirmada nunca muestra un estado falso: si el
        // navegador ya no tiene suscripción, vuelve al estado inicial.
        setStatus(next === "active" ? "unknown" : next);
      }
      setMessage(result.message);
    } finally {
      setBusy(false);
    }
  }, []);

  const probe = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await requestPushTest({
        requestTest: () => PushService.requestTest(),
      });
      setMessage(result.message);
    } finally {
      setBusy(false);
    }
  }, []);

  if (!canShowPushSettings(userRole)) return null;

  const text = pushStatusText(status);

  return (
    <section
      aria-live="polite"
      aria-label="Avisos de nueva reserva"
      className="rounded-lg border bg-background p-4"
    >
      <p className="text-sm font-semibold">Avisos de nueva reserva</p>
      {text ? (
        <div className="mt-1">
          <Badge variant="secondary">{text}</Badge>
        </div>
      ) : null}
      {message ? (
        <Alert className="mt-2">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {status === "active" ? (
          <>
            <Button type="button" onClick={probe} disabled={busy}>
              Probar aviso
            </Button>
            <Button
              type="button"
              onClick={deactivate}
              disabled={busy}
              variant="outline"
            >
              Desactivar avisos
            </Button>
          </>
        ) : (
          <Button type="button" onClick={activate} disabled={busy}>
            Activar avisos
          </Button>
        )}
      </div>
    </section>
  );
}
