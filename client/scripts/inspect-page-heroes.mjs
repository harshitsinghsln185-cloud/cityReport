import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '../src/assets/pages');
const files = ['services.png', 'states.png', 'track.png', 'about.png', 'contact.png'];

console.log('Inspecting images in:', dir);
for (const f of files) {
  const fullPath = path.join(dir, f);
  if (!fs.existsSync(fullPath)) {
    console.log(JSON.stringify({ file: f, status: 'MISSING' }));
    continue;
  }
  const meta = await sharp(fullPath).metadata();
  const stats = fs.statSync(fullPath);
  const ratio = meta.width / meta.height;
  const target16x9 = 16 / 9; // ~1.7777777777777777
  const diff = Math.abs(ratio - target16x9);
  console.log(JSON.stringify({
    file: f,
    width: meta.width,
    height: meta.height,
    format: meta.format,
    channels: meta.channels,
    aspectRatio: ratio.toFixed(3),
    target16x9: target16x9.toFixed(3),
    isCloseTo16x9: diff < 0.1,
    isOver1600: meta.width >= 1600,
    sizeKB: Math.round(stats.size / 1024),
    sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
  }, null, 2));
}
