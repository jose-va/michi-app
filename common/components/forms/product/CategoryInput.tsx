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

export default function CategoryInput({ field }: { field: any }) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Categorías" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categorías</SelectLabel>
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
