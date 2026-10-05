---
name: sdd
description: Úsala siempre que trabajes con Spec-Driven Development en este proyecto; redactar, revisar o cambiar specs, planes y tareas, o implementar y validar tareas de una spec.
---

# Spec-Driven Development (SDD)

## Flujo

Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación → Cambio.

- No pases a la siguiente fase sin aprobación explícita del usuario.
- La spec define el alcance: no implementes requisitos que no estén especificados. Si falta una decisión, pregunta y detente.
- Para cambiar requisitos, actualiza primero la spec, después el plan y las tareas, y finalmente el código.
- Cada spec vive en `specs/NNN-nombre/` junto con sus respectivos archivos `spec.md`, `plan.md` y `tasks.md`.
- Actualiza `MEMORY.md` al terminar cada fase.

## Plantilla de spec (`spec.md`)

```markdown
# Spec NNN — <Nombre>
Estado: borrador | aprobada | implementada

## Contexto y objetivo
## Usuarios
## Historias de usuario
- HU-1. Como <rol>, quiero <acción> para <beneficio>.
## Definiciones (solo si hay términos ambiguos)
## Requisitos funcionales
## Requisitos no funcionales
## Casos límite
## Fuera de alcance
## Criterios de finalización
## Dudas abiertas
- [NECESITA ACLARACIÓN] <duda>
```

La spec describe el qué y el porqué, no el stack, la arquitectura ni nombres de archivos.

## Requisitos EARS en español

- `RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.`
- `RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.`
- `RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.`
- `RF-x: EL SISTEMA <comportamiento permanente>.`

Cada requisito debe ser verificable; evita términos subjetivos sin un criterio medible.

## Plan (`plan.md`)

Incluye archivos y responsabilidades, funciones puras (con `hoy` explícito cuando aplique), algoritmo en pseudocódigo, interfaz, decisiones justificadas con alternativas descartadas y estrategia de pruebas con `npm test`. Indica qué RF cubre cada parte.

## Tareas (`tasks.md`)

```markdown
- [ ] **Tn. <Descripción>** (20–30 min)
  - RF: RF-x, RF-y.
  - Hecho cuando: <comprobación verificable>.
```

Ordénalas por dependencia. Si hay más de 10, propone dividir la spec.

## Implementación

Implementa una sola tarea cada vez: escribe primero los tests y comprueba que fallan, luego el código, ejecuta `npm test`, marca la tarea completada e indica los RF cubiertos. Después, detente.
