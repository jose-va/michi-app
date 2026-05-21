"use client";

import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/components/tabs";
import { Hours } from "@/common/types/hour.types";
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { getAvailableHours } from "@/lib/server-actions";
import HourPreview from "./HourPreview";
import { ReservationFormProps, ReservationFormValues } from "@/common/types/reservation-form.types";
import { UseFormReturn } from "react-hook-form";

export default function AvailabilityTab({form}: { form: UseFormReturn<ReservationFormValues> }) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? "";
  const guests = searchParams.get("guests") ?? "";

  const [hours, setHours] = useState<Hours>({
    insideHours: [],
    outsideHours: [],
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!date || !guests) return;

    startTransition(async () => {
      try {
        const data = await getAvailableHours(date, guests);
        setHours(data);

        if (data.insideHours.length === 0 && data.outsideHours.length === 0) {
          toast.warning(
            "No hay horas disponibles para esa fecha y número de comensales"
          );
        }
      } catch (error) {
        console.error("Se ha producido un error al obtener las horas: " + error);
      }
    });
  }, [date, guests]);



  return (
    <Tabs defaultValue="inside">
      <TabsList variant="line">
        <TabsTrigger value="inside">Interior</TabsTrigger>
        <TabsTrigger value="outside">Terraza</TabsTrigger>
      </TabsList>
      <TabsContent value="inside">
        <HourPreview hours={hours.insideHours} isPending={isPending} onHourSelect={(hour) => form.setValue("startTime", hour)} />
      </TabsContent>
      <TabsContent value="outside">
        <HourPreview hours={hours.outsideHours} isPending={isPending} onHourSelect={(hour) => form.setValue("startTime", hour)} />
      </TabsContent>
    </Tabs>
  );
}
