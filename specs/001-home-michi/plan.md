# Plan — Spec 001 Renovación de la página de inicio

## Alcance, estado y prioridad

Este plan ejecuta la spec aprobada (`specs/001-home-michi/spec.md`), cubriendo RF-1–RF-10 y RNF-1–RNF-4. Las únicas fotos dentro del alcance son exactamente cinco seleccionadas por el coordinador entre las 22 HEIC iniciales y preparadas en formato WebP; las fotos futuras y cualquier extensión de galería quedan fuera. El copy y los destinos concretos no se inventan: se conservan o verifican contra lo existente (placeholders permitidos en textos descriptivos mientras no esté fijado el copy final, con regla de énfasis RNF-4: máximo 3 segmentos `<strong>` en `text-white font-bold` que no superan el 30% del cuerpo). El estilo visual es editorial limpio de inspiración Sibuya: carrusel sin botones manuales con imagen que llena el contenedor, y secciones descriptivas directamente sobre el fondo de la página. El detalle RNF-4 aplica solo a la sección de carta con tokens existentes (`montserrat`, `text-white`, `text-zinc-300`, `Button` `default`/`lg`, `bg-primary`/`text-primary-foreground`, `rounded-full`, `aspect-video`/`object-cover`), convive con el estilo sobrio de RF-3 sin reintroducir `Card`, no se extiende a reservas, ubicación ni horario, y en 375 px apila en una sola columna con imagen a `w-full` sin overflow ni solape; no modifica el horario de RF-5.

**Estado de implementación y tareas:**
- **T1–T8 completadas:** validación inicial de fuentes, lógica pura de galería (`resolveGallery`), controlador de temporización con reinicio estándar de 5 s, selección de 5 fotos WebP, composición inicial de UI y verificación completa (tests 20/20, tsc limpio, build y auditoría Chrome DevTools).
- **T9 completada:** rediseño visual Sibuya del carrusel y las secciones (retirar botones manuales visibles, envoltorios Card/bordes oscuros y bandas superiores; imagen con `object-cover`; secciones transparentes sobre el fondo). T1–T8 no se reabren salvo el retrabajo cubierto por T9.
- **T10 pendiente:** detalle tipográfico reforzado RNF-4 solo en la sección de carta (`app/page.tsx`), manteniendo 4 secciones, fondo transparente, sin `Card` y horario RF-5 intacto.

## Archivos y responsabilidades

| Archivo/ruta | Responsabilidad | RF |
|---|---|---|
| `app/page.tsx` | Componer nombre, carrusel superior, cuatro secciones descriptivas en orden editorial directamente sobre el fondo de la página sin Card translúcidas ni marcos oscuros, y bloque de horario; enlazar destinos existentes verificados. Aplica RNF-4 solo en la sección de carta con criterios medibles y tokens existentes (título exacto, cuerpo con regla de énfasis, botón `Button` `default`/`lg` en `rounded-full`, imagen `aspect-video`/`object-cover` con insignia `rounded-full` fija contenida) y layout apilado en 375 px sin overflow ni solape, sin alterar reservas, ubicación ni RF-5. | RF-1, RF-3–RF-9, RNF-4 |
| `common/components/ui/HomeCarousel.tsx` | Presentación del carrusel sin `CarouselPrevious`/`Next` ni botones manuales visibles, sin wrapper Card con bordes oscuros; imagen con `object-cover` llenando limpiamente el contenedor; manejo de carga/fallo de imágenes, pausa por hover/foco con reinicio estándar de 5 s, y reduced-motion. | RF-1, RF-2, RF-10, RNF-3 |
| `common/utils/home-gallery.ts` | Resolver únicamente la lista explícita seleccionada, conservar orden, omitir fallidas y clasificar estados de 0/1/múltiples cargables; no buscar imágenes adicionales. | RF-1, RF-2, RF-10 |
| `common/utils/home-carousel-controller.ts` | Controlador desacoplado de temporización y estado de carrusel: intervalo de 5 s, pausa en hover/foco, reinicio de ciclo completo estándar al reanudar, desactivación por reduced-motion, avance cíclico automático y reglas de 0/1 slide sin controles manuales visibles. | RF-1, RF-10 |
| `tests/home-gallery.test.ts` | Pruebas unitarias de resolución pura de galería: selección de 5, orden, omisión de fallidas, fallo de visible y casos borde (0 y 1). | RF-1, RF-2, RF-10 |
| `tests/home-carousel-timing.test.ts` | Pruebas unitarias deterministas con reloj falso local: inicio de 5000 ms, pausas, reanudación con reinicio a 5000 ms, reduced-motion y casos 0/1 sin autoplay. | RF-1, RF-10 |
| `public/images/` | Preservar las 22 fuentes `.HEIC` intactas; alojar exclusivamente las 5 imágenes `.webp` resultantes de la selección. | RF-2, RF-10 |
| `package.json` | Incorporación justificada de `sharp` (o script de preparación en Node.js) como herramienta de procesamiento de imagen de HEIC a WebP. | RF-2 |

