import "server-only";

import { cache } from "react";
import type { Reservation } from "@/common/types/reservation.types";
import { autoFinishExpired } from "@/common/utils/reservation-day";
import { ReservationService } from "@/service/ReservationService";

export const getReservationsWithAutoCancel = cache(
  async (date: string): Promise<Reservation[] | null> => {
    const reservations = await ReservationService.getReservations(date);
    if (reservations === null) {
      return null;
    }
    const result = await autoFinishExpired(reservations, async (id) => {
      const finishResult = await ReservationService.finishReservation(id);
      return finishResult.ok;
    });
    if (result.failed > 0) {
      console.error(
        `auto-finish: ${result.finished}/${result.attempted} ok, ${result.failed} fallo`
      );
    }
    return result.reservations;
  }
);
