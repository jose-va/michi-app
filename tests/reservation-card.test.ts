import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
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

test("ReservationCard muestra foto de gatito con alt=nombre del cliente", () => {
  assert.ok(
    source.includes("getCatAvatarUrl"),
    "ReservationCard debe elegir el gatito con getCatAvatarUrl"
  );
  assert.ok(
    source.includes("alt={reservation.name}"),
    "El alt de la foto debe ser el nombre del cliente"
  );
});

test("ReservationCard elige el gatito de forma determinista por reserva", () => {
  assert.ok(
    /\$\{reservation\.name\}-\$\{index\}/.test(source),
    "La semilla del gatito debe combinar nombre e índice"
  );
});

test("ReservationCard oculta la foto si falla, sin iniciales ni icono genérico", () => {
  assert.ok(source.includes("imageFailed"), "Debe usar el estado imageFailed");
  assert.ok(
    /\{!imageFailed && \(/.test(source),
    "La foto solo se renderiza cuando no ha fallado"
  );
  assert.ok(
    /onError=\{\(\)\s*=>\s*setImageFailed\(true\)\}/.test(source),
    "onError debe activar el fallo con setImageFailed(true)"
  );
  assert.ok(
    !source.includes("initials"),
    "El fallback no debe mostrar iniciales"
  );
  assert.ok(
    !source.includes("<Avatar"),
    "El fallback no debe mostrar un avatar genérico"
  );
});

test("ReservationCard muestra solo el nombre en la cabecera, sin la hora", () => {
  assert.ok(
    source.includes("<CardTitle>{reservation.name}</CardTitle>"),
    "CardTitle debe mostrar solo el nombre del cliente"
  );
  assert.ok(
    !source.includes("{reservation.name} - {reservation.startTime}"),
    "La cabecera ya no debe mostrar `nombre - hora`"
  );
});

test("ReservationCard mantiene el Badge de ubicación Terraza/Interior", () => {
  assert.ok(source.includes("<Badge"), "Debe seguir mostrando el Badge");
  assert.ok(
    source.includes(
      'reservation.location === "OUTSIDE" ? "Terraza" : "Interior"'
    ),
    "La lógica del Badge debe quedar intacta"
  );
});

test("ReservationCard ya no muestra el email", () => {
  assert.ok(
    !source.toLowerCase().includes("email"),
    "ReservationCard no debe mencionar el email"
  );
  assert.ok(
    !source.includes("CardDescription"),
    "ReservationCard no debe usar CardDescription"
  );
});

test("ReservationCard muestra la hora tal cual con etiqueta delante", () => {
  assert.ok(source.includes("Hora:"), "Debe mostrar la etiqueta Hora:");
  assert.ok(
    source.includes("{reservation.startTime}"),
    "Debe mostrar startTime tal cual, sin formatear"
  );
  assert.ok(
    !source.includes("format(") && !source.includes("date-fns"),
    "La hora no debe formatearse"
  );
});

test("ReservationCard muestra Sin observaciones cuando no hay", () => {
  assert.ok(
    source.includes("reservation.observations"),
    "Debe mostrar las observaciones"
  );
  assert.ok(
    source.includes("Sin observaciones"),
    "Debe usar el literal Sin observaciones como fallback"
  );
});

test("ReservationCard enlaza el teléfono manteniendo icono y texto", () => {
  assert.ok(
    source.includes('from "next/link"'),
    "Debe usar next/link para el teléfono"
  );
  assert.ok(source.includes("<Link"), "El teléfono debe ser un Link clicable");
  assert.ok(
    /href=\{`tel:\$\{reservation\.phone\}`\}/.test(source),
    "El href temporal debe ser tel:{phone}"
  );
  assert.ok(
    source.includes("TODO"),
    "El href temporal debe llevar un TODO localizable"
  );
  assert.ok(source.includes("<Phone"), "Debe mantener el icono Phone");
  assert.ok(
    source.includes("{reservation.phone}"),
    "El texto visible debe seguir siendo el teléfono"
  );
});

test("AdminReservations mantiene el grid 1/2/4 intacto", () => {
  assert.ok(
    adminSource.includes("grid-cols-1") &&
      adminSource.includes("md:grid-cols-2") &&
      adminSource.includes("lg:grid-cols-4"),
    "El grid 1/2/4 debe quedar intacto"
  );
});
