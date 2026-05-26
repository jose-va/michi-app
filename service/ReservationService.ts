import { Hours } from "@/common/types/hour.types";
import { Reservation } from "@/common/types/reservation.types";
import { cookies } from "next/headers";

export class ReservationService {
  private static baseUrl = process.env.BACKEND_URL;

  static async getReservations(
    date: string,
    role: string
  ): Promise<Reservation[] | null> {
    const cookieStore = await cookies();
    try {
      const response = await fetch(
        `${this.baseUrl}/reservations?date=${date}`,
        {
          method: "GET",
          headers: {
            Cookie: `token=${cookieStore.get("token")?.value}`,
            "User-Role": role ?? "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Se ha producido un error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("No se han encontrado reservas: " + error);
      return null;
    }
  }

  static async getAvailableHours(date: string, guests: string): Promise<Hours> {
    try {
      const params = new URLSearchParams({ date, guests });
      const response = await fetch(
        `${this.baseUrl}/reservations/hours?${params}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Se ha producido un error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error al obtener disponibilidad: ", error);
      return { insideHours: [], outsideHours: [] };
    }
  }

  static async createReservation(payload: Reservation): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  }
}
