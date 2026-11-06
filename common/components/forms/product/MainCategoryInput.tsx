"use client";

import {
  MAIN_CATEGORIES,
  getMainCategoryTitle,
} from "@/common/mappers/main-category.mapper";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/select";

export default function MainCategoryInput({
  field,
}: {
  field: { value?: string; onChange: (value: string) => void };
}) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-full max-w-56">
        <SelectValue placeholder="Seleccionar categoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Seleccionar categoría</SelectLabel>
          {MAIN_CATEGORIES.map((mainCategory) => (
            <SelectItem key={mainCategory} value={mainCategory}>
              {getMainCategoryTitle(mainCategory)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
