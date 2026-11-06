import assert from "node:assert/strict";
import { test } from "node:test";
import { ProductService } from "../service/ProductService";
import {
  getMainCategoryDescription,
  getMainCategoryTitle,
  resolveCategoryFilter,
} from "../common/mappers/main-category.mapper";

const BASE = "http://backend.test";

function recorder() {
  const urls: string[] = [];
  const methods: (string | undefined)[] = [];
  const fetcher = (async (url: string, init?: RequestInit) => {
    urls.push(String(url));
    methods.push(init?.method);
    return Response.json([]);
  }) as unknown as typeof fetch;
  return { fetcher, urls, methods };
}

// T13 — Contrato RF-11/RNF-3: GET /products/search?category=<MAIN> en MAYÚSCULAS.
test("contrato SPECIAL sale como GET /products/search?category=SPECIAL", async () => {
  const { fetcher, urls, methods } = recorder();
  await ProductService.searchProducts(
    { category: "SPECIAL" },
    { fetcher, baseUrl: BASE },
  );
  assert.equal(urls[0], `${BASE}/products/search?category=SPECIAL`);
  assert.equal(methods[0], "GET");
});

test("contrato DESSERTS sale como GET /products/search?category=DESSERTS", async () => {
  const { fetcher, urls, methods } = recorder();
  await ProductService.searchProducts(
    { category: "DESSERTS" },
    { fetcher, baseUrl: BASE },
  );
  assert.equal(urls[0], `${BASE}/products/search?category=DESSERTS`);
  assert.equal(methods[0], "GET");
});

test("cada respuesta va a rama principal con su título y descripción", async () => {
  assert.deepEqual(resolveCategoryFilter("SPECIAL"), {
    kind: "main",
    main: "SPECIAL",
  });
  assert.equal(getMainCategoryTitle("SPECIAL"), "Makis especiales");
  assert.equal(
    getMainCategoryDescription("SPECIAL"),
    "Los especiales de la casa, creaciones únicas del chef.",
  );
  assert.deepEqual(resolveCategoryFilter("DESSERTS"), {
    kind: "main",
    main: "DESSERTS",
  });
  assert.equal(getMainCategoryTitle("DESSERTS"), "Postres");
  assert.equal(
    getMainCategoryDescription("DESSERTS"),
    "Nuestra selección de postres.",
  );
});
