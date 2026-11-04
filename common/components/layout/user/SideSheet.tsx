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
  // No modal: con modal=true Radix desactiva los pointer-events fuera del
  // diálogo (body { pointer-events: none }) y el clic en el toast de
  // WhatsApp (sonner, fuera del Sheet) nunca le llega; preventDefault solo
  // evitaba el cierre. Con modal={false} el primer clic sí abre wa.me y la
  // exención de onInteractOutside mantiene el panel abierto.
  // Radix no renderiza overlay en modo no modal, así que se mantiene uno
  // visual propio que no bloquea (pointer-events-none); el clic fuera sigue
  // cerrando vía DismissableLayer, igual que Escape y la X.
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      {open && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 bg-black/10 supports-backdrop-filter:backdrop-blur-xs"
        />
      )}
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
