/** Intervalo estándar completo del avance automático del carrusel de inicio. */
export const AUTOPLAY_INTERVAL_MS = 5000;

/** Consulta de medios del sistema para la preferencia de movimiento reducido. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Decide si el avance automático puede estar activo: exige más de una
 * fotografía cargable, sin puntero encima, sin foco dentro y sin
 * preferencia de movimiento reducido (prioritaria).
 */
export function shouldAutoplay(
  slideCount: number,
  hasPointer: boolean,
  hasFocus: boolean,
  prefersReducedMotion: boolean,
): boolean {
  return (
    slideCount > 1 &&
    !hasPointer &&
    !hasFocus &&
    !prefersReducedMotion
  );
}
