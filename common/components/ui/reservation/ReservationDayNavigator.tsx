"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { es } from "react-day-picker/locale";
import { CalendarSearch } from "lucide-react";

import { Calendar } from "@/shadcn/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn/components/popover";
import {
  dateKeyToDate,
  dateToDateKey,
  isPastKey,
  isSundayKey,
  nextOpenKey,
  prevOpenKey,
  shiftDateKey,
} from "@/common/utils/reservation-day";

export default function ReservationDayNavigator({
  date,
  today,
  label,
}: {
  date: string;
  today: string;
  label: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const previous = prevOpenKey(date);
  const next = nextOpenKey(date);
  const maxDate = shiftDateKey(today, 30);
  const isPreviousBlocked = previous === date || isPastKey(previous, today);
  const isNextBlocked =
    next === date || isPastKey(next, today) || next > maxDate;
  const controlClass =
    "inline-flex min-h-[44px] min-w-[44px] w-auto items-center justify-center gap-1 whitespace-nowrap px-3 text-sm sm:text-base";
  const blockedClass = `${controlClass} opacity-50`;

  function closeAndRefocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
    <h1 className="mb-2 wrap-break-word text-xl font-bold text-white">RESERVAS</h1>
      <h1 className="mb-4 wrap-break-word text-md font-light text-white">{label}</h1>
      <nav
        aria-label="Navegación por día"
        className="black-glassmorphism flex flex-row items-center justify-between gap-2 rounded-lg px-2 py-2 mb-4"
      >
        {isPreviousBlocked ? (
          <span
            aria-disabled="true"
            aria-label="Día anterior"
            className={blockedClass}
          >
            <span aria-hidden="true" className="shrink-0">‹</span> Anterior
          </span>
        ) : (
          <Link
            href={`/reservation/preview?date=${previous}`}
            aria-label="Día anterior"
            className={controlClass}
          >
            <span aria-hidden="true" className="shrink-0">‹</span> Anterior
          </Link>
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
              <CalendarSearch aria-hidden="true" className="size-5 shrink-0" />
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
                  day.getDate()
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
                router.push(`/reservation/preview?date=${chosenKey}`);
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
            Siguiente <span aria-hidden="true" className="shrink-0">›</span>
          </span>
        ) : (
          <Link
            href={`/reservation/preview?date=${next}`}
            aria-label="Día siguiente"
            className={controlClass}
          >
            Siguiente <span aria-hidden="true" className="shrink-0">›</span>
          </Link>
        )}
      </nav>
    </>
  );
}
