import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAssets() {
  const logoSvgPath = path.resolve('client/src/assets/logo/logo.svg');
  const logoWhiteSvgPath = path.resolve('client/src/assets/logo/logo-white.svg');
  const publicDir = path.resolve('client/public');

  const logoSvg = fs.readFileSync(logoSvgPath);
  const logoWhiteSvg = fs.readFileSync(logoWhiteSvgPath);

  // 1. client/public/favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), logoSvg);
  console.log('✓ Wrote favicon.svg');

  // 2. client/public/icon-512.png (512x512, transparent background with mark centered)
  const mark512 = await sharp(logoSvg)
    .resize({ width: 440, height: 440, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: mark512, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Wrote icon-512.png');

  // 3. client/public/icon-192.png (192x192, transparent background with mark centered)
  const mark192 = await sharp(logoSvg)
    .resize({ width: 164, height: 164, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: mark192, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Wrote icon-192.png');

  // 4. client/public/apple-touch-icon.png (180x180 with clean rounded or soft ivory background)
  const mark180 = await sharp(logoSvg)
    .resize({ width: 130, height: 130, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 250, g: 248, b: 243, alpha: 1 } // Soft Ivory canvas
    }
  })
    .composite([{ input: mark180, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Wrote apple-touch-icon.png');

  // 5. client/public/favicon.ico (32x32 standard ICO / PNG container)
  const favicon32 = await sharp(logoSvg)
    .resize({ width: 32, height: 32, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);
  console.log('✓ Wrote favicon.ico');

  // 6. client/public/og-image.jpg (1200x630, navy background with the logo and the name, no extra claims)
  // Render the white logo mark at height 200px
  const markOg = await sharp(logoWhiteSvg)
    .resize({ height: 210, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create SVG text overlay for "Crowd Report" in Fraunces font with crisp vector typography
  const textSvg = Buffer.from(`
    <svg width="800" height="210" xmlns="http://www.w3.org/2000/svg">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&amp;display=swap');
        .word-crowd {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 88px;
          font-weight: 600;
          fill: #FFFFFF;
          letter-spacing: -1.5px;
        }
        .word-report {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 88px;
          font-weight: 600;
          fill: #E8A33D;
          letter-spacing: -1.5px;
        }
      </style>
      <text x="0" y="140">
        <tspan class="word-crowd">Crowd </tspan>
        <tspan class="word-report">Report</tspan>
      </text>
    </svg>
  `);

  const textPng = await sharp(textSvg).png().toBuffer();
  const textMeta = await sharp(textPng).metadata();

  // Mark + Gap + Text Lockup centered on 1200x630 canvas
  const markMeta = await sharp(markOg).metadata();
  const gap = 36;
  const totalLockupWidth = (markMeta.width || 172) + gap + (textMeta.width || 600);
  const startX = Math.round((1200 - totalLockupWidth) / 2);
  const startY = Math.round((630 - 210) / 2);

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 10, g: 31, b: 68 } // Midnight Navy #0A1F44
    }
  })
    .composite([
      { input: markOg, left: startX, top: startY },
      { input: textPng, left: startX + (markMeta.width || 172) + gap, top: startY }
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(publicDir, 'og-image.jpg'));
  console.log('✓ Wrote og-image.jpg');
}

generateAssets().catch(err => {
  console.error(err);
  process.exit(1);
});

