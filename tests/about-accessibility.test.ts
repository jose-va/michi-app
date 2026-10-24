import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const SOURCE = readFileSync("app/about/page.tsx", "utf8");

describe("About T9: foto contenida decorativa no anunciada (RF-9)", () => {
  it("la foto es next/image contenida, no fondo CSS ni <img> literal", () => {
    assert.ok(!SOURCE.includes("<img"), "la foto no debe ser un <img> literal");
    assert.ok(
      SOURCE.includes("next/image"),
      "la foto debe usar next/image contenida",
    );
    assert.ok(
      SOURCE.includes("object-cover"),
      "la foto debe cubrir el contenedor (object-cover)",
    );
    assert.ok(
      !SOURCE.includes("backgroundImage"),
      "la foto no debe ser fondo CSS",
    );
    assert.ok(SOURCE.includes('alt=""'), "la foto decorativa lleva alt vacío");
    assert.ok(
      !SOURCE.includes('role="img"'),
      "el fondo decorativo no lleva role img",
    );
  });

  it("el kanji decorativo está oculto al lector de pantalla", () => {
    assert.ok(SOURCE.includes('aria-hidden="true"'));
  });
});

describe("About T7: h1 único (RF-9)", () => {
  it("hay exactamente un h1 en la página", () => {
    const h1Count = (SOURCE.match(/<h1[\s>]/g) ?? []).length;
    assert.equal(h1Count, 1);
  });

  it("el h1 abre el article: título antes que los párrafos (orden de lectura)", () => {
    const h1Index = SOURCE.indexOf("<h1");
    const paragraphsIndex = SOURCE.indexOf("getAboutParagraphs().map");
    assert.ok(h1Index !== -1 && paragraphsIndex !== -1);
    assert.ok(
      h1Index < paragraphsIndex,
      "el h1 debe preceder a los párrafos en el DOM",
    );
  });
});

describe("About T7: recorrido de teclado lógico sin trampas (RF-9)", () => {
  it("sin tabIndex positivos, autoFocus ni manejadores de foco/teclado", () => {
    assert.ok(!SOURCE.includes("tabIndex"), "sin tabIndex manual");
    assert.ok(!SOURCE.includes("autoFocus"), "sin autoFocus");
    assert.ok(!SOURCE.includes("onKey"), "sin manejadores de teclado");
    assert.ok(!SOURCE.includes("onFocus"), "sin manejadores de foco");
  });

  it("sin elementos interactivos propios: nada que atrape el foco", () => {
    for (const interactive of [
      "<button",
      "<a ",
      "<input",
      "<select",
      "<textarea",
      'role="button"',
      'role="dialog"',
    ]) {
      assert.ok(
        !SOURCE.includes(interactive),
        `elemento interactivo inesperado: ${interactive}`,
      );
    }
  });

  it("sin reordenación visual: el DOM sigue el orden de lectura", () => {
    for (const reorder of [
      /(?<![\w-])order-/,
      /flex-row-reverse/,
      /flex-col-reverse/,
    ]) {
      assert.ok(
        !reorder.test(SOURCE),
        `reordenación visual inesperada: ${reorder}`,
      );
    }
  });
});
