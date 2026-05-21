"use client"

import { uberSync } from "@/lib/server-actions";
import Image from "next/image";
import { toast } from "sonner";

export default function UberSync() {
    const handleUber= async () => {
        const response= await uberSync();
        if (response) toast.success("Se han sincronizado todos los productos");
        else toast.error("No se han podido sincronizar los productos")
    }
  
    return (
    <Image
      src="/logo_uber.webp"
      alt="logo_uber"
      width={35}
      height={15}
      className="hover:animate-bounce hover:cursor-pointer hover:brightness-120"
      onClick={handleUber}
    />
  );
}
