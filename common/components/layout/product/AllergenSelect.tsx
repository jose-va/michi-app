"use client";

import Image from "next/image";
import { allergens, getAllergenTitle, getAllergenIcon } from "@/common/mappers/allergen.mapper";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/components/toggle-group";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shadcn/components/collapsible";
import { ChevronDown } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function AllergenSelect() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selected = searchParams.getAll("allergens");

  const handleChange = (selected: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.delete("allergens");
    selected.forEach((a) => params.append("allergens", a));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Collapsible className="w-full rounded-md">
      <CollapsibleTrigger className="filter-input max-w-50 justify-between gap-1">
        <span>Alérgenos</span>
        <ChevronDown className="size-4" />
      </CollapsibleTrigger>

      <CollapsibleContent className="absolute inset-x-3 top-full z-50 mt-2 rounded-lg border border-white/15 bg-[#161b1d] p-3 sm:inset-x-auto sm:left-1/2 sm:w-120 sm:-translate-x-1/2">
        <ToggleGroup
          type="multiple"
          value={selected}
          onValueChange={handleChange}
          className="w-full"
          spacing={4}
        >
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
            {allergens.map((allergen) => (
              <ToggleGroupItem
                key={allergen}
                value={allergen}
                className="flex h-auto min-h-12 w-full min-w-0 flex-row items-center justify-start gap-2 rounded-md border border-white/4 px-3 py-2 text-left whitespace-normal data-[state=on]:border-white/30"
              >
                <Image
                  src={getAllergenIcon(allergen)}
                  alt=""
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <span className="text-xs font-light leading-tight">
                  {getAllergenTitle(allergen)}
                </span>
              </ToggleGroupItem>
            ))}
          </div>
        </ToggleGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}
