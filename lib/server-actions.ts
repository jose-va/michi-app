"use server";

import { ReservationService } from "@/service/ReservationService";
import { Hours } from "@/common/types/hour.types";
import { Reservation } from "@/common/types/reservation.types";
import { ReservationFormValues } from "@/common/types/reservation-form.types";
import { format } from "date-fns";
import { ProductFormValues } from "@/common/types/product-form.types";
import { Product } from "@/common/types/product.types";
import { ProductService } from "@/service/ProductService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getAvailableHours(
  date: string,
  guests: string
): Promise<Hours | null> {
  try {
    const hours: Hours = await ReservationService.getAvailableHours(
      date,
      guests
    );
    return hours;
  } catch (error) {
    console.error("No se han podido obtener las horas disponibles: " + error);
    return null;
  }
}

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
    console.error("No se ha podido crear la reserva: " + error);
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
