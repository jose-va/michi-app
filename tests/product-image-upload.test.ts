import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  buildProductImageFileName,
  getProductImageExtension,
  needsHeicConversion,
  PRODUCT_IMAGE_MAX_BYTES,
  validateProductImageFile,
} from "../common/utils/product-image";

test("builds the file name from the exact product name plus webp", () => {
  assert.equal(buildProductImageFileName("Nigiri Salmón"), "Nigiri Salmón.webp");
});

test("buildProductImageFileName rejects empty names", () => {
  assert.throws(() => buildProductImageFileName("   "), /obligatorio/);
});

test("buildProductImageFileName strips path traversal", () => {
  const fileName = buildProductImageFileName("../evil");
  assert.ok(!fileName.includes("/"), "no debe contener barras");
  assert.ok(!fileName.includes(".."), "no debe contener ..");
  assert.ok(fileName.endsWith(".webp"), "debe terminar en .webp");
});

test("getProductImageExtension normalizes to lowercase", () => {
  assert.equal(getProductImageExtension("foto.JPG"), "jpg");
  assert.equal(getProductImageExtension("foto.HEIC"), "heic");
  assert.equal(getProductImageExtension("sin-extension"), "");
  assert.equal(getProductImageExtension(".heic"), "");
});

test("needsHeicConversion detects heic and heif only", () => {
  assert.ok(needsHeicConversion("foto.heic"));
  assert.ok(needsHeicConversion("foto.HEIF"));
  assert.ok(!needsHeicConversion("foto.jpg"));
  assert.ok(!needsHeicConversion("foto.webp"));
});

test("validateProductImageFile accepts jpg, png, webp and heic", () => {
  for (const name of ["foto.jpg", "foto.png", "foto.webp", "foto.heic"]) {
    assert.deepEqual(validateProductImageFile(name, 1024), { ok: true });
  }
});

test("validateProductImageFile rejects unsupported formats in Spanish", () => {
  const result = validateProductImageFile("foto.exe", 1024);
  assert.equal(result.ok, false);
  assert.match(
    (result as { ok: false; error: string }).error,
    /Formato no admitido/,
  );
});

test("validateProductImageFile rejects files over 10 MB in Spanish", () => {
  const result = validateProductImageFile(
    "foto.jpg",
    PRODUCT_IMAGE_MAX_BYTES + 1,
  );
  assert.equal(result.ok, false);
  assert.match(
    (result as { ok: false; error: string }).error,
    /10 MB/,
  );
});

test("validateProductImageFile rejects empty files", () => {
  assert.equal(validateProductImageFile("foto.jpg", 0).ok, false);
});

const formSource = readFileSync(
  new URL("../common/components/forms/product/ProductForm.tsx", import.meta.url),
  "utf8",
);

test("ProductForm renders the photo input before the name field", () => {  const photoIndex = formSource.indexOf("<ProductPhotoInput");
  const nameIndex = formSource.indexOf('name="name"');
  assert.ok(photoIndex >= 0, "ProductForm debe incluir ProductPhotoInput");
  assert.ok(nameIndex >= 0, "ProductForm debe mantener el campo nombre");
  assert.ok(
    photoIndex < nameIndex,
    "La foto debe ser la primera opción del formulario",
  );
});

const pageSource = readFileSync(
  new URL(
    "../common/components/pages/product/ProductFormPage.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("ProductFormPage uploads the photo after creating or updating", () => {  assert.ok(
    pageSource.includes("uploadProductImage"),
    "ProductFormPage debe llamar a uploadProductImage",
  );
  assert.ok(
    pageSource.includes("getProductImageSrc(product.name)"),
    "En modificación debe mostrar la imagen ya existente",
  );
});

const actionsSource = readFileSync(
  new URL("../lib/server-actions.ts", import.meta.url),
  "utf8",
);

test("uploadProductImage saves into public/images and revalidates", () => {
  assert.ok(
    actionsSource.includes("uploadProductImage"),
    "server-actions debe exportar uploadProductImage",
  );
  assert.ok(
    actionsSource.includes('"public", "images"'),
    "la imagen debe guardarse en public/images",
  );
  assert.ok(
    actionsSource.includes("convertToWebpBuffer"),
    "debe convertir a WebP con la lógica verificada",
  );
});

test("photo preview shows an image-off icon when there is no image", () => {
  const photoSource = readFileSync(
    new URL(
      "../common/components/forms/product/ProductPhotoInput.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.ok(
    photoSource.includes("ImageOff"),
    "el fallback debe usar el icono ImageOff de lucide",
  );
  assert.ok(
    photoSource.includes("items-center justify-center"),
    "el icono debe estar centrado en la previsualización",
  );
});

test("photo picker uses a custom button with the file name", () => {
  const photoSource = readFileSync(
    new URL(
      "../common/components/forms/product/ProductPhotoInput.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.ok(
    photoSource.includes("Seleccionar foto"),
    "el selector debe mostrar el texto en español",
  );
  assert.ok(
    photoSource.includes('type="file"'),
    "debe mantener el input de archivo nativo",
  );
  assert.ok(
    photoSource.includes('className="hidden"'),
    "el input nativo debe estar oculto",
  );
  assert.ok(
    photoSource.includes("truncate"),
    "el nombre del archivo debe recortarse con puntos suspensivos",
  );
});
