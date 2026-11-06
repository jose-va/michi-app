import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { productFormSchema } from "@/common/types/product-form.types";

const pageSource = readFileSync(
  new URL("../common/components/pages/product/ProductFormPage.tsx", import.meta.url),
  "utf8",
);

const base = {
  name: "Nigiri",
  japaneseName: "",
  description: "",
  price: 3,
  mainCategory: "SUSHI_CLASSIC",
  category: "NIGIRI_SUSHI",
  allergens: [],
  pieces: 0,
};

test("schema accepts featured true, false and absent", () => {
  assert.equal(productFormSchema.safeParse({ ...base, featured: true }).success, true);
  assert.equal(productFormSchema.safeParse({ ...base, featured: false }).success, true);
  assert.equal(productFormSchema.safeParse(base).success, true);
});

test("schema rejects non-boolean featured", () => {
  for (const value of ["true", 1, null, {}]) {
    assert.equal(
      productFormSchema.safeParse({ ...base, featured: value }).success,
      false,
      `featured=${JSON.stringify(value)} debe rechazarse`,
    );
  }
});

test("schema keeps featured in parsed output", () => {
  const parsed = productFormSchema.parse({ ...base, featured: true });
  assert.equal(parsed.featured, true);
});

test("ProductFormPage default featured uses normalizeFeatured(product?.featured)", () => {
  assert.ok(pageSource.includes("@/common/utils/product-featured"));
  assert.ok(
    pageSource.includes("featured: normalizeFeatured(product?.featured)"),
    "defaultValues.featured must be normalizeFeatured(product?.featured)",
  );
});

test("ProductFormPage onSubmit normalizes featured before create/update", () => {
  assert.ok(
    pageSource.includes("featured: normalizeFeatured(data.featured)"),
    "onSubmit must normalize featured",
  );
  assert.ok(pageSource.includes("updateProduct(product.id, payload)"));
  assert.ok(pageSource.includes("createProduct(payload)"));
  assert.ok(!pageSource.includes("updateProduct(product.id, data as Product)"));
  assert.ok(!pageSource.includes("createProduct(data)"));
});

const formSource = readFileSync(
  new URL("../common/components/forms/product/ProductForm.tsx", import.meta.url),
  "utf8",
);
const categoryInputSource = readFileSync(
  new URL("../common/components/forms/product/CategoryInput.tsx", import.meta.url),
  "utf8",
);

test("ProductForm has a shadcn Checkbox bound to featured", () => {
  assert.ok(formSource.includes('name="featured"'));
  assert.ok(formSource.includes('from "@/shadcn/components/checkbox"'));
  assert.ok(formSource.includes("<Checkbox"));
  assert.ok(formSource.includes("checked={field.value === true}"));
  assert.ok(formSource.includes("onCheckedChange"));
  assert.ok(formSource.includes("Destacado"));
  assert.ok(
    /Destacado[\s\S]{0,120}\(opcional\)/.test(formSource),
    "label must include dimmed (opcional)",
  );
});

test("CategoryInput keeps using categories without featured", () => {
  assert.ok(categoryInputSource.includes("categories"));
  assert.ok(!categoryInputSource.includes("filterCategories"));
  assert.ok(!/Destacados/.test(categoryInputSource));
});
