"use client";

import * as React from "react";
import { es } from "react-day-picker/locale";
import { CalendarSearch } from "lucide-react";

import type { Reservation } from "@/common/types/reservation.types";
import {
  dateKeyToDate,
  dateToDateKey,
  formatDayLabel,
  groupReservationsByShift,
  isPastKey,
  isSundayKey,
  nextOpenKey,
  prevOpenKey,
  shiftDateKey,
  sortReservationsByTimeAndName,
} from "@/common/utils/reservation-day";
import { getMyReservationsByDay } from "@/lib/server-actions";
import { ReservationCancel } from "@/common/components/ui/reservation/ReservationCancel";
import { Badge } from "@/shadcn/components/badge";
import { Calendar } from "@/shadcn/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn/components/popover";

function UserReservationDetail({
  reservation,
  onCancelled,
}: {
  reservation: Reservation;
  onCancelled: (id: string) => void;
}) {
  return (
    <div className="relative flex min-w-0 flex-col gap-1 pr-12">
      <p>
        <span className="font-medium">Hora:</span> <span className="font-extralight">{reservation.startTime}</span> 
      </p>
      <p>
        <span className="font-medium">Comensales:</span> <span className="font-extralight">{reservation.guests}</span> 
      </p>
      <p>
        <span className="font-medium">Nombre:</span> <span className="font-extralight">{reservation.name}</span> 
      </p>
      <p>
        <span className="font-medium">Teléfono:</span> <span className="font-extralight">{reservation.phone}</span> 
      </p>
      {reservation.observations ? (
        <p>
          <span className="font-medium">Observaciones:</span>{" "}
          <span className="font-extralight">{reservation.observations}</span> 
        </p>
      ) : null}
      {reservation.location ? (
        <p>
          <span className="font-medium">Ubicación:</span>{" "}
          <Badge>
            {reservation.location === "OUTSIDE" ? "Terraza" : "Interior"}
          </Badge>
        </p>
      ) : null}
      {reservation.id && reservation.state !== "CANCELLED" ? (
        <ReservationCancel
          id={reservation.id}
          name={reservation.name}
          token={reservation.cancelToken ?? undefined}
          onCancelled={() => onCancelled(reservation.id as string)}
        />
      ) : null}
    </div>
  );
}

