# Tareas — Spec 001 Renovación de la página de inicio

- [x] **T1. Validar preparación de imágenes a partir de las fuentes HEIC** (30–60 min)
  - RF: RF-2.
  - Hecho cuando: prueba de conversión controlada ejecutada; fuentes originales HEIC preservadas intactas; se confirma la viabilidad técnica para generar el formato web final a partir de los originales.

- [x] **T2. Reconciliar primero pruebas unitarias de galería y navegación** (30–45 min)
  - RF: RF-1, RF-2, RF-10.
  - Hecho cuando: las pruebas existentes se revisan sin borrar archivos; no esperan fotos adicionales/futuras; cubren selección explícita (exactamente cinco en la configuración final), orden de cargables, fallo parcial, fallo de la visible y siguiente cargable, estado con una o cero imágenes, galería vacía y navegación cíclica; `npm test` registra el comportamiento esperado.

- [x] **T3. Completar lógica pura de galería conforme a las pruebas** (30–45 min)
  - RF: RF-1, RF-2, RF-10.
  - Hecho cuando: se reconcilia el helper puramente funcional; solo procesa la selección explícita, no admite fotos adicionales, conserva orden, omite fallos, avanza ante fallo de la visible y representa correctamente estados de 0/1/múltiples; `npm test` pasa 9/9 pruebas.

- [x] **T4. Definir pruebas unitarias del controlador de temporización** (30–45 min)
  - RF: RF-1, RF-10.
  - Hecho cuando: `tests/home-carousel-timing.test.ts` ejercita mediante fake clock determinista el contrato del controlador (inicio a 5000 ms, pausas, avance cíclico, avance manual durante pausas y casos borde 0/1 sin temporizador ni controles).

- [x] **T5. Implementar controlador de temporización estándar** (45–60 min)
  - RF: RF-1, RF-2, RF-10.
  - Hecho cuando: `common/utils/home-carousel-controller.ts` satisface el comportamiento estándar por defecto (pausa en hover/foco y reinicio del intervalo completo de 5 segundos al reanudar, reduced-motion y 0/1 slide); `npm test` pasa todas las pruebas unitarias.

- [x] **T6. Inspeccionar las 22 fotos HEIC, seleccionar 5 y generar WebP con sharp** (45–60 min)
  - RF: RF-2, RF-10.
  - Hecho cuando: el coordinador realiza la inspección visual de las 22 fotografías `.HEIC` originales; se seleccionan exactamente 5 imágenes; se evalúa y añade `sharp` (o script equivalente en Node.js) en el proyecto; se generan exclusivamente los 5 archivos `.webp` correspondientes en `public/images/` optimizados para web; los 22 archivos `.HEIC` originales se conservan intactos.

- [x] **T7. Componer la UI de la home integrando componentes shadcn** (45–60 min)
  - RF: RF-1, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9, RF-10.
  - Hecho cuando: `app/page.tsx` y `common/components/ui/HomeCarousel.tsx` integran los componentes de shadcn (`Carousel`, `Card`, `Button`); el carrusel superior muestra las 5 fotos WebP con navegación manual y fallback ante errores; se renderizan exactamente cuatro secciones descriptivas en orden (lema, carta, reservas, ubicación) con texto (o placeholder), imagen y botón enlazando a las rutas existentes verificadas; se presenta el bloque de horarios confirmados.

- [x] **T8. Verificar accesibilidad, responsive y suite de pruebas** (30–60 min)
  - RF: RF-1–RF-10; RNF-1, RNF-2.
  - Hecho cuando: `npm test`, `npm run lint` y `npx tsc --noEmit` se ejecutan y validan; se comprueba en navegador (o Chrome DevTools si está disponible) la ausencia de desbordamiento horizontal en móvil y escritorio, textos en español, accesos funcionales a las rutas existentes y manejo de casos extremos (simulación de fallos de imagen y preferencia de reduced-motion).

- [x] **T9. Rediseño visual Sibuya de carrusel y secciones** (45–60 min)
  - RF: RF-1, RF-3, RF-10; RNF-3.
  - Hecho cuando: `common/components/ui/HomeCarousel.tsx` no importa ni renderiza `CarouselPrevious`/`Next` ni botones manuales visibles, no usa wrapper `Card` con bordes/fondos oscuros, y la imagen usa `object-cover` llenando limpiamente el contenedor; `app/page.tsx` presenta las 4 secciones directamente sobre el fondo sin `Card` translúcidas ni marcos oscuros; `npm test` sigue verde y `npx tsc --noEmit` limpio; la verificación visual con Chrome DevTools en móvil 375 px y escritorio confirma sin overflow, sin botones visibles, sin bandas oscuras superiores y secciones transparentes.

- [x] **T10. Detalle medible RNF-4 en sección de carta con tokens existentes** (30–45 min)
  - RF: RF-3, RF-4, RF-5, RF-6; RNF-1, RNF-2, RNF-4.
  - Hecho cuando: en `app/page.tsx` solo la sección de carta muestra título exacto «CONOCE NUESTRA CARTA» en `uppercase`, `montserrat`, `font-extrabold`, `text-4xl`/`md:text-5xl`, `text-white`, `tracking-tight`; cuerpo `text-base`/`md:text-lg` en `text-zinc-300` con un máximo de 3 segmentos `<strong>` en `text-white font-bold` que no superan el 30% del cuerpo; botón `Button` existente (`variant="default"`, `size="lg"`, `rounded-full`) con texto exacto «Ver todos los platos» al destino existente de carta; imagen lateral `aspect-video` con `object-cover` e insignia `rounded-full` fija (`size-20`/`md:size-24`, `bg-primary text-primary-foreground`, texto exacto «Explora nuestros platos» en `text-xs` centrado) contenida dentro del marco de imagen; en 375 px la sección apila en una sola columna con imagen a `w-full`, sin overflow horizontal ni solape; se mantienen exactamente 4 secciones en orden, fondo transparente sin `Card` ni marcos oscuros, reservas/ubicación sin énfasis RNF-4 y bloque de horario RF-5 intacto; `npm test` verde, `npx tsc --noEmit` y `npm run lint` limpios, y verificación visual en 375 px y escritorio sin overflow ni solape.
