import "server-only";

import { cache } from "react";
import type { Reservation } from "@/common/types/reservation.types";
import { autoCancelNoShows } from "@/common/utils/reservation-day";
import { ReservationService } from "@/service/ReservationService";

export const getReservationsWithAutoCancel = cache(
  async (date: string): Promise<Reservation[] | null> => {
    const reservations = await ReservationService.getReservations(date);
    if (reservations === null) {
      return null;
    }
    const result = await autoCancelNoShows(reservations, async (id) => {
      const cancelResult = await ReservationService.cancelReservation(id);
      return cancelResult.ok;
    });
    if (result.failed > 0) {
      console.error(
        `auto-cancel no-show: ${result.cancelled}/${result.attempted} ok, ${result.failed} fallo`
      );
    }
    return result.reservations;
  }
);
