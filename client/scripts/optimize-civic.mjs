import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDesignDir = path.resolve(__dirname, '../design-source/civic');
const outAssetsDir = path.resolve(__dirname, '../src/assets/images/civic');

const COVER_WIDTHS = [1920, 1280, 768, 800, 480];
const SUB_WIDTHS = [800, 480];

const QUALITY_WEBP = 80;
const QUALITY_AVIF = 75;

// Blur placeholder: 20px wide with high blur
async function generateBlurPlaceholder(inputPath, outPath) {
  await sharp(inputPath)
    .resize(20, null, { fit: 'inside' })
    .webp({ quality: 30 })
    .toFile(outPath);
}

// Optimized resize for a target width
async function processWidth(inputPath, outDir, width, isCover) {
  // Height calculated by aspect ratio: 16:9 for cover, 4:3 for sub-issue
  const height = isCover ? Math.round((width * 9) / 16) : Math.round((width * 3) / 4);

  const webpPath = path.join(outDir, `${width}.webp`);
  const avifPath = path.join(outDir, `${width}.avif`);

  const img = sharp(inputPath)
    .rotate() // auto-orient based on EXIF before stripping
    .resize(width, height, { fit: 'cover', position: 'center' });

  // WebP without EXIF
  await img
    .clone()
    .webp({ quality: QUALITY_WEBP, effort: 4 })
    .withMetadata(false)
    .toFile(webpPath);

  // AVIF without EXIF
  await img
    .clone()
    .avif({ quality: QUALITY_AVIF, effort: 4 })
    .withMetadata(false)
    .toFile(avifPath);

  const webpStat = fs.statSync(webpPath);
  const avifStat = fs.statSync(avifPath);

  return { width, webpSize: webpStat.size, avifSize: avifStat.size };
}

async function optimizeAll() {
  console.log('--- Starting Civic Image Optimization Pipeline ---');
  console.log(`Source: ${srcDesignDir}`);
  console.log(`Destination: ${outAssetsDir}\n`);

  if (!fs.existsSync(srcDesignDir)) {
    console.error(`Design source directory not found: ${srcDesignDir}`);
    process.exit(1);
  }

  const categories = fs.readdirSync(srcDesignDir).filter(f => {
    return fs.statSync(path.join(srcDesignDir, f)).isDirectory();
  });

  const reportRows = [];
  let totalProcessed = 0;

  for (const catSlug of categories) {
    const catDir = path.join(srcDesignDir, catSlug);
    const files = fs.readdirSync(catDir);

    for (const file of files) {
      if (!file.endsWith('.png') && !file.endsWith('.jpg') && !file.endsWith('.jpeg')) {
        continue;
      }

      const isCover = file === '_category.png';
      const subSlug = isCover ? '_category' : path.basename(file, path.extname(file));
      const inputFilePath = path.join(catDir, file);
      const targetOutDir = path.join(outAssetsDir, catSlug, subSlug);

      fs.mkdirSync(targetOutDir, { recursive: true });

      // Check if unchanged (compare mtime)
      const inputStat = fs.statSync(inputFilePath);
      const blurPath = path.join(targetOutDir, 'blur.webp');
      const sampleWebpPath = path.join(targetOutDir, isCover ? '1920.webp' : '800.webp');

      if (fs.existsSync(sampleWebpPath) && fs.existsSync(blurPath)) {
        const outStat = fs.statSync(sampleWebpPath);
        if (outStat.mtimeMs >= inputStat.mtimeMs) {
          // Unchanged, skip
          continue;
        }
      }

      totalProcessed++;
      const widths = isCover ? COVER_WIDTHS : SUB_WIDTHS;
      const sizeResults = [];

      for (const w of widths) {
        const res = await processWidth(inputFilePath, targetOutDir, w, isCover);
        sizeResults.push(res);
      }

      await generateBlurPlaceholder(inputFilePath, blurPath);

      const maxWebp = isCover ? sizeResults.find(s => s.width === 1920) : sizeResults.find(s => s.width === 800);
      reportRows.push({
        item: `${catSlug}/${subSlug}`,
        type: isCover ? 'Cover (16:9)' : 'Sub (4:3)',
        maxWebpSizeKB: (maxWebp.webpSize / 1024).toFixed(1) + ' KB',
        maxAvifSizeKB: (maxWebp.avifSize / 1024).toFixed(1) + ' KB',
        status: '✓ Optimized'
      });
    }
  }

  console.log(`Optimized ${totalProcessed} images across categories.`);
  if (reportRows.length > 0) {
    console.table(reportRows);
  } else {
    console.log('All image assets are up to date.');
  }

  console.log('\n--- Optimization Complete ---');
}

optimizeAll().catch(err => {
  console.error('Optimization error:', err);
  process.exit(1);
});

