import assert from "node:assert/strict";
import { test } from "node:test";
import { getCategoryBadge } from "../common/mappers/badge.mapper";

test("TARTAR has its own badge colour", () => {
  assert.notEqual(
    getCategoryBadge("TARTAR"),
    getCategoryBadge("UNKNOWN_CATEGORY"),
  );
  assert.equal(getCategoryBadge("TARTAR"), "bg-rose-900 text-rose-200");
});

test("NIGIRI_SUSHI and SPECIAL_MAKI badges are visually distinct", () => {
  assert.notEqual(
    getCategoryBadge("NIGIRI_SUSHI"),
    getCategoryBadge("SPECIAL_MAKI"),
  );
  assert.equal(
    getCategoryBadge("SPECIAL_MAKI"),
    "bg-indigo-800 text-indigo-100",
  );
});

test("HOT_STARTERS and HOT_MAKI badges are visually distinct", () => {
  assert.notEqual(
    getCategoryBadge("HOT_STARTERS"),
    getCategoryBadge("HOT_MAKI"),
  );
  assert.equal(getCategoryBadge("HOT_MAKI"), "bg-red-800 text-red-100");
});

test("DESSERTS dual tiene distintivo propio «Postres» (RF-6, RF-7, RF-9)", () => {
  // Fucsia inédito en la paleta (-950/300 como el resto de distintivos oscuros).
  assert.equal(
    getCategoryBadge("DESSERTS"),
    "bg-fuchsia-950 text-fuchsia-300",
  );
  assert.notEqual(
    getCategoryBadge("DESSERTS"),
    getCategoryBadge("UNKNOWN_CATEGORY"),
  );
  assert.notEqual(getCategoryBadge("DESSERTS"), getCategoryBadge("COMBOS"));
});

test("SPECIAL no es dual: sin distintivo propio, usa fallback", () => {
  assert.equal(
    getCategoryBadge("SPECIAL"),
    getCategoryBadge("UNKNOWN_CATEGORY"),
  );
});

test("COMBOS conserva su color (invariante RF-7)", () => {
  assert.equal(getCategoryBadge("COMBOS"), "bg-cyan-800 text-cyan-100");
});
