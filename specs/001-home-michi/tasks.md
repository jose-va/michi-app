# Tareas — Spec 001 Renovación de la página de inicio + imagen lateral en reservas (selección 3+3, autoplay 3 s, RF-11)

- [x] **T11. Reconciliar pruebas de galería a la selección de 3** (20–30 min)
  - RF: RF-1, RF-2, RF-10.
  - Hecho cuando: `tests/home-gallery.test.ts` cubre selección explícita de 3 en orden, omisión de fallidas, fallo de visible → siguiente cargable, 1 visible y 0 sin contenido; no espera fotos adicionales ni 5 antiguas; `npm test` registra el comportamiento esperado (puede fallar hasta T12).

- [x] **T12. Cablear las 6 fotos exactas en `home-content.ts`** (20–30 min)
  - RF: RF-2, RF-3, RF-4.
  - Hecho cuando: `DEFAULT_CAROUSEL_IMAGES` contiene en orden los 3 WebP de RF-2 y `HOME_SECTIONS` usa las 3 fotos de carta/reservas/ubicación distintas al carrusel y entre sí (lema sin imagen), excluyendo `michi-image1.webp`/`michi-image2.webp`; alts en español; RNF-4 de carta intacto; `npm test` de galería pasa.

- [x] **T13. Actualizar solo selección/documentación del script HEIC→WebP** (20–30 min)
  - RF: RF-2.
  - Hecho cuando: `scripts/convert-selected-images.js` conserva intacta la lógica `heic-decode`+`sharp` y ya no declara como vigente la selección antigua de 5 (`IMG_8115…`); no se ejecuta conversión ni se implementa subida; `npx tsc --noEmit` no introduce errores por este cambio.

- [x] **T14. Reconciliar pruebas de autoplay a 3 s** (20–30 min)
  - RF: RF-1, RF-10.
  - Hecho cuando: `tests/home-carousel-autoplay.test.ts` afirma `AUTOPLAY_INTERVAL_MS === 3000`, avance cada 3 s, pausa hover/foco con reanudación a 3 s completos, prioridad de reduced-motion y 0/1 sin autoplay; `npm test` pasa.

- [x] **T15. Verificar `HomeCarousel` sin cambios de lógica (fallback RF-10)** (20–30 min)
  - RF: RF-1, RF-2, RF-10.
  - Hecho cuando: `HomeCarousel.tsx` usa la selección por defecto, muestra una foto a la vez con `object-cover` sin botones manuales ni `Card`, y cumple 0 → null / 1 → fija sin autoplay / fallida → siguiente; `npm test` verde y `npx tsc --noEmit` limpio.

- [x] **T16. Verificar `app/page.tsx`: secciones, horario y accesos** (20–30 min)
  - RF: RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9.
  - Hecho cuando: la home presenta nombre + carrusel, 4 secciones en orden (lema sin imagen; carta/reservas/ubicación con texto, imagen y botón a destinos existentes), bloque de horario confirmado y RNF-4 solo en carta intacto; `npm test` verde.

- [x] **T17. Verificación final estática y visual** (20–30 min)
  - RF: RF-1–RF-10; RNF-1, RNF-2, RNF-3, RNF-4.
  - Hecho cuando: `npm test` verde, `npx tsc --noEmit` y `npm run lint` limpios; revisión en navegador/DevTools (375 px y escritorio) confirma una foto a la vez sin bandas ni botones, 4 secciones sobre el fondo, horario confirmado y sin overflow horizontal, o se declara la limitación y la alternativa realizada.

- [x] **T18. Imagen lateral en la página de reservas (RF-11)** (20–30 min)
  - RF: RF-11; RNF-1, RNF-2.
  - Hecho cuando: la página de reservas muestra junto al formulario intacto la imagen lateral `Futomaki De Salmón 10 Piezas [5_4-1024x1280-watermarked] 715_cleanup.webp` (distinta a home) con `object-cover` y alt en español; en 375 px se apila sin overflow horizontal ni solape; si la imagen falla se omite sin imagen rota ni cambios en el formulario; verificado con DevTools en 375 px y escritorio más `npm test`, `npx tsc --noEmit` y `npm run lint` limpios (o limitación declarada).
