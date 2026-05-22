"use client";
import { Calendar } from "@/shadcn/components/calendar";
import { Badge } from "@/shadcn/components/badge";

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
    <div className="flex w-full justify-between">
      <Calendar
        mode="single"
        selected={selectedValue}
        onSelect={(newDate) => {
          if (newDate) onChange(newDate);
        }}
        disabled={{ before: today }}
        className="mt-1 rounded-lg border"
      />
      <Badge
        className={
          isToday
            ? "bg-green-500 text-black capitalize animate-fade-in-up duration-500"
            : "bg-blue-500 text-black capitalize animate-fade-in-up duration-500"
        }
      >
        {selectedValue.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </Badge>
    </div>
  );
}
