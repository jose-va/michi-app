// Contexto seguro exigido para suscribirse y recibir avisos (RNF-7).
// Lógica pura fuera de la UI (constitución, punto 3): el navegador solo
// permite notificaciones push en contexto seguro (HTTPS de la web); en
// desarrollo se admite localhost sin HTTPS, que el propio navegador ya
// trata como seguro pero se deja explícito para no bloquear el alta.
// Sin contexto seguro el control muestra «Avisos no soportados» (RF-26)
// y la web sigue operativa (RF-27).

export type SecurePushContextInput = {
  isSecureContext: boolean;
  hostname: string;
};

// Bucle local admitido sin HTTPS (localhost de desarrollo).
export function isLoopbackHostname(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

// Dice si el entorno permite suscribirse a avisos push: contexto seguro
// o bucle local de desarrollo. `hostname` vacío no es bucle local.
export function isSecurePushContext(input: SecurePushContextInput): boolean {
  if (isLoopbackHostname(input.hostname)) return true;
  return input.isSecureContext === true;
}
