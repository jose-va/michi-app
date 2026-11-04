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
import { Checkbox } from "@/shadcn/components/checkbox";
import { Label } from "@/shadcn/components/label";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import AvailabilityTab from "../../ui/reservation/AvailabilityTab";
import { Hours } from "@/common/types/hour.types";

export default function AvailabilityForm({ form, hours }: { form: UseFormReturn<ReservationFormValues>, hours: Hours }) {
  const [hasAllergy, setHasAllergy] = useState(
    () => Boolean(form.getValues("observations")),
  );

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
              <span className="text-sm font-normal text-muted-foreground">
                (opcional)
              </span>
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} autoComplete="email" />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <div className="flex items-start gap-3">
        <Checkbox
          className="mt-0.5"
          id="has-allergy"
          checked={hasAllergy}
          onCheckedChange={(checked) => {
            const value = checked === true;
            setHasAllergy(value);
            if (!value) form.setValue("observations", "");
          }}
        />
        <Label htmlFor="has-allergy" className="leading-relaxed">
          ¿Algún comensal tiene alergias o intolerancias alimentarias?
        </Label>
      </div>
      {hasAllergy && (
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">
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
                Por favor, especifique el tipo de alergia o intolerancia para avisar a cocina.
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}