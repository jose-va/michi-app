"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "../../provider/UserProvider";
import { SideSheet } from "./SideSheet";
import { User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/shadcn/components/sheet";
import type { ReactNode } from "react";

export default function ProfileAuth({
  profileTabs,
}: {
  profileTabs: ReactNode;
}) {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "#";
  const user = useUser();

  if (user) {
    return (
      <div className="ml-auto flex justify-center gap-4">
        <SideSheet user={user} profileTabs={profileTabs} />
      </div>
    );
  }

  return (
    <div className="ml-auto flex justify-center gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <button
            aria-label="Abrir panel de usuario"
            className="group -mr-2 flex size-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <User className="size-6 text-white/90 transition-colors duration-300 group-hover:text-white lg:size-7" />
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>¡Te damos la bienvenida!</SheetTitle>
            <SheetDescription className="mt-1 text-balance">
              Accede a tu cuenta para consultar tus reservas.
            </SheetDescription>
          </SheetHeader>

          <div className="px-6">
            <Link
              href={authUrl}
              className="flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#1f1f1f] shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] transition-all duration-200 hover:bg-[#f8fafd] hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none active:bg-[#e8eaed]"
            >
              <Image
                src="/icons/google.svg"
                alt=""
                width={20}
                height={20}
                className="shrink-0"
              />
              <span>Continuar con Google</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
