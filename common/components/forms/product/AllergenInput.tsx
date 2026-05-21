"use client";

import Image from "next/image";
import { allergens, getAllergenTitle, getAllergenIcon } from "@/common/mappers/allergen.mapper";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/components/toggle-group";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shadcn/components/collapsible";
import { ChevronDown } from "lucide-react";

export default function AllergenInput({ field }: { field: any }) {
  return (
    <Collapsible className="w-full rounded-md">
      <CollapsibleTrigger className="filter-input w-40 justify-between">
        <span>Alérgenos</span>
        <ChevronDown className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="z-50 rounded-lg border border-white/10 bg-[#161b1d] p-2">
        <ToggleGroup
          type="multiple"
          value={field.value ?? []}
          onValueChange={field.onChange}
          className="flex flex-wrap"
          spacing={4}
        >
          <div className="grid grid-cols-5 gap-2 px-3">
            {allergens.map((allergen) => (
              <ToggleGroupItem
                key={allergen}
                value={allergen}
                className="flex h-16 w-21 flex-col items-center gap-1 data-[state=on]:bg-[#006a63]/20"
              >
                <Image
                  src={getAllergenIcon(allergen)}
                  alt={getAllergenTitle(allergen)}
                  width={24}
                  height={24}
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