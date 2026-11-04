import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// T9 (RF-27): panel lateral en edición igual que en creación.
// La edición presenta `/images/Foto sushi.webp` con alt
// «Plato de sushi de Michi Sushi Granada», rótulo «Michi Sushi» /
// «Sushi para compartir en Granada» y `data-testid="reservation-side-image"`;
// si la imagen falla, el panel se oculta y el formulario ocupa todo el ancho.

const editSource = readFileSync(
  new URL(
    "../common/components/pages/reservation/EditReservationPage.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("la edición muestra la imagen del panel lateral", () => {
  assert.ok(
    editSource.includes("/images/Foto sushi.webp"),
    "EditReservationPage debe usar /images/Foto sushi.webp",
  );
  assert.ok(
    editSource.includes("Plato de sushi de Michi Sushi Granada"),
    "EditReservationPage debe usar el alt «Plato de sushi de Michi Sushi Granada»",
  );
  assert.ok(
    editSource.includes('data-testid="reservation-side-image"'),
    "EditReservationPage debe exponer data-testid=\"reservation-side-image\"",
  );
});

test("la edición muestra el mismo rótulo que la creación", () => {
  assert.ok(
    editSource.includes("Michi Sushi"),
    "EditReservationPage debe mostrar el rótulo «Michi Sushi»",
  );
  assert.ok(
    editSource.includes("Sushi para compartir en Granada"),
    "EditReservationPage debe mostrar «Sushi para compartir en Granada»",
  );
});

test("la edición usa la misma disposición y repliegue que la creación", () => {
  assert.ok(
    editSource.includes("md:grid-cols-[2fr_3fr]"),
    "EditReservationPage debe usar la misma disposición md:grid-cols-[2fr_3fr]",
  );
  assert.ok(
    editSource.includes("imageFailed"),
    "EditReservationPage debe ocultar el panel si la imagen falla (imageFailed)",
  );
  assert.ok(
    editSource.includes("md:col-span-2"),
    "el formulario debe ocupar todo el ancho si la imagen falla (md:col-span-2)",
  );
  assert.ok(
    editSource.includes("onError"),
    "EditReservationPage debe replegar el panel con onError",
  );
});
