import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FadeInLetters from "@/common/components/FadeInLetters";

const PAGE_PATH = "app/about/page.tsx";
const WRAPPER_PATH = "common/components/FadeInLetters.tsx";
const CSS_PATH = "app/globals.css";

const PAGE_SOURCE = readFileSync(PAGE_PATH, "utf8");
const CSS_SOURCE = readFileSync(CSS_PATH, "utf8");

function readWrapper(): string {
  assert.ok(existsSync(WRAPPER_PATH), "falta el envoltorio FadeInLetters");
  return readFileSync(WRAPPER_PATH, "utf8");
}

describe("About fade-in letra a letra: envoltorio cliente mínimo", () => {
  it("existe el envoltorio cliente con directiva de cliente", () => {
    const source = readWrapper();
    assert.ok(
      source.includes('"use client"') || source.includes("'use client'"),
      "el envoltorio debe ser Client Component",
    );
  });

  it("la página sigue siendo servidor y delega la animación al envoltorio", () => {
    assert.ok(!PAGE_SOURCE.includes('"use client"'));
    assert.ok(!PAGE_SOURCE.includes("'use client'"));
    assert.ok(
      PAGE_SOURCE.includes("FadeInLetters"),
      "la página debe animar los textos con FadeInLetters",
    );
    assert.ok(
      PAGE_SOURCE.includes("@/common/components/FadeInLetters"),
      "import con alias @/",
    );
  });

  it("fragmenta el texto por letra con retardo creciente por índice base", () => {
    const source = readWrapper();
    assert.ok(
      source.includes("Array.from") || source.includes(".split("),
      "debe partir el texto en letras",
    );
    assert.ok(source.includes("baseIndex"), "acepta el índice base global");
    assert.ok(
      source.includes("animationDelay"),
      "aplica el retardo creciente en línea",
    );
    assert.ok(
      source.includes("animate-fade-in-up"),
      "reutiliza la aparición del tema global",
    );
  });

  it("solo al cargar: sin observador de intersección", () => {
    const source = readWrapper();
    assert.ok(!source.includes("IntersectionObserver"));
    assert.ok(!PAGE_SOURCE.includes("IntersectionObserver"));
  });

  it("contenido visible por defecto: sin ocultado estático", () => {
    const source = readWrapper();
    assert.ok(!source.includes("opacity-0"), "sin opacidad cero fija");
    assert.ok(!source.includes("invisible"), "sin invisibilidad fija");
  });

  it("sin anchos fijos ni desbordes nuevos en el envoltorio", () => {
    const source = readWrapper();
    assert.ok(!source.includes("min-w-"));
    assert.ok(!source.includes("whitespace-nowrap"));
    assert.ok(!source.includes("fixed"));
  });

  it("accesibilidad estática: letras ocultas y texto completo expuesto", () => {
    const source = readWrapper();
    assert.ok(
      source.includes('aria-hidden="true"') || source.includes("aria-hidden"),
      "las letras no deben deletrearse en el lector",
    );
    assert.ok(
      source.includes("aria-label"),
      "el texto completo debe exponerse al lector",
    );
  });

  it("movimiento reducido desactiva la animación en CSS global", () => {
    assert.ok(
      CSS_SOURCE.includes("prefers-reduced-motion"),
      "falta la regla de movimiento reducido",
    );
    const ruleIndex = CSS_SOURCE.indexOf("prefers-reduced-motion");
    const animationIndex = CSS_SOURCE.indexOf(
      "animate-fade-in-up",
      ruleIndex,
    );
    assert.ok(
      animationIndex > ruleIndex,
      "la regla debe alcanzar a la aparición reutilizada",
    );
  });

  it("textos e identificadores de contenido intactos", () => {
    for (const token of [
      "ABOUT_TITLE",
      "ABOUT_KANJI",
      "getAboutParagraphs",
      "ABOUT_SIGNATURE",
      "buildAboutImageUrl",
    ]) {
      assert.ok(PAGE_SOURCE.includes(token), `falta ${token}`);
    }
    assert.equal(
      (PAGE_SOURCE.match(/<h1[\s>]/g) ?? []).length,
      1,
      "un solo h1",
    );
  });

  it("titular, párrafos y firma usan FadeInLetters con retardo global continuo", () => {
    assert.ok(
      PAGE_SOURCE.includes("text={ABOUT_TITLE}"),
      "el titular se anima letra a letra",
    );
    assert.ok(
      PAGE_SOURCE.includes("text={paragraph}"),
      "cada párrafo se anima letra a letra",
    );
    assert.ok(
      PAGE_SOURCE.includes("text={ABOUT_SIGNATURE}"),
      "la firma se anima letra a letra",
    );
    assert.ok(
      PAGE_SOURCE.includes("ABOUT_TITLE.length"),
      "el retardo parte de la longitud del titular",
    );
    assert.ok(
      PAGE_SOURCE.includes("paragraph.length"),
      "el retardo acumula la longitud del relato",
    );
    const mapIndex = PAGE_SOURCE.indexOf("getAboutParagraphs().map");
    const footerIndex = PAGE_SOURCE.indexOf("<footer");
    assert.ok(mapIndex !== -1 && footerIndex > mapIndex);
    const signatureUsage = PAGE_SOURCE.indexOf("text={ABOUT_SIGNATURE}");
    assert.ok(
      signatureUsage > mapIndex,
      "la firma continúa el escalonado tras el relato",
    );
  });
});

