import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const photo = readFileSync(
  new URL(
    "../common/components/layout/user/FavoriteProductPhoto.tsx",
    import.meta.url,
  ),
  "utf8",
);

const userTabs = readFileSync(
  new URL(
    "../common/components/layout/user/UserProfileTabs.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("foto de favorito es cliente mínimo con el mismo alternativo condicional que ProductCard", () => {
  assert.ok(
    photo.includes('"use client"'),
    "La foto necesita interactividad y debe ser un hijo cliente mínimo",
  );
  assert.ok(
    photo.includes("useState"),
    "Debe usar estado para detectar el fallo de carga",
  );
  assert.match(
    photo,
    /imageFailed \?/,
    "El bloque neutro debe mostrarse EN LUGAR de la imagen cuando falla la carga",
  );
  const fallbackIndex = photo.indexOf("h-14 w-14 shrink-0 rounded-md bg-black/60");
  const imageIndex = photo.indexOf("<Image");
  assert.ok(
    fallbackIndex !== -1 &&
      imageIndex !== -1 &&
      fallbackIndex < imageIndex,
    "La rama de fallo (bloque neutro) debe ir antes que la rama de imagen, como en ProductCard",
  );
  assert.match(
    photo,
    /onError=\{\(\) => setImageFailed\(true\)\}/,
    "El fallo de carga debe activar el alternativo vía onError→imageFailed",
  );
});

test("la foto se resuelve por nombre igual que la página de producto, sin inventos", () => {
  assert.ok(
    photo.includes("getProductImageSrc(name)"),
    "La foto debe resolverse por nombre con getProductImageSrc",
  );
  assert.ok(
    photo.includes("Fotografía de ${name}"),
    "El alternativo debe ser el mismo que en la página de producto",
  );
  assert.ok(
    !photo.includes("dish-composition") && !photo.includes("PLACEHOLDER"),
    "No debe inventar ninguna imagen",
  );
});

test("la foto de favorito es una miniatura fija que no colapsa la fila", () => {
  assert.ok(
    photo.includes("w-14") && photo.includes("h-14"),
    "La foto debe ser una miniatura fija w-14 (ya no h-44 w-full)",
  );
  assert.ok(
    photo.includes("shrink-0"),
    "La miniatura no debe encogerse dentro de la fila flex",
  );
  assert.ok(
    photo.includes("object-cover"),
    "La miniatura debe recortar la foto con object-cover",
  );
  assert.ok(
    photo.includes("rounded-md"),
    "La miniatura cuadrada debe ir redondeada",
  );
  assert.ok(
    !photo.includes("h-44 w-full"),
    "La foto grande de ancho completo colapsa con nombre y corazón",
  );
  assert.ok(
    photo.includes("width={56}") && photo.includes("height={56}"),
    "La miniatura cuadrada debe declararse en 56×56",
  );
});
test("UserProfileTabs compone la foto cliente y sigue en servidor", () => {
  assert.ok(
    userTabs.includes("<FavoriteProductPhoto"),
    "El detalle de favorito debe componer la foto cliente",
  );
  assert.ok(
    userTabs.includes("name={product.name}"),
    "La foto cliente debe recibir solo el nombre (prop serializable)",
  );
  assert.ok(
    !userTabs.includes("useState") && !userTabs.includes("onError"),
    "La interactividad de la foto vive en el hijo cliente, no en el servidor",
  );
  assert.ok(
    !userTabs.includes('"use client"'),
    "UserProfileTabs sigue en servidor",
  );
  assert.ok(
    userTabs.includes("export default async function UserProfileTabs"),
    "UserProfileTabs sigue siendo async en servidor",
  );
});
