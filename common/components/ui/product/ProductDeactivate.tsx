"use client"

import { toast } from "sonner";
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
import { ShieldMinus } from "lucide-react";
import { deactivateProduct } from "@/lib/server-actions";

export default function ProductDeactivate({ id }: { id: string }) {
    const handleDeactivate= async (id: string) => {
    const product = await deactivateProduct(id);
    if (!product) toast.error("No se ha podido desactivar el producto");
    else toast.success("Se ha desactivado el producto")
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ShieldMinus className="size-6 md:size-5 opacity-50 hover:cursor-pointer hover:opacity-100" />
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <ShieldMinus />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Desactivar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            El producto se desactivará y no se mostrará a los clienttes
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Volver atrás</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => handleDeactivate(id)}>
            Desactivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