## Diseño de comportamiento y funciones puras

- **Resolución pura de galería (`resolveGallery`):** recibe la lista explícita de rutas y un mapa o set de estado de carga; devuelve las imágenes cargables conservando el orden de selección.
- **Navegación pura:** cálculo cíclico de índice `(actual + 1) % total` solo para avance automático; paso automático al siguiente elemento cargable si la imagen visible reporta error. Sin navegación manual visible.
- **Elegibilidad de autoplay:** activo únicamente cuando `slideCount > 1`, el carrusel ha iniciado, no está en hover ni foco, y no está activa la preferencia de movimiento reducido.
- **Temporización estándar:**
  - Intervalo base de 5 segundos (5000 ms).
  - Al pausar por hover o foco, el temporizador se detiene.
  - Al cesar el hover o foco, se reinicia el intervalo estándar completo de 5 segundos (sin retener tiempo fraccional restante).
  - Reduced-motion desactiva el autoplay.
- **Presentación visual:**
  - La imagen del carrusel usa `object-cover` y llena limpiamente su contenedor, sin bandas, bordes ni fondos oscuros sobrantes en la parte superior.
  - Las cuatro secciones descriptivas se disponen directamente sobre el fondo de la página, sin `Card`, paneles translúcidos ni marcos oscuros.
  - La sección de carta aplica RNF-4 con criterios medibles y tokens existentes: título exacto «CONOCE NUESTRA CARTA» en `uppercase`, `montserrat`, `font-extrabold`, `text-4xl`/`md:text-5xl`, `text-white`, `tracking-tight`; cuerpo `text-base`/`md:text-lg` en `text-zinc-300` con máximo 3 `<strong>` en `text-white font-bold` que no superan el 30% del cuerpo; botón `Button` existente (`variant="default"`, `size="lg"`, `rounded-full`) con texto exacto «Ver todos los platos»; imagen lateral `aspect-video` con `object-cover` e insignia `rounded-full` fija (`size-20`/`md:size-24`, `bg-primary text-primary-foreground`, «Explora nuestros platos» en `text-xs` centrado) contenida en el marco de imagen; en 375 px una sola columna con imagen a `w-full`, sin overflow ni solape. No introduce `Card` ni altera reservas, ubicación u horario.
- No aplica parámetro `hoy`: la temporización es puramente transcurrida, no depende de fechas de calendario; RNF-4 tampoco requiere funciones puras con fecha.

## Algoritmo (pseudocódigo)

