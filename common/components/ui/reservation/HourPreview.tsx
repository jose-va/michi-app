"use client";

import { Badge } from "@/shadcn/components/badge";

export default function HourPreview({
  hours,
  selectedHour,
  selectHour,
}: {
  hours: string[];
  selectedHour: string;
  selectHour: (hour: string) => void;
}) {
  return (
    <div className="mt-3 grid grid-cols-5 place-items-center gap-3">
      {hours.map((hour) => {
        return (
          <Badge
            key={hour}
            className={`animate-fade-in-up hover:scale-110 hover:cursor-pointer ${
              selectedHour === hour
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            }`}
            onClick={() => selectHour(hour)}
          >
            {hour}
          </Badge>
        );
      })}
    </div>
  );
}
