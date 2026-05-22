"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/tabs";
import { Hours } from "@/common/types/hour.types";
import HourPreview from "./HourPreview";
import { ReservationFormValues } from "@/common/types/reservation-form.types";
import { UseFormReturn } from "react-hook-form";
import { MessageSquareWarning } from "lucide-react";

export default function AvailabilityTab({
  form,
  hours,
}: {
  form: UseFormReturn<ReservationFormValues>;
  hours: Hours;
}) {
  const handleHour = (hour: string, location: "INSIDE" | "OUTSIDE") => {
    form.setValue("startTime", hour);
    form.setValue("location", location);
  };

  return (
    <Tabs defaultValue="inside">
      <TabsList variant="line">
        <TabsTrigger value="inside">Interior</TabsTrigger>
        <TabsTrigger value="outside">Terraza</TabsTrigger>
      </TabsList>
      <TabsContent value="inside">
        {hours.insideHours.length > 0 ? (
          <HourPreview
            hours={hours.insideHours}
            selectedHour={form.watch("startTime")}
            selectHour={(hour) => handleHour(hour, "INSIDE")}
          />
        ) : (
          <span className="text-red-400 flex gap-2 mt-1">No hay horas disponibles<MessageSquareWarning className="size-4"/></span>
        )}
      </TabsContent>
      <TabsContent value="outside">
        {hours.outsideHours.length > 0? (
          <HourPreview
            hours={hours.outsideHours}
            selectedHour={form.watch("startTime")}
            selectHour={(hour) => handleHour(hour, "OUTSIDE")}
          />
        ) : (
          <span className="text-red-400 flex gap-2 mt-1">No hay horas disponibles<MessageSquareWarning className="size-4"/></span>
        )}
      </TabsContent>
    </Tabs>
  );
}
