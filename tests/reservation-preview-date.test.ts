import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const cardSource = readFileSync(
  new URL(
    "../common/components/ui/reservation/ReservationCard.tsx",
    import.meta.url
  ),
  "utf8"
);
const adminSource = readFileSync(
  new URL(
    "../common/components/pages/reservation/AdminReservations.tsx",
    import.meta.url
  ),
  "utf8"
);

test("AdminReservations ya no muestra la fecha como título externo flotante", () => {
  assert.ok(
    !adminSource.includes("toLocaleDateString"),
    "AdminReservations no debe formatear la fecha como título externo"
  );
  assert.ok(
    !adminSource.includes("mx-auto"),
    "AdminReservations no debe tener el título centrado fuera de la card"
  );
});

test("ReservationCard muestra la fecha como cabecera dentro de la card", () => {
  assert.ok(
    cardSource.includes("reservation.date"),
    "La card debe leer la fecha de la propia reserva"
  );
  assert.ok(
    cardSource.includes("toLocaleDateString"),
    "La card debe formatear la fecha con el literal vigente (día de mes)"
  );
  assert.ok(
    cardSource.includes("es-ES"),
    "El formato de fecha debe seguir en español"
  );
  assert.ok(
    /Calendar\w*/.test(cardSource),
    "La cabecera de fecha debe llevar un icono de calendario"
  );
  assert.ok(
    cardSource.includes("aria-hidden"),
    "El icono de calendario debe ser decorativo (aria-hidden)"
  );
  const cardOpen = cardSource.indexOf("<Card");
  const renderIndex = cardSource.indexOf("{dateLabel}");
  const titleIndex = cardSource.indexOf("reservation.name");
  assert.ok(
    cardOpen !== -1 && renderIndex > cardOpen && renderIndex < titleIndex,
    "La fecha debe ir dentro de la card, antes del contenido existente"
  );
});

test("ReservationCard mantiene el contenido existente intacto", () => {
  assert.ok(
    cardSource.includes("<CardTitle>{reservation.name}</CardTitle>"),
    "Debe mantener el nombre en la cabecera"
  );
  assert.ok(
    cardSource.includes(
      'reservation.location === "OUTSIDE" ? "Terraza" : "Interior"'
    ),
    "Debe mantener el distintivo Terraza/Interior"
  );
  assert.ok(
    cardSource.includes("Hora:") &&
      cardSource.includes("{reservation.startTime}"),
    "Debe mantener la hora tal cual"
  );
  assert.ok(
    cardSource.includes("Sin observaciones"),
    "Debe mantener el literal Sin observaciones"
  );
  assert.ok(
    cardSource.includes("{reservation.phone}"),
    "Debe mantener el teléfono"
  );
});
