// Contrato observable del cuerpo del aviso de nueva reserva (T8:
// RF-15–RF-19, CL-15, CL-20).
// Lógica pura fuera de la UI (constitución, punto 3): el backend compone
// el cuerpo en formato largo español («Mesa para {nombre} · {día}
// {fecha} · HH:MM», en hora local del restaurante Europe/Madrid) y el
// trabajador de servicio lo muestra tal cual sin reconstruirlo; este
// módulo fija ese contrato para probarlo con `npm test` con `hoy` fijo.
// Si falta algún dato se muestran solo los disponibles sin inventar
// valores (CL-15); los emoji y el cambio de horario (DST) se respetan
// tal cual (CL-20). Nunca registra nada (RF-24, RNF-2).

export const PUSH_NOTIFICATION_TITLE = "Nueva reserva";
export const PUSH_NOTIFICATION_ICON = "/icons/manifest-icon-192.png";
export const PUSH_NOTIFICATION_URL = "/reservation/preview";

export const RESTAURANT_TIME_ZONE = "Europe/Madrid";

export type PushBodyInput = {
  name?: string | null;
  date?: string | null;
  time?: string | null;
};

export type PushPayloadInput = {
  title?: unknown;
  body?: unknown;
  url?: unknown;
};

export type PushNotificationContent = {
  title: string;
  body: string;
  icon: string;
  url: string;
};

type RestaurantDateParts = {
  weekday: string;
  day: string;
  month: string;
  year: string;
};

function restaurantDateParts(value: Date): RestaurantDateParts {
  const parts = new Intl.DateTimeFormat("es-ES", {
    timeZone: RESTAURANT_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(value);
  const get = (type: string): string =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    weekday: get("weekday"),
    day: get("day"),
    month: get("month"),
    year: get("year"),
  };
}

// Acepta fecha sola («2026-11-06») o ISO completa; la fecha sola se
// interpreta al mediodía para que el huso horario del restaurante nunca
// la desplace de día. Nulo si es inválida (nunca se inventa, CL-15).
function parseReservationDate(iso: string): Date | null {
  if (typeof iso !== "string") return null;
  const trimmed = iso.trim();
  if (trimmed.length === 0) return null;
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? `${trimmed}T12:00:00`
    : trimmed;
  const value = new Date(normalized);
  return Number.isNaN(value.getTime()) ? null : value;
}

// Fecha en formato largo español en hora local del restaurante
// («viernes 6 de noviembre»); si es inválida devuelve "" (RF-15,
// CL-20). `hoy` decide si el año se muestra: solo cuando difiere del
// año actual en el restaurante, para no ambiguar reservas futuras.
export function formatPushDateTime(iso: string, hoy: Date): string {
  const value = parseReservationDate(iso);
  if (!value) return "";
  const target = restaurantDateParts(value);
  if (!target.weekday || !target.day || !target.month) return "";
  const currentYear = restaurantDateParts(hoy).year;
  const sameYear = currentYear !== "" && currentYear === target.year;
  const yearSuffix = sameYear ? "" : ` de ${target.year}`;
  return `${target.weekday} ${target.day} de ${target.month}${yearSuffix}`;
}

// Hora a HH:MM («9:05» → «09:05», «20:30:00» → «20:30»); "" si es
// inválida o ausente (nunca se inventa, CL-15).
export function normalizePushTime(
  time: string | null | undefined,
): string {
  if (typeof time !== "string") return "";
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(time.trim());
  if (!match) return "";
  const hours = Number(match[1]);
  if (hours > 23 || Number(match[2]) > 59) return "";
  return `${String(hours).padStart(2, "0")}:${match[2]}`;
}

// Cuerpo con nombre+fecha+hora en español, unidos con «·» como el
// formato largo del backend; solo los disponibles (RF-15, CL-15).
export function buildPushBody(input: PushBodyInput, hoy: Date): string {
  const parts: string[] = [];
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name) parts.push(`Mesa para ${name}`);
  const dateText = formatPushDateTime(
    typeof input.date === "string" ? input.date : "",
    hoy,
  );
  if (dateText) parts.push(dateText);
  const timeText = normalizePushTime(input.time);
  if (timeText) parts.push(timeText);
  return parts.join(" · ");
}

// Resuelve el payload del push con los fallbacks exactos (RF-15, RF-17):
// título «Nueva reserva», icono 192 y url a la gestión. El trabajador de
// servicio (`public/sw.js`) replica esta lógica porque no puede importar
// TypeScript: si cambia aquí, cambia allí.
export function resolvePushNotification(
  input: PushPayloadInput,
): PushNotificationContent {
  const title =
    typeof input.title === "string" && input.title.trim()
      ? input.title
      : PUSH_NOTIFICATION_TITLE;
  const body = typeof input.body === "string" ? input.body : "";
  const url =
    typeof input.url === "string" && input.url.trim()
      ? input.url
      : PUSH_NOTIFICATION_URL;
  return { title, body, icon: PUSH_NOTIFICATION_ICON, url };
}
