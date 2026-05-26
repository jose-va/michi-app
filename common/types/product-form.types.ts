import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Introduzca un nombre para el producto"),
  japaneseName: z.string(),
  description: z.string(),
  price: z.number().positive("El precio debe ser mayor que 0"),
  category: z.string().min(1, "Por favor, seleccione una categoría"),
  allergens: z.array(z.string()),
  pieces: z.number().int().min(0),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
}