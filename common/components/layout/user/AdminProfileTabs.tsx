import type { Reservation } from "@/common/types/reservation.types";
import type { User } from "@/common/types/user.types";
import { ReservationCancel } from "@/common/components/ui/reservation/ReservationCancel";
import PushSettings from "@/common/components/admin/PushSettings";
import { buildTelHref } from "@/common/utils/phone-tel";
import { getTodayKey } from "@/common/utils/profile-day";
import {
  formatDayLabel,
  sortReservationsByTimeAndName,
} from "@/common/utils/reservation-day";
import { Separator } from "@/shadcn/components/separator";
import { Button } from "@/shadcn/components/button";
import { SheetClose } from "@/shadcn/components/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/tabs";
import { getReservationsWithAutoCancel } from "@/lib/admin-reservations";
import { CalendarDays, Soup } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

function TodayReservationDetail({ reservation }: { reservation: Reservation }) {
  return (
    <div className="flex flex-col gap-1">
      <SheetClose asChild>
        <Link
          href={`/reservation/preview?date=${reservation.date}`}
          className="flex cursor-pointer flex-col gap-1"
        >
          <p>
            <span className="text-michi-aqua font-semibold">Cliente:</span>{" "}
            {reservation.name}
          </p>

          <p>
            <span className="text-michi-aqua font-semibold">Hora:</span>{" "}
            {reservation.startTime}
          </p>
          <p>
            <span className="text-michi-aqua font-semibold">Mesa:</span>{" "}
            {reservation.guests} personas
            {reservation.location ? (
              <>
                {" "}
                • {reservation.location === "OUTSIDE" ? "Terraza" : "Interior"}
              </>
            ) : null}
          </p>
          {reservation.observations?.trim() ? (
            <p>
              <span className="text-michi-aqua font-semibold">
                Alergias:
              </span>{" "}
              {reservation.observations}
            </p>
          ) : null}
        </Link>
      </SheetClose>
      {reservation.id && reservation.state !== "CANCELLED" ? (
        <div className="mt-1 flex w-fit items-center gap-2">
          <ReservationCancel
            id={reservation.id}
            name={reservation.name}
            date={reservation.date}
            startTime={reservation.startTime}
            trigger="text"
          />
          <Button variant="outline" size="sm" asChild>
            <a href={buildTelHref(reservation.phone)}>Contactar</a>
          </Button>
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
  const timeLabel = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(new Date());
  const reservations = await getReservationsWithAutoCancel(todayKey);
  const active = (reservations ?? []).filter((r) => r.state !== "CANCELLED");
  const ordered = sortReservationsByTimeAndName(active);
  const visible = ordered.slice(0, 3);

  return (
    <Tabs defaultValue="reservas-hoy" className="flex min-w-0 flex-col">
      <p className="mb-2 text-sm text-white/80">
        {formatDayLabel(todayKey)} · {timeLabel}
      </p>
      <TabsList variant="line">
        <TabsTrigger value="reservas-hoy">Reservas</TabsTrigger>
        <TabsTrigger value="opciones">Opciones</TabsTrigger>
      </TabsList>
      <TabsContent value="reservas-hoy">
        {reservations === null ? (
          <p className="text-michi-aqua mt-4">No hay ninguna reserva</p>
        ) : active.length === 0 ? (
          <p className="text-michi-aqua mt-4">
            Todavía no se han realizado reservas
          </p>
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
            <Separator />
            {active.length > 3 ? (
              <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:scale-101 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
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
          <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:scale-101 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <CalendarDays className="size-4" />
            <SheetClose asChild>
              <Link href="/reservation/preview">Todas las reservas</Link>
            </SheetClose>
          </div>

          <Separator />

          <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:scale-101 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Soup className="size-4" />
            <SheetClose asChild>
              <Link href="/product/create">Crear un producto</Link>
            </SheetClose>
          </div>

          <Separator />

          <PushSettings userRole={user.role} />
        </nav>
      </TabsContent>
    </Tabs>
  );
}
