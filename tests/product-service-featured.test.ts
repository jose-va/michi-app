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

test("sin filtros llama a /products/featured sin query", async (t) => {
  const { fetcher, urls, inits } = recorder(() => Response.json([]));
  stubError(t);
  await ProductService.getFeaturedProducts({}, { fetcher, baseUrl: BASE });
  assert.equal(urls[0], `${BASE}/products/featured`);
  assert.equal(inits[0]?.method, "GET");
});

test("envía name recortado y alérgenos, sin category", async (t) => {
  const { fetcher, urls } = recorder(() => Response.json([]));
  stubError(t);
  await ProductService.getFeaturedProducts(
    { name: "  roll ", allergens: ["GLUTEN", "", "SOY"] },
    { fetcher, baseUrl: BASE },
  );
  assert.equal(
    urls[0],
    `${BASE}/products/featured?name=roll&allergens=GLUTEN&allergens=SOY`,
  );
  assert.ok(!urls[0].includes("category"));
});

test("nombre en blanco se descarta", async (t) => {
  const { fetcher, urls } = recorder(() => Response.json([]));
  stubError(t);
  await ProductService.getFeaturedProducts(
    { name: "   " },
    { fetcher, baseUrl: BASE },
  );
  assert.equal(urls[0], `${BASE}/products/featured`);
});

test("200 con array devuelve los productos tal cual, sin refiltrar", async (t) => {
  const items = [
    { id: "1", featured: true },
    { id: "2", featured: false, status: "INACTIVE" },
  ];
  const { fetcher } = recorder(() => Response.json(items));
  const err = stubError(t);
  const result = await ProductService.getFeaturedProducts(
    {},
    { fetcher, baseUrl: BASE },
  );
  assert.deepEqual(result, items);
  assert.equal(err.mock.callCount(), 0);
});

test("200 con array vacío devuelve []", async (t) => {
  const { fetcher } = recorder(() => Response.json([]));
  stubError(t);
  const result = await ProductService.getFeaturedProducts(
    {},
    { fetcher, baseUrl: BASE },
  );
  assert.deepEqual(result, []);
});

test("no 2xx devuelve [] y registra error", async (t) => {
  for (const status of [404, 500]) {
    const { fetcher } = recorder(() => new Response(null, { status }));
    const err = stubError(t);
    const result = await ProductService.getFeaturedProducts(
      {},
      { fetcher, baseUrl: BASE },
    );
    assert.deepEqual(result, []);
    assert.equal(err.mock.callCount(), 1);
    err.mock.restore();
  }
});

test("JSON inválido devuelve [] y registra error", async (t) => {
  const { fetcher } = recorder(() => new Response("no-json{", { status: 200 }));
  const err = stubError(t);
  const result = await ProductService.getFeaturedProducts(
    {},
    { fetcher, baseUrl: BASE },
  );
  assert.deepEqual(result, []);
  assert.equal(err.mock.callCount(), 1);
});

test("respuesta no-array devuelve []", async (t) => {
  const { fetcher } = recorder(() => Response.json({ content: [] }));
  stubError(t);
  const result = await ProductService.getFeaturedProducts(
    {},
    { fetcher, baseUrl: BASE },
  );
  assert.deepEqual(result, []);
});

test("fallo de red devuelve [] y el log no incluye token ni cookie", async (t) => {
  const { fetcher } = recorder(() => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  const result = await ProductService.getFeaturedProducts(
    { name: "x" },
    { fetcher, baseUrl: BASE },
  );
  assert.deepEqual(result, []);
  assert.equal(err.mock.callCount(), 1);
  const logged = err.mock.calls[0].arguments.map(String).join(" ");
  assert.ok(!/token|cookie/i.test(logged));
});

test("no envía credenciales (sin cabecera Cookie)", async (t) => {
  const { fetcher, inits } = recorder(() => Response.json([]));
  stubError(t);
  await ProductService.getFeaturedProducts({}, { fetcher, baseUrl: BASE });
  assert.ok(!JSON.stringify(inits[0] ?? {}).toLowerCase().includes("cookie"));
});
