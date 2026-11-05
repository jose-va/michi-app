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
import type { ReactNode } from "react";
import { useState } from "react";

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
  // Modal: con modal=true Radix monta DismissableLayer con
  // disableOutsidePointerEvents (body { pointer-events: none } inline) y
  // recupera overlay con blur + focus trap originales. El toast de sonner
  // vive fuera del diálogo, así que hereda el none: la regla
  // [data-sonner-toaster]{pointer-events:auto;} en globals.css (hijo
  // explícito gana a la herencia) re-activa el clic, y la exención de
  // onInteractOutside con preventDefault mantiene el panel abierto.
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen} modal={true}>
      <SheetTrigger asChild>
        <button>
          <ProfileAvatar user={user} />
        </button>
      </SheetTrigger>
      <SheetContent
        className="max-h-screen overflow-hidden"
        onInteractOutside={(event) => {
          const target = event.target as HTMLElement | null;
          if (
            target?.closest?.(
              "[data-sonner-toast], [data-sonner-toaster]",
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <SheetHeader className="shrink-0 pb-2">
          <SheetTitle className="mb-2">
            {user.role === "ROLE_USER"
              ? "¡Bienvenido!"
              : "Panel de administrador"}
          </SheetTitle>
          <ProfileHeader user={user} />
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {profileTabs}
        </div>
        <SheetFooter className="shrink-0">
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
