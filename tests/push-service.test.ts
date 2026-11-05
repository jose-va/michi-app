import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { PushService } from "../service/PushService";
import { UserService } from "../service/UserService";

process.env.BACKEND_URL ??= "http://backend.test";

const BASE = "http://app.test";
const BACKEND = "http://backend.test";
const SUB = {
  endpoint: "https://fcm.example/buzon-1",
  keys: { p256dh: "clave-p256dh", auth: "secreto-auth" },
};

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

function loggedText(err: { mock: { calls: { arguments: unknown[] }[] } }) {
  return err.mock.calls.flatMap((c) => c.arguments).map(String).join(" ");
}

// --- Cliente mismo origen (PushService con fetcher inyectado) ---

test("getPublicKey pide la clave a la fuente oficial mismo origen", async (t) => {
  const { fetcher, urls, inits } = recorder(() =>
    Response.json({ key: "oficial-1" }),
  );
  stubError(t);
  const result = await PushService.getPublicKey({ fetcher, baseUrl: BASE });
  assert.equal(urls[0], `${BASE}/api/push/public-key`);
  assert.ok(!inits[0]?.method || inits[0]?.method === "GET");
  assert.deepEqual(result, { ok: true, key: "oficial-1" });
});

test("getPublicKey acepta la forma {publicKey} del backend", async (t) => {
  const { fetcher } = recorder(() => Response.json({ publicKey: "oficial-2" }));
  stubError(t);
  assert.deepEqual(await PushService.getPublicKey({ fetcher, baseUrl: BASE }), {
    ok: true,
    key: "oficial-2",
  });
});

test("getPublicKey recurre a la variable frontend si la fuente oficial falla", async (t) => {
  const { fetcher } = recorder(() => new Response(null, { status: 502 }));
  stubError(t);
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = "respaldo-env";
  try {
    assert.deepEqual(
      await PushService.getPublicKey({ fetcher, baseUrl: BASE }),
      { ok: true, key: "respaldo-env" },
    );
  } finally {
    delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  }
});

