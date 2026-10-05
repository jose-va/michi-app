<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Michi Sushi Granada

Michi Sushi Granada es la plataforma web de un restaurante de sushi en Granada. Este repositorio contiene el frontend Next.js, que consume un backend REST externo. Permite explorar la carta y reservar; los administradores gestionan reservas y productos, con autenticación mediante Google, ubicación con Google Maps y sincronización con Uber Eats.

## Stack y estructura

- Next.js 16 App Router, React 19, TypeScript estricto y Tailwind CSS 4; dependencias fijadas en `package-lock.json`.
- `app/`: rutas, layouts y estilos globales. `app/layout.tsx` carga el perfil inicial y monta el proveedor de usuario y la navegación.
- `common/`: tipos, mappers y componentes de páginas, formularios, layout y UI reutilizable.
- `shadcn/components/`: UI compartida basada en Radix/shadcn. Los aliases de `components.json` no reflejan completamente las rutas reales; comprueba los imports antes de generar componentes.
- `service/`: clientes de API (`ProductService`, `ReservationService`, `UserService`). `lib/server-actions.ts`: acciones de servidor que los utilizan y revalidan rutas.
- El alias TypeScript `@/*` apunta a la raíz del repositorio.

## Comandos

```bash
npm ci
npm run dev
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

Las pruebas TypeScript usan el runner integrado de Node mediante `tsx`: ejecuta `npm test`. Configura `BACKEND_URL` para las funciones que llaman al backend.

## Convenciones

- Conserva en español los textos visibles al usuario, como en las rutas y componentes existentes.
- Sigue los patrones cercanos: componentes React en `.tsx`, imports internos con `@/` y clases Tailwind para estilos.
- Reutiliza los tipos de `common/types/` y los servicios existentes para llamadas al backend; evita duplicar lógica de API en componentes.

## Reglas de dominio / trampas conocidas

- Los servicios leen `process.env.BACKEND_URL`. Las peticiones autenticadas obtienen la cookie `token` y la reenvían al backend.
- `app/auth/route.ts` toma `token` de la query y lo guarda como cookie; logout está en `lib/server-actions.ts`. Comprueba ambos puntos antes de cambiar el flujo de autenticación.
- La implementación del backend no está aquí. No inventes endpoints ni payloads; verifica los cambios de contrato contra el código y el comportamiento esperado del backend.

## Forma de trabajar

- Antes de modificar código, lee `AGENTS.md`, `MEMORY.md` y `docs/constitution.md`. Si la tarea pertenece a una spec, lee también su `spec.md`, `plan.md` y `tasks.md`; implementa solo requisitos aprobados.
- Para cambios en varias rutas, contratos de API o autenticación, identifica primero los entrypoints y servicios afectados; mantén el cambio acotado al objetivo.
- Al terminar, resume qué cambió y qué comprobaciones se ejecutaron, indicando las que no se pudieron ejecutar.
- Cuando la tarea use Spec-Driven Development, sigue `.agents/skills/sdd/SKILL.md` y los comandos de `.opencode/commands/`: no avances de fase sin aprobación y, al implementar, trabaja en una sola tarea aprobada cada vez.

## Límites

- ✅ Reutiliza tipos y servicios existentes y ejecuta las verificaciones relevantes.
- ⚠️ Consulta antes de añadir dependencias o cambiar contratos de datos/API o el flujo de autenticación.
- 🚫 No omitas `npm test` al verificar cambios cubiertos por pruebas.

## Verificación

- Ejecuta `npm run lint` y `npx tsc --noEmit` para cambios de código; añade `npm run build` si el cambio afecta al build, rutas o configuración.
- En tareas SDD, escribe primero las pruebas y ejecútalas con `npm test`; comunica cualquier limitación del entorno.
- Para cambios de interfaz, comprueba el comportamiento en navegador. Si Chrome DevTools MCP está conectado, úsalo; si no está disponible, indícalo y describe qué verificación alternativa pudiste hacer.
- La verificación end-to-end de páginas y acciones que llaman al backend requiere `BACKEND_URL` y un backend accesible.

## Memoria

- Lee `MEMORY.md` al empezar. Al cerrar cada fase SDD aprobada, actualízalo con el estado, las decisiones y los aprendizajes útiles; mantenlo en un máximo de 50 líneas y nunca incluyas datos sensibles.
- SDD está definido en `.agents/skills/sdd/SKILL.md`; los flujos invocables están en `.opencode/commands/` (incluye comandos para spec, plan, tareas, implementación y validación).
- Existe `docs/constitution.md`. Si una tarea SDD requiere una spec inexistente, inicia el flujo para redactarla y espera aprobación antes de continuar.
- Si algo se convierte en una regla permanente, propón moverlo a `AGENTS.md` en lugar de dejarlo en la memoria.
