# Plan — Spec 001 Renovación de la página de inicio + imagen lateral en reservas (selección 3+3, autoplay 3 s, RF-11)

## Alcance y estado

Ejecuta la spec aprobada `specs/001-home-michi/spec.md` (RF-1–RF-11, RNF-1–RNF-4) como cambio mínimo sobre lo ya implementado (T1–T10 y simplificación de autoplay ya en código). No hay nueva funcionalidad salvo RF-11: solo cablear la selección exacta ya convertida por el usuario, verificar el intervalo de 3 s ya existente, conservar el fallback RF-10 y añadir la imagen lateral en reservas sin tocar su formulario. Las fotos futuras y la subida por visitante quedan fuera de alcance; la lógica HEIC→WebP se conserva sin implementar subida.

Selección fijada (RF-2, orden estricto):
- Carrusel (3 WebP en `public/images/`, una visible a la vez): `Combinando Duo Mixto 21 Piezas [5_4-1024x1280-watermarked] b67_cleanup.webp`, `Sake Goku 8 Piezas [5_4-1024x1280-watermarked] a66_cleanup.webp`, `Maguro Spicy 8 Piezas [5_4-1024x1280-watermarked] e4e_cleanup.webp`.
- Secciones (distintas al carrusel, sin repetición; lema sin imagen): carta → `Katsumaki Combinado 8 Piezas [5_4-1024x1280-watermarked] 2be_cleanup.webp`; reservas → `Hitokiri 8 Piezas [5_4-1024x1280-watermarked] 18d_cleanup.webp`; ubicación → `Katsudon [5_4-1024x1280-watermarked] 356_cleanup.webp`.
- Exclusión exacta: `michi-image1.webp` y `michi-image2.webp` no se usan en carrusel ni secciones.

## Archivos y responsabilidades

| Archivo/ruta | Responsabilidad | RF |
|---|---|---|
| `common/utils/home-content.ts` | Única fuente de la selección: `DEFAULT_CAROUSEL_IMAGES` con los 3 WebP del carrusel en orden; `HOME_SECTIONS` con las 3 fotos de carta/reservas/ubicación distintas entre sí y al carrusel; `CAROUSEL_IMAGE_ALTS` y `imageAlt` en español; título/botón/insignia de carta según RNF-4 intactos. | RF-2, RF-3, RF-4, RNF-2, RNF-4 |
| `common/components/ui/HomeCarousel.tsx` | Presentación sin cambios de lógica: una foto a la vez con `object-cover` llenando el contenedor, sin botones manuales ni `Card`; fallback RF-10 vía `resolveGallery` (0 → `null`, 1 → visible sin autoplay); pausa hover/foco con reinicio a intervalo completo; reduced-motion. Reutiliza `DEFAULT_CAROUSEL_IMAGES` por defecto. | RF-1, RF-2, RF-10, RNF-3 |
| `common/utils/home-autoplay.ts` | Conservar `AUTOPLAY_INTERVAL_MS = 3000` y `shouldAutoplay(slideCount, hasPointer, hasFocus, prefersReducedMotion)` sin cambios salvo verificación. | RF-1, RF-10 |
| `common/utils/home-gallery.ts` | Conservar `resolveGallery` y `getNextSlide` sin cambios de lógica; solo procesa la selección explícita. | RF-1, RF-2, RF-10 |
| `app/page.tsx` | Componer nombre, `HomeCarousel`, 4 secciones en orden sobre el fondo (lema sin imagen; carta/reservas/ubicación con texto+imagen+botón a destinos existentes) y bloque de horario confirmado; sin duplicar flujos. RNF-4 solo en carta, intacto. | RF-1, RF-3–RF-9, RNF-1, RNF-4 |
| `app/reservation/page.tsx` + componente de página de reservas | Añadir imagen lateral RF-11 (`Futomaki De Salmón … 715_cleanup.webp`, distinta a home) con `object-cover` y alt en español junto al formulario existente, sin cambios funcionales en el formulario; apilado en móvil sin overflow; omisión limpia si la imagen falla. | RF-11, RNF-1, RNF-2 |
| `scripts/convert-selected-images.js` | Conservar la lógica HEIC→WebP (`heic-decode` + `sharp`); actualizar solo la selección antigua de 5 (`IMG_8115…`) en `SELECTED_IMAGES`/documentación para que no contradiga la selección vigente; no ejecutar conversión (el usuario ya convirtió); no implementar subida futura. | RF-2 (fuera de alcance parcial) |
| `public/images/` | Usar los 6 WebP ya existentes; preservar originales JPG/HEIC cuando existan; no generar ni borrar imágenes en este cambio. | RF-2 |
| `tests/home-gallery.test.ts` | Reconciliar a selección de 3: orden, omisión de fallidas, fallo de visible → siguiente, casos 1/0. | RF-1, RF-2, RF-10 |
| `tests/home-carousel-autoplay.test.ts` | Reconciliar a 3 s: `AUTOPLAY_INTERVAL_MS === 3000`, avance cada 3 s, pausa hover/foco con reinicio a 3 s completos, reduced-motion, 0/1 sin autoplay. | RF-1, RF-10 |

