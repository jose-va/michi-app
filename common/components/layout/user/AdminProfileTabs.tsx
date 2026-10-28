import type { Reservation } from "@/common/types/reservation.types";
import type { User } from "@/common/types/user.types";
import { ReservationCancel } from "@/common/components/ui/reservation/ReservationCancel";
import { getTodayKey } from "@/common/utils/profile-day";
import { formatDayLabel, sortReservationsByTimeAndName } from "@/common/utils/reservation-day";
import { Separator } from "@/shadcn/components/separator";
import { SheetClose } from "@/shadcn/components/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/tabs";
import { ReservationService } from "@/service/ReservationService";
import { CalendarDays, Soup } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

function TodayReservationDetail({
  reservation,
}: {
  reservation: Reservation;
}) {
  return (
    <div className="flex flex-col gap-1">
       <p>
        <span className="font-semibold text-primary brightness-150">Cliente:</span> {reservation.name}
      </p>

      <p>
        <span className="font-semibold text-primary brightness-150">Hora:</span> {reservation.startTime}
      </p>
      <p>
        <span className="font-semibold text-primary brightness-150">Comensales:</span> {reservation.guests}
      </p>
      {reservation.location ? (
        <p>
          <span className="font-semibold text-primary brightness-150">Ubicación:</span>{" "}
          {reservation.location === "OUTSIDE" ? "Terraza" : "Interior"}
        </p>
      ) : null}
      <p>
        <span className="font-semibold text-primary brightness-150">Teléfono:</span> {reservation.phone}
      </p>
      {reservation.observations ? (
        <p>
          <span className="font-semibold text-primary brightness-150">Observaciones:</span>{" "}
          {reservation.observations}
        </p>
      ) : null}
      {reservation.id && reservation.state !== "CANCELLED" ? (
        <div className="mt-1 w-fit">
          <ReservationCancel
            id={reservation.id}
            name={reservation.name}
            trigger="text"
          />
        </div>
      ) : null}
    </div>
  );
}

function TodayReservationRow({
  reservation,
  index,
}: {
  reservation: Reservation;
  index: number;
}) {
  return (
    <Fragment>
      {index > 0 ? <Separator /> : null}
      <li>
        <TodayReservationDetail reservation={reservation} />
      </li>
    </Fragment>
  );
}

export default async function AdminProfileTabs({ user }: { user: User }) {
  const todayKey = getTodayKey(new Date(), "Europe/Madrid");
  const reservations = await ReservationService.getReservations(todayKey);
  const active = (reservations ?? []).filter((r) => r.state !== "CANCELLED");
  const ordered = sortReservationsByTimeAndName(active);
  const visible = ordered.slice(0, 3);

  return (
    <Tabs defaultValue="reservas-hoy" className="flex min-w-0 flex-col">
      <p className="mb-2 text-sm text-white/80">{formatDayLabel(todayKey)}</p>
      <TabsList variant="line">
        <TabsTrigger value="reservas-hoy">Reservas</TabsTrigger>
        <TabsTrigger value="opciones">Opciones</TabsTrigger>
      </TabsList>
      <TabsContent value="reservas-hoy">
        {reservations === null ? (
          <p className="mt-4 text-primary brightness-150">No hay ninguna reserva</p>
        ) : active.length === 0 ? (
          <p className="mt-4 text-primary brightness-150">Todavía no se han realizado reservas</p>
        ) : (
          <div className="mt-4 flex min-w-0 flex-col gap-4">
            <ul className="flex min-w-0 flex-col gap-4">
              {visible.map((reservation, index) => (
                <TodayReservationRow
                  key={`${reservation.date}-${reservation.startTime}-${reservation.name}-${index.toString()}`}
                  reservation={reservation}
                  index={index}
                />
              ))}
            </ul>
            <Separator/>
            {active.length > 3 ? (
              <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:scale-101">
                <CalendarDays className="size-4" />
                <SheetClose asChild>
                  <Link href="/reservation/preview">
                    Mostrar {active.length - visible.length} reservas más
                  </Link>
                </SheetClose>
              </div>
            ) : null}
          </div>
        )}
      </TabsContent>
      <TabsContent value="opciones">
        <nav className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:scale-101">
            <CalendarDays className="size-4" />
            <SheetClose asChild>
              <Link href="/reservation/preview">Todas las reservas</Link>
            </SheetClose>
          </div>

          <Separator />

          <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:scale-101">
            <Soup className="size-4" />
            <SheetClose asChild>
              <Link href="/product/create">Crear un producto</Link>
            </SheetClose>
          </div>

          <Separator />
        </nav>
      </TabsContent>
    </Tabs>
  );
}
