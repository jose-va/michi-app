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
  position: z.number().int().min(0).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  showPosition?: boolean;
  existingImageSrc?: string | null;
  existingImageAlt?: string;
  photoFile?: File | null;
  photoError?: string | null;
  onPhotoSelect?: (file: File | null) => void;
  existingRemoved?: boolean;
  onRemoveExisting?: () => void;
  onRestoreExisting?: () => void;
}