## Funciones puras

- `resolveGallery(initialSelection: readonly string[], loadStatus: Readonly<Record<string, ImageLoadStatus>>): string[]` — filtra por `loaded`, preserva orden; sin acceso a tiempo ni DOM.
- `getNextSlide(currentIndex: number, slideCount: number): number | undefined` — `(currentIndex + 1) % slideCount`; `undefined` si `slideCount <= 0`.
- `shouldAutoplay(slideCount: number, hasPointer: boolean, hasFocus: boolean, prefersReducedMotion: boolean): boolean` — `slideCount > 1 && !hasPointer && !hasFocus && !prefersReducedMotion`. El tiempo solo entra vía `setInterval(AUTOPLAY_INTERVAL_MS)` en el componente, recreado completo al pausar/reanudar (sin retener fracción restante).

## Algoritmo (pseudocódigo)

```text
selección = 3 WebP exactos de RF-2 en orden; secciones = 3 WebP distintos
visibles = resolveGallery(selección, loadStatus)  # conserva orden
si visibles vacía: carrusel retorna null
si visibles tiene 1: muestra imagen fija con object-cover, sin intervalo
si visibles > 1:
  muestra una a la vez con object-cover, sin botones manuales
  si shouldAutoplay(...): programa setInterval(3000) → scrollNext
  al hover/foco: cancela intervalo
  al cesar hover/foco: si shouldAutoplay, reprograma 3000 completos
  al error de imagen: marca failed → resolveGallery omite → siguiente cargable
  reduced-motion activo: sin intervalo; al cesar: reprograma 3000
render 4 secciones en orden (lema; carta+foto; reservas+foto; ubicación+foto) + horario confirmado
```

## Interfaz

Sin cambios de interfaz pública: `HomeCarousel({ images = DEFAULT_CAROUSEL_IMAGES, initialLoadStatus, className })`; `HOME_SECTIONS`, `CONFIRMED_SCHEDULE`, `resolveGallery`, `shouldAutoplay` mantienen firmas. El cambio es solo de datos (rutas de imagen) y de expectativas de tests (3 en vez de 5; 3000 en vez de 5000).

## Decisiones y alternativas descartadas

1. **Reutilizar los 6 WebP ya convertidos por el usuario, sin reconvertir.**
   - *Por qué:* el usuario ya hizo la conversión; evita trabajo y riesgo innecesarios.
   - *Descartado:* regenerar desde HEIC o reintroducir JPEG (la spec exige WebP y excluye JPEG en carrusel).
2. **No tocar la lógica de autoplay (ya a 3000 ms).**
   - *Por qué:* `home-autoplay.ts` ya vale 3000 y el componente ya recrea el intervalo completo al reanudar; solo hay que reconciliar los tests que aún esperan 5000.
   - *Descartado:* cambiar el intervalo o reintroducir retención de tiempo fraccional/controlador con avance manual.
