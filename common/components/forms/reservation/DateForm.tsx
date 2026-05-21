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
    <div className="flex flex-col gap-3">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de reserva</FormLabel>
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
            <FormDescription>
              Seleccione el número de comensales que van a asistir
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