describe("About fade-in letra a letra: comportamiento del envoltorio", () => {
  function letterHtml(text: string, baseIndex = 0): string {
    return renderToStaticMarkup(
      createElement(FadeInLetters, { text, baseIndex }),
    );
  }

  it("expone el texto completo y oculta las letras al lector", () => {
    const html = letterHtml("Michi", 0);
    assert.ok(
      html.includes('aria-label="Michi"'),
      "el contenedor expone el texto completo",
    );
    assert.ok(
      html.includes('aria-hidden="true"'),
      "las letras quedan ocultas al lector",
    );
  });

  it("renderiza una marca por letra con retardos estrictamente crecientes", () => {
    const html = letterHtml("Michi", 10);
    const delays = [...html.matchAll(/animation-delay:\s*(\d+)ms/g)].map(
      (match) => Number(match[1]),
    );
    assert.equal(delays.length, 5, "una marca animada por letra");
    for (let i = 1; i < delays.length; i += 1) {
      assert.ok(
        delays[i] > delays[i - 1],
        `el retardo debe crecer letra a letra: ${delays.join(",")}`,
      );
    }
    assert.ok(
      delays[0] >= 10,
      "el índice base desplaza toda la secuencia",
    );
  });

  it("el escalonado es continuo entre bloques", () => {
    const first = letterHtml("AB", 0);
    const second = letterHtml("CD", 2);
    const firstDelays = [...first.matchAll(/animation-delay:\s*(\d+)ms/g)].map(
      (match) => Number(match[1]),
    );
    const secondDelays = [
      ...second.matchAll(/animation-delay:\s*(\d+)ms/g),
    ].map((match) => Number(match[1]));
    assert.deepEqual(firstDelays.length, 2);
    assert.deepEqual(secondDelays.length, 2);
    assert.ok(
      secondDelays[0] > firstDelays[firstDelays.length - 1],
      "el segundo bloque continúa donde termina el primero",
    );
  });

  it("preserva el texto completo incluidos los espacios", () => {
    const html = letterHtml("a b", 0);
    const visible = html.replace(/<[^>]*>/g, "");
    assert.equal(visible, "a b");
  });

  it("respeta el contraste y el foco: sin estilos propios de color ni foco", () => {
    const source = readWrapper();
    assert.ok(!source.includes("tabIndex"), "sin tabIndex manual");
    assert.ok(!source.includes("autoFocus"), "sin autoFocus");
    assert.ok(!source.includes("text-zinc"), "los tonos los pone la página");
  });
});
