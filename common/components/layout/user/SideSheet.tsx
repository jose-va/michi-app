"use client";

import { Button } from "@/shadcn/components/button";
import { logout } from "@/lib/server-actions";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/components/sheet";
import ProfileAvatar from "./ProfileAvatar";
import ProfileHeader from "./ProfileHeader";
import { User } from "@/common/types/user.types";
import UserMenu from "./UserMenu";
import type { ReactNode } from "react";

export function SideSheet({
  user,
  profileTabs,
}: {
  user: User;
  profileTabs: ReactNode;
}) {
  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button>
          <ProfileAvatar user={user} />
        </button>
      </SheetTrigger>
      <SheetContent className="max-h-screen">
        <SheetHeader>
          <SheetTitle className="mb-2">
            {user.role === "ROLE_USER"
              ? "¡Bienvenido!"
              : "Panel de administrador"}
          </SheetTitle>
          <ProfileHeader user={user} />
          {profileTabs}
          {user.role === "ROLE_USER" ? (<div><UserMenu /></div>) : null}
        </SheetHeader>
        <SheetFooter>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
