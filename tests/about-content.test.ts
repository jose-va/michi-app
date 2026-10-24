// RF-3: el relato y la firma reproducen el Anexo A de specs/006-about/spec.md
// byte a byte (diff vacío verificado por script 21 oct 2026, ver
// specs/006-about/verificacion-vuelta1.md §1): cero tildes/puntuación
// cambiadas, cero palabras añadidas/quitadas. Pendiente solo el visto bueno
// explícito del usuario (D1 de la spec). No cambiar estos literales.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ABOUT_IMAGE_SRC,
  ABOUT_KANJI,
  ABOUT_PARAGRAPHS,
  ABOUT_SIGNATURE,
  ABOUT_SIGNATURE_IMAGE_ALT,
  ABOUT_SIGNATURE_IMAGE_HEIGHT,
  ABOUT_SIGNATURE_IMAGE_SRC,
  ABOUT_SIGNATURE_IMAGE_WIDTH,
  ABOUT_TITLE,
  buildAboutImageUrl,
  buildAboutSignatureUrl,
  getAboutParagraphs,
} from "@/common/utils/about-content";

const P1 = 'En japonés, Michi significa "Camino".';
const P2 =
  "Aunque mis inicios estuvieron ligados al dibujo y las artes, la vida me guió hacia la gastronomía japonesa, donde descubrí que el lienzo puede ser un plato y el pincel, un cuchillo.";
const P3 =
  "Tras emigrar de Venezuela y continuar mi crecimiento profesional en Europa, este restaurante nace como un espacio de libertad absoluta, sin restricciones creativas.";
const P4 =
  "Michi es el resultado de ese recorrido, una propuesta honesta donde plasmo los sabores que me han marcado a ambos lados del atlántico. Aquí, la técnica tradicional se fusiona con mi propia visión, movida siempre por la pasión a lo que hago.";
const P5 =
  "Gracias por acompañarme en este tramo del camino. Disfruta de la experiencia.";
const SIGNATURE = "Milo Márquez / Chef y creador de Michi.";

describe("About: título y kanji (RF-2)", () => {
  it("título exacto «BIENVENIDOS A MICHI»", () => {
    assert.equal(ABOUT_TITLE, "BIENVENIDOS A MICHI");
  });

  it("kanji «道» como elemento separado, no dentro del título", () => {
    assert.equal(ABOUT_KANJI, "道");
    assert.ok(!ABOUT_TITLE.includes(ABOUT_KANJI));
  });
});

describe("About: relato y firma literales en orden (RF-3)", () => {
  it("cinco párrafos en el orden del Anexo A", () => {
    assert.equal(ABOUT_PARAGRAPHS.length, 5);
    assert.deepEqual(ABOUT_PARAGRAPHS, [P1, P2, P3, P4, P5]);
  });

  it("P1 literal exacto", () => {
    assert.equal(ABOUT_PARAGRAPHS[0], P1);
  });

  it("P2–P5 literales exactos", () => {
    assert.equal(ABOUT_PARAGRAPHS[1], P2);
    assert.equal(ABOUT_PARAGRAPHS[2], P3);
    assert.equal(ABOUT_PARAGRAPHS[3], P4);
    assert.equal(ABOUT_PARAGRAPHS[4], P5);
  });

  it("firma literal exacta", () => {
    assert.equal(ABOUT_SIGNATURE, SIGNATURE);
  });

  it("getAboutParagraphs devuelve una copia en orden", () => {
    const copy = getAboutParagraphs();
    assert.deepEqual(copy, [P1, P2, P3, P4, P5]);
    assert.notEqual(copy, ABOUT_PARAGRAPHS);
    copy.push("intruso");
    assert.equal(ABOUT_PARAGRAPHS.length, 5);
  });
});

describe("About: imagen tal cual con URL codificada (RF-5)", () => {
  it("ruta cruda con espacio y mayúsculas, sin codificar", () => {
    assert.equal(ABOUT_IMAGE_SRC, "/images/Foto Milo.webp");
  });

  it("buildAboutImageUrl codifica el espacio sin doble encoding", () => {
    assert.equal(buildAboutImageUrl(), "/images/Foto%20Milo.webp");
    assert.equal(
      buildAboutImageUrl("/images/Foto Milo.webp"),
      "/images/Foto%20Milo.webp",
    );
    assert.ok(buildAboutImageUrl().includes("Foto%20Milo.webp"));
    assert.ok(buildAboutImageUrl().includes("Milo"));
    assert.ok(buildAboutImageUrl().endsWith(".webp"));
    assert.equal(
      buildAboutImageUrl("/images/Foto%20Milo.webp"),
      "/images/Foto%20Milo.webp",
    );
    assert.ok(!buildAboutImageUrl().includes("%2520"));
  });
});

describe("About: imagen de firma manuscrita (RF-3, D7)", () => {
  it("ruta exacta sin espacios ni mayúsculas", () => {
    assert.equal(ABOUT_SIGNATURE_IMAGE_SRC, "/images/firma-milo.webp");
  });

  it("buildAboutSignatureUrl devuelve la ruta exacta sin doble codificación", () => {
    assert.equal(buildAboutSignatureUrl(), "/images/firma-milo.webp");
    assert.equal(
      buildAboutSignatureUrl("/images/firma-milo.webp"),
      "/images/firma-milo.webp",
    );
    assert.ok(!buildAboutSignatureUrl().includes("%25"));
  });

  it("alt de la firma equivale a la firma literal del Anexo A", () => {
    assert.equal(ABOUT_SIGNATURE_IMAGE_ALT, ABOUT_SIGNATURE);
    assert.equal(
      ABOUT_SIGNATURE_IMAGE_ALT,
      "Milo Márquez / Chef y creador de Michi.",
    );
  });

  it("dimensiones intrínsecas reales de firma-milo.webp (1264x385)", () => {
    assert.equal(ABOUT_SIGNATURE_IMAGE_WIDTH, 1264);
    assert.equal(ABOUT_SIGNATURE_IMAGE_HEIGHT, 385);
  });
});

describe("About: español salvo «道», sin restos del Accordion en inglés (RF-8)", () => {
  it("sin restos de inglés del contenido provisional", () => {
    const all = [ABOUT_TITLE, ...ABOUT_PARAGRAPHS, ABOUT_SIGNATURE].join(
      "\n",
    );
    for (const leftover of [
      "Accordion",
      "Lorem",
      "Welcome",
      "Example",
      "Click",
    ]) {
      assert.ok(
        !all.includes(leftover),
        `resto en inglés detectado: ${leftover}`,
      );
    }
  });

  it("todo el texto en español salvo el kanji «道»", () => {
    const all = [ABOUT_TITLE, ...ABOUT_PARAGRAPHS, ABOUT_SIGNATURE].join(
      " ",
    );
    const withoutKanji = all.replaceAll(ABOUT_KANJI, "");
    assert.match(withoutKanji, /[a-záéíóúñü]/i);
    assert.ok(!/[\u4E00-\u9FFF]/.test(withoutKanji));
    assert.ok(!ABOUT_PARAGRAPHS.some((p) => p.includes(ABOUT_KANJI)));
    assert.ok(!ABOUT_SIGNATURE.includes(ABOUT_KANJI));
  });
});
