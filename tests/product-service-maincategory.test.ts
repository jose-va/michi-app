import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { ProductService } from "../service/ProductService";

const BASE = "http://backend.test";

function recorder(impl: () => Promise<Response> | Response) {
  const urls: string[] = [];
  const inits: (RequestInit | undefined)[] = [];
  const fetcher = (async (url: string, init?: RequestInit) => {
    urls.push(String(url));
    inits.push(init);
    return impl();
  }) as unknown as typeof fetch;
  return { fetcher, urls, inits };
}

function stubError(t: TestContext) {
  return t.mock.method(console, "error", () => {});
}

const productPayload = {
  name: "Tartar de salmón",
  japaneseName: "",
  description: "",
  price: 12.5,
  mainCategory: "STARTERS",
  category: "TARTAR",
  allergens: ["FISH"],
  pieces: 0,
};

test("searchProducts envía la principal como category=<MAIN>", async (t) => {
  const { fetcher, urls } = recorder(() => Response.json([]));
  stubError(t);
  await ProductService.searchProducts(
    { category: "STARTERS" },
    { fetcher, baseUrl: BASE },
  );
  assert.equal(urls[0], `${BASE}/products/search?category=STARTERS`);
});

test("searchProducts combina principal con nombre y alérgenos (RF-15)", async (t) => {
  const { fetcher, urls } = recorder(() => Response.json([]));
  stubError(t);
  await ProductService.searchProducts(
    { category: "MAKIS_ROLLS", name: "roll", allergens: ["GLUTEN", "SOY"] },
    { fetcher, baseUrl: BASE },
  );
  assert.equal(
    urls[0],
    `${BASE}/products/search?name=roll&category=MAKIS_ROLLS&allergens=GLUTEN&allergens=SOY`,
  );
});

test("searchProducts sin category no envía el parámetro", async (t) => {
  const { fetcher, urls } = recorder(() => Response.json([]));
  stubError(t);
  await ProductService.searchProducts(
    { name: "nigiri" },
    { fetcher, baseUrl: BASE },
  );
  assert.equal(urls[0], `${BASE}/products/search?name=nigiri`);
  assert.ok(!urls[0].includes("category"));
});

test("searchProducts con backend no-ok devuelve [] (RF-14)", async (t) => {
  const { fetcher } = recorder(() => new Response(null, { status: 500 }));
  stubError(t);
  const result = await ProductService.searchProducts(
    { category: "COMBOS" },
    { fetcher, baseUrl: BASE },
  );
  assert.deepEqual(result, []);
});

test("searchProducts ante excepción devuelve [] (RF-14)", async (t) => {
  const { fetcher } = recorder(() => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  const result = await ProductService.searchProducts(
    { category: "COMBOS" },
    { fetcher, baseUrl: BASE },
  );
  assert.deepEqual(result, []);
  assert.equal(err.mock.callCount(), 1);
});

test("create serializa mainCategory en el cuerpo (RF-13)", async (t) => {
  const { fetcher, urls, inits } = recorder(() =>
    Response.json({ id: "1", ...productPayload }),
  );
  stubError(t);
  await ProductService.create(productPayload, {
    fetcher,
    baseUrl: BASE,
    headers: {},
  });
  assert.equal(urls[0], `${BASE}/products`);
  assert.equal(inits[0]?.method, "POST");
  const body = JSON.parse(String(inits[0]?.body));
  assert.equal(body.mainCategory, "STARTERS");
  assert.equal(body.category, "TARTAR");
});

test("update serializa mainCategory en el cuerpo (RF-13)", async (t) => {
  const { fetcher, urls, inits } = recorder(() =>
    Response.json({ id: "9", ...productPayload }),
  );
  stubError(t);
  await ProductService.update(
    "9",
    { id: "9", ...productPayload, position: 3, status: true },
    { fetcher, baseUrl: BASE, headers: {} },
  );
  assert.equal(urls[0], `${BASE}/products/9`);
  assert.equal(inits[0]?.method, "PUT");
  const body = JSON.parse(String(inits[0]?.body));
  assert.equal(body.mainCategory, "STARTERS");
  assert.equal(body.category, "TARTAR");
});
