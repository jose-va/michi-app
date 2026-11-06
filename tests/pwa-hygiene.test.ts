import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  PUSH_NOTIFICATION_ICON,
  PUSH_NOTIFICATION_TITLE,
  PUSH_NOTIFICATION_URL,
} from "@/common/utils/push-format";
import { isSecurePushContext } from "@/common/utils/push-environment";

const ROOT = process.cwd();
function src(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("T9 barrido de textos, privacidad y tema (RF-19, RF-21; RNF-1, RNF-2, RNF-3, RNF-4, RNF-6)", () => {
  it("lista cerrada de textos exactos en español (RNF-1)", () => {
    // Sin Badge en la UI: los textos de estado (PUSH_STATUS_TEXT) son
    // lógica pura cubierta en push-status.test.ts y ya no se exigen aquí.
    assert.equal(PUSH_NOTIFICATION_TITLE, "Nueva reserva");
    assert.equal(PUSH_NOTIFICATION_ICON, "/icons/manifest-icon-192.png");
    assert.equal(PUSH_NOTIFICATION_URL, "/reservation/preview");
    const settings = src("common/components/admin/PushSettings.tsx");
    assert.ok(settings.includes("Activar avisos"));
    assert.ok(!settings.includes("Probar aviso"));
  });

  it("cero secretos o suscripciones en cliente, consola o repo (RF-19, RNF-2)", () => {
    for (const path of [
      "service/PushService.ts",
      "common/components/admin/PushSettings.tsx",
      "common/utils/push-subscription.ts",
      "app/api/push/public-key/route.ts",
      "app/api/push/subscriptions/route.ts",
      "public/sw.js",
    ]) {
      const text = src(path);
      assert.ok(!text.includes("VAPID_PRIVATE"));
      assert.ok(!text.includes("VAPID_PRIVATE_KEY"));
      assert.ok(!text.includes("BEGIN PRIVATE KEY"));
      assert.ok(!text.includes("NEXT_PUBLIC_VAPID_PRIVATE"));
    }
    const client = src("service/PushService.ts");
    assert.ok(!client.includes("console.log"));
    for (const line of client.split("\n")) {
      if (line.includes("console.")) {
        assert.ok(!line.includes("endpoint"));
        assert.ok(!line.includes("sub."));
        assert.ok(!line.includes("keys"));
      }
    }
  });

  it("flujos de reserva, auth y admin intactos sin caché propia (RNF-3)", () => {
    const sw = src("public/sw.js");
    assert.ok(sw.includes('addEventListener("push"'));
    assert.ok(sw.includes('addEventListener("notificationclick"'));
    assert.ok(!sw.includes("caches"));
    assert.ok(!sw.includes('addEventListener("fetch"'));
    assert.ok(!sw.includes("/offline"));
  });

  it("tema visual existente respetado (RNF-4)", () => {
    for (const path of ["common/components/admin/PushSettings.tsx"]) {
      const text = src(path);
      // Diseño plano aprobado: sección semántica sin recuadro oscuro
      // y sin Badge (basta el switch apagado + Alert destructivo).
      assert.ok(!text.includes("rounded-lg border bg-background"));
      assert.ok(!text.includes("rounded-lg"));
      assert.ok(!text.includes("@/shadcn/components/badge"));
      assert.ok(!text.includes("<Badge"));
      assert.ok(!text.includes("@/shadcn/components/button"));
      assert.ok(!text.includes("<Button"));
      // Tema shadcn respetado mediante el sistema de diseño existente
      // (sección plana sin Button: solo Switch + Alert).
      assert.ok(text.includes("@/shadcn/components/alert"));
      assert.ok(text.includes("@/shadcn/components/switch"));
      assert.ok(text.includes("<Alert"));
      assert.ok(text.includes("<Switch"));
      // Alert de error/aviso: variante destructiva (roja), debajo del
      // switch y a ancho completo.
      assert.ok(text.includes('variant="destructive"'));
      assert.ok(text.includes("w-full"));
    }
  });

  it("contexto seguro exigido salvo localhost (RNF-6, RF-21)", () => {
    assert.equal(
      isSecurePushContext({ isSecureContext: true, hostname: "example.com" }),
      true,
    );
    assert.equal(
      isSecurePushContext({ isSecureContext: false, hostname: "example.com" }),
      false,
    );
    assert.equal(
      isSecurePushContext({ isSecureContext: false, hostname: "localhost" }),
      true,
    );
    assert.equal(
      isSecurePushContext({ isSecureContext: false, hostname: "127.0.0.1" }),
      true,
    );
    assert.equal(
      isSecurePushContext({ isSecureContext: false, hostname: "::1" }),
      true,
    );
    assert.equal(
      isSecurePushContext({ isSecureContext: true, hostname: "localhost" }),
      true,
    );
    const settings = src("common/components/admin/PushSettings.tsx");
    assert.ok(settings.includes("isSecurePushContext"));
  });
});
