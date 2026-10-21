import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { UserService } from "../service/UserService";

const TOKEN = "dummy-token";

function stubWarn(t: TestContext) {
  return t.mock.method(console, "warn", () => {});
}

function countingFetcher(
  implementation: () => Promise<Response> | Response,
): { fetcher: typeof fetch; calls: () => number } {
  let calls = 0;
  const fetcher = (async () => {
    calls += 1;
    return implementation();
  }) as typeof fetch;
  return { fetcher, calls: () => calls };
}

test("401 devuelve null en silencio, sin reintentos ni avisos", async (t) => {
  const { fetcher, calls } = countingFetcher(
    async () => new Response(null, { status: 401 }),
  );
  const warnMock = stubWarn(t);

  const result = await UserService.getProfile({ token: TOKEN, fetcher });

  assert.equal(result, null);
  assert.equal(calls(), 1);
  assert.equal(warnMock.mock.callCount(), 0);
});

test("fallo de red devuelve null en silencio sin tumbar el layout", async (t) => {
  const { fetcher, calls } = countingFetcher(async () => {
    throw new TypeError("fetch failed");
  });
  const warnMock = stubWarn(t);

  const result = await UserService.getProfile({ token: TOKEN, fetcher });

  assert.equal(result, null);
  assert.equal(calls(), 1);
  assert.equal(warnMock.mock.callCount(), 0);
});

test("otro error (500) devuelve null con un aviso sin datos sensibles", async (t) => {
  const { fetcher, calls } = countingFetcher(
    async () => new Response(null, { status: 500 }),
  );
  const warnMock = stubWarn(t);

  const result = await UserService.getProfile({ token: TOKEN, fetcher });

  assert.equal(result, null);
  assert.equal(calls(), 1);
  assert.equal(warnMock.mock.callCount(), 1);
  const message = String(warnMock.mock.calls[0]?.arguments[0] ?? "");
  assert.match(message, /500/);
  assert.ok(!message.includes(TOKEN));
});

test("200 devuelve el usuario sin avisos", async (t) => {
  const user = { id: "1", role: "ROLE_USER" };
  const { fetcher } = countingFetcher(async () => Response.json(user));
  const warnMock = stubWarn(t);

  const result = await UserService.getProfile({ token: TOKEN, fetcher });

  assert.deepEqual(result, user);
  assert.equal(warnMock.mock.callCount(), 0);
});

test("sin token no llama al backend y devuelve null", async (t) => {
  const { fetcher, calls } = countingFetcher(async () => Response.json({}));
  const warnMock = stubWarn(t);

  const result = await UserService.getProfile({ token: undefined, fetcher });

  assert.equal(result, null);
  assert.equal(calls(), 0);
  assert.equal(warnMock.mock.callCount(), 0);
});
