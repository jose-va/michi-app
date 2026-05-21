"use client";

import { Badge } from "@/shadcn/components/badge";
import HourSkeleton from "../../skeletons/HourSkeleton";

export default function HourPreview({
  hours,
  isPending,
  onHourSelect
}: {
  hours: string[];
  isPending: boolean;
  onHourSelect: (hour: string) => void;
}) {
  if (isPending) return <HourSkeleton />;

  if (hours.length === 0)
    return (
      <p className="mt-3 text-sm text-red-400">No hay horas disponibles</p>
    );

  return (
    <div className="mt-3 grid grid-cols-5 place-items-center gap-3">
      {hours.map((hour) => (
        <Badge
          key={hour}
          className="hover:scale-110 hover:cursor-pointer hover:brightness-120"
          onClick={() => onHourSelect(hour)}
        >
          {hour}
        </Badge>
      ))}
    </div>
  );
}
