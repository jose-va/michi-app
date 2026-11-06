import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// /feature about fade-in: los 5 párrafos aparecen por bloque con
// animate-fade-in (solo opacidad), sin troceado letra a letra.
const about = readFileSync(
  new URL("../app/about/page.tsx", import.meta.url),
  "utf8",
);
const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);
const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const letters = readFileSync(
  new URL("../common/components/FadeInLetters.tsx", import.meta.url),
  "utf8",
);

test("About no usa FadeInLetters (sin troceado letra a letra)", () => {
  assert.ok(
    !about.includes("FadeInLetters"),
    "app/about/page.tsx no debe importar ni renderizar FadeInLetters",
  );
  assert.ok(
    !about.includes("paragraphBaseIndexes") &&
      !about.includes("runningChars") &&
      !about.includes("baseIndex"),
    "About no debe calcular retardo por letra (baseIndex/runningChars)",
  );
});

test("About renderiza los párrafos con animate-fade-in por bloque", () => {
  assert.ok(
    about.includes("animate-fade-in") &&
      !about.includes("animate-fade-in-up"),
    "los párrafos deben usar animate-fade-in, no animate-fade-in-up",
  );
  assert.ok(
    about.includes("opacity-0"),
    "el bloque parte de opacity-0 y la animación lo lleva a visible",
  );
  assert.ok(
    about.includes("motion-reduce:animate-none") &&
      about.includes("motion-reduce:opacity-100"),
    "debe quedar legible con movimiento reducido",
  );
  assert.ok(
    about.includes("animationDelay") &&
      about.includes("animationFillMode"),
    "el escalonado por párrafo usa animationDelay con fillMode both",
  );
  assert.ok(
    about.includes("getAboutParagraphs()"),
    "sigue iterando los 5 párrafos de about-content",
  );
});

test("globals.css define fade-in puro sin desplazamiento", () => {
  assert.ok(
    css.includes("--animate-fade-in:"),
    "globals.css debe definir el token --animate-fade-in",
  );
  assert.ok(
    css.includes("@keyframes fade-in"),
    "globals.css debe definir @keyframes fade-in",
  );
  const start = css.indexOf("@keyframes fade-in {");
  const end = css.indexOf("@keyframes fade-in-up");
  assert.ok(start >= 0 && end > start, "ambos keyframes deben existir");
  const block = css.slice(start, end);
  assert.ok(
    block.includes("opacity"),
    "fade-in anima la opacidad",
  );
  assert.ok(
    !block.includes("translate"),
    "fade-in no debe desplazar (sin translate), a diferencia de fade-in-up",
  );
  assert.ok(
    css.includes(".animate-fade-in"),
    "globals.css debe contemplar .animate-fade-in en movimiento reducido",
  );
});

test("el lema del home conserva FadeInLetters", () => {
  assert.ok(
    home.includes("FadeInLetters"),
    "app/page.tsx debe seguir usando FadeInLetters en el lema",
  );
  assert.ok(
    letters.includes("animate-fade-in-up"),
    "FadeInLetters sigue con animate-fade-in-up para el home",
  );
});
