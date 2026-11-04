"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import AllergenPicker from "@/common/components/layout/product/AllergenPicker";

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
    <AllergenPicker
      value={selected}
      onChange={handleChange}
      triggerLabel="Alérgenos"
      panelClassName="absolute inset-x-3 top-full z-50 mt-2 sm:inset-x-auto sm:left-1/2 sm:w-120 sm:-translate-x-1/2"
    />
  );
}