test("getPublicKey informa en español si no hay clave en ningún sitio", async (t) => {
  const { fetcher } = recorder(() => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const result = await PushService.getPublicKey({ fetcher, baseUrl: BASE });
  assert.equal(result.ok, false);
  assert.ok(
    result.ok === false && result.reason.length > 0,
    "debe explicar el motivo en español",
  );
  assert.equal(err.mock.callCount(), 1);
});

test("subscribe envía endpoint y llaves al proxy y 200/201 es éxito", async (t) => {
  for (const status of [200, 201]) {
    const { fetcher, urls, inits } = recorder(
      () => new Response(null, { status }),
    );
    stubError(t);
    const result = await PushService.subscribe(SUB, { fetcher, baseUrl: BASE });
    assert.equal(urls[0], `${BASE}/api/push/subscriptions`);
    assert.equal(inits[0]?.method, "POST");
    assert.deepEqual(JSON.parse(String(inits[0]?.body)), SUB);
    assert.deepEqual(result, { ok: true, status });
  }
});

test("subscribe propaga el 403 del proxy", async (t) => {
  const { fetcher } = recorder(() => new Response(null, { status: 403 }));
  stubError(t);
  assert.deepEqual(await PushService.subscribe(SUB, { fetcher, baseUrl: BASE }), {
    ok: false,
    status: 403,
  });
});

test("subscribe ante fallo de red informa sin estado falso ni secretos", async (t) => {
  const { fetcher } = recorder(() => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  const result = await PushService.subscribe(SUB, { fetcher, baseUrl: BASE });
  assert.deepEqual(result, { ok: false, status: 0 });
  assert.equal(err.mock.callCount(), 1);
  const logged = loggedText(err);
  assert.ok(!logged.includes(SUB.endpoint));
  assert.ok(!logged.includes(SUB.keys.p256dh));
  assert.ok(!logged.includes(SUB.keys.auth));
});

test("unsubscribe pide la baja con el extremo codificado", async (t) => {
  const { fetcher, urls, inits } = recorder(
    () => new Response(null, { status: 200 }),
  );
  stubError(t);
  const result = await PushService.unsubscribe(SUB.endpoint, {
    fetcher,
    baseUrl: BASE,
  });
  assert.equal(
    urls[0],
    `${BASE}/api/push/subscriptions?endpoint=${encodeURIComponent(SUB.endpoint)}`,
  );
  assert.equal(inits[0]?.method, "DELETE");
  assert.deepEqual(result, { ok: true, status: 200 });
});

test("unsubscribe propaga el 403 e informa el fallo de red sin el extremo", async (t) => {
  const denied = recorder(() => new Response(null, { status: 403 }));
  stubError(t);
  assert.deepEqual(
    await PushService.unsubscribe(SUB.endpoint, {
      fetcher: denied.fetcher,
      baseUrl: BASE,
    }),
    { ok: false, status: 403 },
  );
  const down = recorder(() => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  assert.deepEqual(
    await PushService.unsubscribe(SUB.endpoint, {
      fetcher: down.fetcher,
      baseUrl: BASE,
    }),
    { ok: false, status: 0 },
  );
  assert.equal(err.mock.callCount(), 1);
  assert.ok(!loggedText(err).includes(SUB.endpoint));
});

test("requestTest pide la prueba de difusión al proxy", async (t) => {
  const { fetcher, urls, inits } = recorder(
    () => new Response(null, { status: 200 }),
  );
  stubError(t);
  const result = await PushService.requestTest({ fetcher, baseUrl: BASE });
  assert.equal(urls[0], `${BASE}/api/push/test`);
  assert.equal(inits[0]?.method, "POST");
  assert.deepEqual(result, { ok: true, status: 200 });
});

test("requestTest propaga el 403 e informa el fallo de red", async (t) => {
  const denied = recorder(() => new Response(null, { status: 403 }));
  stubError(t);
  assert.deepEqual(
    await PushService.requestTest({ fetcher: denied.fetcher, baseUrl: BASE }),
    { ok: false, status: 403 },
  );
  const down = recorder(() => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  assert.deepEqual(
    await PushService.requestTest({ fetcher: down.fetcher, baseUrl: BASE }),
    { ok: false, status: 0 },
  );
  assert.equal(err.mock.callCount(), 1);
});

// --- Proxy mismo origen (rutas app/api/push/*) ---

async function loadRoutes() {
  const publicKey = await import("../app/api/push/public-key/route");
  const subscriptions = await import("../app/api/push/subscriptions/route");
  const pushTest = await import("../app/api/push/test/route");
  return { publicKey, subscriptions, pushTest };
}

function stubBackend(
  t: TestContext,
  impl: (url: string, init?: RequestInit) => Promise<Response> | Response,
) {
  const urls: string[] = [];
  const inits: (RequestInit | undefined)[] = [];
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    (async (url: unknown, init?: RequestInit) => {
      urls.push(String(url));
      inits.push(init);
      return impl(String(url), init);
    }) as typeof fetch,
  );
  return {
    urls,
    inits,
    restore: () => fetchMock.mock.restore(),
  };
}

function mockProfile(t: TestContext, role: string | null) {
  return t.mock.method(UserService, "getProfile", async () =>
    role ? { id: "admin-1", role } : null,
  );
}

test("proxy public-key es pública y reenvía a la fuente oficial", async (t) => {
  const { publicKey } = await loadRoutes();
  const profile = mockProfile(t, null);
  const backend = stubBackend(t, () => Response.json({ key: "oficial-9" }));
  stubError(t);
  try {
    const res = await publicKey.GET(
      new Request(`${BASE}/api/push/public-key`) as never,
    );
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { key: "oficial-9" });
    assert.equal(
      backend.urls[0],
      `${BACKEND}/reservations/push/public-key`,
    );
    assert.equal(profile.mock.callCount(), 0);
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy public-key no envía credenciales al backend público", async (t) => {
  const { publicKey } = await loadRoutes();
  const profile = mockProfile(t, null);
  const backend = stubBackend(t, () => Response.json({ key: "oficial-9" }));
  stubError(t);
  try {
    await publicKey.GET(new Request(`${BASE}/api/push/public-key`) as never);
    const headers = new Headers(backend.inits[0]?.headers);
    assert.ok(!headers.get("cookie"));
    assert.ok(!headers.get("user-role"));
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy public-key recurre a la variable frontend si el backend falla", async (t) => {
  const { publicKey } = await loadRoutes();
  const profile = mockProfile(t, null);
  const backend = stubBackend(t, () => new Response(null, { status: 500 }));
  stubError(t);
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = "respaldo-env";
  try {
    const res = await publicKey.GET(
      new Request(`${BASE}/api/push/public-key`) as never,
    );
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { key: "respaldo-env" });
  } finally {
    delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy public-key devuelve 502 en español sin clave en ningún sitio", async (t) => {
  const { publicKey } = await loadRoutes();
  const profile = mockProfile(t, null);
  const backend = stubBackend(t, () => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  try {
    const res = await publicKey.GET(
      new Request(`${BASE}/api/push/public-key`) as never,
    );
    assert.equal(res.status, 502);
    const body = await res.json();
    assert.ok(typeof body.error === "string" && body.error.length > 0);
    assert.equal(err.mock.callCount(), 1);
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy subscriptions alta sin admin devuelve 403 sin llamar al backend", async (t) => {
  const { subscriptions } = await loadRoutes();
  for (const role of [null, "ROLE_USER"]) {
    const profile = mockProfile(t, role);
    const backend = stubBackend(t, () => new Response(null, { status: 201 }));
    stubError(t);
    try {
      const res = await subscriptions.POST(
        new Request(`${BASE}/api/push/subscriptions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(SUB),
        }) as never,
      );
      assert.equal(res.status, 403);
      assert.equal(backend.urls.length, 0);
    } finally {
      backend.restore();
      profile.mock.restore();
    }
  }
});

test("proxy subscriptions alta reenvía Cookie y User-Role y acepta 200/201", async (t) => {
  const { subscriptions } = await loadRoutes();
  for (const status of [200, 201]) {
    const profile = mockProfile(t, "ROLE_ADMIN");
    const backend = stubBackend(t, () => new Response(null, { status }));
    stubError(t);
    try {
      const res = await subscriptions.POST(
        new Request(`${BASE}/api/push/subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            cookie: "token=sesion-1",
          },
          body: JSON.stringify(SUB),
        }) as never,
      );
      assert.equal(res.status, status);
      assert.equal(
        backend.urls[0],
        `${BACKEND}/reservations/push/subscriptions`,
      );
      const headers = new Headers(backend.inits[0]?.headers);
      assert.equal(headers.get("cookie"), "token=sesion-1");
      assert.equal(headers.get("user-role"), "ROLE_ADMIN");
      assert.deepEqual(JSON.parse(String(backend.inits[0]?.body)), SUB);
    } finally {
      backend.restore();
      profile.mock.restore();
    }
  }
});

test("proxy subscriptions alta con cuerpo inválido devuelve 400 sin backend", async (t) => {
  const { subscriptions } = await loadRoutes();
  const profile = mockProfile(t, "ROLE_ADMIN");
  const backend = stubBackend(t, () => new Response(null, { status: 201 }));
  stubError(t);
  try {
    const res = await subscriptions.POST(
      new Request(`${BASE}/api/push/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: "token=sesion-1",
        },
        body: JSON.stringify({ endpoint: "", keys: {} }),
      }) as never,
    );
    assert.equal(res.status, 400);
    assert.equal(backend.urls.length, 0);
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy subscriptions baja reenvía el extremo y exige admin", async (t) => {
  const { subscriptions } = await loadRoutes();
  const denied = mockProfile(t, null);
  const idle = stubBackend(t, () => new Response(null, { status: 200 }));
  stubError(t);
  try {
    const res = await subscriptions.DELETE(
      new Request(
        `${BASE}/api/push/subscriptions?endpoint=${encodeURIComponent(SUB.endpoint)}`,
        { method: "DELETE" },
      ) as never,
    );
    assert.equal(res.status, 403);
    assert.equal(idle.urls.length, 0);
  } finally {
    idle.restore();
    denied.mock.restore();
  }
  const profile = mockProfile(t, "ROLE_ADMIN");
  const backend = stubBackend(t, () => new Response(null, { status: 200 }));
  try {
    const res = await subscriptions.DELETE(
      new Request(
        `${BASE}/api/push/subscriptions?endpoint=${encodeURIComponent(SUB.endpoint)}`,
        { method: "DELETE", headers: { cookie: "token=sesion-1" } },
      ) as never,
    );
    assert.equal(res.status, 200);
    assert.equal(
      backend.urls[0],
      `${BACKEND}/reservations/push/subscriptions?endpoint=${encodeURIComponent(SUB.endpoint)}`,
    );
    const headers = new Headers(backend.inits[0]?.headers);
    assert.equal(headers.get("cookie"), "token=sesion-1");
    assert.equal(headers.get("user-role"), "ROLE_ADMIN");
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy subscriptions baja sin extremo devuelve 400 sin backend", async (t) => {
  const { subscriptions } = await loadRoutes();
  const profile = mockProfile(t, "ROLE_ADMIN");
  const backend = stubBackend(t, () => new Response(null, { status: 200 }));
  stubError(t);
  try {
    const res = await subscriptions.DELETE(
      new Request(`${BASE}/api/push/subscriptions`, {
        method: "DELETE",
        headers: { cookie: "token=sesion-1" },
      }) as never,
    );
    assert.equal(res.status, 400);
    assert.equal(backend.urls.length, 0);
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy subscriptions informa el fallo de red sin exponer la suscripción", async (t) => {  const { subscriptions } = await loadRoutes();
  const profile = mockProfile(t, "ROLE_ADMIN");
  const backend = stubBackend(t, () => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  try {
    const res = await subscriptions.POST(
      new Request(`${BASE}/api/push/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: "token=sesion-1",
        },
        body: JSON.stringify(SUB),
      }) as never,
    );
    assert.equal(res.status, 502);
    assert.equal(err.mock.callCount(), 1);
    assert.ok(!loggedText(err).includes(SUB.endpoint));
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy test exige admin y difunde con Cookie y User-Role", async (t) => {
  const { pushTest } = await loadRoutes();
  const denied = mockProfile(t, null);
  const idle = stubBackend(t, () => new Response(null, { status: 200 }));
  stubError(t);
  try {
    const res = await pushTest.POST(
      new Request(`${BASE}/api/push/test`, {
        method: "POST",
        headers: { cookie: "token=sesion-1" },
      }) as never,
    );
    assert.equal(res.status, 403);
    assert.equal(idle.urls.length, 0);
  } finally {
    idle.restore();
    denied.mock.restore();
  }
  const profile = mockProfile(t, "ROLE_ADMIN");
  const backend = stubBackend(t, () => new Response(null, { status: 200 }));
  try {
    const res = await pushTest.POST(
      new Request(`${BASE}/api/push/test`, {
        method: "POST",
        headers: { cookie: "token=sesion-1" },
      }) as never,
    );
    assert.equal(res.status, 200);
    assert.equal(backend.urls[0], `${BACKEND}/reservations/push/test`);
    const headers = new Headers(backend.inits[0]?.headers);
    assert.equal(headers.get("cookie"), "token=sesion-1");
    assert.equal(headers.get("user-role"), "ROLE_ADMIN");
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});

test("proxy test informa el fallo de red en español", async (t) => {
  const { pushTest } = await loadRoutes();
  const profile = mockProfile(t, "ROLE_ADMIN");
  const backend = stubBackend(t, () => {
    throw new TypeError("fetch failed");
  });
  const err = stubError(t);
  try {
    const res = await pushTest.POST(
      new Request(`${BASE}/api/push/test`, {
        method: "POST",
        headers: { cookie: "token=sesion-1" },
      }) as never,
    );
    assert.equal(res.status, 502);
    const body = await res.json();
    assert.ok(typeof body.error === "string" && body.error.length > 0);
    assert.equal(err.mock.callCount(), 1);
  } finally {
    backend.restore();
    profile.mock.restore();
  }
});
