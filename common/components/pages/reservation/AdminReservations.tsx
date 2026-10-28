import { ReservationService } from "@/service/ReservationService";
import ReservationShiftTabs from "../../ui/reservation/ReservationShiftTabs";
import {
  groupReservationsByShift,
  sortReservationsByTimeAndName,
} from "@/common/utils/reservation-day";

export default async function AdminReservations({ date }: { date: string }) {
  const reservations = await ReservationService.getReservations(date);
  if (reservations === null) {
    return (
      <section className="flex flex-col">
        <p
          role="alert"
          className="black-glassmorphism my-5 w-full border border-destructive/60 px-4 py-6 text-destructive"
        >
          No se han podido cargar las reservas de este día. Inténtalo de nuevo
          más tarde.
        </p>
      </section>
    );
  }
  const ordered = sortReservationsByTimeAndName(reservations);
  const groups = groupReservationsByShift(ordered);
  return (
    <section className="flex flex-col gap-6">
      <ReservationShiftTabs lunch={groups.lunch} dinner={groups.dinner} />
    </section>
  );
}
