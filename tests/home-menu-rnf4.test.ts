import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { HOME_SECTIONS } from "../common/utils/home-content";

const pageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

const cartaStart = pageSource.indexOf('id="seccion-carta"');
const reservasStart = pageSource.indexOf('id="seccion-reservas"');
assert.ok(cartaStart >= 0 && reservasStart > cartaStart, "Carta section must exist before reservas section");
const cartaBlock = pageSource.slice(cartaStart, reservasStart);

test("RNF-4: carta data exposes exact title, action label and destination", () => {
  const menu = HOME_SECTIONS.find((section) => section.id === "menu");
  assert.ok(menu, "HOME_SECTIONS must include the menu section");
  assert.equal(menu.title, "CONOCE NUESTRA CARTA");
  assert.equal(menu.actionLabel, "Ver todos los platos");
  assert.equal(menu.actionHref, "/product");
});

test("RNF-4: carta title uses exact text with measurable typography tokens", () => {
  assert.ok(
    cartaBlock.includes("menuSection.title") || cartaBlock.includes("CONOCE NUESTRA CARTA"),
    "Carta title must render the exact «CONOCE NUESTRA CARTA» text",
  );
  const heading = cartaBlock.match(/<h2[^>]*>/)?.[0];
  assert.ok(heading, "Carta section must include an h2 title");
  for (const token of [
    "uppercase",
    "font-extrabold",
    "text-4xl",
    "md:text-5xl",
    "text-white",
    "tracking-tight",
    "montserrat",
  ]) {
    assert.ok(heading.includes(token), `Carta h2 must include «${token}»`);
  }
});

test("RNF-4: carta body keeps emphasis within the 30% rule", () => {
  const body = cartaBlock.match(/<p className="([^"]*)">([\s\S]*?)<\/p>/);
  assert.ok(body, "Carta section must include a body paragraph");
  for (const token of ["text-base", "md:text-lg", "text-zinc-300"]) {
    assert.ok(body[1].includes(token), `Carta body must include «${token}»`);
  }
  const strongs = [...body[2].matchAll(/<strong className="([^"]*)">([\s\S]*?)<\/strong>/g)];
  assert.ok(strongs.length >= 1 && strongs.length <= 3, "Carta body must highlight 1–3 segments");
  for (const strong of strongs) {
    assert.ok(strong[1].includes("text-white"), "Each <strong> must use text-white");
    assert.ok(strong[1].includes("font-bold"), "Each <strong> must use font-bold");
  }
  const plainText = body[2]
    .replace(/\{" "\}/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const highlighted = strongs
    .map((strong) => strong[2].replace(/\s+/g, " ").trim())
    .join(" ");
  assert.ok(plainText.length > 0, "Carta body must include readable text");
  assert.ok(
    highlighted.length / plainText.length <= 0.3,
    `Highlighted text must stay within 30% of the body (${highlighted.length}/${plainText.length})`,
  );
});

test("RNF-4: carta button is a pill Button default/lg to the carta destination", () => {
  const button = cartaBlock.match(/<Button[^>]*>/)?.[0];
  assert.ok(button, "Carta section must include a Button");
  assert.ok(button.includes('variant="default"'), "Carta Button must use variant default");
  assert.ok(button.includes('size="lg"'), "Carta Button must use size lg");
  assert.ok(button.includes("rounded-full"), "Carta Button must be a pill (rounded-full)");
  assert.ok(
    cartaBlock.includes("menuSection.actionLabel") || cartaBlock.includes("Ver todos los platos"),
    "Carta Button must show «Ver todos los platos»",
  );
  assert.ok(
    cartaBlock.includes('menuSection.actionHref') || cartaBlock.includes('"/product"'),
    "Carta Button must target /product",
  );
});

test("RNF-4: carta image keeps aspect-video with a contained circular badge", () => {
  assert.ok(cartaBlock.includes("aspect-video"), "Carta image frame must use aspect-video");
  assert.ok(cartaBlock.includes("w-full"), "Carta image frame must be w-full");
  assert.ok(cartaBlock.includes("object-cover"), "Carta image must use object-cover");
  assert.ok(
    cartaBlock.includes("Explora nuestros platos"),
    "Carta badge must show «Explora nuestros platos»",
  );
  const badge = cartaBlock.match(/<span[^>]*>\s*Explora nuestros platos\s*<\/span>/)?.[0];
  assert.ok(badge, "Carta badge must be a span with the exact text");
  for (const token of [
    "absolute",
    "rounded-full",
    "size-20",
    "md:size-24",
    "bg-primary",
    "text-primary-foreground",
    "text-xs",
  ]) {
    assert.ok(badge.includes(token), `Carta badge must include «${token}»`);
  }
});

test("RNF-4: carta stacks in one column on mobile without Card wrappers", () => {
  const sectionTag = cartaBlock.match(/<section[^>]*>/)?.[0] ?? cartaBlock.slice(0, 400);
  assert.ok(sectionTag.includes("grid-cols-1"), "Carta section must use grid-cols-1 on mobile");
  assert.ok(sectionTag.includes("md:grid-cols-2"), "Carta section must use md:grid-cols-2 on desktop");
  assert.ok(!pageSource.includes("<Card"), "Home must not render Card wrappers");
  assert.ok(!pageSource.includes("from \"@/shadcn/components/card\""), "Home must not import Card");
});

test("RNF-4: four sections in order and RF-5 schedule stay intact", () => {
  for (const id of ["seccion-lema", "seccion-carta", "seccion-reservas", "seccion-ubicacion"]) {
    assert.ok(pageSource.includes(`id="${id}"`), `Home must keep section ${id}`);
  }
  assert.ok(
    pageSource.indexOf('id="seccion-lema"') < pageSource.indexOf('id="seccion-carta"') &&
      pageSource.indexOf('id="seccion-carta"') < pageSource.indexOf('id="seccion-reservas"') &&
      pageSource.indexOf('id="seccion-reservas"') < pageSource.indexOf('id="seccion-ubicacion"'),
    "Sections must keep the approved order",
  );
  assert.ok(pageSource.includes('id="bloque-horarios"'), "RF-5 schedule block must stay intact");
});
