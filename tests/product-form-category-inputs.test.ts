import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  MAIN_CATEGORIES,
  getMainCategoryTitle,
} from "../common/mappers/main-category.mapper";
import {
  categories,
  getCategoryTitle,
} from "../common/mappers/category.mapper";
import { productFormSchema } from "../common/types/product-form.types";

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

test("MainCategoryInput ofrece las 7 principales desde MAIN_CATEGORIES sin filtrar", () => {
  const src = mainCategoryInput();
  assert.ok(src.includes("MAIN_CATEGORIES"), "usa MAIN_CATEGORIES");
  assert.ok(
    src.includes("getMainCategoryTitle"),
    "rotula con getMainCategoryTitle",
  );
  assert.ok(
    !src.includes('!== "DESSERTS"') && !src.includes("MAIN_FILTER_OPTIONS"),
    "admin no filtra DESSERTS como el filtro de cliente",
  );
  assert.equal(MAIN_CATEGORIES.length, 7, "7 principales en fuente");
  assert.ok(MAIN_CATEGORIES.includes("SPECIAL"), "incluye SPECIAL");
  assert.ok(MAIN_CATEGORIES.includes("DESSERTS"), "incluye DESSERTS");
  assert.equal(
    MAIN_CATEGORIES[MAIN_CATEGORIES.length - 1],
    "DESSERTS",
    "DESSERTS última",
  );
  assert.equal(
    getMainCategoryTitle("SPECIAL"),
    "Makis especiales",
    "SPECIAL → Makis especiales",
  );
  assert.equal(
    getMainCategoryTitle("DESSERTS"),
    "Postres",
    "DESSERTS → Postres",
  );
});

test("CategoryInput lista subs con DESSERTS «Postres»", () => {
  const src = categoryInput();
  assert.ok(src.includes("categories"), "usa categories de subs");
  assert.ok(
    /[Ss]ubcategor/.test(src),
    "placeholder/etiqueta menciona subcategoría",
  );
  assert.ok(categories.includes("DESSERTS"), "subs incluyen DESSERTS");
  assert.equal(getCategoryTitle("DESSERTS"), "Postres", "DESSERTS → Postres");
});

test("el esquema acepta mainCategory SPECIAL y DESSERTS (envío crear/editar)", () => {
  const base = {
    name: "Postre",
    japaneseName: "",
    description: "",
    price: 4,
    category: "DESSERTS",
    allergens: [] as string[],
    pieces: 0,
  };
  for (const mainCategory of ["SPECIAL", "DESSERTS"]) {
    const r = productFormSchema.safeParse({ ...base, mainCategory });
    assert.ok(r.success, `acepta mainCategory ${mainCategory}`);
    assert.equal(r.data.mainCategory, mainCategory);
  }
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
