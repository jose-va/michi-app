# Spec 002 — Limpieza del carrusel de inicio
Estado: implementada

## Contexto y objetivo
Línea base: spec 001 implementada (carrusel con avance automático, pausa por puntero y foco, y respeto a movimiento reducido). La lógica que sostiene ese avance creció con capacidades no exigibles: retención del tiempo restante fraccional y avance manual programático. Esta spec busca simplificar ese comportamiento a lo estrictamente exigible, conservando intactos la selección de fotografías, las cuatro secciones descriptivas, el horario confirmado, los textos visibles y los destinos existentes.

## Usuarios
- Personas que visitan la web para conocer Michi Sushi Granada (mismo usuario que spec 001).
- Equipo de mantenimiento, que necesita una lógica de avance simple de entender y de probar.

## Historias de usuario
- HU-1. Como visitante, quiero que el carrusel avance solo cada 5 segundos y se pause mientras lo señalo o mientras el foco está dentro de él, reanudando solo cuando cesan ambos, para ver las fotos con calma sin perder el ritmo habitual.
- HU-2. Como visitante con preferencia de movimiento reducido, quiero que el avance automático se detenga incluso sin pausa por puntero o foco, para navegar sin movimiento no deseado.
- HU-3. Como mantenedor, quiero una lógica de avance simple sin tiempo restante retenido ni avance manual programático, para reducir complejidad y coste de pruebas.

## Definiciones
- **Avance estándar de 5 segundos:** cada avance automático ocurre 5 segundos después del avance o reinicio anterior, sin conservar fracciones de tiempo de pausas previas.
- **Pausa por puntero:** mientras el puntero está sobre el carrusel, el avance automático está detenido.
- **Pausa por foco:** mientras cualquier elemento dentro del carrusel tiene el foco, el avance automático está detenido.
- **Reanudación conjunta:** el avance se reanuda solo cuando cesan el puntero Y el foco (ninguno sigue activo), reiniciando siempre el intervalo estándar completo de 5 segundos.
- **Movimiento reducido:** lo que indica `matchMedia` del sistema; mientras está indicado, el avance automático está desactivado con prioridad sobre la pausa por puntero o foco.
- **Comportamiento conservado de spec 001:** selección de exactamente cinco fotografías, omisión de las que fallen preservando el orden, casos de 0 y 1 fotografía cargable, cuatro secciones descriptivas en su orden, horario confirmado, textos visibles y destinos de carta, reservas y ubicación.

## Requisitos funcionales
- RF-1: CUANDO el avance automático está habilitado y hay más de una fotografía cargable, EL SISTEMA avanza a la siguiente fotografía cargable cada 5 segundos.
- RF-2: MIENTRAS el puntero esté sobre el carrusel, EL SISTEMA pausa el avance automático.
- RF-3: MIENTRAS cualquier elemento dentro del carrusel tenga el foco, EL SISTEMA pausa el avance automático.
- RF-4: CUANDO cesan el puntero Y el foco (ninguno sigue activo) y el avance está habilitado, EL SISTEMA reanuda el avance reiniciando el intervalo estándar completo de 5 segundos.
- RF-5: SI `matchMedia` indica preferencia por movimiento reducido, ENTONCES EL SISTEMA desactiva el avance automático, incluido el arranque con esa preferencia ya indicada.
- RF-6: CUANDO `matchMedia` deja de indicar movimiento reducido y no hay puntero ni foco activos, EL SISTEMA reanuda el avance con el intervalo estándar completo de 5 segundos.
- RF-7: MIENTRAS `matchMedia` indica movimiento reducido, EL SISTEMA mantiene desactivado el avance automático aunque no haya puntero ni foco activos.
- RF-8: SI queda una sola fotografía cargable, ENTONCES EL SISTEMA la mantiene visible sin avance automático.
- RF-9: SI ninguna fotografía se puede cargar, ENTONCES EL SISTEMA no presenta contenido en el carrusel.
- RF-10: EL SISTEMA conserva sin cambios el comportamiento de selección de spec 001: muestra solo las fotografías seleccionadas que cargan (cinco WebP derivadas de las 22 HEIC mediante el coordinador), omite las fallidas sin presentar imágenes rotas, preserva el orden de las que sí cargan y, si falla la visible, presenta la siguiente cargable según ese orden.
- RF-11: EL SISTEMA conserva sin cambios de spec 001 las cuatro secciones descriptivas en su orden, el bloque de horario confirmado, los textos visibles y los destinos existentes de carta, reservas y ubicación.
- RF-12: EL SISTEMA no retiene tiempo restante fraccional entre pausas ni expone avance manual programático: cada reanudación usa siempre el intervalo estándar completo de 5 segundos y solo el ciclo automático produce avances.

