import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CAROUSEL_IMAGE_ALTS,
  CONFIRMED_SCHEDULE,
  DEFAULT_CAROUSEL_IMAGES,
  HOME_SECTIONS,
} from "../common/utils/home-content";

test("carousel configuration contains exactly the five selected WebP images with Spanish alts", () => {
  const expectedImages = [
    "/images/IMG_8115.webp",
    "/images/IMG_8118.webp",
    "/images/IMG_8121.webp",
    "/images/IMG_8127.webp",
    "/images/IMG_8496.webp",
  ];

  assert.deepEqual([...DEFAULT_CAROUSEL_IMAGES], expectedImages);
  assert.equal(DEFAULT_CAROUSEL_IMAGES.length, 5);

  for (const image of DEFAULT_CAROUSEL_IMAGES) {
    const alt = CAROUSEL_IMAGE_ALTS[image];
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
  assert.ok(menu.image && menu.image.endsWith(".webp"));
  assert.equal(menu.actionHref, "/product");
  assert.ok(menu.actionLabel && menu.actionLabel.length > 0);

  // Section 3: Reservas
  assert.equal(reservations.id, "reservations");
  assert.ok(reservations.description.length > 0);
  assert.ok(reservations.image && reservations.image.endsWith(".webp"));
  assert.equal(reservations.actionHref, "/reservation");
  assert.ok(reservations.actionLabel && reservations.actionLabel.length > 0);

  // Section 4: Ubicación
  assert.equal(location.id, "location");
  assert.ok(location.description.length > 0);
  assert.ok(location.image && location.image.endsWith(".webp"));
  assert.equal(location.actionHref, "/location");
  assert.ok(location.actionLabel && location.actionLabel.length > 0);
});

test("confirmed schedule matches the confirmed opening hours", () => {
  assert.equal(CONFIRMED_SCHEDULE.weekdays.days, "Lunes a sábado");
  assert.deepEqual(CONFIRMED_SCHEDULE.weekdays.hours, ["08:00–16:00", "20:00–23:00"]);
  assert.equal(CONFIRMED_SCHEDULE.sunday.days, "Domingo");
  assert.equal(CONFIRMED_SCHEDULE.sunday.status, "Cerrado");
});
