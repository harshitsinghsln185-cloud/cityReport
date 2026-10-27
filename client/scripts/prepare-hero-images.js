import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_PATH = 'C:/Users/harsh/.gemini/antigravity-ide/brain/aa7f3974-38b1-4f03-89a7-185cdb7ee97e/hero_candidate_1_1793078912084.jpg';
const DESIGN_SOURCE_DIR = path.resolve(__dirname, '../../design-source');
const ASSETS_HOME_DIR = path.resolve(__dirname, '../src/assets/images/home');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

async function main() {
  if (!fs.existsSync(DESIGN_SOURCE_DIR)) {
    fs.mkdirSync(DESIGN_SOURCE_DIR, { recursive: true });
  }
  if (!fs.existsSync(ASSETS_HOME_DIR)) {
    fs.mkdirSync(ASSETS_HOME_DIR, { recursive: true });
  }

  // 1. Copy source master to design-source/ (git-ignored)
  const masterDest = path.join(DESIGN_SOURCE_DIR, 'hero-master.jpg');
  fs.copyFileSync(SOURCE_PATH, masterDest);
  console.log(`[hero-images] Saved master copy to ${masterDest}`);

  const metadata = await sharp(SOURCE_PATH).metadata();
  console.log(`[hero-images] Source dimensions: ${metadata.width}x${metadata.height}`);

  // 2. Generate Desktop variants (16:9)
  const desktopWidths = [
    { name: 'hero-2560', width: 2560 },
    { name: 'hero-1920', width: 1920 },
    { name: 'hero-1280', width: 1280 },
    { name: 'hero-768', width: 768 },
  ];

  for (const { name, width } of desktopWidths) {
    const height = Math.round((width * 9) / 16);
    
    // WebP
    const webpPath = path.join(ASSETS_HOME_DIR, `${name}.webp`);
    await sharp(SOURCE_PATH)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);
    const webpStat = fs.statSync(webpPath);
    console.log(`[hero-images] Created ${name}.webp: ${(webpStat.size / 1024).toFixed(1)} KB`);

    // AVIF
    const avifPath = path.join(ASSETS_HOME_DIR, `${name}.avif`);
    await sharp(SOURCE_PATH)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .avif({ quality: 75, effort: 6 })
      .toFile(avifPath);
    const avifStat = fs.statSync(avifPath);
    console.log(`[hero-images] Created ${name}.avif: ${(avifStat.size / 1024).toFixed(1)} KB`);
  }

  // 3. Generate Mobile Portrait variants (4:5 aspect ratio)
  // Re-compose by focusing horizontally on the right ~65% where the issues, citizen, and sky are,
  // ensuring the lower 60% contains the hazards and top 40% contains the calm golden sky.
  // Original width = 1376, height = 768.
  // For 4:5 crop, width = height * 0.8 = 768 * 0.8 = 614.
  // Crop area: left from around 500 to 1150 (width ~614), full height 768.
  const cropWidth = Math.round(metadata.height * 0.8);
  const cropLeft = Math.min(metadata.width - cropWidth, Math.round(metadata.width * 0.42));
  
  console.log(`[hero-images] Mobile portrait crop: left=${cropLeft}, width=${cropWidth}, height=${metadata.height}`);

  const mobileWidths = [
    { name: 'hero-m-1080', width: 1080 },
    { name: 'hero-m-720', width: 720 },
  ];

  for (const { name, width } of mobileWidths) {
    const height = Math.round((width * 5) / 4);

    // WebP
    const webpPath = path.join(ASSETS_HOME_DIR, `${name}.webp`);
    await sharp(SOURCE_PATH)
      .extract({ left: cropLeft, top: 0, width: cropWidth, height: metadata.height })
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);
    const webpStat = fs.statSync(webpPath);
    console.log(`[hero-images] Created ${name}.webp: ${(webpStat.size / 1024).toFixed(1)} KB`);

    // AVIF
    const avifPath = path.join(ASSETS_HOME_DIR, `${name}.avif`);
    await sharp(SOURCE_PATH)
      .extract({ left: cropLeft, top: 0, width: cropWidth, height: metadata.height })
      .resize(width, height, { fit: 'cover' })
      .avif({ quality: 75, effort: 6 })
      .toFile(avifPath);
    const avifStat = fs.statSync(avifPath);
    console.log(`[hero-images] Created ${name}.avif: ${(avifStat.size / 1024).toFixed(1)} KB`);
  }

  // 4. Generate tiny blurred placeholder (24px wide)
  const blurPath = path.join(ASSETS_HOME_DIR, 'hero-blur.webp');
  await sharp(SOURCE_PATH)
    .resize(24, 14, { fit: 'cover' })
    .blur(1.5)
    .webp({ quality: 50 })
    .toFile(blurPath);
  const blurStat = fs.statSync(blurPath);
  console.log(`[hero-images] Created hero-blur.webp: ${(blurStat.size / 1024).toFixed(2)} KB`);

  // 5. Generate og-image.jpg (1200x630 share image)
  const ogPath = path.join(PUBLIC_DIR, 'og-image.jpg');
  await sharp(SOURCE_PATH)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(ogPath);
  const ogStat = fs.statSync(ogPath);
  console.log(`[hero-images] Created og-image.jpg: ${(ogStat.size / 1024).toFixed(1)} KB`);

  console.log('[hero-images] All hero image variants generated successfully!');
}

main().catch(err => {
  console.error('[hero-images] Error:', err);
  process.exit(1);
});
