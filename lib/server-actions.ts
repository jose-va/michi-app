"use server";

import { ReservationService } from "@/service/ReservationService";
import { Reservation } from "@/common/types/reservation.types";
import { ReservationFormValues } from "@/common/types/reservation-form.types";
import { format } from "date-fns";
import { ProductFormValues } from "@/common/types/product-form.types";
import { Product } from "@/common/types/product.types";
import { ProductService } from "@/service/ProductService";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createReservation(
  data: ReservationFormValues
): Promise<Reservation | null> {
  try {
    const payload: Reservation = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
      guests: parseInt(data.guests),
    };
 
    const reservation = await ReservationService.createReservation(payload);
    revalidatePath("/reservation");
    return reservation;
  } catch (error) {
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
    const payload= {
      id: id,
      ...data
    }
    const product = await ProductService.update(id, payload);
    
    revalidatePath("/product");
    return product;
  } catch (error) {
    console.error("No se ha podido actualizar el producto: " + error);
    return null;
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
