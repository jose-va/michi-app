import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (p: string) =>
  readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const form = () => read("common/components/forms/product/ProductForm.tsx");
const page = () =>
  read("common/components/pages/product/ProductFormPage.tsx");
const categoryInput = () =>
  read("common/components/forms/product/CategoryInput.tsx");
const mainCategoryInput = () =>
  read("common/components/forms/product/MainCategoryInput.tsx");
const card = () => read("common/components/ui/product/ProductCard.tsx");

test("existe MainCategoryInput con las 5 principales desde MAIN_CATEGORIES", () => {
  const src = mainCategoryInput();
  assert.ok(src.includes("MAIN_CATEGORIES"), "usa MAIN_CATEGORIES");
  assert.ok(
    src.includes("getMainCategoryTitle"),
    "rotula con getMainCategoryTitle",
  );
  assert.ok(!src.includes("DESSERTS"), "sin DESSERTS");
});

test("CategoryInput lista subs sin DESSERTS y con textos de subcategoría", () => {
  const src = categoryInput();
  assert.ok(src.includes("categories"), "usa categories de subs");
  assert.ok(!src.includes("DESSERTS"), "sin DESSERTS");
  assert.ok(
    /[Ss]ubcategor/.test(src),
    "placeholder/etiqueta menciona subcategoría",
  );
});

test("ProductForm muestra primero «Categoría» y después «Subcategoría», ambas con FormMessage", () => {
  const src = form();
  assert.ok(src.includes('name="mainCategory"'), "campo mainCategory");
  assert.ok(src.includes('name="category"'), "campo category (sub)");
  assert.ok(src.includes("<FormLabel>Categoría</FormLabel>"), "label Categoría");
  assert.ok(
    src.includes("<FormLabel>Subcategoría</FormLabel>"),
    "label Subcategoría",
  );
  const mainField = src.indexOf('name="mainCategory"');
  const subField = src.indexOf('name="category"');
  assert.ok(mainField >= 0 && subField > mainField, "Categoría antes que Subcategoría");
  const mainBlock = src.slice(mainField, mainField + 600);
  const subBlock = src.slice(subField, subField + 600);
  assert.ok(mainBlock.includes("<FormMessage"), "Categoría con FormMessage");
  assert.ok(subBlock.includes("<FormMessage"), "Subcategoría con FormMessage");
  assert.ok(src.includes("MainCategoryInput"), "usa MainCategoryInput");
});

test("ProductFormPage inicializa y reenvía mainCategory en crear/editar", () => {
  const src = page();
  assert.ok(
    src.includes("mainCategory: product?.mainCategory ??"),
    "defaultValues inicializa mainCategory del producto",
  );
  assert.ok(src.includes("updateProduct(product.id, payload)"), "editar reenvía payload");
  assert.ok(src.includes("createProduct(payload)"), "crear reenvía payload");
  assert.ok(
    src.includes("...data"),
    "payload parte de los valores del formulario (incluye mainCategory)",
  );
});

test("ProductCard sigue con distintivo por subcategoría sin cambio funcional", () => {
  const src = card();
  assert.ok(
    src.includes("getCategoryTitle(product.category)"),
    "título por product.category",
  );
  assert.ok(
    src.includes("getCategoryBadge(product.category)"),
    "badge por product.category",
  );
  assert.ok(!src.includes("mainCategory"), "no usa mainCategory");
});
