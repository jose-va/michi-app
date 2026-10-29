// Enlace de WhatsApp para cuando falla la creación de la reserva.
// Las horas que elige el usuario ya vienen del backend en formato `HH:mm`,
// así que aquí no se normaliza ni valida: solo se usa tal cual (con trim).

const WHATSAPP_PHONE = "34673821148";

/**
 * Compone la URL de WhatsApp con la plantilla aprobada
 * (`Hola, no he podido reservar para el <fecha> a las <hora>.`).
 * Solo si tras el trim no hay hora se omite el tramo `a las ...`.
 */
export function buildReservationWhatsappUrl(
  fecha: string,
  startTime: unknown,
): string {
  const hora = typeof startTime === "string" ? startTime.trim() : "";
  const mensaje = hora
    ? `Hola, no he podido reservar para el ${fecha} a las ${hora}.`
    : `Hola, no he podido reservar para el ${fecha}.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
}
