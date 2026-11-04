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

/**
 * Compone la URL de WhatsApp para cancelar con menos de 2 horas
 * (`Hola, quiero cancelar mi reserva del <fecha> a las <hora>. ¿Pueden ayudarme?`).
 * Sin fecha usa el mensaje genérico; sin hora omite el tramo `a las ...`.
 */
export function buildCancelWhatsappUrl(
  fecha: string,
  startTime: unknown,
): string {
  const fechaLimpia = typeof fecha === "string" ? fecha.trim() : "";
  if (!fechaLimpia) {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola, necesito cancelar una reserva con menos de 2 horas de antelación. ¿Pueden ayudarme?")}`;
  }
  const hora = typeof startTime === "string" ? startTime.trim() : "";
  const mensaje = hora
    ? `Hola, quiero cancelar mi reserva del ${fechaLimpia} a las ${hora}. ¿Pueden ayudarme?`
    : `Hola, quiero cancelar mi reserva del ${fechaLimpia}. ¿Pueden ayudarme?`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Compone la URL de WhatsApp para modificar con menos de 2 horas
 * (`Hola, quiero modificar mi reserva del <fecha> a las <hora>. ¿Pueden ayudarme?`).
 * Sin fecha usa el mensaje genérico; sin hora omite el tramo `a las ...`.
 */
export function buildEditWhatsappUrl(fecha: string, startTime: unknown): string {
  const fechaLimpia = typeof fecha === "string" ? fecha.trim() : "";
  if (!fechaLimpia) {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola, necesito modificar una reserva con menos de 2 horas de antelación. ¿Pueden ayudarme?")}`;
  }
  const hora = typeof startTime === "string" ? startTime.trim() : "";
  const mensaje = hora
    ? `Hola, quiero modificar mi reserva del ${fechaLimpia} a las ${hora}. ¿Pueden ayudarme?`
    : `Hola, quiero modificar mi reserva del ${fechaLimpia}. ¿Pueden ayudarme?`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
}