export default function UserReservationsByDay({
  today,
  initialDate,
  initialReservations,
}: {
  today: string;
  initialDate: string;
  initialReservations: Reservation[] | null;
}) {
  const [date, setDate] = React.useState(initialDate);
  const [reservations, setReservations] = React.useState<
    Reservation[] | null
  >(initialReservations);
  const [isPending, setIsPending] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const maxDate = shiftDateKey(today, 30);
  const previous = prevOpenKey(date);
  const next = nextOpenKey(date);
  const isPreviousBlocked =
    previous === date || isPastKey(previous, today);
  const isNextBlocked =
    next === date || isPastKey(next, today) || next > maxDate;
  const controlClass =
    "inline-flex min-h-[44px] min-w-[44px] w-auto items-center justify-center gap-1 whitespace-nowrap px-2 text-xs";
  const blockedClass = `${controlClass} opacity-50`;

  function closeAndRefocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  async function loadDay(nextDate: string) {
    if (nextDate === date || isPending) {
      return;
    }
    setDate(nextDate);
    setIsPending(true);
    try {
      const data = await getMyReservationsByDay(nextDate);
      setReservations(data);
    } catch {
      setReservations(null);
    } finally {
      setIsPending(false);
    }
  }

  function handleCancelled(cancelledId: string) {
    setReservations((prev) =>
      prev ? prev.filter((r) => r.id !== cancelledId) : prev,
    );
  }

  const active =
    reservations === null
      ? null
      : reservations.filter((r) => r.state !== "CANCELLED");
  const ordered =
    active === null ? null : sortReservationsByTimeAndName(active);
  const groups =
    ordered === null ? null : groupReservationsByShift(ordered);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p aria-live="polite" className="text-sm text-white/80">
        {formatDayLabel(date)}
      </p>
      <nav
        aria-label="Navegación por día"
        className="flex min-w-0 flex-row items-center justify-between gap-1 rounded-lg border border-white/10 bg-black/40 px-1 py-1"
      >
        {isPreviousBlocked ? (
          <span
            aria-disabled="true"
            aria-label="Día anterior"
            className={blockedClass}
          >
            <span aria-hidden="true" className="shrink-0">
              ‹
            </span>{" "}
            Anterior
          </span>
        ) : (
          <button
            type="button"
            aria-label="Día anterior"
            className={controlClass}
            disabled={isPending}
            onClick={() => void loadDay(previous)}
          >
            <span aria-hidden="true" className="shrink-0">
              ‹
            </span>{" "}
            Anterior
          </button>
        )}
        <div aria-hidden="true" className="my-2 w-px self-stretch bg-white/15" />
        <Popover
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
              triggerRef.current?.focus();
            }
          }}
        >
          <PopoverTrigger asChild>
            <button
              ref={triggerRef}
              type="button"
              aria-label="Elegir fecha"
              className={controlClass}
            >
              <CalendarSearch aria-hidden="true" className="size-4 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto border border-white/10 bg-[#090B0C]! p-2 text-white shadow-xl backdrop-blur-none"
            onEscapeKeyDown={closeAndRefocus}
          >
            <Calendar
              mode="single"
              selected={dateKeyToDate(date)}
              onSelect={(day) => {
                if (!day) {
                  return;
                }
                const chosenKey = dateToDateKey(
                  day.getFullYear(),
                  day.getMonth() + 1,
                  day.getDate(),
                );
                if (chosenKey === date) {
                  closeAndRefocus();
                  return;
                }
                if (
                  isPastKey(chosenKey, today) ||
                  isSundayKey(chosenKey) ||
                  chosenKey > maxDate
                ) {
                  return;
                }
                closeAndRefocus();
                void loadDay(chosenKey);
              }}
              disabled={[
                { before: dateKeyToDate(today) },
                { after: dateKeyToDate(maxDate) },
                { dayOfWeek: [0] },
              ]}
              locale={es}
              weekStartsOn={1}
              className="bg-[#090B0C] in-data-[slot=popover-content]:bg-[#090B0C] [&_[data-selected-single=true]]:bg-teal-600 [&_[data-selected-single=true]]:text-white"
            />
          </PopoverContent>
        </Popover>
        <div aria-hidden="true" className="my-2 w-px self-stretch bg-white/15" />
        {isNextBlocked ? (
          <span
            aria-disabled="true"
            aria-label="Día siguiente"
            className={blockedClass}
          >
            Siguiente{" "}
            <span aria-hidden="true" className="shrink-0">
              ›
            </span>
          </span>
        ) : (
          <button
            type="button"
            aria-label="Día siguiente"
            className={controlClass}
            disabled={isPending}
            onClick={() => void loadDay(next)}
          >
            Siguiente{" "}
            <span aria-hidden="true" className="shrink-0">
              ›
            </span>
          </button>
        )}
      </nav>
      <div aria-live="polite" className="flex min-w-0 flex-col gap-3">
        {isPending ? <p>Cargando…</p> : null}
        {!isPending && reservations === null ? (
          <p className="text-primary brightness-150">No tienes ninguna reserva</p>
        ) : null}
        {!isPending && ordered !== null && ordered.length === 0 ? (
          <p className="text-primary brightness-150">No has reservado para este día</p>
        ) : null}
        {!isPending && groups !== null && ordered !== null && ordered.length > 0 ? (
          <>
            {groups.lunch.length > 0 ? (
              <section aria-label="Comida" className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-primary brightness-150">Comida</h3>
                <ul className="flex min-w-0 flex-col gap-3">
                  {groups.lunch.map((reservation, index) => (
                    <li
                      key={`${reservation.date}-${reservation.startTime}-${reservation.name}-${index.toString()}`}
                    >
                      <UserReservationDetail reservation={reservation} onCancelled={handleCancelled} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {groups.dinner.length > 0 ? (
              <section aria-label="Cena" className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-primary brightness-150">Cena</h3>
                <ul className="flex min-w-0 flex-col gap-3">
                  {groups.dinner.map((reservation, index) => (
                    <li
                      key={`${reservation.date}-${reservation.startTime}-${reservation.name}-${index.toString()}`}
                    >
                      <UserReservationDetail reservation={reservation} onCancelled={handleCancelled} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
