import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Al cambiar un filtro del listado de productos se vuelve a la primera página.

test("resetPageParam borra `page` y conserva el resto de params", async () => {
  const { resetPageParam } = await import("../common/utils/product-filters");
  const params = new URLSearchParams("page=1&category=nigiri&name=sal");
  const result = resetPageParam(params);
  assert.equal(result.has("page"), false);
  assert.equal(result.get("category"), "nigiri");
  assert.equal(result.get("name"), "sal");
});

test("resetPageParam no muta el original y tolera ausencia de page", async () => {
  const { resetPageParam } = await import("../common/utils/product-filters");
  const params = new URLSearchParams("page=2&allergens=a&allergens=b");
  resetPageParam(params);
  assert.equal(params.get("page"), "2");
  const result = resetPageParam(new URLSearchParams("category=x"));
  assert.equal(result.toString(), "category=x");
});

for (const file of [
  "CategorySelect",
  "CategoryTab",
  "AllergenSelect",
  "ProductSearch",
]) {
  test(`${file} reinicia la página al cambiar el filtro`, () => {
    const source = readFileSync(
      `common/components/layout/product/${file}.tsx`,
      "utf8",
    );
    assert.ok(source.includes("resetPageParam"));
  });
}

test("ProductPagination sigue fijando `page`", () => {
  const source = readFileSync(
    "common/components/ui/product/ProductPagination.tsx",
    "utf8",
  );
  assert.ok(!source.includes("resetPageParam"));
});
