import { Hours } from "@/common/types/hour.types";
import { Reservation } from "@/common/types/reservation.types";

export class ReservationService {
  private static baseUrl = process.env.BACKEND_URL;

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
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  }
}
