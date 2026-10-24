import type { Reservation } from "@/common/types/reservation.types";
import type { User } from "@/common/types/user.types";
import { getTodayKey } from "@/common/utils/profile-day";
import { Badge } from "@/shadcn/components/badge";
import { Separator } from "@/shadcn/components/separator";
import { SheetClose } from "@/shadcn/components/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/tabs";
import { ReservationService } from "@/service/ReservationService";
import { CalendarCheck2, Shrimp } from "lucide-react";
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
          <Badge variant="outline">{reservation.location === "OUTSIDE" ? "Terraza" : "Interior"}</Badge>
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
    </div>
  );
}

export default async function AdminProfileTabs({ user }: { user: User }) {
  const reservations = await ReservationService.getReservations(
    getTodayKey(new Date(), "Europe/Madrid"),
    user.role,
  );

  return (
    <Tabs defaultValue="reservas-hoy" className="flex min-w-0 flex-col">
      <TabsList variant="line">
        <TabsTrigger value="reservas-hoy">Reservas</TabsTrigger>
        <TabsTrigger value="opciones">Opciones</TabsTrigger>
      </TabsList>
      <TabsContent value="reservas-hoy">
        {reservations === null ? (
          <p>No se ha podido cargar la información</p>
        ) : reservations.length === 0 ? (
          <p>Todavía no hay reservas</p>
        ) : (
          <ul className="flex min-w-0 flex-col gap-4">
            {reservations.map((reservation, index) => (
              <Fragment
                key={`${reservation.date}-${reservation.startTime}-${reservation.name}-${index.toString()}`}
              >
                {index > 0 ? <Separator /> : null}
                <li>
                  <TodayReservationDetail reservation={reservation} />
                </li>
              </Fragment>
            ))}
          </ul>
        )}
      </TabsContent>
      <TabsContent value="opciones">
        <nav className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:scale-101">
            <CalendarCheck2 className="size-4" />
            <SheetClose asChild>
              <Link href="/reservation/preview">Reservas</Link>
            </SheetClose>
          </div>

          <Separator />

          <div className="flex items-center gap-2 text-zinc-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:scale-101">
            <Shrimp className="size-4" />
            <SheetClose asChild>
              <Link href="/product/create">Crear producto</Link>
            </SheetClose>
          </div>

          <Separator />
        </nav>
      </TabsContent>
    </Tabs>
  );
}
