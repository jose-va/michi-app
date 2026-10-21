import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getProductImageSrc } from "../common/utils/product-image";

test("resolves the image src using the exact product name", () => {
  assert.equal(
    getProductImageSrc("Nigiri Salmón"),
    "/images/Nigiri Salmón.webp",
  );
});

test("the resolved image file exists in public", () => {
  const src = getProductImageSrc("Nigiri Salmón");
  const filePath = join(process.cwd(), "public", src.replace(/^\//, ""));
  assert.ok(existsSync(filePath), `No existe el archivo de imagen: ${filePath}`);
});
