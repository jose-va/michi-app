import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bufferToBase64,
  publicKeyToUint8Array,
} from "@/common/utils/push-keys";
import {
  activatePushSubscription,
  deactivatePushSubscription,
  type PushActivateDeps,
  type PushDeactivateDeps,
} from "@/common/utils/push-subscription";

const ENDPOINT = "https://fcm.example/buzon-1";
const P256DH = "clave-p256dh";
const AUTH = "secreto-auth";

function base64UrlOf(bytes: number[]): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function okActivateDeps(
  overrides: Partial<PushActivateDeps> = {},
): PushActivateDeps & { calls: string[] } {
  const calls: string[] = [];
  const deps = {
    supported: true,
    requestPermission: async () => {
      calls.push("permission");
      return "granted" as NotificationPermission;
    },
    getPublicKey: async () => ({ ok: true, key: "clave-oficial" }) as const,
    decodeKey: () => new Uint8Array([1, 2, 3]),
    subscribeDevice: async () => {
      calls.push("subscribe");
      return { endpoint: ENDPOINT, keys: { p256dh: P256DH, auth: AUTH } };
    },
    postSubscription: async () => {
      calls.push("post");
      return { ok: true, status: 201 };
    },
    calls,
    ...overrides,
  };
  return deps;
}

function okDeactivateDeps(
  overrides: Partial<PushDeactivateDeps> = {},
): PushDeactivateDeps & { calls: string[] } {
  const calls: string[] = [];
  const deps = {
    getCurrentSubscription: async () => ({
      endpoint: ENDPOINT,
      unsubscribe: async () => {
        calls.push("unsubscribe");
      },
    }),
    deleteSubscription: async (endpoint: string) => {
      calls.push(`delete:${endpoint}`);
      return { ok: true, status: 200 };
    },
    calls,
    ...overrides,
  };
  return deps;
}

function stubConsole() {
  const logged: string[] = [];
  const methods = ["log", "error", "warn", "info", "debug"] as const;
  const restores: (() => void)[] = [];
  for (const method of methods) {
    const original = console[method];
    console[method] = ((...args: unknown[]) => {
      logged.push(args.map(String).join(" "));
    }) as typeof console.log;
    restores.push(() => {
      console[method] = original;
    });
  }
  return { logged, restore: () => restores.forEach((restore) => restore()) };
}

describe("clave pública VAPID (T6: RF-9, CL-19)", () => {
  it("convierte una clave URL-safe válida a Uint8Array", () => {
    const bytes = [4, 20, 33, 200, 1, 2, 3, 250];
    const key = publicKeyToUint8Array(base64UrlOf(bytes));
    assert.ok(key instanceof Uint8Array);
    assert.deepEqual(Array.from(key), bytes);
  });

  it("devuelve null si la clave está ausente o malformada", () => {
    assert.equal(publicKeyToUint8Array(""), null);
    assert.equal(publicKeyToUint8Array("   "), null);
    assert.equal(publicKeyToUint8Array(null), null);
    assert.equal(publicKeyToUint8Array(undefined), null);
    assert.equal(publicKeyToUint8Array("¡no-base64!"), null);
  });

  it("exporta claves del dispositivo a base64 sin perder bytes", () => {
    const bytes = new Uint8Array([1, 2, 250, 0, 255]).buffer;
    const text = bufferToBase64(bytes);
    assert.deepEqual(Array.from(Buffer.from(text, "base64")), [1, 2, 250, 0, 255]);
  });
});

