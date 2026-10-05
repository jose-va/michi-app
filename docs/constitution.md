# Constitución del proyecto

1. **Stack simple:** No añadir dependencias ni tecnologías sin justificar la necesidad y obtener aprobación.
2. **Spec y código:** En tareas SDD, implementar solo requisitos aprobados; cambiar primero la spec, después el plan y las tareas, y finalmente el código.
3. **Lógica e interfaz:** Mantener las reglas de negocio y transformaciones fuera de los componentes de presentación; probarlas sin depender de la UI cuando sea posible.
4. **Pruebas:** Escribir primero pruebas para la lógica modificada y ejecutar `npm test`, lint y TypeScript; comprobar en un navegador los cambios de interfaz cuando corresponda y declarar cualquier limitación.
5. **Protección de datos:** No registrar ni guardar tokens, credenciales o datos personales; no exponer secretos en el cliente, los logs ni la memoria.
6. **Idioma:** Escribir en español los textos visibles al usuario y mantener en inglés los identificadores del código, siguiendo los patrones existentes.
