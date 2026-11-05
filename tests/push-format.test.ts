import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPushBody,
  formatPushDateTime,
  normalizePushTime,
  PUSH_NOTIFICATION_ICON,
  PUSH_NOTIFICATION_TITLE,
  PUSH_NOTIFICATION_URL,
  resolvePushNotification,
} from "@/common/utils/push-format";

// Contrato observable del aviso de nueva reserva (T8: RF-15–RF-19,
// CL-15, CL-20). `hoy` fijo para determinismo (jueves 5 de noviembre de
// 2026, hora local del restaurante Europe/Madrid).
const HOY = new Date("2026-11-05T12:00:00+01:00");

describe("aviso de nueva reserva (T8: RF-15–RF-19)", () => {
  it("título exacto, icono existente y url relativa a la gestión (RF-15–RF-17)", () => {
    assert.equal(PUSH_NOTIFICATION_TITLE, "Nueva reserva");
    assert.equal(PUSH_NOTIFICATION_ICON, "/icons/manifest-icon-192.png");
    assert.equal(PUSH_NOTIFICATION_URL, "/reservation/preview");
  });

  it("fecha en formato largo español en hora local del restaurante (RF-15)", () => {
    assert.equal(
      formatPushDateTime("2026-11-06", HOY),
      "viernes 6 de noviembre",
    );
  });

  it("respeta el horario de verano/invierno (CL-20, DST)", () => {
    // 20:30 UTC en julio son las 22:30 en Madrid (UTC+2): mismo viernes.
    assert.equal(
      formatPushDateTime("2026-07-10T20:30:00Z", HOY),
      "viernes 10 de julio",
    );
    // 20:30 UTC en enero son las 21:30 en Madrid (UTC+1): mismo sábado.
    assert.equal(
      formatPushDateTime("2026-01-10T20:30:00Z", HOY),
      "sábado 10 de enero",
    );
  });

  it("fecha inválida no inventa valores (RF-15, CL-15)", () => {
    assert.equal(formatPushDateTime("no-es-fecha", HOY), "");
    assert.equal(formatPushDateTime("", HOY), "");
    assert.equal(formatPushDateTime("2026-13-99", HOY), "");
  });

  it("cuerpo con nombre+fecha+hora unidos sin inventar (RF-15, CL-15)", () => {
    assert.equal(
      buildPushBody(
        { name: "Ana", date: "2026-11-06", time: "20:30" },
        HOY,
      ),
      "Mesa para Ana · viernes 6 de noviembre · 20:30",
    );
  });

  it("datos ausentes muestran solo los disponibles (CL-15)", () => {
    assert.equal(
      buildPushBody({ date: "2026-11-06", time: "20:30" }, HOY),
      "viernes 6 de noviembre · 20:30",
    );
    assert.equal(
      buildPushBody({ name: "Ana", time: "20:30" }, HOY),
      "Mesa para Ana · 20:30",
    );
    assert.equal(
      buildPushBody({ name: "Ana", date: "2026-11-06" }, HOY),
      "Mesa para Ana · viernes 6 de noviembre",
    );
    assert.equal(buildPushBody({ time: "20:30" }, HOY), "20:30");
    assert.equal(buildPushBody({}, HOY), "");
    assert.equal(
      buildPushBody(
        { name: "  ", date: "basura", time: "cuando sea" },
        HOY,
      ),
      "",
    );
  });

  it("nombre con emoji o caracteres especiales intacto (CL-20)", () => {
    assert.equal(
      buildPushBody(
        { name: "Ana 🎉 García-López", date: "2026-11-06", time: "20:30" },
        HOY,
      ),
      "Mesa para Ana 🎉 García-López · viernes 6 de noviembre · 20:30",
    );
  });

  it("hora normalizada a HH:MM sin inventar (RF-15)", () => {
    assert.equal(normalizePushTime("20:30"), "20:30");
    assert.equal(normalizePushTime("20:30:00"), "20:30");
    assert.equal(normalizePushTime("9:05"), "09:05");
    assert.equal(normalizePushTime("cuando sea"), "");
    assert.equal(normalizePushTime("25:00"), "");
    assert.equal(normalizePushTime(null), "");
  });

  it("año distinto al de hoy se muestra para no ambiguar (hoy inyectado)", () => {
    const texto = formatPushDateTime("2027-01-10", HOY);
    assert.ok(texto.includes("enero"));
    assert.ok(texto.includes("2027"));
    assert.ok(!formatPushDateTime("2026-11-06", HOY).includes("2026"));
  });

  it("payload del SW con fallbacks exactos (RF-15, RF-17)", () => {
    assert.deepEqual(resolvePushNotification({}), {
      title: "Nueva reserva",
      body: "",
      icon: "/icons/manifest-icon-192.png",
      url: "/reservation/preview",
    });
    const completo = resolvePushNotification({
      title: "Nueva reserva",
      body: "Mesa para Ana · viernes 6 de noviembre · 20:30",
      url: "/reservation/preview",
    });
    assert.equal(completo.title, "Nueva reserva");
    assert.ok(completo.body.includes("Mesa para Ana"));
    assert.equal(completo.url, "/reservation/preview");
    assert.equal(
      resolvePushNotification({ title: "  ", url: 42 }).url,
      "/reservation/preview",
    );
  });
});
