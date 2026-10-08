# Tareas 002 — Limpieza del carrusel de inicio

- [x] **T1. Eliminar controlador y su test de temporización (20–30 min)**
  - RF: RF-12.
  - Hecho cuando: `common/utils/home-carousel-controller.ts` y `tests/home-carousel-timing.test.ts` ya no existen en el árbol; `npm test` pasa sin esos ficheros y `npx tsc --noEmit` no reporta imports rotos pendientes salvo los de `HomeCarousel.tsx` (a resolver en T2).

- [x] **T2. Simplificar autoplay en HomeCarousel a setInterval 5 s + Embla (20–30 min)**
  - RF: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9, RF-12.
  - Hecho cuando: `HomeCarousel.tsx` avanza con `setInterval(..., 5000)` + `api.scrollNext()`, pausa con puntero sobre el carrusel y foco-dentro, reanuda solo con ambos cesados reiniciando 5 s completos, respeta `matchMedia` reducido con prioridad (incluido arranque), detiene con 1/0 fotos, el fallo de imagen no reinicia el intervalo, `select` solo sincroniza índice visual, y no importa el controlador ni expone avance manual; JSX, fotos, secciones y textos sin cambios; `npx tsc --noEmit` limpio.

- [x] **T3. Crear test mínimo del autoplay simplificado (20–30 min)**
  - RF: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-12.
  - Hecho cuando: existe `tests/home-carousel-autoplay.test.ts` que con tolerancia ±500 ms verifica avance cada 5 s habilitado, pausa con un solo disparador (puntero o foco) con reanudación conjunta a 5 s completos, movimiento reducido sin autoplay desde arranque y reanudación al cesar, y ausencia de controlador/avance manual; `npm test` verde incluyendo `home-gallery` y `home-content` sin modificar.

- [x] **T4. Verificación final de no-regresión y tipos (20–30 min)**
  - RF: RF-10, RF-11.
  - Hecho cuando: `npm test` en verde completo, `npx tsc --noEmit` limpio, y se confirma que galería (5 fotos, orden, fallos omitidos, 0/1), 4 secciones, horario, textos en español y destinos siguen intactos sin dependencias nuevas.
