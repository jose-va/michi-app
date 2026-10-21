"use client";

import { Calendar } from "@/shadcn/components/calendar";
import { Badge } from "@/shadcn/components/badge";
import { cn } from "@/lib/utils";
import OpeningHours from "./OpeningHours";

export default function ReservationCalendar({
  selectedValue,
  onChange,
}: {
  selectedValue: Date;
  onChange: (date: Date) => void;
}) {
  const today = new Date();
  const isToday = selectedValue.toDateString() === today.toDateString();

  return (
    <div className="flex flex-wrap gap-4">
      <Calendar
        mode="single"
        selected={selectedValue}
        onSelect={(newDate) => {
          if (newDate) onChange(newDate);
        }}
        // Sin fechas pasadas y sin domingos (el local cierra)
        disabled={[{ before: today }, { dayOfWeek: [0] }]}
        className="mt-1 rounded-lg border"
      />

      <div className="mt-1 flex flex-col items-start gap-4">
        <Badge
          className={cn(
            "animate-fade-in-up text-black capitalize duration-500",
            isToday ? "bg-green-500" : "bg-blue-500"
          )}
        >
          {selectedValue.toLocaleDateString("es-ES", { weekday: "long" })}
        </Badge>

        <OpeningHours />
      </div>
    </div>
  );
}