describe("alta de suscripción (T6: RF-9, RF-13b, RF-24)", () => {
  it("sigue el orden permiso → suscripción → POST y solo 2xx es éxito (RF-9)", async () => {
    for (const status of [200, 201]) {
      const deps = okActivateDeps({
        postSubscription: async () => {
          deps.calls.push("post");
          return { ok: true, status };
        },
      });
      const result = await activatePushSubscription(deps);
      assert.deepEqual(deps.calls, ["permission", "subscribe", "post"]);
      assert.equal(result.activated, true);
      assert.equal(result.status, "active");
      assert.equal(result.message, null);
    }
  });

  it("sin soporte no pide permiso ni suscribe ni comunica nada (RF-26)", async () => {
    const deps = okActivateDeps({ supported: false });
    const result = await activatePushSubscription(deps);
    assert.deepEqual(deps.calls, []);
    assert.equal(result.activated, false);
    assert.equal(result.status, "unsupported");
    assert.ok(result.message && result.message.length > 0);
  });

  it("permiso denegado muestra «Avisos bloqueados» sin suscribir (RF-27)", async () => {
    const deps = okActivateDeps({
      requestPermission: async () => {
        deps.calls.push("permission");
        return "denied" as NotificationPermission;
      },
    });
    const result = await activatePushSubscription(deps);
    assert.deepEqual(deps.calls, ["permission"]);
    assert.equal(result.activated, false);
    assert.equal(result.status, "blocked");
  });

  it("sin clave pública informa en español sin suscribir (CL-19)", async () => {
    const deps = okActivateDeps({
      getPublicKey: async () => ({
        ok: false,
        reason: "sin clave",
      }),
    });
    const result = await activatePushSubscription(deps);
    assert.deepEqual(deps.calls, ["permission"]);
    assert.equal(result.activated, false);
    assert.notEqual(result.status, "active");
    assert.ok(result.message && result.message.length > 0);
  });

  it("clave malformada informa en español sin suscribir (CL-19)", async () => {
    const deps = okActivateDeps({ decodeKey: () => null });
    const result = await activatePushSubscription(deps);
    assert.deepEqual(deps.calls, ["permission"]);
    assert.equal(result.activated, false);
    assert.notEqual(result.status, "active");
  });

  it("fallo del navegador al suscribir informa sin comunicar al backend", async () => {
    const deps = okActivateDeps({
      subscribeDevice: async () => {
        deps.calls.push("subscribe");
        throw new Error("push no disponible");
      },
    });
    const result = await activatePushSubscription(deps);
    assert.deepEqual(deps.calls, ["permission", "subscribe"]);
    assert.equal(result.activated, false);
    assert.notEqual(result.status, "active");
    assert.ok(result.message && result.message.length > 0);
  });

  it("POST no 2xx no deja estado falso de «Avisos activados» (RF-13b)", async () => {
    for (const status of [403, 500]) {
      const deps = okActivateDeps({
        postSubscription: async () => {
          deps.calls.push("post");
          return { ok: false, status };
        },
      });
      const result = await activatePushSubscription(deps);
      assert.equal(result.activated, false);
      assert.notEqual(result.status, "active");
      assert.ok(result.message && result.message.length > 0);
      assert.notEqual(result.message, "Avisos activados");
    }
  });

  it("fallo de red en el POST informa sin estado falso (RF-13b)", async () => {
    const deps = okActivateDeps({
      postSubscription: async () => {
        deps.calls.push("post");
        throw new TypeError("fetch failed");
      },
    });
    const result = await activatePushSubscription(deps);
    assert.equal(result.activated, false);
    assert.notEqual(result.status, "active");
    assert.ok(result.message && result.message.length > 0);
  });

  it("el alta nunca registra la suscripción en consola (RF-24)", async () => {
    const { logged, restore } = stubConsole();
    try {
      const deps = okActivateDeps();
      await activatePushSubscription(deps);
      const failing = okActivateDeps({
        postSubscription: async () => {
          throw new TypeError("fetch failed");
        },
      });
      await activatePushSubscription(failing).catch(() => {});
      const text = logged.join(" ");
      assert.ok(!text.includes(ENDPOINT));
      assert.ok(!text.includes(P256DH));
      assert.ok(!text.includes(AUTH));
    } finally {
      restore();
    }
  });

  it("el resultado nunca expone la suscripción a la UI (RF-24)", async () => {
    const deps = okActivateDeps();
    const result = await activatePushSubscription(deps);
    const text = JSON.stringify(result);
    assert.ok(!text.includes(ENDPOINT));
    assert.ok(!text.includes(P256DH));
    assert.ok(!text.includes(AUTH));
  });
});

