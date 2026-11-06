export type CancelFailure = {
  ok: false;
  status: 403 | 404 | 409 | 500;
  message?: string;
};

export function getCancelErrorMessage(result: CancelFailure): string {
  if (result.status === 403) return "El enlace de cancelación no es válido";
  if (result.status === 404) return "No encontramos su reserva";
  if (result.status === 409) {
    return result.message && result.message.length > 0
      ? result.message
      : "No se ha podido cancelar su reserva, contáctenos por WhatsApp";
  }
  return "Error inesperado, inténtalo de nuevo por favor";
}

/**
 * Extrae el mensaje legible de un 409 de cancelación.
 * El backend Spring devuelve el JSON de error por defecto
 * (`timestamp`/`status`/`error`/`message`/`path`); la UI solo debe
 * mostrar `message`. Devuelve null si no hay mensaje aprovechable.
 */
export function extractCancelConflictMessage(body: string): string | null {
  if (!body) return null;
  const trimmed = body.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{")) {
    try {
      const data = JSON.parse(trimmed) as { message?: unknown };
      if (typeof data.message === "string" && data.message.trim().length > 0) {
        return data.message.trim();
      }
      return null;
    } catch {
      return null;
    }
  }
  if (trimmed.startsWith("<")) return null;
  return trimmed;
}
