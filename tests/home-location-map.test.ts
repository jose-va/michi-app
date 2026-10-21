import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { HOME_SECTIONS } from "../common/utils/home-content";

const pageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const googleMapsSource = readFileSync(
  new URL("../common/components/ui/location/GoogleMaps.tsx", import.meta.url),
  "utf8",
);
const locationPageSource = readFileSync(
  new URL("../common/components/pages/location/LocationPage.tsx", import.meta.url),
  "utf8",
);

function ubicacionBlock(): string {
  const start = pageSource.indexOf('id="seccion-ubicacion"');
  assert.ok(start >= 0, "Home must keep section seccion-ubicacion");
  const end = pageSource.indexOf("</section>", start);
  assert.ok(end > start, "Ubicacion section must close");
  return pageSource.slice(start, end);
}

test("Home: seccion-ubicacion renders GoogleMaps with zoom 15", () => {
  assert.ok(
    pageSource.includes("@/common/components/ui/location/GoogleMaps"),
    "Home must import the shared GoogleMaps component",
  );
  const block = ubicacionBlock();
  assert.ok(
    block.includes("<GoogleMaps zoom={15} />"),
    "Ubicacion section must render <GoogleMaps zoom={15} />",
  );
  assert.ok(!block.includes("<Image"), "Ubicacion section must not render a photo");
  assert.ok(
    !block.includes("locationSection.image"),
    "Ubicacion section must not reference locationSection.image",
  );
});

test("Home: seccion-ubicacion keeps the borderless aspect-video container", () => {
  const block = ubicacionBlock();
  assert.ok(
    block.includes(
      'className="relative order-1 aspect-video w-full overflow-hidden md:order-2"',
    ),
    "Ubicacion map container must keep its exact classes without rounded-lg or border",
  );
  const containerMatch = block.match(/<div className="([^"]*)">\s*<GoogleMaps/);
  assert.ok(containerMatch, "GoogleMaps must sit inside the map container div");
  assert.ok(!containerMatch[1].includes("rounded"), "Map container must not add rounded");
  assert.ok(!containerMatch[1].includes("border"), "Map container must not add border");
});

test("Home: seccion-ubicacion keeps title, description and Cómo llegar button", () => {
  const block = ubicacionBlock();
  assert.ok(block.includes("<h2"), "Ubicacion section must keep its h2 title");
  assert.ok(
    block.includes("locationSection.title"),
    "Ubicacion h2 must render locationSection.title",
  );
  assert.ok(
    block.includes("locationSection.description"),
    "Ubicacion section must render locationSection.description",
  );
  assert.ok(
    block.includes("locationSection.actionLabel") || block.includes("Cómo llegar"),
    "Ubicacion button must show «Cómo llegar»",
  );
  assert.ok(
    block.includes('locationSection.actionHref') || block.includes('"/location"'),
    "Ubicacion button must target /location",
  );
});

test("Home content: location section exposes no photo", () => {
  const location = HOME_SECTIONS.find((section) => section.id === "location");
  assert.ok(location, "HOME_SECTIONS must include the location section");
  assert.equal(location.title, "¿Dónde estamos?");
  assert.ok(location.description.length > 0);
  assert.equal(
    location.image,
    undefined,
    "Location section must not expose an image (the home shows the map)",
  );
  assert.equal(location.actionHref, "/location");
  assert.ok(location.actionLabel && location.actionLabel.length > 0);
});

test("GoogleMaps: zoom is an optional prop defaulting to 16", () => {
  assert.ok(
    googleMapsSource.includes("zoom?: number"),
    "GoogleMaps must accept an optional zoom prop",
  );
  assert.ok(
    googleMapsSource.includes("= 16"),
    "GoogleMaps zoom must default to 16",
  );
  assert.ok(
    googleMapsSource.includes("zoom,") || googleMapsSource.includes("zoom: zoom"),
    "GoogleMaps must pass the zoom prop to the Map options",
  );
});

test("LocationPage: keeps GoogleMaps without zoom (zoom 16 default)", () => {
  assert.ok(
    locationPageSource.includes("<GoogleMaps />"),
    "/location must keep rendering <GoogleMaps /> with the default zoom 16",
  );
  assert.ok(
    !locationPageSource.includes("<GoogleMaps zoom"),
    "/location must not override the zoom prop",
  );
});
