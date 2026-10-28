import { Hours } from "@/common/types/hour.types";
import { Reservation } from "@/common/types/reservation.types";
import { extractCancelConflictMessage } from "@/common/utils/cancel-error";
import { normalizeUserKey } from "@/common/utils/profile-reservations";
import { cookies } from "next/headers";
import { UserService } from "./UserService";

export type CancelReservationResult =
  | { ok: true }
  | { ok: false; status: 403 | 404 | 409 | 500; message?: string };

export type CreateReservationResult =
  | { ok: true; reservation: Reservation }
  | {
      ok: false;
      error: "ALREADY_EXISTS" | "NO_TABLES" | "INVALID_TIME" | "UNKNOWN";
    };

const ADMIN_ROLE = "ROLE_ADMIN";

export class ReservationService {
  private static baseUrl = process.env.BACKEND_URL;

  static async getReservations(date: string): Promise<Reservation[] | null> {
    const profile = await UserService.getProfile();
    if (profile?.role !== ADMIN_ROLE) return null;

    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/reservations?date=${encodeURIComponent(date)}`,
        {
          headers: {
            Cookie: `token=${token}`,
            "User-Role": ADMIN_ROLE,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Estado ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      return null;
    }
  }

  static async getMyReservations(date?: string): Promise<Reservation[] | null> {
    const profile = await UserService.getProfile();
    const userKey = normalizeUserKey(profile?.id);
    if (!userKey) return null;

    const token = (await cookies()).get("token")?.value;
    const query = date ? `?date=${encodeURIComponent(date)}` : "";

    try {
      const response = await fetch(
        `${this.baseUrl}/reservations/preview${query}`,
        {
          headers: {
            "User-Id": userKey,
            ...(token ? { Cookie: `token=${token}` } : {}),
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Estado ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      return null;
    }
  }

  static async getAvailableHours(date: string, guests: string): Promise<Hours> {
    try {
      const params = new URLSearchParams({ date, guests });
      const response = await fetch(
        `${this.baseUrl}/reservations/hours?${params}`,
        { method: "GET", cache: "no-store" }
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

  static async cancelReservation(
    id: string,
    token?: string
  ): Promise<CancelReservationResult> {
    if (!id) {
      return { ok: false, status: 404 };
    }
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("token")?.value;

    // Solo se consulta el perfil si hay sesión; el rol se verifica aquí, en el servidor.
    const profile = sessionToken ? await UserService.getProfile() : null;
    const isAdmin = profile?.role === ADMIN_ROLE;

    const query =
      token && token.length > 0 ? `?token=${encodeURIComponent(token)}` : "";
    try {
      const response = await fetch(
        `${this.baseUrl}/reservations/${encodeURIComponent(id)}${query}`,
        {
          method: "DELETE",
          headers: {
            ...(sessionToken ? { Cookie: `token=${sessionToken}` } : {}),
            ...(isAdmin ? { "User-Role": ADMIN_ROLE } : {}),
          },
        }
      );

      if (response.ok) {
        return { ok: true };
      }
      if (response.status === 403 || response.status === 404) {
        return { ok: false, status: response.status };
      }
      if (response.status === 409) {
        const body = await response.text().catch(() => "");
        const message = extractCancelConflictMessage(body);
        return {
          ok: false,
          status: 409,
          ...(message ? { message } : {}),
        };
      }
      return { ok: false, status: 500 };
    } catch {
      console.error("No se ha podido cancelar la reserva");
      return { ok: false, status: 500 };
    }
  }

  static async createReservation(
    payload: Reservation
  ): Promise<CreateReservationResult> {
    const token = (await cookies()).get("token")?.value;

    try {
      const response = await fetch(`${this.baseUrl}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(payload.user ? { "User-Id": payload.user } : {}),
          ...(token ? { Cookie: `token=${token}` } : {}),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (response.ok) {
        return { ok: true, reservation: await response.json() };
      }

      const body = await response.text().catch(() => "");

      if (response.status === 409) {
        if (body.includes("RESERVATION_ALREADY_EXISTS"))
          return { ok: false, error: "ALREADY_EXISTS" };
        if (body.includes("NO_TABLES_AVAILABLE"))
          return { ok: false, error: "NO_TABLES" };
      }
      if (response.status === 400 && body.includes("INVALID_TIME"))
        return { ok: false, error: "INVALID_TIME" };

      return { ok: false, error: "UNKNOWN" };
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      return { ok: false, error: "UNKNOWN" };
    }
  }
}
