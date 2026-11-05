/**
 * Lee el `token` de sesión de la cabecera `Cookie` de la petición entrante.
 * Las rutas proxy push lo reenvían al backend como `Cookie: token=...`
 * (patrón ReservationService); nunca se registra ni se expone.
 */
export function readPushToken(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const match = /(?:^|;\s*)token=([^;]*)/.exec(cookie);
  if (!match) return null;
  const raw = match[1].trim();
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
