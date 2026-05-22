"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "../provider/UserProvider";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/avatar";
import { Button } from "@/shadcn/components/button";
import { logout } from "@/lib/server-actions";
import { Swords } from "lucide-react";

export default function UserMenu() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
  const user = useUser();

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  if (user) {

    return (
      <div className="ml-auto flex justify-center gap-4">
        <Button variant="outline" onClick={handleLogout}>
          Cerrar sesión
        </Button>
        <Avatar className="hover:scale-110 hover:cursor-pointer">
          <AvatarImage src={user.picture} alt="michi-user" />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          {user.role === "ROLE_USER" ? (
            <AvatarBadge className="animate-bounce bg-green-600" />
          ) : (
            <AvatarBadge className="bg-transparent 10! ring-transparent size-4! text-yellow-500">
              <Swords className="size-4!"/>
            </AvatarBadge>
          )}
        </Avatar>
      </div>
    );
  }

  return (
    <Link
      href={`${authUrl}`}
      className="ml-auto flex gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-semibold text-black duration-300 hover:scale-105 hover:bg-white"
    >
      <Image src="/icons/google.svg" alt="Google" width={16} height={16} />
      <span className="hidden sm:block">Continuar con Google</span>
    </Link>
  );
}
