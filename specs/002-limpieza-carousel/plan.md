# Plan 002 — Limpieza del carrusel de inicio

## Alcance
Simplificar el autoplay de `HomeCarousel` a un intervalo estándar fijo de 5 s gobernado por `setInterval` + API Embla, eliminando la retención de tiempo restante fraccional y el avance manual programático. Conserva sin cambios galería, contenido, secciones y horario (RF-10, RF-11).

## Archivos y responsabilidades

| Archivo | Responsabilidad | RF |
|---|---|---|
| `common/components/ui/HomeCarousel.tsx` (modificar) | Único dueño del autoplay: `setInterval` 5 s + `api.scrollNext()`; pausa por puntero y foco-dentro; reanudación conjunta con intervalo completo; `matchMedia` movimiento reducido prioritario; parada en 1/0; fallo de imagen no reinicia intervalo; sincronía `select` → `api.selectedScrollSnap()` | RF-1…RF-9, RF-12 |
| `common/utils/home-carousel-controller.ts` (eliminar) | Desaparece: contenía `remainingDelay`, `deadline`, `advanceManually`, `syncIndex` | RF-12 |
| `tests/home-carousel-timing.test.ts` (eliminar) | Desaparece: verificaba tiempo restante fraccional y avance manual, ambos fuera de alcance | RF-12, RNF-3 |
| `tests/home-carousel-autoplay.test.ts` (crear, mínimo) | Prueba mínima del autoplay simplificado con tolerancia ±500 ms | RF-1…RF-7, RF-12 |
| `common/utils/home-gallery.ts`, `common/utils/home-content.ts`, `app/page.tsx` (conservar) | No se tocan: selección/orden de fotos, 4 secciones, horario, textos y destinos | RF-10, RF-11, RNF-1 |
| `tests/home-gallery.test.ts`, `tests/home-content.test.ts` (conservar, deben seguir verdes) | No-regresión del comportamiento de spec 001 | RF-10, RF-11, RNF-3 |

Sin dependencias nuevas (RNF-2).

## Funciones puras
No se crea ninguna función pura temporal nueva: al eliminar la retención fraccional no hay cálculo de tiempo que aislar, por lo que no corresponde parámetro `hoy`. Si se extrae un ayudante para legibilidad, será predicado booleano puro sin tiempo:

```ts
// Ejemplo ilustrativo, sin tiempo: decide si el tick puede avanzar
function canAdvance(slideCount: number, hasPointer: boolean, hasFocus: boolean, prefersReducedMotion: boolean): boolean;
```

- `canAdvance` cubre RF-1/RF-2/RF-3/RF-5/RF-7/RF-8/RF-9; se prueba sin UI si se extrae, pero no es obligatorio.

## Algoritmo (pseudocódigo)
```
ESTADO: hasPointer=false, hasFocus=false, prefersReducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches
EFECTO autoplay dependiente de [api, slideCount, hasPointer, hasFocus, prefersReducedMotion]:
  SI api es nulo O slideCount <= 1 O prefersReducedMotion O hasPointer O hasFocus:
    NO crear intervalo; RETORNAR limpieza vacía        // RF-1, RF-2, RF-3, RF-5, RF-7, RF-8, RF-9
  SINO:
    id = setInterval(() => api.scrollNext(), 5000)    // RF-1, intervalo estándar completo
    AL cambiar matchMedia a reducido: actualizar flag → el efecto limpia el intervalo  // RF-5
    AL dejar de indicarlo sin puntero ni foco: el efecto crea un intervalo nuevo de 5 s // RF-6
    LIMPIEZA: clearInterval(id)
EVENTOS contenedor:
  onMouseEnter → hasPointer=true; onMouseLeave → hasPointer=false          // RF-2
  onFocusCapture → hasFocus=true; onBlurCapture(sale del contenedor) → hasFocus=false  // RF-3
  REANUDACIÓN solo cuando hasPointer=false Y hasFocus=false: el efecto recrea intervalo de 5 s // RF-4, RF-12
EMBLA:
  api.on("select", ...) solo sincroniza índice visual local, nunca reinicia el intervalo // RF-10 parcial
FALLO imagen:
  onError → marca "failed" vía resolveGallery; NO toca el intervalo  // caso límite "fallo no reinicia"
CASOS 1/0:
  slideCount<=1 → sin intervalo; 1 muestra foto fija; 0 retorna null   // RF-8, RF-9
```

Tolerancia de verificación: ±500 ms sobre los 5 s (p. ej. avance observable entre 4500 ms y 5500 ms con temporizadores falsos o espera real acotada).

## Interfaz
Sin cambios de props ni de UI:

```ts
interface HomeCarouselProps {
  images?: readonly string[];
  initialLoadStatus?: Record<string, ImageLoadStatus>;
  className?: string;
}
```

Sin botones manuales visibles nuevos (fuera de alcance). `data-testid` existentes (`home-carousel-multi`, `home-carousel-single`) se conservan.

