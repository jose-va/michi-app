"use client";

import { ProductFormProps } from "@/common/types/product-form.types";
import {
  FormControl,
  FormDescription,
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

export default function ProductForm({ form}: ProductFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Michi"/>
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
            <FormLabel>Nombre japonés (opcional)</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} placeholder="道"/>
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
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                placeholder="Introduzca una descripción sobre el producto"
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
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
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
        name="pieces"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Piezas</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                step={1}
                placeholder="0"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
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
              <CategoryInput field= {field}/>
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
            <FormControl>
              <AllergenInput field={field}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}