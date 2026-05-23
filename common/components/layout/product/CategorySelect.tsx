"use client";

import { getCategoryTitle } from "@/common/mappers/category.mapper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/select";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { categories } from "@/common/mappers/category.mapper";

export const CategorySelect = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentCategory = searchParams.get("category") ?? "";

  function handleCategory(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete("category");
    else params.set("category", value);

    router.replace(`${pathname}?${params.toString()}`);
  }
  return (
    <Select value={currentCategory} onValueChange={handleCategory}>
      <SelectTrigger className="filter-input w-full max-w-50">
        <SelectValue placeholder="Categorías" />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4} className="max-h-80">
        <SelectGroup >
          <SelectLabel>Categorías</SelectLabel>
          <SelectItem value="all">Todas</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {getCategoryTitle(category)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
