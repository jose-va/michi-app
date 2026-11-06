"use client";

import {
  MAIN_FILTER_OPTIONS,
  resolveCategoryFilter,
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
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { resetPageParam } from "@/common/utils/product-filters";

export const CategorySelect = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const rawCategory = searchParams.get("category");
  const resolved = resolveCategoryFilter(rawCategory ?? undefined);
  const currentCategory =
    resolved.kind === "all"
      ? "all"
      : resolved.kind === "featured"
        ? "featured"
        : resolved.kind === "main"
          ? resolved.main
          : (rawCategory ?? "");

  function handleCategory(value: string) {
    const params = resetPageParam(searchParams);
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
          {MAIN_FILTER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
