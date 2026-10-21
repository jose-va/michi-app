import assert from "node:assert/strict";
import { test } from "node:test";
import { getNextSlide, resolveGallery } from "../common/utils/home-gallery";

const DUO_MIXTO =
  "/images/Combinando Duo Mixto 21 Piezas [5_4-1024x1280-watermarked] b67_cleanup.webp";
const SAKE_GOKU =
  "/images/Sake Goku 8 Piezas [5_4-1024x1280-watermarked] a66_cleanup.webp";
const MAGURO_SPICY =
  "/images/Maguro Spicy 8 Piezas [5_4-1024x1280-watermarked] e4e_cleanup.webp";
const SELECTION_3 = [DUO_MIXTO, SAKE_GOKU, MAGURO_SPICY] as const;

test("keeps only the three explicitly selected images in selection order", () => {
  assert.deepEqual(
    resolveGallery([...SELECTION_3], {
      [DUO_MIXTO]: "loaded",
      [SAKE_GOKU]: "loaded",
      [MAGURO_SPICY]: "loaded",
      "/images/unselected.webp": "loaded",
    }),
    [...SELECTION_3],
  );
});

test("excludes unselected images such as michi-image1 and michi-image2", () => {
  assert.deepEqual(
    resolveGallery([...SELECTION_3], {
      [DUO_MIXTO]: "loaded",
      [SAKE_GOKU]: "loaded",
      [MAGURO_SPICY]: "loaded",
      "/images/michi-image1.webp": "loaded",
      "/images/michi-image2.webp": "loaded",
    }),
    [...SELECTION_3],
  );
});

test("omits failed images while preserving the order of loadable selections", () => {
  assert.deepEqual(
    resolveGallery([...SELECTION_3], {
      [DUO_MIXTO]: "loaded",
      [SAKE_GOKU]: "failed",
      [MAGURO_SPICY]: "loaded",
      "/images/unselected.webp": "loaded",
    }),
    [DUO_MIXTO, MAGURO_SPICY],
  );
});

test("moves from a failed current image to the next loadable image", () => {
  const loaded = resolveGallery([...SELECTION_3], {
    [DUO_MIXTO]: "failed",
    [SAKE_GOKU]: "loaded",
    [MAGURO_SPICY]: "loaded",
  });

  assert.deepEqual(loaded, [SAKE_GOKU, MAGURO_SPICY]);
  assert.equal(loaded[getNextSlide(0, loaded.length)!], MAGURO_SPICY);
});

test("keeps a single loadable selected image visible", () => {
  assert.deepEqual(
    resolveGallery([...SELECTION_3], {
      [DUO_MIXTO]: "failed",
      [SAKE_GOKU]: "failed",
      [MAGURO_SPICY]: "loaded",
    }),
    [MAGURO_SPICY],
  );
});

test("returns an empty gallery when no selected image loads", () => {
  assert.deepEqual(
    resolveGallery([...SELECTION_3], {
      [DUO_MIXTO]: "failed",
      [SAKE_GOKU]: "failed",
      [MAGURO_SPICY]: "failed",
      "/images/unselected.webp": "loaded",
    }),
    [],
  );
  assert.deepEqual(resolveGallery([], {}), []);
});

test("navigates cyclically only when more than one image is available", () => {
  assert.equal(getNextSlide(0, 3), 1);
  assert.equal(getNextSlide(2, 3), 0);
  assert.equal(getNextSlide(0, 1), 0);
  assert.equal(getNextSlide(4, 0), undefined);
});
