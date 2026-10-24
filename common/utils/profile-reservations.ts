import type { Reservation } from "../types/reservation.types";

export function selectActiveReservation(
  reservations: Reservation[],
  userId: string,
): Reservation | null {
  if (userId === "") {
    return null;
  }
  const mine = reservations.filter(
    (reservation) =>
      reservation.user !== "" && reservation.user === userId,
  );
  if (mine.length === 0) {
    return null;
  }
  let active = mine[0];
  for (const reservation of mine.slice(1)) {
    if (reservation.startTime > active.startTime) {
      active = reservation;
    }
  }
  return active;
}
