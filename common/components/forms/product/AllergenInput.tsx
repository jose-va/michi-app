"use client";

import Image from "next/image";
import { allergens, getAllergenTitle, getAllergenIcon } from "@/common/mappers/allergen.mapper";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/components/toggle-group";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shadcn/components/collapsible";
import { ChevronDown } from "lucide-react";

export default function AllergenInput({ field }: { field: any }) {
  return (
    <Collapsible className="w-full rounded-md">
      <CollapsibleTrigger className="filter-input w-40 justify-between mb-1">
        <span>Alérgenos</span>
        <ChevronDown className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-lg border border-white/10 bg-[#161b1d]">
        <ToggleGroup
          type="multiple"
          value={field.value ?? []}
          onValueChange={field.onChange}
          className="flex p-3"
          spacing={4}
        >
          <div className="grid grid-cols-5 gap-5">
            {allergens.map((allergen) => (
              <ToggleGroupItem
                key={allergen}
                value={allergen}
                className="flex h-auto w-full flex-col items-center data-[state=on]:bg-[#006a63]/20 p-2"
              >
                <Image
                  src={getAllergenIcon(allergen)}
                  alt={getAllergenTitle(allergen)}
                  width={24}
                  height={24}
                />
                <span className="text-xs text-center">{getAllergenTitle(allergen)}</span>
              </ToggleGroupItem>
            ))}
          </div>
        </ToggleGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}