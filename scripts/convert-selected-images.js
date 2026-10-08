const fs = require('fs');
const path = require('path');
const decode = require('heic-decode');
const sharp = require('sharp');

const SELECTED_IMAGES = [
  'IMG_8115',
  'IMG_8118',
  'IMG_8121',
  'IMG_8127',
  'IMG_8496',
];

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