3. **No cambiar `resolveGallery`/`HomeCarousel` salvo la selección.**
   - *Por qué:* el fallback RF-10 (omitir fallidas, 1 sin autoplay, 0 sin contenido) ya está implementado y probado.
   - *Descartado:* reescribir fallback o añadir navegación manual (fuera de alcance).
4. **Script HEIC→WebP: solo actualizar selección/documentación, conservar lógica, no ejecutar.**
   - *Por qué:* evita contradicción con la selección antigua de 5 y conserva la capacidad futura sin implementar la subida (fuera de alcance).
   - *Descartado:* borrar el script, cambiar su pipeline o implementar subida ahora.
5. **Sin dependencias nuevas ni cambios de contratos/API/autenticación.**
   - *Por qué:* cambio acotado a datos de home, según constitución (stack simple) y AGENTS.md.
   - *Descartado:* añadir librerías de imagen o tocar servicios/backend.
6. **Imagen lateral en reservas como presentación junto al formulario existente, sin lógica nueva.**
   - *Por qué:* RF-11 solo pide.decoración visual distinta a home con `object-cover`, alt en español y fallback de omisión; no justifica componentes, estado ni cambios en el flujo de reserva.
   - *Descartado:* modificar campos/flujo del formulario, reutilizar una foto de home o añadir carrusel/galería en reservas.

## Estrategia de pruebas y verificación

1. `npm test` — galería reconciliada a 3 (orden, fallidas omitidas, visible fallida → siguiente, 1/0) y autoplay reconciliado a 3 s (avance, pausa hover/foco con reinicio a 3 s completos, reduced-motion, 0/1 sin autoplay); RNF-4 (`home-menu-rnf4.test.ts`) debe seguir verde.
2. `npx tsc --noEmit` y `npm run lint` limpios en los archivos tocados.
3. Visual con Chrome DevTools si está disponible (375 px y escritorio): una foto a la vez llenando el contenedor sin bandas/bordes oscuros, sin botones manuales, 4 secciones en orden sobre el fondo, horario confirmado, sin overflow horizontal; página de reservas con imagen lateral `object-cover` junto al formulario intacto, apilada a 375 px sin overflow y omitida limpiamente si falla; si DevTools no está disponible, indicarlo y describir la alternativa.

## Trazabilidad

| Requisito | Cobertura |
|---|---|
| RF-1 | `HomeCarousel` + `home-autoplay.ts` (3 s, pausa/reanudación 3 s, reduced-motion, sin botones); verificado en `home-carousel-autoplay.test.ts`. |
| RF-2 | `home-content.ts` (3+3 exactos, orden, exclusión michi-image1/2); `public/images/` preservado; script solo en selección/documentación; verificado en `home-gallery.test.ts` + revisión de rutas. |
| RF-3–RF-4 | `app/page.tsx` + `home-content.ts` (4 secciones en orden, lema sin imagen, placeholders permitidos, sin tarjetas). |
| RF-5 | `app/page.tsx` + `CONFIRMED_SCHEDULE` (horario confirmado intacto). |
| RF-6–RF-9 | `app/page.tsx` (botones a destinos existentes, sin duplicar flujos). |
| RF-10 | `resolveGallery` + `HomeCarousel` (omitir fallidas, siguiente cargable, 1 sin autoplay, 0 sin contenido); verificado en tests. |
| RF-11 | Página de reservas (imagen lateral Futomaki distinta a home, `object-cover`, alt español, formulario intacto, apilado 375 px sin overflow, omisión limpia si falla); verificado en T18 con DevTools 375 px/escritorio + `npm test`/`tsc`/`lint`. |
| RNF-1–RNF-4 | Sin cambios de estilo salvo cableado de fotos; RNF-4 de carta intacto y reverificado en tests + visual 375 px/escritorio. |
