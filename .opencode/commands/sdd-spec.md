---
description: SDD · Entrevista y genera la spec (uso: /sdd-spec 002-nombre idea inicial)
agent: plan
---

NO escribas código. Lee `docs/constitution.md` y `MEMORY.md`, y usa la skill SDD.

Carpeta de la spec: `specs/$1/`
Idea inicial: $ARGUMENTS

1. Haz preguntas de una en una para eliminar ambigüedades (casos límite, errores y fuera de alcance). Máximo 5 preguntas.
2. Con las respuestas, genera `specs/$1/spec.md` siguiendo la plantilla de la skill SDD, con requisitos EARS y `Estado: borrador`.
3. Describe solo el qué y el porqué: nada de stack, arquitectura ni nombres de archivos.
