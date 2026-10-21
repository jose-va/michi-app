import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isCurrentFooterLink } from "@/common/components/layout/footer-links";

describe("Marca de auto-enlace del footer (RF-16)", () => {
  it("marca la raíz solo en la raíz", () => {
    assert.equal(isCurrentFooterLink("/", "/"), true);
    assert.equal(isCurrentFooterLink("/", "/about"), false);
    assert.equal(isCurrentFooterLink("/", "/product"), false);
  });

  it("marca cada sección solo en su ruta exacta", () => {
    assert.equal(isCurrentFooterLink("/about", "/about"), true);
    assert.equal(isCurrentFooterLink("/product", "/product"), true);
    assert.equal(isCurrentFooterLink("/reservation", "/reservation"), true);
    assert.equal(isCurrentFooterLink("/location", "/location"), true);
    assert.equal(isCurrentFooterLink("/product", "/about"), false);
    assert.equal(isCurrentFooterLink("/about", "/"), false);
  });

  it("marca cada página legal solo en su ruta exacta", () => {
    assert.equal(isCurrentFooterLink("/privacidad", "/privacidad"), true);
    assert.equal(isCurrentFooterLink("/aviso-legal", "/aviso-legal"), true);
    assert.equal(isCurrentFooterLink("/cookies", "/cookies"), true);
    assert.equal(isCurrentFooterLink("/cookies", "/privacidad"), false);
  });

  it("tolera la barra final en la ruta actual", () => {
    assert.equal(isCurrentFooterLink("/about", "/about/"), true);
    assert.equal(isCurrentFooterLink("/privacidad", "/privacidad/"), true);
  });
});