describe("baja de suscripción (T6: RF-12, RF-13, RF-13b, RF-24)", () => {
  it("elimina primero la suscripción local y después comunica la baja (RF-12)", async () => {
    const deps = okDeactivateDeps();
    const result = await deactivatePushSubscription(deps);
    assert.deepEqual(deps.calls, ["unsubscribe", `delete:${ENDPOINT}`]);
    assert.equal(result.removed, true);
    assert.equal(result.message, null);
  });

  it("fallo de red en la baja mantiene la baja local e informa reintento manual (RF-13)", async () => {
    const networkDown = okDeactivateDeps({
      deleteSubscription: async () => {
        networkDown.calls.push("delete");
        throw new TypeError("fetch failed");
      },
    });
    const offline = await deactivatePushSubscription(networkDown);
    assert.deepEqual(networkDown.calls, ["unsubscribe", "delete"]);
    assert.equal(offline.removed, true);
    assert.ok(
      offline.message && offline.message.includes("pendiente de reintento manual"),
    );

    const denied = okDeactivateDeps({
      deleteSubscription: async (endpoint: string) => {
        denied.calls.push(`delete:${endpoint}`);
        return { ok: false, status: 500 };
      },
    });
    const failed = await deactivatePushSubscription(denied);
    assert.equal(failed.removed, true);
    assert.ok(
      failed.message && failed.message.includes("pendiente de reintento manual"),
    );
  });

  it("sin suscripción local no comunica baja y queda en estado inicial", async () => {
    const deps = okDeactivateDeps({
      getCurrentSubscription: async () => null,
    });
    const result = await deactivatePushSubscription(deps);
    assert.deepEqual(deps.calls, []);
    assert.equal(result.removed, true);
    assert.equal(result.message, null);
  });

  it("si la baja local falla no comunica nada e informa en español", async () => {
    const deps = okDeactivateDeps({
      getCurrentSubscription: async () => ({
        endpoint: ENDPOINT,
        unsubscribe: async () => {
          deps.calls.push("unsubscribe");
          throw new Error("sin trabajador");
        },
      }),
    });
    const result = await deactivatePushSubscription(deps);
    assert.deepEqual(deps.calls, ["unsubscribe"]);
    assert.equal(result.removed, false);
    assert.ok(result.message && result.message.length > 0);
  });

  it("la baja nunca registra el extremo en consola (RF-24)", async () => {
    const { logged, restore } = stubConsole();
    try {
      await deactivatePushSubscription(okDeactivateDeps());
      const text = logged.join(" ");
      assert.ok(!text.includes(ENDPOINT));
    } finally {
      restore();
    }
  });

  it("ante 502 reintenta una única vez con la vía alternativa (CL-16)", async () => {
    const deps = okDeactivateDeps({
      deleteSubscription: async (endpoint: string) => {
        deps.calls.push(`delete:${endpoint}`);
        return { ok: false, status: 502 };
      },
      deleteSubscriptionFallback: async (endpoint: string) => {
        deps.calls.push(`fallback:${endpoint}`);
        return { ok: true, status: 204 };
      },
    });
    const result = await deactivatePushSubscription(deps);
    assert.deepEqual(deps.calls, [
      "unsubscribe",
      `delete:${ENDPOINT}`,
      `fallback:${ENDPOINT}`,
    ]);
    assert.equal(result.removed, true);
    assert.equal(result.message, null);
  });

  it("sin 502 no llama a la vía alternativa", async () => {
    const deps = okDeactivateDeps({
      deleteSubscriptionFallback: async (endpoint: string) => {
        deps.calls.push(`fallback:${endpoint}`);
        return { ok: true, status: 200 };
      },
    });
    const result = await deactivatePushSubscription(deps);
    assert.deepEqual(deps.calls, ["unsubscribe", `delete:${ENDPOINT}`]);
    assert.equal(result.removed, true);
    assert.equal(result.message, null);
  });

  it("si ambas vías fallan por red queda pendiente de reintento manual (RF-7)", async () => {
    const calls: string[] = [];
    const deps = okDeactivateDeps({
      deleteSubscription: async () => {
        calls.push("delete");
        throw new TypeError("fetch failed");
      },
      deleteSubscriptionFallback: async () => {
        calls.push("fallback");
        throw new TypeError("fetch failed");
      },
    });
    const result = await deactivatePushSubscription(deps);
    assert.deepEqual(calls, ["delete", "fallback"]);
    assert.equal(result.removed, true);
    assert.ok(
      result.message && result.message.includes("pendiente de reintento manual"),
    );
  });

  it("502 con alternativa fallida mantiene la baja local y pide reintento", async () => {
    const deps = okDeactivateDeps({
      deleteSubscription: async () => ({ ok: false, status: 502 }),
      deleteSubscriptionFallback: async () => ({ ok: false, status: 500 }),
    });
    const result = await deactivatePushSubscription(deps);
    assert.equal(result.removed, true);
    assert.ok(
      result.message && result.message.includes("pendiente de reintento manual"),
    );
  });
});
