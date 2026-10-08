import assert from "node:assert/strict";
import { test } from "node:test";
import { getNextSlide, resolveGallery } from "../common/utils/home-gallery";

test("keeps only the five explicitly selected images in selection order", () => {
  const selection = ["selected-a.jpg", "selected-b.jpg", "selected-c.jpg", "selected-d.jpg", "selected-e.jpg"];

  assert.deepEqual(
    resolveGallery(selection, {
      "selected-a.jpg": "loaded",
      "selected-b.jpg": "loaded",
      "selected-c.jpg": "loaded",
      "selected-d.jpg": "loaded",
      "selected-e.jpg": "loaded",
      "unselected.jpg": "loaded",
    }),
    selection,
  );
});

test("omits failed images while preserving the order of loadable selections", () => {
  assert.deepEqual(
    resolveGallery(["first.jpg", "failed.jpg", "last.jpg"], {
      "first.jpg": "loaded",
      "failed.jpg": "failed",
      "last.jpg": "loaded",
      "unselected.jpg": "loaded",
    }),
    ["first.jpg", "last.jpg"],
  );
});

test("moves from a failed current image to the next loadable image", () => {
  const loaded = resolveGallery(["visible.jpg", "next.jpg", "later.jpg"], {
    "visible.jpg": "failed",
    "next.jpg": "loaded",
    "later.jpg": "loaded",
  });

  assert.equal(loaded[getNextSlide(0, loaded.length)!], "later.jpg");
});

test("keeps a single loadable selected image visible", () => {
  assert.deepEqual(
    resolveGallery(["failed.jpg", "remaining.jpg"], {
      "failed.jpg": "failed",
      "remaining.jpg": "loaded",
    }),
    ["remaining.jpg"],
  );
});

test("returns an empty gallery when no selected image loads", () => {
  assert.deepEqual(
    resolveGallery(["failed-a.jpg", "failed-b.jpg"], {
      "failed-a.jpg": "failed",
      "failed-b.jpg": "failed",
      "unselected.jpg": "loaded",
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
