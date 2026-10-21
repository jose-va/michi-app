import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FOOTER_SCHEDULE,
  FOOTER_SCHEDULE_EMPTY_TEXT,
} from "@/common/components/layout/footer-links";
import { CONFIRMED_SCHEDULE } from "@/common/utils/home-content";

describe("Datos puros del Bloque Horario del footer (RF-18)", () => {
  it("tiene el título exacto", () => {
    assert.equal(FOOTER_SCHEDULE.title, "Horario de Apertura");
  });

  it("tiene las filas exactas, idénticas al home sin inventar horas", () => {
    assert.deepEqual(FOOTER_SCHEDULE.rows, [
      {
        days: "Lunes a sábado",
        hours: "08:00–16:00 y 20:00–23:00",
      },
      { days: "Domingo", hours: "Cerrado" },
    ]);
  });

  it("reutiliza el contenido exacto del home (CONFIRMED_SCHEDULE unido con ' y ')", () => {
    assert.equal(
      FOOTER_SCHEDULE.rows[0].days,
      CONFIRMED_SCHEDULE.weekdays.days,
    );
    assert.equal(
      FOOTER_SCHEDULE.rows[0].hours,
      CONFIRMED_SCHEDULE.weekdays.hours.join(" y "),
    );
    assert.equal(
      FOOTER_SCHEDULE.rows[1].days,
      CONFIRMED_SCHEDULE.sunday.days,
    );
    assert.equal(
      FOOTER_SCHEDULE.rows[1].hours,
      CONFIRMED_SCHEDULE.sunday.status,
    );
  });
});

describe("Texto de vacío del Bloque Horario (RF-22)", () => {
  it("tiene el texto exacto sin horas", () => {
    assert.equal(
      FOOTER_SCHEDULE_EMPTY_TEXT,
      "Horario pendiente de confirmación",
    );
  });
});
