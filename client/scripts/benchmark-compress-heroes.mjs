import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '../src/assets/pages');
const files = ['services.png', 'states.png', 'track.png', 'about.png', 'contact.png'];

console.log('=== PAGE HERO COMPRESSION BENCHMARKS ===\n');
for (const f of files) {
  const full = path.join(dir, f);
  const buf = fs.readFileSync(full);
  const webpBuf = await sharp(buf).resize(1920).webp({ quality: 82 }).toBuffer();
  const avifBuf = await sharp(buf).resize(1920).avif({ quality: 75 }).toBuffer();
  const pngOptBuf = await sharp(buf).png({ compressionLevel: 9, quality: 85, palette: true }).toBuffer();
  console.log(`${f}:`);
  console.log(`  Raw PNG:       ${(buf.length / (1024 * 1024)).toFixed(2)} MB (${Math.round(buf.length / 1024)} KB)`);
  console.log(`  Quantized PNG: ${(pngOptBuf.length / 1024).toFixed(0)} KB (-${Math.round((1 - pngOptBuf.length / buf.length) * 100)}%)`);
  console.log(`  WebP (1920w):  ${(webpBuf.length / 1024).toFixed(0)} KB (-${Math.round((1 - webpBuf.length / buf.length) * 100)}%)`);
  console.log(`  AVIF (1920w):  ${(avifBuf.length / 1024).toFixed(0)} KB (-${Math.round((1 - avifBuf.length / buf.length) * 100)}%)`);
}

