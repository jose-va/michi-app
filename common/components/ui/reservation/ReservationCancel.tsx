"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cancelReservation } from "@/lib/server-actions";
import { getCancelErrorMessage } from "@/common/utils/cancel-error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/components/alert-dialog";

export function ReservationCancel({
  id,
  name,
  trigger = "icon",
  token,
  onCancelled,
  triggerButtonClassName = "absolute top-4 right-4",
  triggerIconClassName = "size-5 text-destructive transition-all duration-200 group-hover:scale-110 group-hover:text-red-300 group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.7)] hover:cursor-pointer hover:text-red-400",
}: {
  id: string;
  name: string;
  trigger?: "icon" | "text";
  token?: string | null;
  onCancelled?: () => void;
  triggerButtonClassName?: string;
  triggerIconClassName?: string;
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    try {
      const result = await cancelReservation(id, token ?? undefined);
      if (result.ok) {
        toast.success("Reserva cancelada");
        onCancelled?.();
        router.refresh();
      } else toast.error(getCancelErrorMessage(result));
    } catch {
      toast.error("Error inesperado, inténtalo de nuevo");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger === "text" ? (
          <button
            type="button"
            disabled={isCancelling}
            aria-label={`Cancelar reserva de ${name}`}
            title="Cancelar reserva"
            className="inline-flex h-5 w-fit items-center justify-center rounded-4xl border border-destructive/30 px-2 text-xs font-medium text-destructive hover:bg-red-900 hover:text-zinc-300"
          >
            Cancelar reserva
          </button>
        ) : (
          <button
            type="button"
            disabled={isCancelling}
            aria-label={`Cancelar reserva de ${name}`}
            title="Cancelar reserva"
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm p-1 transition-colors duration-200 group hover:bg-destructive/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${triggerButtonClassName}`}
          >
            <Trash2 className={triggerIconClassName} />
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 ">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
          <AlertDialogDescription>
            Se cancelará la reserva de {name}. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Volver</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleCancel}>
            Cancelar reserva
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
