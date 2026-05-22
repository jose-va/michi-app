"use client";

import { ReservationFormValues } from "@/common/types/reservation-form.types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/form";
import { Input } from "@/shadcn/components/input";
import { Textarea } from "@/shadcn/components/textarea";
import { Separator } from "@/shadcn/components/separator";
import { UseFormReturn } from "react-hook-form";
import AvailabilityTab from "../../ui/reservation/AvailabilityTab";
import { Hours } from "@/common/types/hour.types";

export default function AvailabilityForm({ form, hours }: { form: UseFormReturn<ReservationFormValues>, hours: Hours }) {
  return (
    <div className="flex flex-col gap-3">
      <AvailabilityTab form={form} hours= {hours}/>
      <Separator />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="username" />
            </FormControl>
            <FormDescription>
              Este es el nombre al que irá asociada a su reserva
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de teléfono</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="tel" />
            </FormControl>
            <FormDescription>
              En caso de haber algún problema, le llamaremos
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Correo electrónico
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} autoComplete="email" />
            </FormControl>
            <FormDescription>
              Enviaremos un recordatorio a este correo electrónico
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <FormField
        control={form.control}
        name="observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Observaciones
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                className="min-h-30"
              />
            </FormControl>
            <FormMessage />
            <FormDescription>
              Puede incluir información adicional a su reserva
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}