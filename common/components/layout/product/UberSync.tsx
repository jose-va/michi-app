"use client";

import { uberSync } from "@/lib/server-actions";
import { useUser } from "@/common/components/provider/UserProvider";
import { UBER_EATS_URL } from "@/common/utils/home-content";
import Image from "next/image";
import { toast } from "sonner";

export default function UberSync() {
  const user = useUser();
  const isAdmin = user?.role === "ROLE_ADMIN";

  if (!isAdmin) {
    return (
      <a
        href={UBER_EATS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pedir a domicilio en Uber Eats (se abre en una pestaña nueva)"
        className="ml-auto flex items-center"
      >
        <Image
          src="/logos/logo_uber.webp"
          alt="logo_uber"
          width={35}
          height={32}
          className="transition-transform duration-300 hover:cursor-pointer hover:brightness-120"
        />
      </a>
    );
  }

  const handleUber = async () => {
    const response = await uberSync();
    if (response) toast.success("Se han sincronizado todos los productos");
    else toast.error("No se han podido sincronizar los productos");
  };

  return (
    <button
      type="button"
      onClick={handleUber}
      aria-label="Sincronizar productos con Uber Eats"
      className="flex items-center bg-transparent p-0 hover:scale-105 hover:cursor-pointer hover:brightness-110"
    >
      <Image
        src="/logos/logo_uber.webp"
        alt="logo_uber"
        width={35}
        height={32}
      />
    </button>
  );
}
