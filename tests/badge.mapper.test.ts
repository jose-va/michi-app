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
