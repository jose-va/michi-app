import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FOOTER_CONTACT } from "@/common/components/layout/footer-links";

const iconsSource = readFileSync(
  join(process.cwd(), "common/components/layout/FooterContactIcons.tsx"),
  "utf8",
);
const footerSource = readFileSync(
  join(process.cwd(), "common/components/layout/SiteFooter.tsx"),
  "utf8",
);

describe("Iconos de contacto del footer", () => {
  it("contiene exactamente 4 contactos con icono", () => {
    assert.equal(FOOTER_CONTACT.length, 4);
    assert.deepEqual(
      FOOTER_CONTACT.map((item) => item.icon),
      ["instagram", "whatsapp", "phone", "mail"],
    );
  });

  it("mantiene los hrefs actuales de contacto", () => {
    assert.deepEqual(
      FOOTER_CONTACT.map((item) => item.href),
      [
        "https://www.instagram.com/michisushigranada",
        "https://api.whatsapp.com/send/?phone=34673821148",
        "tel:+34673821148",
        "mailto:michisushigranada@gmail.com",
      ],
    );
  });

  it("usa lucide Phone y Mail y los SVG oficiales de marca", () => {
    assert.ok(iconsSource.includes('from "lucide-react"'));
    assert.ok(iconsSource.includes("Phone"));
    assert.ok(iconsSource.includes("Mail"));
    assert.ok(
      iconsSource.includes("/icons/Digital_Glyph_Green_RGB_2026.svg"),
    );
    assert.ok(iconsSource.includes("/icons/Instagram_Glyph_Gradient.svg"));
  });

  it("no muestra etiqueta visible bajo los iconos y conserva el nombre accesible", () => {
    assert.ok(!iconsSource.includes("{item.label}</span>"));
    assert.ok(iconsSource.includes("aria-label"));
  });

  it("el footer monta secciones, iconos y legal en línea con separadores", () => {
    assert.ok(footerSource.includes("FooterContactIcons"));
    assert.ok(footerSource.includes('aria-label="Secciones"'));
    assert.ok(footerSource.includes('aria-label="Información legal"'));
    assert.ok(footerSource.includes("aria-hidden"));
  });
});
