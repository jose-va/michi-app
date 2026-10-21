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
  assert.equal(menu.title, "NUESTRA CARTA");
  assert.equal(menu.actionLabel, "Ver todos los platos");
  assert.equal(menu.actionHref, "/product");
});

test("RNF-4: carta title uses exact text with measurable typography tokens", () => {
  assert.ok(
    cartaBlock.includes("menuSection.title") || cartaBlock.includes("NUESTRA CARTA"),
    "Carta title must render the exact «NUESTRA CARTA» text",
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

test("Carta button matches Reserva mesa: rounded-lg base, no pill override", () => {
  const button = cartaBlock.match(/<Button[^>]*>/)?.[0];
  assert.ok(button, "Carta section must include a Button");
  assert.ok(button.includes('variant="default"'), "Carta Button must use variant default");
  assert.ok(button.includes('size="lg"'), "Carta Button must use size lg");
  assert.ok(!button.includes("rounded-full"), "Carta Button must not override the pill (rounded-full)");
  assert.ok(
    button.includes("bg-black") && button.includes("font-semibold"),
    "Carta Button must keep bg-black font-semibold like Reserva mesa",
  );
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
    cartaBlock.includes("Fusión Tropical"),
    "Carta badge must show «Fusión Tropical»",
  );
  assert.ok(
    cartaBlock.includes("Maracuyá"),
    "Carta badge must show «Ebi & Maracuyá»",
  );
  const badge = cartaBlock.match(/<span className="[^"]*absolute[^"]*rounded-full[^"]*">/)?.[0];
  assert.ok(badge, "Carta badge must be an absolute circular span");
  for (const token of [
    "absolute",
    "rounded-full",
    "size-24",
    "md:size-28",
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

test("Home: carta, reservas y ubicacion share the NUESTRA CARTA typography", () => {
  for (const id of ["seccion-carta", "seccion-reservas", "seccion-ubicacion"]) {
    const start = pageSource.indexOf(`id="${id}"`);
    assert.ok(start >= 0, `Home must keep section ${id}`);
    const block = pageSource.slice(start, start + 2000);
    const heading = block.match(/<h2[^>]*>/)?.[0];
    assert.ok(heading, `Section ${id} must include an h2 title`);
    for (const token of [
      "uppercase",
      "font-extrabold",
      "text-4xl",
      "md:text-5xl",
      "text-white",
      "tracking-tight",
      "montserrat",
    ]) {
      assert.ok(heading.includes(token), `Section ${id} h2 must include «${token}»`);
    }
  }
});

test("Home: lema keeps its original small overline format, not an h2", () => {
  const start = pageSource.indexOf('id="seccion-lema"');
  assert.ok(start >= 0, "Home must keep section seccion-lema");
  const end = pageSource.indexOf("</section>", start);
  assert.ok(end > start, "Lema section must close");
  const block = pageSource.slice(start, end);
  assert.ok(!block.match(/<h2[^>]*>/), "Lema section must not use an h2 title");
  const overline = block.match(/<span[^>]*>\s*\{mottoSection\.title\}\s*<\/span>/)?.[0];
  assert.ok(overline, "Lema title must be a span rendering mottoSection.title");
  for (const token of [
    "text-xs",
    "font-bold",
    "tracking-widest",
    "text-primary",
    "uppercase",
    "brightness-120",
  ]) {
    assert.ok(overline.includes(token), `Lema span must include «${token}»`);
  }
  assert.ok(!overline.includes("font-semibold"), "Lema span must not use font-semibold");
  assert.ok(
    block.includes("mottoSection.description"),
    "Lema Playfair italic quote must stay intact",
  );
});

test("Home RF-19 (005-footer): sin bloque de horario fuera del pie", () => {
  assert.ok(
    !pageSource.includes('id="bloque-horarios"'),
    "Home must not render bloque-horarios (el horario vive solo en el pie)",
  );
  assert.ok(
    !pageSource.includes("Horario de Apertura"),
    "«Horario de Apertura» debe aparecer 0 veces en app/page.tsx (solo en el pie)",
  );
});

test("RNF-4: four sections in order and RF-19 (sin horario en el home)", () => {
  for (const id of ["seccion-lema", "seccion-carta", "seccion-reservas", "seccion-ubicacion"]) {
    assert.ok(pageSource.includes(`id="${id}"`), `Home must keep section ${id}`);
  }
  assert.ok(
    pageSource.indexOf('id="seccion-lema"') < pageSource.indexOf('id="seccion-carta"') &&
      pageSource.indexOf('id="seccion-carta"') < pageSource.indexOf('id="seccion-reservas"') &&
      pageSource.indexOf('id="seccion-reservas"') < pageSource.indexOf('id="seccion-ubicacion"'),
    "Sections must keep the approved order",
  );
  assert.ok(!pageSource.includes('id="bloque-horarios"'), "RF-19: home must not render a schedule block outside the footer");
});
