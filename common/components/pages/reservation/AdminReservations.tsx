import { ReservationService } from "@/service/ReservationService";
import { format } from "date-fns";
import ReservationCard from "../../ui/reservation/ReservationCard";
import { User } from "@/common/types/user.types";
import { ReservationEmpty } from "../../ui/reservation/ReservationEmpty";
import { bodoni, montserrat } from "@/app/fonts/font";

export default async function AdminReservations({ user }: { user: User }) {
  const today = new Date();
  const date: string = format(today, "yyyy-MM-dd");
  const reservations = await ReservationService.getReservations(
    date,
    user.role
  );
  return (
    <section className="flex flex-col">
      <span
        className={`${montserrat.className} mx-auto flex text-3xl font-bold text-white/90 md:text-4xl`}
      >
        {today.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
        })}
      </span>
      {!reservations || reservations.length === 0 ? (
        <ReservationEmpty />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reservations?.map((reservation, index) => (
            <ReservationCard
              key={index}
              index={index}
              reservation={reservation}
            />
          ))}
        </div>
      )}
    </section>
  );
}
