"use client";

import { Utensils } from "lucide-react";
import { activateProducts } from "@/lib/server-actions";
import { toast } from "sonner";

export default function ActivateAllButton() {
  const handleActivate = async () => {
    const result = await activateProducts();
    if (!result) toast.error("No se han podido activar los productos");
    else toast.success("¡Se han activado todos los productos!");
  };

  return (
    <Utensils
      className="size-7.5 text-white hover:scale-105 hover:cursor-pointer hover:text-white hover:animate-bounce"
      onClick={handleActivate}
    />
  );
}
 