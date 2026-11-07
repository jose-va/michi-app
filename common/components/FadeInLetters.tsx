// Feature fade-in About letra a letra — envoltorio cliente mínimo.
// Actualmente solo lo usa el lema del home (`app/page.tsx`); la página
// `app/about/page.tsx` usa fundido por bloque con `animate-fade-in`.
// Recibe props serializables (ver guía
// `node_modules/next/dist/docs/.../05-server-and-client-components.md`).
// Reutiliza la aparición del tema global (fundido con leve desplazamiento
// vertical) con retardo creciente por letra y base continua entre bloques;
// se ejecuta una vez al cargar, sin observador de intersección.
// Cada letra va en su propia marca en línea para no alterar el flujo del
// texto ni la justificación; el lector de pantalla recibe el texto completo
// una sola vez (letras ocultas + copia `sr-only`) en lugar de
// deletrearlo. El contenido va en el HTML servido y termina visible sin JS;
// con movimiento reducido la animación se desactiva en `app/globals.css`.
"use client";

import type { CSSProperties } from "react";

const LETTER_STAGGER_MS = 15;

type FadeInLettersProps = {
  text: string;
  baseIndex?: number;
  staggerMs?: number;
};

export default function FadeInLetters({
  text,
  baseIndex = 0,
  staggerMs = LETTER_STAGGER_MS,
}: FadeInLettersProps) {
  const letters = Array.from(text);
  return (
    <span>
      <span aria-hidden="true">
        {letters.map((letter, letterIndex) => {
          const style: CSSProperties = {
            animationDelay: `${(baseIndex + letterIndex) * staggerMs}ms`,
            animationFillMode: "both",
          };
          return (
            <span
              key={letterIndex}
              className="animate-fade-in-up"
              style={style}
            >
              {letter}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
