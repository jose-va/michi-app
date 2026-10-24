import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  ABOUT_SIGNATURE,
  ABOUT_SIGNATURE_IMAGE_ALT,
  buildAboutSignatureUrl,
} from "@/common/utils/about-content";

const SOURCE = readFileSync("app/about/page.tsx", "utf8");

describe("About T10: bloque de firma imagen + texto literal (RF-3, RF-4, RNF-4)", () => {
  it("usa la URL de firma del módulo de contenido", () => {
    assert.ok(SOURCE.includes("ABOUT_SIGNATURE_IMAGE_SRC"));
    assert.equal(buildAboutSignatureUrl(), "/images/firma-milo.webp");
  });

  it("imagen next/image centrada (mx-auto) con dimensiones reales", () => {
    assert.ok(SOURCE.includes("next/image"));
    assert.ok(SOURCE.includes("mx-auto"));
    assert.ok(
      SOURCE.includes("ABOUT_SIGNATURE_IMAGE_WIDTH"),
      "width intrínseco real de la firma",
    );
    assert.ok(
      SOURCE.includes("ABOUT_SIGNATURE_IMAGE_HEIGHT"),
      "height intrínseco real de la firma",
    );
  });

  it("alt equivalente a la firma literal del Anexo A", () => {
    assert.equal(
      ABOUT_SIGNATURE_IMAGE_ALT,
      "Milo Márquez / Chef y creador de Michi.",
    );
    assert.ok(
      SOURCE.includes("ABOUT_SIGNATURE_IMAGE_ALT") ||
        SOURCE.includes("alt={ABOUT_SIGNATURE}"),
      "el alt de la imagen equivale a la firma literal",
    );
  });

  it("texto literal visible intacto en Playfair itálica (fallback si falta la imagen)", () => {
    assert.ok(SOURCE.includes("ABOUT_SIGNATURE"));
    assert.ok(SOURCE.includes("italic"));
    // El texto se renderiza siempre, fuera de cualquier condicional:
    // si la imagen falta o falla, el literal permanece sin error 500.
    assert.ok(!SOURCE.includes("ABOUT_SIGNATURE_IMAGE_SRC ?"));
    assert.ok(!SOURCE.includes("&& ABOUT_SIGNATURE"));
  });

  it("bloque de firma centrado debajo del relato", () => {
    const articleIndex = SOURCE.indexOf("<article");
    const signatureIndex = SOURCE.indexOf("ABOUT_SIGNATURE", articleIndex);
    assert.ok(articleIndex >= 0 && signatureIndex > articleIndex);
    assert.ok(SOURCE.includes("text-center"));
  });

  it("la firma literal no se altera", () => {
    assert.equal(ABOUT_SIGNATURE, "Milo Márquez / Chef y creador de Michi.");
  });
});
