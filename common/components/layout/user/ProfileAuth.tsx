"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "../../provider/UserProvider";
import { SideSheet } from "./SideSheet";
import { UserRound } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/components/sheet";
import type { ReactNode } from "react";

export default function ProfileAuth({
  profileTabs,
}: {
  profileTabs: ReactNode;
}) {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
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
            className="flex size-8 items-center justify-center rounded-full bg-white/90 text-black duration-300 hover:scale-110 hover:cursor-pointer hover:bg-white"
          >
            <UserRound className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>No has iniciado sesión</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <Link
              href={`${authUrl}`}
              className="flex items-center justify-center gap-3 rounded-full bg-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-800 duration-300 hover:bg-neutral-300"
            >
              <Image
                src="/icons/google.svg"
                alt=""
                width={20}
                height={20}
              />
              Continuar con Google
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
