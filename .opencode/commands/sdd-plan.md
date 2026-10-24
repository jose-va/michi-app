---
description: SDD · Genera el plan técnico de una spec aprobada
agent: planner
---

Lee `docs/constitution.md`, `AGENTS.md`, `MEMORY.md` y `specs/$1/spec.md`. Si el plan toca Next.js, consulta antes la guía relevante de `node_modules/next/dist/docs/`. Usa la skill SDD. NO escribas código.

Genera `specs/$1/plan.md` con: archivos que se crean o modifican y sus responsabilidades, funciones puras de lógica (con parámetros explícitos para tiempo u otras dependencias externas solo cuando aplique), algoritmo en pseudocódigo, presentación en la interfaz, decisiones justificadas con alternativas descartadas y estrategia de pruebas con `npm test`.

Respeta la constitución y cubre todos los RF, indicando qué RF cubre cada parte. Si la spec no tiene `Estado: aprobada` o tiene dudas abiertas, detente y avisa.
