"use client"

import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { activateProduct } from "@/lib/server-actions";

export default function ProductActivate({ id }: { id: string }) {
    const handleActivate= async (id: string) => {
    const product = await activateProduct(id);
    if (!product) toast.error("No se ha podido activar el producto");
    else toast.success("¡Se ha activado el producto!")
  }

  return <ShieldCheck className="size-6 md:size-5 opacity-50 hover:cursor-pointer hover:opacity-100 text-green-400" onClick={() => handleActivate(id)}/>
}
