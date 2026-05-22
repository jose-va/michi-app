import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  date: z.date(),
  guests: z.string().min(1, "Seleccione el número de comensales."),
  location: z.enum(["INSIDE", "OUTSIDE"]),
  startTime: z.string(),
  name: z.string().min(2, "Por favor, introduzca un nombre"),
  phone: z.string().min(9, "El número de teléfono introducido no es correcto"),
  email: z
    .email("El correo electrónico introducido no es correcto")
    .nullable()
    .or(z.literal("")),
  observations: z.string().nullable().or(z.literal("")),
  googleId: z.string().nullable().or(z.literal("")),
});

export type ReservationFormValues = z.infer<typeof formSchema>;

export type ReservationFormProps= {
  form: UseFormReturn<ReservationFormValues>;
}

