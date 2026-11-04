"use client";

import { ProductFormProps } from "@/common/types/product-form.types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/form";
import { Input } from "@/shadcn/components/input";
import { Separator } from "@/shadcn/components/separator";
import { Textarea } from "@/shadcn/components/textarea";
import CategoryInput from "./CategoryInput";
import AllergenInput from "./AllergenInput";
import ProductPhotoInput from "./ProductPhotoInput";

export default function ProductForm({
  form,
  existingImageSrc,
  existingImageAlt,
  photoFile,
  photoError,
  onPhotoSelect,
  existingRemoved,
  onRemoveExisting,
  onRestoreExisting,
}: ProductFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <ProductPhotoInput
        existingSrc={existingImageSrc ?? null}
        existingAlt={existingImageAlt ?? "Fotografía del producto"}
        file={photoFile ?? null}
        error={photoError ?? null}
        onSelect={onPhotoSelect ?? (() => {})}
        existingRemoved={existingRemoved ?? false}
        onRemoveExisting={onRemoveExisting}
        onRestoreExisting={onRestoreExisting}
      />
      <Separator />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del producto</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Michi" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <FormField
        control={form.control}
        name="japaneseName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre japonés <span className="font-normal text-muted-foreground">(opcional)</span></FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} placeholder="道" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción <span className="font-normal text-muted-foreground">(opcional)</span></FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                placeholder="Introduzca una descripción"
                className="min-h-30"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />

      <FormField
        control={form.control}
        name="pieces"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Piezas <span className="font-normal text-muted-foreground">(opcional)</span></FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                step={1}
                placeholder="0"
                value={field.value || ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                }
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="0"
                value={field.value || ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseFloat(e.target.value) : 0
                  )
                }
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoría</FormLabel>
            <FormControl>
              <CategoryInput field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />

      <FormField
        control={form.control}
        name="allergens"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alérgenos</FormLabel>
            <AllergenInput field={field} />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
