import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONFIRMED_SCHEDULE,
  getCompactScheduleRows,
  getDetailedScheduleRows,
} from "@/common/utils/home-content";
import { FOOTER_SCHEDULE } from "@/common/components/layout/footer-links";

describe("CONFIRMED_SCHEDULE separa desayuno, comida y cena", () => {
  it("define las franjas por día", () => {
    assert.equal(CONFIRMED_SCHEDULE.monday.days, "Lunes");
    assert.deepEqual(CONFIRMED_SCHEDULE.monday.meals, { dinner: "20:00–23:00" });
    assert.equal(CONFIRMED_SCHEDULE.tuesdayToSaturday.days, "Martes a Sábado");
    assert.deepEqual(CONFIRMED_SCHEDULE.tuesdayToSaturday.meals, {
      breakfast: "desde las 08:00",
      lunch: "13:00–16:00",
      dinner: "20:00–23:00",
    });
    assert.equal(CONFIRMED_SCHEDULE.sunday.days, "Domingo");
    assert.equal(CONFIRMED_SCHEDULE.sunday.status, "Cerrado");
  });
});

describe("getDetailedScheduleRows (ubicación y reserva)", () => {
  it("devuelve una línea por servicio con etiqueta", () => {
    assert.deepEqual(getDetailedScheduleRows(), [
      {
        days: "Lunes",
        services: [{ label: "Cena", time: "20:00–23:00" }],
        status: undefined,
      },
      {
        days: "Martes a Sábado",
        services: [
          { label: "Desayuno", time: "Desde las 08:00" },
          { label: "Comida", time: "13:00–16:00" },
          { label: "Cena", time: "20:00–23:00" },
        ],
        status: undefined,
      },
      { days: "Domingo", services: [], status: "Cerrado" },
    ]);
  });
});

describe("getCompactScheduleRows (pie)", () => {
  it("fusiona desayuno y comida en un tramo y mantiene Cerrado", () => {
    assert.deepEqual(getCompactScheduleRows(), [
      { days: "Lunes", hours: "20:00–23:00" },
      {
        days: "Martes a Sábado",
        hours: "08:00–16:00 y 20:00–23:00",
      },
      { days: "Domingo", hours: "Cerrado" },
    ]);
  });

  it("FOOTER_SCHEDULE.rows deriva del helper compartido", () => {
    assert.equal(FOOTER_SCHEDULE.title, "Horario de Apertura");
    assert.deepEqual(FOOTER_SCHEDULE.rows, getCompactScheduleRows());
  });
});
