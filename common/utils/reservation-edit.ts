import type { Hours } from "../types/hour.types";
import type { Reservation } from "../types/reservation.types";
import { extractCancelConflictMessage } from "./cancel-error";
import { normalizeUserKey } from "./profile-reservations";

// Lógica pura de la ruta `/reservation/edit` (spec 002, plan §2).
// Sin fetch ni sesión: solo validación del parámetro `id` (RF-22), avisos
// de carga en español sin códigos (RF-9, RF-12, RF-13, RF-23, RNF-1, RNF-6)
// y precarga de valores iniciales desde la reserva (RF-2, RF-3, RF-4,
// RF-21, RF-24).

export type ParsedEditId = { ok: true; id: string } | { ok: false };

// RF-22: ausente/vacío/repetido/no válido → `ok: false` y la ruta bloquea
// sin pedir nada al backend. Solo una cadena no vacía es un id aprovechable;
// cualquier matriz (varios valores `id`, aunque sean iguales) se rechaza.
export function parseEditId(
  raw: string | string[] | null | undefined,
): ParsedEditId {
  if (typeof raw !== "string") {
    return { ok: false };
  }
  const id = raw.trim();
  if (id.length === 0) {
    return { ok: false };
  }
  return { ok: true, id };
}

// RF-22: aviso en español cuando el `id` no permite pedir la reserva.
export const EDIT_INVALID_ID_MESSAGE = "El enlace de modificación no es válido.";

// RF-15: aviso en español cuando la reserva no está `CONFIRMED` (bloqueo
// preventivo desde la carga; RNF-6: sin códigos). Se reutiliza también para
// el 409 `RESERVATION_NOT_MODIFIABLE` tardío del `PUT` (RF-25).
export const EDIT_NOT_MODIFIABLE_MESSAGE =
  "Esta reserva ya no se puede modificar.";

// RF-19: toast de éxito tras guardar, visible tras navegar a `/`
// (RNF-1: español; literal exacto de la spec).
export const EDIT_SUCCESS_TOAST_MESSAGE = "Se ha modificado su reserva";

// RF-15: bloqueo preventivo del guardado por estado. Solo `CONFIRMED`
// permite guardar; cualquier otro estado (incluida la ausencia de estado)
// bloquea desde la carga. No distingue roles: la exención del admin (RF-17)
// es solo del bloqueo de 2h —que aplica el backend y el frontend no
// anticipa—, no del estado.
export function isSaveBlockedByState(
  state: string | null | undefined,
): boolean {
  return state !== "CONFIRMED";
}

export type EditLoadErrorKind =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "NETWORK"
  | "UNAUTHENTICATED";

// Avisos de carga en español, sin códigos (RNF-6: los tipos solo dirigen la
// lógica y nunca se muestran a la persona usuaria).
export function mapEditLoadError(kind: EditLoadErrorKind): string {
  switch (kind) {
    // RF-12: la reserva solicitada no existe (backend 404).
    case "NOT_FOUND":
      return "No hemos encontrado esta reserva.";
    // RF-13: reserva de otra persona, o anónima y quien consulta no es admin.
    case "FORBIDDEN":
      return "No tiene permiso para modificar esta reserva.";
    // RF-23: sin sesión al acceder a `/reservation/edit`.
    case "UNAUTHENTICATED":
      return "Inicie sesión para modificar su reserva.";
    // RF-9: fallo de red o del backend sin respuesta aprovechable.
    case "NETWORK":
    default:
      return "No se ha podido cargar la reserva. Inténtelo de nuevo.";
  }
}

export type EditInitialValues = {
  date: Date | null;
  guests: string;
  phone: string;
  observations: string;
  name: string;
  email: string;
};

export type EditViewerProfile = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
} | null;

