"use client";

import { PackageCheck } from "lucide-react";
import { activateProducts } from "@/lib/server-actions";
import { toast } from "sonner";

export default function ActivateAllButton() {
  const handleActivate = async () => {
    const result = await activateProducts();
    if (!result) toast.error("No se han podido activar los productos");
    else toast.success("¡Se han activado todos los productos!");
  };

  return (
    <PackageCheck
      className="size-8 text-zinc-200 hover:scale-105 hover:cursor-pointer hover:text-white"
      onClick={handleActivate}
    />
  );
}
