"use client";

import { categories, getCategoryTitle } from "@/common/mappers/category.mapper";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/select";

export default function CategoryInput({
  field,
}: {
  field: { value?: string; onChange: (value: string) => void };
}) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-full max-w-56">
        <SelectValue placeholder="Seleccionar subcategoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Seleccionar subcategoría</SelectLabel>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {getCategoryTitle(category)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
