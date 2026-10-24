import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { buildAboutImageUrl } from "@/common/utils/about-content";

const SOURCE = readFileSync("app/about/page.tsx", "utf8");

describe("About: reescritura sin restos del Accordion provisional (RF-1)", () => {
  it("no contiene Accordion ni textos del contenido provisional", () => {
    for (const leftover of [
      "Accordion",
      "AccordionItem",
      "AccordionTrigger",
      "AccordionContent",
      "Notification Settings",
      "Privacy & Security",
      "Billing & Subscription",
    ]) {
      assert.ok(
        !SOURCE.includes(leftover),
        `resto del Accordion detectado: ${leftover}`,
      );
    }
  });

  it("es un Server Component (sin directiva de cliente)", () => {
    assert.ok(!SOURCE.includes('"use client"'));
    assert.ok(!SOURCE.includes("'use client'"));
  });
});

describe("About: estructura y card sobre la foto (RF-1, RF-5, RNF-4)", () => {
  it("section sin fondo negro sólido", () => {
    assert.ok(SOURCE.includes("<section"));
    assert.ok(!/\bbg-black(?![/\w-])/.test(SOURCE));
  });

  it("foto del chef decorativa (object-cover, alt vacío)", () => {
    assert.ok(SOURCE.includes("buildAboutImageUrl()"));
    assert.ok(!SOURCE.includes("src={ABOUT_IMAGE_SRC}"));
    assert.equal(buildAboutImageUrl(), "/images/Foto%20Milo.webp");
    assert.ok(SOURCE.includes("next/image"));
    assert.ok(SOURCE.includes("object-cover"));
    assert.ok(SOURCE.includes('alt=""'));
    assert.ok(!SOURCE.includes("fixed inset-0"));
    assert.ok(!SOURCE.includes("backgroundImage"));
  });

  it("card bg-black/80 sobre la foto", () => {
    assert.ok(SOURCE.includes("bg-black/80"));
  });

  it("article con Montserrat y título en Playfair Display", () => {
    assert.ok(SOURCE.includes("<article"));
    assert.ok(SOURCE.includes("montserrat"));
    assert.ok(SOURCE.includes("playfair"));
  });
});
