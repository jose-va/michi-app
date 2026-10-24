import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL(
    "../common/components/layout/user/AdminProfileTabs.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("dos pestañas de línea con Reservas de hoy seleccionada al abrir sin navegar", () => {
  assert.ok(
    source.includes('defaultValue="reservas-hoy"'),
    "Reservas de hoy debe ser la pestaña seleccionada al abrir",
  );
  assert.ok(
    source.includes('<TabsList variant="line">'),
    "Las pestañas deben usar la variante de línea",
  );
  assert.ok(
    source.includes(
      '<TabsTrigger value="reservas-hoy">Reservas de hoy</TabsTrigger>',
    ),
    "Debe existir la pestaña Reservas de hoy con su etiqueta exacta",
  );
  assert.ok(
    source.includes('<TabsTrigger value="opciones">Opciones</TabsTrigger>'),
    "Debe existir la pestaña Opciones con su etiqueta exacta",
  );
  assert.ok(
    source.includes('<TabsContent value="reservas-hoy">'),
    "Debe existir el contenido de Reservas de hoy",
  );
  assert.ok(
    source.includes('<TabsContent value="opciones">'),
    "Debe existir el contenido de Opciones",
  );
  assert.equal(
    source.match(/<TabsTrigger/g)?.length ?? 0,
    2,
    "Debe haber dos pestañas",
  );
  assert.ok(
    source.indexOf('value="reservas-hoy"') < source.indexOf('value="opciones"'),
    "Opciones debe ir junto a Reservas de hoy, después de ella",
  );
  assert.ok(
    !source.includes("next/navigation") &&
      !source.includes("useRouter") &&
      !source.includes("redirect("),
    "Las pestañas deben estar contenidas en el panel sin navegar",
  );
});

test("Opciones contiene Crear producto y Ver reservas sin navegar", () => {
  assert.ok(
    source.includes('<TabsContent value="opciones">'),
    "Debe existir el contenido de Opciones",
  );
  assert.ok(
    source.includes('href="/product/create"') &&
      source.includes("Crear producto"),
    "Opciones debe contener Crear producto",
  );
  assert.ok(
    source.includes('href="/reservation/preview"') &&
      source.includes("Reservas"),
    "Opciones debe contener Ver reservas",
  );
  assert.ok(
    source.includes("SheetClose"),
    "Los enlaces de Opciones deben cerrar el panel",
  );
});

test("Reservas de hoy usa la consulta del día sin filtro y su vacío exacto", () => {
  assert.ok(
    source.includes('getTodayKey(new Date(), "Europe/Madrid")'),
    "El día debe calcularse en Europa/Madrid con getTodayKey",
  );
  assert.ok(
    source.includes("ReservationService.getReservations("),
    "Debe consultar las reservas del día con ReservationService",
  );
  assert.ok(
    !source.includes("selectActiveReservation"),
    "El administrador lista todas las reservas sin filtrar por usuario",
  );
  assert.ok(
    source.includes("Todavía no hay reservas"),
    "Sin reservas debe mostrar el mensaje exacto",
  );
  assert.ok(
    source.includes("No se ha podido cargar la información"),
    "Ante un error de carga debe mostrar el mensaje exacto",
  );
});

test("las reservas de hoy se separan visualmente entre sí", () => {
  assert.ok(
    source.includes('<TabsContent value="reservas-hoy">'),
    "Debe existir el contenido de Reservas de hoy",
  );
  assert.ok(
    source.includes("<Separator"),
    "El listado debe usar un separador visible entre reservas",
  );
  assert.ok(
    source.includes("index > 0") || source.includes("index !== 0"),
    "El separador debe aparecer solo entre reservas, no antes de la primera",
  );
});

test("cada reserva muestra sus campos y solo email/observations/location si existen", () => {
  for (const field of [
    "reservation.date",
    "reservation.startTime",
    "reservation.guests",
    "reservation.name",
    "reservation.phone",
  ]) {
    assert.ok(
      source.includes(field),
      `Cada reserva debe mostrar ${field}`,
    );
  }
  assert.ok(
    source.includes("reservation.email ?"),
    "El correo solo debe mostrarse si existe",
  );
  assert.ok(
    source.includes("reservation.observations ?"),
    "Las observaciones solo deben mostrarse si existen",
  );
  assert.ok(
    source.includes("reservation.location ?"),
    "La ubicación solo debe mostrarse si existe",
  );
});
