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

test("home sections contain exactly four descriptive sections in strict order", () => {
  assert.equal(HOME_SECTIONS.length, 4, "Must have exactly four descriptive sections");

  const [motto, menu, reservations, location] = HOME_SECTIONS;

  // Section 1: Lema del bar
  assert.equal(motto.id, "motto");
  assert.ok(motto.description.includes("Donde el arte del sushi se une al encanto de las tapas"));

  // Section 2: Carta
  assert.equal(menu.id, "menu");
  assert.ok(menu.description.length > 0);
  assert.equal(
    menu.image,
    "/images/Ebi Pasión.webp",
  );
  assert.ok(menu.image && menu.image.endsWith(".webp"));
  assert.equal(menu.actionHref, "/product");
  assert.ok(menu.actionLabel && menu.actionLabel.length > 0);

  // Section 3: Reservas
  assert.equal(reservations.id, "reservations");
  assert.ok(reservations.description.length > 0);
  assert.equal(
    reservations.image,
    "/images/Dish Composition [5_4-2304x2880-watermarked] d88.webp",
  );
  assert.ok(reservations.image && reservations.image.endsWith(".webp"));
  assert.equal(reservations.actionHref, "/reservation");
  assert.ok(reservations.actionLabel && reservations.actionLabel.length > 0);

  // Section 4: Ubicación (shows the shared map, so it exposes no photo)
  assert.equal(location.id, "location");
  assert.ok(location.description.length > 0);
  assert.equal(
    location.image,
    undefined,
    "Location section must not expose an image",
  );
  assert.equal(location.actionHref, "/location");
  assert.ok(location.actionLabel && location.actionLabel.length > 0);
});

test("confirmed schedule matches the confirmed opening hours", () => {
  assert.equal(CONFIRMED_SCHEDULE.weekdays.days, "Lunes a sábado");
  assert.deepEqual(CONFIRMED_SCHEDULE.weekdays.hours, ["08:00–16:00", "20:00–23:00"]);
  assert.equal(CONFIRMED_SCHEDULE.sunday.days, "Domingo");
  assert.equal(CONFIRMED_SCHEDULE.sunday.status, "Cerrado");
});
