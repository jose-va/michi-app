"use client";

import { deleteProduct } from "@/lib/server-actions";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ProductDelete({ id }: { id: string }) {

  const handleDelete= async (id: string) => {
    const product = await deleteProduct(id);
    if (!product) toast.error("No se ha podido eliminar el producto");
    else toast.success("Se ha eliminado el producto")
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 className="size-4 opacity-50 hover:cursor-pointer hover:text-red-500" />
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            El producto se eliminará permanente y no se mostrará en la carta de la página.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => handleDelete(id)}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
