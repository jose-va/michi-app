import { Hours } from "@/common/types/hour.types";
import { Reservation } from "@/common/types/reservation.types";

export class ReservationService {
  private static baseUrl = process.env.API_URL;
  private static header = { "Content-Type": "application/json" };

  static async getAvailableHours(date: string, guests: string): Promise<Hours> {
    const params = new URLSearchParams({ date, guests });
    const response = await fetch(
      `${this.baseUrl}/reservations/hours?${params}`,
      {
        method: "GET",
        headers: this.header,
      }
    );

    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
  }

  static async createReservation(payload: Reservation): Promise<Reservation> {
    const response = await fetch(`${this.baseUrl}/reservations`, {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  }
}
