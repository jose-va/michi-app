import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const SOURCE = readFileSync("app/about/page.tsx", "utf8");

describe("About: foto de fondo con card translúcida (RF-5, RF-10)", () => {
  it("sin cuadro negro: ni fondo ni velo negro opaco", () => {
    assert.ok(!SOURCE.includes("bg-black/65"), "sin velo sobre la foto");
    assert.ok(!/\bbg-black(?![/\w-])/.test(SOURCE), "sin fondo negro sólido");
    assert.ok(!SOURCE.includes("sticky"), "sin capa sticky");
  });

  it("foto como fondo del contenedor (fill + object-cover)", () => {
    assert.ok(SOURCE.includes("fill"), "la foto debe usar fill");
    assert.ok(SOURCE.includes("object-cover"), "falta object-cover");
    assert.ok(!SOURCE.includes("backgroundImage"), "sin fondo CSS");
    assert.ok(SOURCE.includes("max-w-prose"), "falta max-w-prose");
    assert.ok(SOURCE.includes("rounded-lg"), "falta rounded-lg");
    assert.ok(SOURCE.includes("overflow-hidden"), "falta overflow-hidden");
  });

  it("card negra transparente con blur, foto delante con transparencia", () => {
    assert.ok(SOURCE.includes("bg-black/80"), "falta bg-black/80");
    assert.ok(SOURCE.includes("backdrop-blur-md"), "falta backdrop-blur-md");
  });

  it("src codificado vía buildAboutImageUrl() (Foto%20Milo)", () => {
    assert.ok(
      SOURCE.includes("buildAboutImageUrl()"),
      "el src debe usar buildAboutImageUrl()",
    );
    assert.ok(
      !SOURCE.includes("src={ABOUT_IMAGE_SRC}"),
      "prohibido el src crudo con espacio sin codificar",
    );
  });

  it("foto decorativa no anunciada (alt vacío)", () => {
    assert.ok(SOURCE.includes('alt=""'), "falta alt vacío decorativo");
  });
});
