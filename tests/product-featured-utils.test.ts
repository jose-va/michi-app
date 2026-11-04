import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildFeaturedQuery,
  normalizeFeatured,
  parseFeaturedResponse,
} from "../common/utils/product-featured";

test("normalizeFeatured: solo true es destacado", () => {
  assert.equal(normalizeFeatured(true), true);
  assert.equal(normalizeFeatured(false), false);
  assert.equal(normalizeFeatured(null), false);
  assert.equal(normalizeFeatured(undefined), false);
});

test("buildFeaturedQuery: sin filtros devuelve cadena vacía sin '?'", () => {
  assert.equal(buildFeaturedQuery({}), "");
  assert.equal(buildFeaturedQuery({ name: "", allergens: [] }), "");
});

test("buildFeaturedQuery: recorta el nombre e ignora el nombre en blanco", () => {
  assert.equal(buildFeaturedQuery({ name: "  Nigiri  " }), "name=Nigiri");
  assert.equal(buildFeaturedQuery({ name: "   " }), "");
});

test("buildFeaturedQuery: añade alérgenos repetidos e ignora los vacíos", () => {
  assert.equal(
    buildFeaturedQuery({ allergens: ["GLUTEN", "", "  ", "FISH"] }),
    "allergens=GLUTEN&allergens=FISH",
  );
});

test("buildFeaturedQuery: combina nombre y alérgenos", () => {
  assert.equal(
    buildFeaturedQuery({ name: "ebi", allergens: ["SOY"] }),
    "name=ebi&allergens=SOY",
  );
});

test("buildFeaturedQuery: nunca incluye category ni '?'", () => {
  const qs = buildFeaturedQuery({
    name: "x",
    allergens: ["A"],
    category: "NIGIRI_SUSHI",
  } as never);
  assert.ok(!qs.includes("category"));
  assert.ok(!qs.includes("?"));
});

test("parseFeaturedResponse: array se devuelve; el resto es []", () => {
  const list = [{ name: "a" }];
  assert.equal(parseFeaturedResponse(list), list);
  assert.deepEqual(parseFeaturedResponse([]), []);
  assert.deepEqual(parseFeaturedResponse({ content: [] }), []);
  assert.deepEqual(parseFeaturedResponse(null), []);
  assert.deepEqual(parseFeaturedResponse(undefined), []);
  assert.deepEqual(parseFeaturedResponse("x"), []);
});
