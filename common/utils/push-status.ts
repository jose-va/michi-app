// Estado de avisos push de nueva reserva (RF-10, RF-26, RF-27, RNF-1).
// Lógica pura fuera de la UI (constitución, punto 3): decide el único
// estado verificable en español a partir del soporte del navegador, del
// permiso de notificaciones y de la suscripción vigente.
// - supported: el navegador y la plataforma soportan notificaciones y
//   push en contexto seguro; sin soporte nunca se ofrece activar (RF-26,
//   CL-8, CL-13).
// - permission: permiso de notificaciones del navegador; el denegado
//   temporal y el bloqueado permanente se muestran ambos como
//   «Avisos bloqueados» (RF-10, CL-5).
// - subscribed: hay suscripción push vigente; solo con permiso
//   concedido y suscripción se muestra «Avisos activados».
// El estado inicial es desconocido hasta comprobar soporte y permiso;
// denegar o bloquear el permiso no rompe la web ni lo vuelve a pedir
// salvo a petición explícita (RF-27).
export type PushUiStatus = "unknown" | "active" | "blocked" | "unsupported";

export function resolvePushStatus(input: {
  supported: boolean;
  permission: NotificationPermission;
  subscribed: boolean;
}): PushUiStatus {
  if (!input.supported) return "unsupported";
  if (input.permission === "denied") return "blocked";
  if (input.subscribed) return "active";
  return "unknown";
}

// Textos exactos en español (RNF-1): un único texto por estado conocido.
export const PUSH_STATUS_TEXT: Record<
  Exclude<PushUiStatus, "unknown">,
  string
> = {
  active: "Avisos activados",
  blocked: "Avisos bloqueados",
  unsupported: "Avisos no soportados",
};

export function pushStatusText(status: PushUiStatus): string | null {
  if (status === "unknown") return null;
  return PUSH_STATUS_TEXT[status];
}

// Puerta de administración (RF-8): el control «Activar avisos» solo es
// visible con sesión de administración; cualquier otro rol o la falta de
// sesión lo ocultan sin llamar al backend.
export function canShowPushSettings(
  role: string | null | undefined
): boolean {
  return role === "ROLE_ADMIN";
}
