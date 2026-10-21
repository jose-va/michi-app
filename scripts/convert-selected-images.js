/**
 * Script histórico de conversión HEIC → WebP (heic-decode + sharp).
 *
 * Selección vigente (spec 001 RF-2, ya convertida por el usuario, NO convertir):
 * carrusel (3) — `Combinando Duo Mixto 21 Piezas [5_4-1024x1280-watermarked] b67_cleanup.webp`,
 * `Sake Goku 8 Piezas [5_4-1024x1280-watermarked] a66_cleanup.webp`,
 * `Maguro Spicy 8 Piezas [5_4-1024x1280-watermarked] e4e_cleanup.webp`;
 * secciones (3) — `Katsumaki Combinado 8 Piezas [5_4-1024x1280-watermarked] 2be_cleanup.webp`
 * (carta), `Hitokiri 8 Piezas [5_4-1024x1280-watermarked] 18d_cleanup.webp` (reservas),
 * `Katsudon [5_4-1024x1280-watermarked] 356_cleanup.webp` (ubicación);
 * reservas lateral RF-11 (1) — `Futomaki De Salmón 10 Piezas [5_4-1024x1280-watermarked] 715_cleanup.webp`.
 *
 * La lista antigua de 5 (`IMG_8115…`) queda abajo solo como referencia histórica,
 * NO vigente. No ejecutar conversión (el usuario ya convirtió) y no implementar
 * subida futura (fuera de alcance, spec 001). La lógica heic-decode + sharp se
 * conserva intacta; los originales JPG/HEIC de `public/images/` no se tocan.
 */
const fs = require('fs');
const path = require('path');
const decode = require('heic-decode');
const sharp = require('sharp');

// Referencia histórica NO vigente (T6): ['IMG_8115', 'IMG_8118', 'IMG_8121', 'IMG_8127', 'IMG_8496'].
// Vacía a propósito: la selección vigente RF-2 ya existe como WebP en `public/images/`.
const SELECTED_IMAGES = [];

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

async function convert() {
  console.log(`Starting conversion of ${SELECTED_IMAGES.length} selected images...`);

  for (const name of SELECTED_IMAGES) {
    const inputPath = path.join(IMAGES_DIR, `${name}.HEIC`);
    const outputPath = path.join(IMAGES_DIR, `${name}.webp`);

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Source file does not exist: ${inputPath}`);
    }

    console.log(`Decoding ${name}.HEIC...`);
    const inputBuffer = fs.readFileSync(inputPath);
    const { width, height, data } = await decode({ buffer: inputBuffer });

    console.log(`Converting ${name} (${width}x${height}) to WebP...`);
    await sharp(data, {
      raw: { width, height, channels: 4 }
    })
      .webp({ quality: 80, effort: 4 })
      .toFile(outputPath);

    const outStat = fs.statSync(outputPath);
    console.log(`Generated ${name}.webp: ${Math.round(outStat.size / 1024)} KB`);
  }

  console.log('Conversion completed successfully.');
}

convert().catch((err) => {
  console.error('Error during conversion:', err);
  process.exit(1);
});
