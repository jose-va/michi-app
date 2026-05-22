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
    <Collapsible className="w-full rounded-md ">
      <CollapsibleTrigger className="filter-input max-w-50 justify-between gap-1">
        <span>Alérgenos</span>
        <ChevronDown className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="absolute z-10 rounded-lg border border-white/10 bg-[#161b1d] p-2">
        <ToggleGroup
          type="multiple"
          value={selected}
          onValueChange={handleChange}
          className="flex flex-wrap"
          spacing={4}
        >
          <div className="grid grid-cols-5 gap-1 px-4">
            {allergens.map((allergen) => (
              <ToggleGroupItem
                key={allergen}
                value={allergen}
                className="flex h-16 w-21 flex-col items-center gap-1 data-[state=on]:bg-[#006a63]/20"
              >
                <Image
                  src={getAllergenIcon(allergen)}
                  alt={getAllergenTitle(allergen)}
                  width={25}
                  height={25}
                />
                <span className="text-xs">{getAllergenTitle(allergen)}</span>
              </ToggleGroupItem>
            ))}
          </div>
        </ToggleGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}