```text
selección = exactamente cinco fuentes .webp seleccionadas en T6
para cada imagen seleccionada:
  cargar imagen; registrar estado (éxito o fallo)
visibles = seleccionadas cargadas, conservando orden original

si visibles está vacía:
  no renderizar contenido en el carrusel
si visibles tiene 1 elemento:
  mostrar la imagen con object-cover; sin autoplay
si visibles tiene > 1 elementos:
  mostrar imagen actual con object-cover, sin botones manuales visibles
  si autoplay es elegible (sin hover, sin foco, sin reduced-motion):
    programar avance en 5 segundos
  al entrar hover o foco:
    cancelar temporizador activo
  al salir hover o foco:
    si autoplay es elegible: programar avance en intervalo estándar completo (5 s)
  al vencer temporizador:
    avanzar cíclicamente y reprogramar ciclo de 5 s
  al fallar imagen visible:
    omitir y pasar a la siguiente cargable según orden

renderizar exactamente cuatro secciones descriptivas en orden, sobre el fondo de la página sin Card ni marcos oscuros:
  1. Lema del bar
  2. Carta (título exacto «CONOCE NUESTRA CARTA» en `uppercase`, `montserrat`, `font-extrabold`, `text-4xl`/`md:text-5xl`, `text-white`, `tracking-tight`; cuerpo `text-base`/`md:text-lg` en `text-zinc-300` con máximo 3 `<strong>` en `text-white font-bold` ≤30% del cuerpo; imagen lateral `aspect-video` con `object-cover` e insignia `rounded-full` fija `size-20`/`md:size-24` en `bg-primary text-primary-foreground` con «Explora nuestros platos»; botón `Button` existente `default`/`lg` en `rounded-full` con «Ver todos los platos» a destino existente; en 375 px una sola columna con imagen a `w-full` sin overflow ni solape)
  3. Reservas (texto descriptivo, imagen y botón a destino existente)
  4. Ubicación (texto descriptivo, imagen y botón a destino existente)
mostrar bloque de horarios confirmados (lunes a sábado 8:00–16:00 y 20:00–23:00; domingo cerrado) sin cambios por RNF-4
```

## Decisiones y alternativas descartadas

1. **WebP generado a partir de HEIC usando `sharp` (o herramienta Node.js):**
   - *Aprobado:* WebP proporciona mayor compresión y mejor soporte web moderno que JPEG. Se usa `sharp` para decodificar HEIC y generar los 5 archivos `.webp` de producción.
   - *Descartado:* Mantener JPEG (descartado por aprobación de la spec) o convertir en tiempo de ejecución en el cliente.
2. **Preservación intacta de los 22 archivos HEIC originales:** Las fuentes originales permanecen inalteradas en el repositorio o carpeta de origen como respaldo maestro.
3. **Autoplay con reinicio estándar de 5 s tras pausa:**
   - *Aprobado:* Al reanudar tras hover o foco, se inicia un intervalo estándar completo de 5 segundos, consistente con `embla-carousel-autoplay` y el estándar por defecto sin sobrecargar estado de milisegundos fraccionales.
   - *Descartado:* Mantener cálculo y retención de milisegundos restantes (descartado por la simplificación aprobada de la spec).
4. **Carrusel sin controles manuales visibles ni envoltorios oscuros:**
   - *Aprobado:* Se retiran `CarouselPrevious`/`Next`, flechas flotantes e indicadores manuales; se elimina el wrapper tipo `Card` con bordes/fondos oscuros y la imagen usa `object-cover` para cubrir limpiamente el contenedor (RNF-3).
   - *Descartado:* Mantener botones manuales o marcos oscuros (descartado por RF-1, RF-10 y fuera de alcance aprobados).
5. **Secciones editoriales transparentes estilo Sibuya:**
   - *Aprobado:* Las cuatro secciones se componen directamente sobre el fondo de la página con tipografía sobria, sin `Card`, paneles translúcidos ni marcos oscuros.
   - *Descartado:* Envolver las secciones en tarjetas translúcidas o contenedores vidriados (descartado por RF-3 aprobado).
6. **Alcance acotado a 5 fotografías seleccionadas por el coordinador:** No se aceptan fotos adicionales dinámicas ni auto-descubrimiento en este ciclo.
7. **Detalle medible RNF-4 solo en carta con tokens existentes:**
   - *Aprobado:* título exacto, cuerpo con regla de énfasis (máximo 3 `<strong>` en `text-white font-bold`, ≤30% del cuerpo, compatible con placeholders RF-4), botón `Button` existente `default`/`lg` en `rounded-full`, imagen `aspect-video`/`object-cover` con insignia `rounded-full` fija contenida, y apilado en 375 px en una columna sin overflow ni solape; convive con el estilo sobrio de RF-3 (mismo sistema de fuentes, fondo transparente, sin `Card`).
   - *Descartado:* mantener adjetivos subjetivos sin medida («grande», «beige claro», «gris claro», «palabras clave» sin definir), extender el cambio a reservas/ubicación u horario, o reintroducir `Card`/paneles para lograr el contraste (descartado por RF-3, RF-5 y fuera de alcance limitado a carta).