## Decisiones y alternativas descartadas
1. **`setInterval` fijo de 5 s en el componente frente a mantener controlador con `setTimeout` inyectable.** Se elige `setInterval` porque cada reanudación debe reiniciar siempre el intervalo completo (RF-4, RF-6, RF-12) y no hay resto que conservar; el controlador actual existe solo para el resto fraccional. Descartado mantener `createHomeCarouselController` podado: conservaría una capa innecesaria y su contrato (`remainingDelay`, `advanceManually`, `syncIndex`) es justo lo que RF-12 exige eliminar.
2. **Avance vía `api.scrollNext()` + escucha `select` solo para sincronía visual, frente a índice propio en estado.** Se elige delegar en Embla (loop existente) porque elimina duplicidad de índice y reinicios acoplados; el fallo de imagen se resuelve por filtrado (`resolveGallery`), no por reinicio del temporizador. Descartado índice propio + `scrollTo`: reintroduciría la sincronía manual que esta limpieza quiere quitar.
3. **Pausa con flags `hasPointer`/`hasFocus` en estado y reanudación conjunta (Y) en el propio efecto, frente a contadores de tiempo.** Se elige porque RF-4 exige reanudar solo cuando cesan ambos; el efecto con dependencias lo garantiza declarativamente y reinicia 5 s completos al recrearse. Descartada reanudación con OR (reanudar al cesar uno solo): violaría RF-4.
4. **`matchMedia("(prefers-reduced-motion: reduce)")` con prioridad máxima y arranque detenido, frente a tratarlo como una pausa más.** Se elige prioridad (RF-5, RF-7) con listener `change`: si está indicado no se crea intervalo ni siquiera al montar. Descartado igualarlo a hover/foco: permitiría arranques con autoplay bajo movimiento reducido.
5. **Eliminar `tests/home-carousel-timing.test.ts` y crear un test mínimo nuevo, frente a adaptar el existente.** Se elige eliminar porque sus casos (reanudación con resto 2900/4000 ms, `advanceManually`, `syncIndex`) verifican exactamente lo prohibido por RF-12 y Fuera de alcance. Descartado conservarlo podado: arrastraría el contrato del controlador eliminado.
6. **Test mínimo con un solo disparador de pausa (puntero O foco) frente a matriz completa.** Se elige un disparador según RNF-3 y criterio de finalización (coste de prueba mínimo del mantenedor, HU-3). Descartada matriz exhaustiva hover×foco×motion: multiplica casos sin cubrir requisito adicional.

## Estrategia de pruebas (`npm test`)
- **Eliminar:** `tests/home-carousel-timing.test.ts` (verifica resto fraccional y avance manual, prohibidos por RF-12).
- **Crear mínimo** `tests/home-carousel-autoplay.test.ts` (fake timers o espera acotada, tolerancia ±500 ms):
  1. avanza cada 5 s habilitado (>1 foto, sin pausa, sin movimiento reducido) — RF-1;
  2. pausa con un solo disparador (puntero sobre el carrusel O foco dentro) y reanuda solo con ambos cesados reiniciando 5 s completos — RF-2/RF-3/RF-4/RF-12;
  3. con movimiento reducido no hay autoplay desde el arranque y al dejar de indicarla reanuda con 5 s completos — RF-5/RF-6/RF-7;
  4. aserción estática (lectura de código o ausencia de import): el componente ya no importa el controlador ni expone avance manual — RF-12.
- **No-regresión intacta:** `tests/home-gallery.test.ts` y `tests/home-content.test.ts` deben seguir pasando sin modificaciones — RF-10/RF-11/RNF-3.
- **Comandos:** `npm test` tras cada tarea de implementación; `npx tsc --noEmit` al cerrar (tipos del efecto y del test). Sin dependencias nuevas que instalar.

## Trazabilidad RF
- RF-1 → intervalo `setInterval` 5 s + test mínimo caso 1.
- RF-2, RF-3, RF-4 → flags puntero/foco + efecto conjunto + test mínimo caso 2.
- RF-5, RF-6, RF-7 → `matchMedia` prioritario + listener + test mínimo caso 3.
- RF-8, RF-9 → guarda `slideCount<=1` sin intervalo (verificado por suite conservada + render 1/0).
- RF-10, RF-11 → archivos conservados + suites conservadas verdes.
- RF-12 → eliminación de controlador y timing test + aserción de ausencia + reanudación siempre con 5 s completos.
- RNF-1/RNF-2/RNF-3 → sin textos/rutas/dependencias nuevas; cobertura = suites conservadas + test mínimo.

## Riesgos
- Regresión visual accidental al tocar `HomeCarousel.tsx`: mitigación en no tocar JSX/estilos salvo lo imprescindible del efecto y verificar en navegador si hay cambio perceptible.
- Test mínimo acoplado a Embla real: preferir fake timers y mocks mínimos de `api`/`matchMedia` para mantenerlo determinista con tolerancia ±500 ms.
