"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { allergens, getAllergenTitle, getAllergenIcon } from "@/common/mappers/allergen.mapper";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/components/toggle-group";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shadcn/components/collapsible";
import { ChevronDown } from "lucide-react";

type AllergenPickerProps = {
  value: string[];
  onChange: (value: string[]) => void;
  panelClassName?: string;
  triggerClassName?: string;
  triggerLabel?: string;
  /** Permite envolver solo el botón (p. ej. con FormControl). */
  wrapTrigger?: (trigger: ReactElement) => ReactElement;
};

export default function AllergenPicker({
  value,
  onChange,
  panelClassName = "",
  triggerClassName = "filter-input max-w-50 justify-between gap-1",
  triggerLabel = "Alérgenos",
  wrapTrigger,
}: AllergenPickerProps) {
  const trigger = (
    <CollapsibleTrigger className={triggerClassName}>
      <span className="min-w-0 flex-1 truncate text-left">{triggerLabel}</span>
      <ChevronDown className="size-4 shrink-0" />
    </CollapsibleTrigger>
  );

  return (
    <Collapsible className="w-full rounded-md">
      {wrapTrigger ? wrapTrigger(trigger) : trigger}

      <CollapsibleContent
        className={`rounded-lg border border-white/15 bg-[#161b1d] p-3 ${panelClassName}`}
      >
        <ToggleGroup
          type="multiple"
          value={value}
          onValueChange={onChange}
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
