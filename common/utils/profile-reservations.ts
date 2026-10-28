import type { Reservation } from "../types/reservation.types";

export function normalizeUserKey(userId: unknown): string {
  if (typeof userId === "string") {
    return userId.trim();
  }
  if (userId === null || userId === undefined) {
    return "";
  }
  return String(userId).trim();
}

// La identidad la manda la sesión viva del servidor (cookie), no el cliente:
// el formulario no tiene campo visible de usuario y el proveedor puede llegar
// null al enviar (defaultValues congelado). El id vivo es autoritativo y
// sobreescribe cualquier valor de cliente (antiguo o en blanco); sin sesión
// la clave queda vacía y la reserva se crea igual como invitado.
export function resolveReservationUserKey(
  clientUser: unknown,
  profile: { id?: string | number } | null,
): string {
  return normalizeUserKey(profile?.id) || normalizeUserKey(clientUser);
}

export function selectActiveReservation(
  reservations: Reservation[],
  userId: string,
): Reservation | null {
  const userKey = normalizeUserKey(userId);
  if (userKey === "") {
    return null;
  }
  const mine = reservations.filter(
    (reservation) =>
      reservation.user !== "" && reservation.user === userKey,
  );
  // El backend ya filtra por el header User-Id: las filas sin usuario
  // atribuido (null o "") solo pueden ser del usuario que pide, así que
  // respaldan la coincidencia exacta en vez de descartar la reserva.
  // Las filas atribuidas a otro usuario distinto nunca se aceptan.
  const unattributed = reservations.filter(
    (reservation) =>
      reservation.user === "" ||
      reservation.user === null ||
      reservation.user === undefined,
  );
  const scoped = mine.length > 0 ? mine : unattributed;
  if (scoped.length === 0) {
    return null;
  }
  let active = scoped[0];
  for (const reservation of scoped.slice(1)) {
    if (reservation.startTime > active.startTime) {
      active = reservation;
    }
  }
  return active;
}
