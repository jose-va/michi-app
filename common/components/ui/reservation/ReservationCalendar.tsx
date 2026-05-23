"use client";
import { Calendar } from "@/shadcn/components/calendar";
import { Badge } from "@/shadcn/components/badge";
import { cn } from "@/lib/utils";

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
    <div className="flex gap-4">
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
  className={cn(
    "text-black capitalize animate-fade-in-up duration-500",
    isToday ? "bg-green-500" : "bg-blue-500"
  )}
>
        {selectedValue.toLocaleDateString("es-ES", {
          weekday: "long",
        })}
      </Badge>
    </div>
  );
}
