/* Trabajador de servicio de avisos push (spec 010, solo push).
 * Sin caché sin conexión ni precache: sin red rige el comportamiento
 * estándar del navegador.
 *
 * El backend compone el payload { title, body, url } (título
 * «Nueva reserva», cuerpo largo en español en hora local del
 * restaurante, url «/reservation/preview» relativa) y el trabajador
 * solo lo muestra tal cual, sin reconstruir el cuerpo: el formato largo
 * vive como contrato observable en `common/utils/push-format.ts`
 * (probado en `npm test`). Al pulsar se enfoca la pestaña abierta con
 * ese destino o se abre (url relativa resuelta contra el origen); el
 * aviso llega con la web cerrada en entorno compatible.
 */

// Réplica de PUSH_NOTIFICATION_* de common/utils/push-format.ts: el
// trabajador no puede importar TypeScript. Icono de 192 px de la fase
// 009 (RNF-9).
const PUSH_ICON = "/icons/manifest-icon-192.png";
const PUSH_FALLBACK_TITLE = "Nueva reserva";
const PUSH_FALLBACK_URL = "/reservation/preview";

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }
  const title =
    typeof payload.title === "string" && payload.title.trim()
      ? payload.title
      : PUSH_FALLBACK_TITLE;
  const body = typeof payload.body === "string" ? payload.body : "";
  const url =
    typeof payload.url === "string" && payload.url.trim()
      ? payload.url
      : PUSH_FALLBACK_URL;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: PUSH_ICON,
      data: { url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const rawUrl =
    event.notification && event.notification.data
      ? event.notification.data.url
      : undefined;
  const target = new URL(String(rawUrl || PUSH_FALLBACK_URL), self.location.origin);
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          try {
            const current = new URL(client.url);
            if (
              current.origin === target.origin &&
              current.pathname === target.pathname &&
              "focus" in client
            ) {
              return client.focus();
            }
          } catch {
            // URL de cliente no válida: se sigue buscando u abriendo.
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(target.href);
        return undefined;
      }),
  );
});