## Requisitos no funcionales
- RNF-1: EL SISTEMA mantiene los textos visibles al usuario en español y sin cambios respecto a lo aprobado.
- RNF-2: EL SISTEMA no introduce dependencias nuevas ni textos, rutas o secciones nuevas como parte de esta limpieza.
- RNF-3: EL SISTEMA mantiene la cobertura de pruebas del comportamiento conservado (galería y contenido de inicio) y verifica el autoplay simplificado con una prueba mínima de intervalo estándar, un solo disparador de pausa (puntero o foco) y movimiento reducido.

## Casos límite
- Con más de una fotografía cargable, el avance ocurre cada 5 segundos solo cuando está habilitado; con una sola, la fotografía permanece visible sin avance; con ninguna, el carrusel no presenta contenido.
- La pausa por puntero o por foco dentro detiene el avance; la reanudación exige que cesen ambos y reinicia siempre el intervalo estándar completo de 5 segundos, sin retener tiempo previo.
- Si la preferencia de movimiento reducido ya está indicada en el arranque, el autoplay no llega a iniciarse; si se activa a mitad de un intervalo, el avance se detiene; al desactivarse sin puntero ni foco, se reanuda con un intervalo estándar completo.
- Si una fotografía falla fuera del momento de avance, ese fallo no reinicia el intervalo; solo el ciclo normal de 5 segundos produce el avance a la siguiente cargable según el orden, sin imágenes rotas.
- Si durante la presentación el número de fotografías cargables pasa dinámicamente a 1 o 0, el avance automático se detiene según RF-8 o RF-9.
- La limpieza no altera textos, rutas, número ni orden de secciones, ni el horario confirmado.

## Fuera de alcance
- Cambiar textos visibles, rutas o destinos existentes.
- Cambiar el número, el orden o el contenido de las cuatro secciones descriptivas o del bloque de horario.
- Añadir botones o controles manuales visibles de navegación al carrusel.
- Conservar o reintroducir cálculo de tiempo restante fraccional o avance manual programático.
- Añadir fotografías nuevas, cambiar formatos de imagen o tratar fotografías añadidas después.
- Cambiar o duplicar funcionalidades de carta, reservas o ubicación.

## Criterios de finalización
- Una prueba mínima verificable confirma el autoplay simplificado con tolerancia ±500 ms: avanza cada 5 segundos cuando está habilitado; pausa con un solo disparador (puntero sobre el carrusel o foco dentro) y reanuda solo cuando cesan puntero Y foco reiniciando 5 segundos completos; con movimiento reducido no hay autoplay desde el arranque y se reanuda al dejar de indicarla; no existe retención de tiempo restante ni avance manual programático.
- Las pruebas del comportamiento conservado de spec 001 (selección y orden de galería con fallos omitidos, contenido de inicio con cuatro secciones y horario) siguen pasando sin cambios de textos ni rutas.
- La página de inicio presenta el carrusel, las cuatro secciones y el horario tal como en spec 001, sin botones manuales visibles ni cambios visuales perceptibles salvo la simplificación interna del ritmo de avance.

## Dudas abiertas
- Sin dudas abiertas: las respuestas de clarificación QA quedan incorporadas (foco interno cualquiera, reanudación conjunta Y, `matchMedia`, tolerancia ±500 ms, arranque con movimiento reducido sin autoplay, prioridad de movimiento reducido, fallo sin reinicio, parada dinámica en 1/0, RF atómicos, RF-10/RF-11 como no-regresión de 001, prueba mínima de un disparador, alcance limitado).
