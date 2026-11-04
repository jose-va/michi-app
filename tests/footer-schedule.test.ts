import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FOOTER_SCHEDULE,
  FOOTER_SCHEDULE_EMPTY_TEXT,
} from "@/common/components/layout/footer-links";
import { getCompactScheduleRows } from "@/common/utils/home-content";

describe("Datos puros del Bloque Horario del footer (RF-18)", () => {
  it("tiene el título exacto", () => {
    assert.equal(FOOTER_SCHEDULE.title, "Horario de Apertura");
  });

  it("tiene las filas exactas en formato compacto", () => {
    assert.deepEqual(FOOTER_SCHEDULE.rows, [
      { days: "Lunes", hours: "20:00–23:00" },
      {
        days: "Martes a Sábado",
        hours: "08:00–16:00 y 20:00–23:00",
      },
      { days: "Domingo", hours: "Cerrado" },
    ]);
  });

  it("deriva de CONFIRMED_SCHEDULE mediante el helper compartido", () => {
    assert.deepEqual(FOOTER_SCHEDULE.rows, getCompactScheduleRows());
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
