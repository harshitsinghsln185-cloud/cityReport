import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(__dirname, '../design-source/states');
const targetBaseDir = path.resolve(__dirname, '../src/assets/images/states');

if (!fs.existsSync(sourceDir)) {
  console.log('No design-source/states directory found.');
  process.exit(0);
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

if (files.length === 0) {
  console.log('No state image originals found in design-source/states.');
  process.exit(0);
}

fs.mkdirSync(targetBaseDir, { recursive: true });

console.log(`Processing ${files.length} state image original(s)...`);
console.log('--------------------------------------------------------------------------------');
console.log('Slug'.padEnd(25) + '1600.webp'.padStart(12) + '800.webp'.padStart(12) + '1600.avif'.padStart(12) + '800.avif'.padStart(12));
console.log('--------------------------------------------------------------------------------');

const formatBytes = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

for (const file of files) {
  const slug = path.basename(file, path.extname(file));
  const srcFile = path.join(sourceDir, file);
  const outDir = path.join(targetBaseDir, slug);
  fs.mkdirSync(outDir, { recursive: true });

  const srcStat = fs.statSync(srcFile);

  const targets = [
    { name: '1600.webp', width: 1600, format: 'webp', quality: 80 },
    { name: '800.webp', width: 800, format: 'webp', quality: 80 },
    { name: '400.webp', width: 400, format: 'webp', quality: 80 },
    { name: '1600.avif', width: 1600, format: 'avif', quality: 75 },
    { name: '800.avif', width: 800, format: 'avif', quality: 75 },
    { name: '400.avif', width: 400, format: 'avif', quality: 75 },
    { name: 'blur.webp', width: 24, format: 'webp', quality: 60 },
  ];

  const sizes = {};

  for (const t of targets) {
    const outFile = path.join(outDir, t.name);
    // Skip if target exists and is newer than srcFile
    if (fs.existsSync(outFile) && fs.statSync(outFile).mtimeMs >= srcStat.mtimeMs) {
      sizes[t.name] = fs.statSync(outFile).size;
      continue;
    }

    let pipeline = sharp(srcFile)
      .resize({ width: t.width, fit: 'inside', withoutEnlargement: true })
      .rotate(); // auto-orient

    if (t.format === 'webp') {
      pipeline = pipeline.webp({ quality: t.quality, effort: 5 });
    } else if (t.format === 'avif') {
      pipeline = pipeline.avif({ quality: t.quality, effort: 4 });
    }

    await pipeline.toFile(outFile);
    sizes[t.name] = fs.statSync(outFile).size;
  }

  console.log(
    slug.padEnd(25) +
    formatBytes(sizes['1600.webp'] || 0).padStart(12) +
    formatBytes(sizes['800.webp'] || 0).padStart(12) +
    formatBytes(sizes['1600.avif'] || 0).padStart(12) +
    formatBytes(sizes['800.avif'] || 0).padStart(12)
  );
}

console.log('--------------------------------------------------------------------------------');
console.log('Image optimization complete.');

