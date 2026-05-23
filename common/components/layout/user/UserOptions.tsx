"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "../../provider/UserProvider";
import { SideSheet } from "./SideSheet";

export default function UserOptions() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
  const user = useUser();

  if (user) {
    return (
      <div className="ml-auto flex justify-center gap-4">
        <SideSheet user={user}/>  
      </div>
    );
  }

  return (
    <Link
      href={`${authUrl}`}
      className="flex gap-2 rounded-lg bg-white/90 px-2.5 py-1.5 text-sm font-semibold text-black duration-300 hover:scale-105 hover:bg-white"
    >
      <Image src="/icons/google.svg" alt="Google" width={16} height={16} />
      <span className="hidden sm:block">Continuar con Google</span>
    </Link>
  );
}
