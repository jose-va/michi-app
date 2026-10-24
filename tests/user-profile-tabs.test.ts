import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL(
    "../common/components/layout/user/UserProfileTabs.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("pestañas de línea Mi reserva (inicial) y Favoritos sin navegar", () => {
  assert.ok(
    source.includes('defaultValue="mi-reserva"'),
    "Mi reserva debe ser la pestaña seleccionada al abrir",
  );
  assert.ok(
    source.includes('<TabsList variant="line">'),
    "Las pestañas deben usar la variante de línea",
  );
  assert.ok(
    source.includes('<TabsTrigger value="mi-reserva">Mi reserva</TabsTrigger>'),
    "Debe existir la pestaña Mi reserva con su etiqueta exacta",
  );
  assert.ok(
    source.includes('<TabsTrigger value="favoritos">Favoritos</TabsTrigger>'),
    "Debe existir la pestaña Favoritos con su etiqueta exacta",
  );
  assert.ok(
    source.includes('<TabsContent value="mi-reserva">'),
    "Debe existir el contenido de Mi reserva",
  );
  assert.ok(
    source.includes('<TabsContent value="favoritos">'),
    "Debe existir el contenido de Favoritos",
  );
  assert.ok(
    !source.includes("next/link") &&
      !source.includes("next/navigation") &&
      !source.includes("useRouter") &&
      !source.includes("redirect("),
    "Las pestañas deben estar contenidas en el panel sin navegar",
  );
});

test("Mi reserva usa la consulta del día y la activa de T1", () => {
  assert.ok(
    source.includes('getTodayKey(new Date(), "Europe/Madrid")'),
    "El día debe calcularse en Europa/Madrid con getTodayKey",
  );
  assert.ok(
    source.includes("ReservationService.getReservations("),
    "Debe consultar las reservas del día con ReservationService",
  );
  assert.ok(
    source.includes("selectActiveReservation(reservations, user.id)"),
    "Debe seleccionar la activa filtrando por el id del usuario",
  );
  assert.ok(
    source.includes("Todavía no has realizado ninguna reserva"),
    "Sin reserva activa debe mostrar el mensaje exacto",
  );
  assert.ok(
    source.includes("No se ha podido cargar la información"),
    "Ante un error de carga debe mostrar el mensaje exacto",
  );
});

test("Mi reserva muestra todos los campos y solo email/observations/location si existen", () => {
  for (const field of [
    "reservation.date",
    "reservation.startTime",
    "reservation.guests",
    "reservation.name",
    "reservation.phone",
  ]) {
    assert.ok(
      source.includes(field),
      `La reserva activa debe mostrar ${field}`,
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

test("Favoritos resuelve con T2 y muestra foto con el mismo alternativo de producto", () => {
  assert.ok(
    source.includes("ProductService.all()"),
    "Debe resolver los favoritos con el servicio de productos existente",
  );
  assert.ok(
    source.includes(
      "resolveFavoriteProducts(products, user.favoriteProducts)",
    ),
    "Debe cruzar los IDs con el listado mediante resolveFavoriteProducts",
  );
  assert.ok(
    source.includes("<FavoriteProductPhoto"),
    "La foto debe componerse con el hijo cliente de alternativo condicional",
  );
  assert.ok(
    source.includes("name={product.name}"),
    "La foto cliente debe recibir solo el nombre (prop serializable)",
  );
  assert.ok(
    !source.includes("dish-composition") && !source.includes("PLACEHOLDER"),
    "No debe inventar ninguna imagen",
  );
  assert.ok(
    source.includes("No tienes productos favoritos"),
    "Sin favoritos resueltos debe mostrar el mensaje exacto",
  );
});

test("Favoritos muestra fila compacta: nombre, japonés y solo UserOptions", () => {
  for (const field of ["product.name", "product.japaneseName"]) {
    assert.ok(
      source.includes(field),
      `Cada favorito debe mostrar ${field}`,
    );
  }
  assert.ok(
    source.includes("<UserOptions"),
    "Cada favorito debe incluir solo el bloque de acción del usuario normal",
  );
  assert.ok(
    source.includes("user={user.id}"),
    "UserOptions debe recibir el id del usuario",
  );
  assert.ok(
    source.includes('product={product.id ?? ""}'),
    "UserOptions debe recibir el id del producto",
  );
  assert.ok(
    source.includes("favorite={"),
    "UserOptions debe recibir si el producto es favorito",
  );
  assert.ok(
    !source.includes("AdminOptions"),
    "La fila compacta no debe incluir el bloque de administrador",
  );
  for (const absent of [
    "product.description",
    "product.pieces",
    "product.price",
    "getCategoryTitle(product.category)",
    "product.allergens",
  ]) {
    assert.ok(
      !source.includes(absent),
      `La fila compacta no debe mostrar ${absent} para no colapsar el panel`,
    );
  }
});

test("Favoritos no colapsa en el panel estrecho: miniatura fija, una línea y solo el corazón actúa", () => {
  assert.ok(
    source.includes('<li className="flex min-w-0 items-center gap-2">'),
    "La fila debe ajustar su separación al panel estrecho",
  );
  const truncates = source.match(/truncate/g) ?? [];
  assert.ok(
    truncates.length >= 2,
    "Nombre y nombre japonés deben quedar a una línea con truncate/ellipsis",
  );
  assert.ok(
    source.includes("shrink-0"),
    "Foto y corazón no deben encogerse dentro de la fila",
  );
  for (const absent of ["next/link", "<Link", "<a "]) {
    assert.ok(
      !source.includes(absent),
      "Foto y nombre no enlazan: solo el corazón actúa",
    );
  }
});
