---
description: SDD · Valida la spec RF por RF (tests y Chrome DevTools)
agent: build
---

Recorre `specs/$1/spec.md` requisito por requisito. Para cada RF, indica qué test lo cubre y el resultado de ejecutarlo con `npm test`.

Los RF de interfaz que no se puedan probar con `npm test`, verifícalos con Chrome DevTools, incluida la vista móvil a 375 px.

Si algún RF no está cubierto o falla, dilo claramente. NO arregles nada todavía. Después comprueba los criterios de finalización y da un veredicto: ¿la spec está cumplida?
