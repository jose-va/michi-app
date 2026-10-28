"use client";

import { Calendar } from "@/shadcn/components/calendar";
import OpeningHours from "./OpeningHours";

export default function ReservationCalendar({
  selectedValue,
  onChange,
}: {
  selectedValue: Date;
  onChange: (date: Date) => void;
}) {
  const today = new Date();

  return (
    <div className="flex flex-wrap gap-4 mt-2">
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
        <OpeningHours />
      </div>
    </div>
  );
}
