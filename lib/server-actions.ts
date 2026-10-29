"use server";

import { Reservation } from "@/common/types/reservation.types";
import { ReservationFormValues } from "@/common/types/reservation-form.types";
import { format } from "date-fns";
import { normalizeUserKey } from "@/common/utils/profile-reservations";
import { ProductFormValues } from "@/common/types/product-form.types";
import { Product } from "@/common/types/product.types";
import { ProductService } from "@/service/ProductService";
import {
  buildProductImageFileName,
  validateProductImageFile,
} from "@/common/utils/product-image";
import { convertToWebpBuffer } from "@/lib/product-image-conversion";
import { unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { UserService } from "@/service/UserService";

import {
  CancelReservationResult,
  CreateReservationResult,
  GetReservationByIdResult,
  ReservationEditOverrides,
  ReservationService,
  UpdateReservationByIdResult,
} from "@/service/ReservationService";

export type GetReservationForEditResult =
  | { ok: true; reservation: Reservation }
  | {
      ok: false;
      kind: "NOT_FOUND" | "FORBIDDEN" | "NETWORK" | "UNAUTHENTICATED";
    };

export type UpdateReservationResult = UpdateReservationByIdResult;

export type ReservationEditActionOverrides = ReservationEditOverrides & {
  revalidate?: (path: string) => void;
};

function hasSessionOverride(overrides?: ReservationEditOverrides): boolean {
  return (
    !!overrides &&
    ("token" in overrides ||
      "userId" in overrides ||
      "userRole" in overrides)
  );
}

export async function createReservation(
  data: Omit<ReservationFormValues, "user">
): Promise<CreateReservationResult> {
  const profile = await UserService.getProfile(); 

  const guests = Number(data.guests);
  if (!Number.isInteger(guests) || guests < 1) {
    return { ok: false, error: "UNKNOWN" };
  }

  try {
    const result = await ReservationService.createReservation({
      ...data,
      user: normalizeUserKey(profile?.id), // "" para invitados
      date: format(data.date, "yyyy-MM-dd"),
      guests,
    });
    if (result.ok) revalidatePath("/reservation");
    return result;
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function cancelReservation(
  id: string,
  token?: string
): Promise<CancelReservationResult> {
  if (!id) {
    return { ok: false, status: 404 };
  }

  const result = await ReservationService.cancelReservation(id, token);
  if (result.ok) {
    revalidatePath("/");
    revalidatePath("/reservation");
    revalidatePath("/reservation/preview");
  }
  return result;
}

export async function getReservationForEdit(
  id: string,
  overrides?: ReservationEditActionOverrides,
): Promise<GetReservationForEditResult> {
  if (!id || id.trim().length === 0) {
    return { ok: false, kind: "NOT_FOUND" };
  }
  try {
    if (!hasSessionOverride(overrides)) {
      const profile = await UserService.getProfile();
      if (!profile) {
        return { ok: false, kind: "UNAUTHENTICATED" };
      }
    }
    const result: GetReservationByIdResult =
      await ReservationService.getReservationById(id, overrides);
    return result;
  } catch (error) {
    console.error("Error al obtener la reserva para editar:", error);
    return { ok: false, kind: "NETWORK" };
  }
}

export async function updateReservation(
  id: string,
  payload: Reservation,
  overrides?: ReservationEditActionOverrides,
): Promise<UpdateReservationResult> {
  if (!id || id.trim().length === 0) {
    return { ok: false, status: 404, code: null, backendMessage: null };
  }
  try {
    if (!hasSessionOverride(overrides)) {
      const profile = await UserService.getProfile();
      if (!profile) {
        return { ok: false, status: 403, code: null, backendMessage: null };
      }
    }
    const result = await ReservationService.updateReservationById(
      id,
      payload,
      overrides,
    );
    if (result.ok) {
      const revalidate = overrides?.revalidate ?? revalidatePath;
      revalidate("/");
      revalidate("/reservation");
    }
    return result;
  } catch (error) {
    console.error("Error al modificar la reserva:", error);
    return { ok: false, status: 500, code: null, backendMessage: null };
  }
}

export async function getMyReservationsByDay(
  date: string
): Promise<Reservation[] | null> {
  try {
    return await ReservationService.getMyReservations(date);
  } catch (error) {
    console.error("Error al obtener las reservas del día:", error);
    return null;
  }
}

export async function createProduct(
  data: ProductFormValues
): Promise<Product | null> {
  try {
    const product = await ProductService.create(data);
    revalidatePath("/product");
    return product;
  } catch (error) {
    console.error("No se ha podido crear el producto: " + error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  data: ProductFormValues
): Promise<Product | null> {
  try {
    const payload = {
      id: id,
      ...data,
    };
    const product = await ProductService.update(id, payload);

    revalidatePath("/product");
    return product;
  } catch (error) {
    console.error("No se ha podido actualizar el producto: " + error);
    return null;
  }
}

export async function uploadProductImage(formData: FormData): Promise<boolean> {
  try {
    const name = formData.get("name");
    const photo = formData.get("photo");
    if (typeof name !== "string" || !(photo instanceof File)) return false;

    const validation = validateProductImageFile(photo.name, photo.size);
    if (!validation.ok) return false;

    const fileName = buildProductImageFileName(name);
    const webp = await convertToWebpBuffer(
      Buffer.from(await photo.arrayBuffer()),
      photo.name
    );
    await writeFile(join(process.cwd(), "public", "images", fileName), webp);
    revalidatePath("/product");
    return true;
  } catch (error) {
    console.error("No se ha podido guardar la imagen del producto: " + error);
    return false;
  }
}

export async function deleteProductImage(name: string): Promise<boolean> {
  try {
    const fileName = buildProductImageFileName(name);
    await unlink(join(process.cwd(), "public", "images", fileName));
    revalidatePath("/product");
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
      revalidatePath("/product");
      return true;
    }
    console.error("No se ha podido eliminar la imagen del producto: " + error);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await ProductService.delete(id);
    revalidatePath("/product");
    return true;
  } catch (error) {
    console.error("No se ha podido eliminar el producto: " + error);
    return false;
  }
}

export async function deactivateProduct(id: string): Promise<boolean> {
  try {
    await ProductService.deactivate(id);
    revalidatePath("/product");
    return true;
  } catch (error) {
    console.error("No se ha podido desactivarr el producto: " + error);
    return false;
  }
}

export async function activateProducts(): Promise<boolean> {
  try {
    await ProductService.activateAll();
    revalidatePath("/product");
    return true;
  } catch (error) {
    console.error("No se han podido activar los productos: " + error);
    return false;
  }
}

export async function activateProduct(id: string): Promise<boolean> {
  try {
    await ProductService.activate(id);
    revalidatePath("/product");
    return true;
  } catch (error) {
    console.error("No se han podido activar el producto: " + error);
    return false;
  }
}

export async function uberSync(): Promise<boolean> {
  try {
    await ProductService.sync();
    revalidatePath("/product");
    return true;
  } catch (error) {
    console.error("No se ha podido sincronizar con Uber Eats: " + error);
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("token");
    revalidatePath("/");
  } catch (error) {
    console.error("No se ha podido cerrar la sesión correctamente " + error);
  }
}

export async function markFavorite(
  user: string,
  product: string
): Promise<void> {
  try {
    await UserService.markFavorite(user, product);
    revalidatePath("/product");
  } catch (error) {
    console.error("No se ha podido marcar como favorito" + error);
  }
}

export async function unmarkFavorite(
  user: string,
  product: string
): Promise<void> {
  try {
    await UserService.unmarkFavorite(user, product);
    revalidatePath("/product");
  } catch (error) {
    console.error("No se ha podido desmarcar como favorito" + error);
  }
}