// RF-2: día de la reserva como fecha local (mediodía, como en
// `ReservationCard`, para no desplazar el día por la zona horaria).
// Nulo o no válido (`yyyy-MM-dd` inexistente) → `null` sin preselección.
function parseReservationDate(raw: unknown): Date | null {
  if (typeof raw !== "string") {
    return null;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

// RF-2: comensales válidos (enteros 1–12, como ofrece la creación) como
// cadena del desplegable; nulos o no válidos → `""` sin preselección.
function parseReservationGuests(raw: unknown): string {
  const value =
    typeof raw === "number"
      ? raw
      : typeof raw === "string" && raw.trim() !== ""
        ? Number(raw)
        : NaN;
  if (!Number.isInteger(value) || value < 1 || value > 12) {
    return "";
  }
  return String(value);
}

// RF-2, RF-3, RF-4, RF-21, RF-24: valores iniciales del formulario de
// modificación. El día y los comensales (RF-2), el teléfono (RF-3) y las
// observaciones (RF-21) vienen de la reserva; nulos o no válidos → sin
// preselección (fecha `null`) o vacío editable, y el resto se carga con
// normalidad. El nombre y el correo salen del usuario actual (RF-4,
// prevalece su información actual), salvo que un admin edite una reserva
// ajena o anónima: entonces salen del propietario guardado (RF-24).
// `hoy` se mantiene en la firma según el plan, pero no filtra fechas
// pasadas ni canceladas: la consulta se permite siempre (RF-14) y el
// formulario se presenta con normalidad; el guardado lo regula el backend.
export function buildEditInitialValues(
  reservation: Reservation | null,
  profile: EditViewerProfile,
  hoy: Date,
  isAdmin = false,
): EditInitialValues {
  const viewerId = normalizeUserKey(profile?.id);
  const ownerId = normalizeUserKey(reservation?.user);
  // Admin ante una reserva de otra persona o anónima (`user == null`):
  // los datos personales son los del propietario, no los del admin.
  const showsOwner = isAdmin && reservation !== null && ownerId !== viewerId;
  return {
    date: parseReservationDate(reservation?.date),
    guests: parseReservationGuests(reservation?.guests),
    phone:
      typeof reservation?.phone === "string" &&
      reservation.phone.trim() !== ""
        ? reservation.phone
        : "",
    observations:
      typeof reservation?.observations === "string"
        ? reservation.observations
        : "",
    name: (showsOwner ? reservation?.name : profile?.name) ?? "",
    email: (showsOwner ? reservation?.email : profile?.email) ?? "",
  };
}

// RF-20: la hora elegida solo sigue valiendo si aparece entre las horas
// recargadas con la misma lógica de la creación (`getAvailableHours`); al
// cambiar día o comensales, una hora ausente obliga a elegir otra de entre
// las actuales. Devuelve un booleano sin ninguna marca sobre la hora
// original: la edición no precarga ni destaca la hora anterior
// (`buildEditInitialValues` no incluye hora).
export function isEditHourStillAvailable(
  hours: Hours | null | undefined,
  startTime: string | null | undefined,
): boolean {
  if (typeof startTime !== "string" || startTime === "") {
    return false;
  }
  const inside = hours?.insideHours ?? [];
  const outside = hours?.outsideHours ?? [];
  return inside.includes(startTime) || outside.includes(startTime);
}

export type UpdateErrorKind =
  | "FORBIDDEN"
  | "NOT_MODIFIABLE"
  | "VALIDATION"
  | "CONFLICT_MESSAGE"
  | "GENERIC";

export type UpdateErrorMapping = {
  kind: UpdateErrorKind;
  backendMessage: string | null;
};

// Identificadores del backend para el guardado (RNF-5: se conservan en
// inglés tal cual y solo dirigen la lógica, nunca se muestran). Misma lista
// que `ReservationService`: el servicio ya devuelve `code`/`backendMessage`
export type UpdateErrorStatus = 400 | 403 | 404 | 409 | 500;

const UPDATE_VALIDATION_CODES = [
  "INVALID_TIME",
  "RESERVATION_ALREADY_EXISTS",
  "NO_TABLES_AVAILABLE",
] as const;

function extractUpdateErrorCode(body: string): string | null {
  if (body.includes("RESERVATION_NOT_MODIFIABLE")) {
    return "RESERVATION_NOT_MODIFIABLE";
  }
  for (const code of UPDATE_VALIDATION_CODES) {
    if (body.includes(code)) {
      return code;
    }
  }
  return null;
}

// RF-7/RF-10/RF-16/RF-18/RF-25/RF-26: clasifica el fallo del `PUT` a partir
// del estado y del cuerpo. 409 con mensaje en español y sin código →
// `CONFLICT_MESSAGE` con el literal del backend (RF-16, RF-26: el teléfono);
// códigos `RESERVATION_NOT_MODIFIABLE`/`INVALID_TIME`/
// `RESERVATION_ALREADY_EXISTS`/`NO_TABLES_AVAILABLE` solo para la lógica
// (RNF-5); 403 → `FORBIDDEN` (RF-25/RF-13). Solo devuelve el mensaje: no toca
// el estado del formulario, así los datos introducidos se conservan (RF-10).
export function mapUpdateError(
  status: UpdateErrorStatus,
  body: string,
): UpdateErrorMapping {
  // RF-25: cambio de permisos entre obtención y guardado (RF-13).
  if (status === 403) {
    return { kind: "FORBIDDEN", backendMessage: null };
  }
  const raw = typeof body === "string" ? body : "";
  const code = extractUpdateErrorCode(raw);
  const backendMessage = extractCancelConflictMessage(raw);
  // RF-25: cambio de estado entre obtención y guardado (RF-15).
  if (code === "RESERVATION_NOT_MODIFIABLE") {
    return { kind: "NOT_MODIFIABLE", backendMessage };
  }
  // RF-18: el guardado incumple las validaciones de la creación.
  if (code !== null) {
    return { kind: "VALIDATION", backendMessage };
  }
  // RF-16: rechazo por cercanía con mensaje en español (teléfono): literal.
  if (status === 409 && backendMessage !== null) {
    return { kind: "CONFLICT_MESSAGE", backendMessage };
  }
  // RF-10: fallo de envío sin caso propio (incluido 409 sin mensaje).
  return { kind: "GENERIC", backendMessage: null };
}

// Avisos en español para el fallo del guardado, sin códigos (RNF-6). El caso
// `CONFLICT_MESSAGE` muestra literalmente el mensaje del backend (RF-16,
// RF-26); el resto usa textos propios y conserva los datos (RF-10, RF-18,
// RF-25: la UI solo fija este mensaje, sin rellenar el formulario).
export function resolveUpdateErrorMessage(
  mapped: UpdateErrorMapping,
): string {
  switch (mapped.kind) {
    case "CONFLICT_MESSAGE":
      if (
        typeof mapped.backendMessage === "string" &&
        mapped.backendMessage.trim() !== ""
      ) {
        return mapped.backendMessage;
      }
      return "No se ha podido guardar la reserva. Inténtelo de nuevo.";
    case "FORBIDDEN":
      return mapEditLoadError("FORBIDDEN");
    case "NOT_MODIFIABLE":
      return EDIT_NOT_MODIFIABLE_MESSAGE;
    case "VALIDATION":
      return "No se ha podido guardar la reserva con esos datos. Revíselos e inténtelo de nuevo.";
    case "GENERIC":
    default:
      return "No se ha podido guardar la reserva. Inténtelo de nuevo.";
  }
}
