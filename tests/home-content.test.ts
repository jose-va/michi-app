import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CAROUSEL_IMAGE_ALTS,
  CONFIRMED_SCHEDULE,
  DEFAULT_CAROUSEL_IMAGES,
  HOME_SECTIONS,
} from "../common/utils/home-content";

test("carousel configuration contains exactly the three selected WebP images with Spanish alts", () => {
  const expectedImages = [
    "/images/Combinado De Nigiri Especial Aburi [5_4-1024x1280-watermarked] 539_cleanup.webp",
    "/images/Combinado dúo mixto.webp",
    "/images/Katsumaki Combinado 8 Piezas [5_4-1024x1280-watermarked] 2be_cleanup.webp",
  ];

  assert.deepEqual([...DEFAULT_CAROUSEL_IMAGES], expectedImages);
  assert.equal(DEFAULT_CAROUSEL_IMAGES.length, 3);

  for (const image of DEFAULT_CAROUSEL_IMAGES) {
    // HomeCarousel falls back to "Fotografía N de Michi Sushi" when the map has no entry.
    const alt = CAROUSEL_IMAGE_ALTS[image] ?? "Fotografía de Michi Sushi";
    assert.ok(alt && alt.length > 0, `Missing Spanish alt for ${image}`);
  }
});

test("home sections contain exactly six sections in strict order with about", () => {
  assert.equal(HOME_SECTIONS.length, 6, "Must have exactly six sections");

  const [motto, about, location, menu, reservations, delivery] = HOME_SECTIONS;

  // Section 1: Lema del bar
  assert.equal(motto.id, "motto");
  assert.ok(motto.description.includes("Donde el arte del sushi se une al encanto de las tapas"));

  // Section 2: Sobre nosotros
  assert.equal(about.id, "about");
  assert.equal(about.title, "SOBRE NOSOTROS");
  assert.equal(
    about.description,
    "En japonés, Michi significa camino. Fusionamos técnica nipona y alma atlántica en un espacio de libertad creativa donde el plato es el lienzo.",
  );
  assert.equal(
    about.image,
    "/images/2326ceaf-1ded-46d3-b174-c7c6cfe55ed6.webp",
  );
  assert.ok(about.image && about.image.endsWith(".webp"));
  assert.equal(about.imageAlt, "Exterior de Michi Sushi");
  assert.equal(about.actionLabel, "Conócenos");
  assert.equal(about.actionHref, "/about");

  // Section 3: Ubicación (shows the shared map, so it exposes no photo)
  assert.equal(location.id, "location");
  assert.ok(location.description.length > 0);
  assert.equal(
    location.image,
    undefined,
    "Location section must not expose an image",
  );
  assert.equal(location.actionHref, "/location");
  assert.ok(location.actionLabel && location.actionLabel.length > 0);

  // Section 4: Carta
  assert.equal(menu.id, "menu");
  assert.ok(menu.description.length > 0);
  assert.equal(
    menu.image,
    "/images/Ebi Pasión.webp",
  );
  assert.ok(menu.image && menu.image.endsWith(".webp"));
  assert.equal(menu.actionHref, "/product");
  assert.ok(menu.actionLabel && menu.actionLabel.length > 0);

  // Section 5: Reservas
  assert.equal(reservations.id, "reservations");
  assert.ok(reservations.description.length > 0);
  assert.equal(
    reservations.image,
    "/images/IMG_1231.webp",
  );
  assert.ok(reservations.image && reservations.image.endsWith(".webp"));
  assert.equal(reservations.actionHref, "/reservation");
  assert.ok(reservations.actionLabel && reservations.actionLabel.length > 0);

  // Section 6: Pide a domicilio
  assert.equal(delivery.id, "delivery");
  assert.ok(delivery.description.length > 0);
  assert.ok(delivery.image && delivery.image.endsWith(".webp"));
  assert.ok(delivery.actionLabel && delivery.actionLabel.length > 0);
});

test("confirmed schedule matches the confirmed opening hours", () => {
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
