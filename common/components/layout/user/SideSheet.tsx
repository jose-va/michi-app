"use client";

import { Button } from "@/shadcn/components/button";
import { logout } from "@/lib/server-actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/components/sheet";
import ProfileAvatar from "./ProfileAvatar";
import { User } from "@/common/types/user.types";
import AdminMenu from "./AdminMenu";
import UserMenu from "./UserMenu";

export function SideSheet({ user }: { user: User }) {
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
          <SheetTitle>
            {user.role === "ROLE_USER"
              ? `Bienvenido, ${user.name}`
              : "Panel de administrador"}
          </SheetTitle>
          <div>{user.role === "ROLE_USER" ? <UserMenu /> : <AdminMenu />}</div>
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