## Estrategia de pruebas y verificación

1. **Pruebas de galería (`tests/home-gallery.test.ts`):** Verifican resolución pura, orden estricto de las 5 seleccionadas, omisión de fallidas, avance ante fallo y estados borde 0/1. Se ejecutan con `npm test`.
2. **Pruebas de temporización (`tests/home-carousel-timing.test.ts`):** Verifican mediante fake clock determinista el intervalo de 5000 ms, pausa en hover/foco, reinicio de ciclo estándar de 5000 ms al reanudar, suspensión por reduced-motion y ausencia de autoplay con 0/1 slides. Se ejecutan con `npm test`.
3. **Verificación de imágenes WebP (T6):** Inspección visual previa por el coordinador, comprobación de generación correcta de exactamente 5 archivos `.webp` válidos y ligeros en `public/images/`.
4. **Verificación estática y de compilación:** Ejecución de `npm test` (sigue verde) y `npx tsc --noEmit` limpio tras el rediseño T9.
5. **Verificación visual en navegador / Chrome DevTools (T9–T10):** Comprobación en móvil 375 px y escritorio de no desbordamiento horizontal (RNF-1), textos en español (RNF-2), imagen del carrusel cubriendo limpiamente el contenedor sin bandas oscuras (RNF-3), ausencia de botones manuales visibles, y secciones transparentes sin Card ni marcos oscuros; accesos a carta, reservas y ubicación funcionales. T10 añade verificación medible RNF-4 solo en carta: textos exactos de título, botón e insignia; clases y tokens existentes; regla de énfasis (máximo 3 `<strong>` en `text-white font-bold`, ≤30% del cuerpo); insignia contenida en el marco de imagen; apilado en 375 px en una columna con imagen a `w-full` sin overflow ni solape; 4 secciones en orden, reservas/ubicación/horario sin cambios y RF-5 intacto.

## Trazabilidad

| Requisito | Cobertura prevista |
|---|---|
| RF-1 | Carrusel: una foto visible con `object-cover`, autoplay 5 s, pausa por hover/foco y reinicio estándar de 5 s, reduced-motion; sin botones manuales de navegación. |
| RF-2 | Selección exacta de 5 fotos entre las 22 HEIC tras inspección visual; generación y uso exclusivo de WebP; fuentes HEIC preservadas. |
| RF-3 | Cuatro secciones descriptivas en orden (lema, carta, reservas, ubicación) directamente sobre el fondo, sin Card translúcidas ni marcos oscuros, estilo editorial Sibuya; hero y horario independientes. |
| RF-4 | Copy provisional o placeholders en textos descriptivos sin alterar estructura. |
| RF-5 | Bloque con horario confirmado de apertura. |
| RF-6 | Botón de acceso a la sección existente de carta. |
| RF-7 | Botón de acceso a la sección existente de reservas. |
| RF-8 | Botón de acceso a la sección existente de ubicación. |
| RF-9 | Home actúa como puerta de entrada sin duplicar flujos de carta/reservas/ubicación. |
| RF-10 | Omisión de imágenes fallidas, avance automático ante fallo visible, 1 imagen visible sin autoplay y 0 imágenes sin contenido; sin controles manuales. |
| RNF-1 | Diseño adaptable en móvil y escritorio sin desbordamiento horizontal. |
| RNF-2 | Interfaz y textos visibles íntegramente en español. |
| RNF-3 | Imagen del carrusel cubre limpiamente su contenedor sin desajustes ni espacios oscuros sobrantes. |
| RNF-4 | Sección de carta en `app/page.tsx` con criterios medibles y tokens existentes: título exacto y clases verificables, cuerpo con regla de énfasis compatible con placeholders, botón `Button` existente en `rounded-full`, imagen con insignia fija contenida y apilado en 375 px sin overflow ni solape (T10); mantiene 4 secciones, fondo transparente, sin `Card`, sin extensión a reservas/ubicación/horario y RF-5 intacto. |
