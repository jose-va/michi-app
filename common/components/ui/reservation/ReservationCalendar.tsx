"use client";

import { es } from "react-day-picker/locale";
import { Calendar } from "@/shadcn/components/calendar";

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
        locale={es}
        weekStartsOn={1}
        className="mt-1 rounded-lg border [&_button[data-selected-single=true]]:bg-green-600 [&_button[data-selected-single=true]]:text-white"
      />
    </div>
  );
}
