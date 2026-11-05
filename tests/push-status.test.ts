import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PUSH_STATUS_TEXT,
  canShowPushSettings,
  pushStatusText,
  resolvePushStatus,
} from "@/common/utils/push-status";

describe("estado de avisos push (T5: RF-10, RF-26)", () => {
  it("sin soporte muestra «Avisos no soportados» aunque haya permiso y suscripción (RF-26, CL-13)", () => {
    assert.equal(
      resolvePushStatus({
        supported: false,
        permission: "granted",
        subscribed: true,
      }),
      "unsupported"
    );
    assert.equal(
      resolvePushStatus({
        supported: false,
        permission: "denied",
        subscribed: false,
      }),
      "unsupported"
    );
  });

  it("permiso denegado o bloqueado muestra «Avisos bloqueados» incluso con suscripción anterior (RF-10, CL-5)", () => {
    assert.equal(
      resolvePushStatus({
        supported: true,
        permission: "denied",
        subscribed: false,
      }),
      "blocked"
    );
    assert.equal(
      resolvePushStatus({
        supported: true,
        permission: "denied",
        subscribed: true,
      }),
      "blocked"
    );
  });

  it("permiso concedido con suscripción vigente muestra «Avisos activados»", () => {
    assert.equal(
      resolvePushStatus({
        supported: true,
        permission: "granted",
        subscribed: true,
      }),
      "active"
    );
  });

  it("permiso concedido o pendiente sin suscripción queda en desconocido sin texto falso (RF-13b)", () => {
    assert.equal(
      resolvePushStatus({
        supported: true,
        permission: "granted",
        subscribed: false,
      }),
      "unknown"
    );
    assert.equal(
      resolvePushStatus({
        supported: true,
        permission: "default",
        subscribed: false,
      }),
      "unknown"
    );
  });

  it("cada estado conocido tiene un único texto exacto en español (RNF-1)", () => {
    assert.equal(PUSH_STATUS_TEXT.active, "Avisos activados");
    assert.equal(PUSH_STATUS_TEXT.blocked, "Avisos bloqueados");
    assert.equal(PUSH_STATUS_TEXT.unsupported, "Avisos no soportados");
    assert.equal(pushStatusText("active"), "Avisos activados");
    assert.equal(pushStatusText("blocked"), "Avisos bloqueados");
    assert.equal(pushStatusText("unsupported"), "Avisos no soportados");
    assert.equal(pushStatusText("unknown"), null);
  });
});

describe("control de avisos solo para administración (T5: RF-8)", () => {
  it("solo la sesión de administración ve «Activar avisos»", () => {
    assert.equal(canShowPushSettings("ROLE_ADMIN"), true);
    assert.equal(canShowPushSettings("ROLE_USER"), false);
    assert.equal(canShowPushSettings(null), false);
    assert.equal(canShowPushSettings(undefined), false);
    assert.equal(canShowPushSettings(""), false);
  });
});
