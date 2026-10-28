"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/form";
import { Separator } from "@/shadcn/components/separator";
import { Badge } from "@/shadcn/components/badge";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import ReservationCalendar from "../../ui/reservation/ReservationCalendar";
import { ReservationFormValues } from "@/common/types/reservation-form.types";
import GuestCount from "./GuestCount";

export default function DateForm({
  form,
}: {
  form: UseFormReturn<ReservationFormValues>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-4">
              <FormLabel>Fecha de reserva:</FormLabel>
              <Badge
                className={cn(
                  "animate-fade-in-up text-black capitalize duration-500",
                  field.value.toDateString() === new Date().toDateString()
                    ? "bg-green-500"
                    : "bg-blue-500"
                )}
              >
                {field.value.toLocaleDateString("es-ES", { weekday: "long" })}
              </Badge>
            </div>
            <FormControl>
              <ReservationCalendar
                selectedValue={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <FormField
        control={form.control}
        name="guests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuántos comensales?</FormLabel>
            <FormDescription className="max-w-80 font-light">
              Seleccione el número de personas que van a asistir a la reserva
            </FormDescription>
            <FormControl>
              <GuestCount field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

