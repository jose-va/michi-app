"use client";

import AllergenPicker from "@/common/components/layout/product/AllergenPicker";
import { FormControl } from "@/shadcn/components/form";

export default function AllergenInput({
  field,
}: {
  field: { value?: string[]; onChange: (value: string[]) => void };
}) {
  return (
    <AllergenPicker
      value={field.value ?? []}
      onChange={field.onChange}
      triggerLabel="Seleccionar alérgenos"
      triggerClassName="filter-input w-full max-w-56 justify-between gap-1 whitespace-nowrap text-left"
      panelClassName="mt-2"
      wrapTrigger={(trigger) => <FormControl>{trigger}</FormControl>}
    />
  );
}
