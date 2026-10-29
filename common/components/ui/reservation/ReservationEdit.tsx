"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { SheetClose } from "@/shadcn/components/sheet";

// RF-11: el lápiz lleva a `/reservation/edit?id=<id>` con el id de la reserva
// como parámetro de consulta `id` (igual que los enlaces del perfil, que
// cierran la hoja con `SheetClose` + `Link`). Sin `id` se conserva el botón
// con `onEdit` como alternativa.
export function ReservationEdit({
  id,
  name,
  onEdit,
}: {
  id?: string;
  name: string;
  onEdit?: () => void;
}) {
  const className =
    "group inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm p-1 transition-colors duration-200 hover:bg-yellow-400/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
  const iconClassName =
    "size-4 text-yellow-600/70 transition-all duration-200 group-hover:scale-110 group-hover:text-yellow-500 group-hover:drop-shadow-[0_0_6px_rgba(202,138,4,0.4)] hover:cursor-pointer hover:text-yellow-500";

  if (id) {
    return (
      <SheetClose asChild>
        <Link
          href={`/reservation/edit?id=${encodeURIComponent(id)}`}
          aria-label={`Modificar reserva de ${name}`}
          title="Modificar reserva"
          className={className}
        >
          <Pencil className={iconClassName} />
        </Link>
      </SheetClose>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Modificar reserva de ${name}`}
      title="Modificar reserva"
      onClick={onEdit}
      className={className}
    >
      <Pencil className={iconClassName} />
    </button>
  );
}
