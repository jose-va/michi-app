import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  requestPushTest,
  type PushTestDeps,
} from "@/common/utils/push-test";

function okDeps(
  overrides: Partial<PushTestDeps> = {},
): PushTestDeps & { calls: string[] } {
  const calls: string[] = [];
  const deps = {
    requestTest: async () => {
      calls.push("test");
      return { ok: true, status: 200 };
    },
    calls,
    ...overrides,
  };
  return deps;
}

describe("prueba de aviso en difusión (T7: RF-23, RNF-1)", () => {
  it("solo 2xx encarga la prueba (POST /api/push/test)", async () => {
    for (const status of [200, 201, 204]) {
      const deps = okDeps({
        requestTest: async () => {
          deps.calls.push("test");
          return { ok: true, status };
        },
      });
      const result = await requestPushTest(deps);
      assert.deepEqual(deps.calls, ["test"]);
      assert.equal(result.sent, true);
    }
  });

  it("sin 2xx informa en español sin encargar la prueba", async () => {
    for (const status of [403, 500, 502]) {
      const deps = okDeps({
        requestTest: async () => {
          deps.calls.push("test");
          return { ok: false, status };
        },
      });
      const result = await requestPushTest(deps);
      assert.equal(result.sent, false);
      assert.ok(result.message && result.message.length > 0);
    }
  });

  it("fallo de red informa en español sin estado falso", async () => {
    const deps = okDeps({
      requestTest: async () => {
        deps.calls.push("test");
        throw new TypeError("fetch failed");
      },
    });
    const result = await requestPushTest(deps);
    assert.deepEqual(deps.calls, ["test"]);
    assert.equal(result.sent, false);
    assert.ok(result.message && result.message.length > 0);
  });

  it("el resultado nunca afirma un envío no encargado", async () => {
    const deps = okDeps({
      requestTest: async () => ({ ok: false, status: 500 }),
    });
    const result = await requestPushTest(deps);
    const text = JSON.stringify(result);
    assert.equal(result.sent, false);
    assert.ok(!text.includes("encargado") || result.message !== null);
    assert.ok(
      result.message === null ||
        !result.message.includes("Avisos activados"),
    );
  });
});
