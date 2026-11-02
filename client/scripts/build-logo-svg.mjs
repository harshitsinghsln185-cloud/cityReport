import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'fs';
import path from 'path';

async function buildSvg() {
  const file = path.resolve('client/src/assets/logo/logo.png');
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });

  const navyMask = Buffer.alloc(info.width * info.height);
  const amberMask = Buffer.alloc(info.width * info.height);

  for (let i = 0; i < info.width * info.height; i++) {
    const idx = i * info.channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];

    if (a < 120) {
      navyMask[i] = 255;
      amberMask[i] = 255;
      continue;
    }

    if (r > 120 && g > 70 && b < 100) {
      amberMask[i] = 0;
      navyMask[i] = 255;
    } else {
      navyMask[i] = 0;
      amberMask[i] = 255;
    }
  }

  const navyPng = await sharp(navyMask, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
  const amberPng = await sharp(amberMask, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();

  const getD = (buf) => new Promise((resolve, reject) => {
    const trace = new potrace.Potrace({
      optCurve: true,
      optTolerance: 0.2,
      turdSize: 20,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      alphaMax: 1.0
    });
    trace.loadImage(buf, err => {
      if (err) return reject(err);
      resolve(trace.getPathTag());
    });
  });

  const navyPathTag = await getD(navyPng);
  const amberPathTag = await getD(amberPng);

  const extractD = (tag) => {
    const m = tag.match(/d="([^"]+)"/);
    return m ? m[1] : '';
  };

  const navyD = extractD(navyPathTag);
  const amberD = extractD(amberPathTag);

  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" fill="none">
  <path d="${navyD}" fill="#0A1F44" fill-rule="evenodd" />
  <path d="${amberD}" fill="#E8A33D" fill-rule="evenodd" />
</svg>`;

  // Render full SVG to raw buffer to find tight bounding box
  const fullSvgBuf = Buffer.from(fullSvg);
  const { data: svgData, info: svgInfo } = await sharp(fullSvgBuf).raw().toBuffer({ resolveWithObject: true });
  let minX = svgInfo.width, maxX = 0, minY = svgInfo.height, maxY = 0;
  for (let y = 0; y < svgInfo.height; y++) {
    for (let x = 0; x < svgInfo.width; x++) {
      const idx = (y * svgInfo.width + x) * svgInfo.channels;
      if (svgData[idx + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const artWidth = maxX - minX + 1;
  const artHeight = maxY - minY + 1;
  console.log('SVG artwork bounds:', { minX, maxX, minY, maxY, artWidth, artHeight });

  // Add 8px even padding
  const padding = 8;
  const cropX = minX - padding;
  const cropY = minY - padding;
  const cropW = artWidth + padding * 2;
  const cropH = artHeight + padding * 2;

  // Cropped primary logo.svg
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cropX} ${cropY} ${cropW} ${cropH}" width="${cropW}" height="${cropH}" fill="none">
  <!-- Crowd Report Official Logo: Civic Location Pin, Verified Community Resolution -->
  <path d="${navyD}" fill="#0A1F44" fill-rule="evenodd" />
  <path d="${amberD}" fill="#E8A33D" fill-rule="evenodd" />
</svg>`;

  // logo-white.svg for dark backgrounds: all navy parts turned white (#FFFFFF), amber (#E8A33D) unchanged
  const logoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cropX} ${cropY} ${cropW} ${cropH}" width="${cropW}" height="${cropH}" fill="none">
  <!-- Crowd Report Official Logo: White/Inverted Theme for Navy/Dark Backgrounds -->
  <path d="${navyD}" fill="#FFFFFF" fill-rule="evenodd" />
  <path d="${amberD}" fill="#E8A33D" fill-rule="evenodd" />
</svg>`;

  // logo-mono.svg for stamps, single-color prints and monochrome PDFs (all parts in navy #0A1F44)
  const logoMonoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cropX} ${cropY} ${cropW} ${cropH}" width="${cropW}" height="${cropH}" fill="none">
  <!-- Crowd Report Official Logo: Monochrome Navy Theme for Stamps and Official Invoices -->
  <path d="${navyD}" fill="#0A1F44" fill-rule="evenodd" />
  <path d="${amberD}" fill="#0A1F44" fill-rule="evenodd" />
</svg>`;

  fs.writeFileSync('client/src/assets/logo/logo.svg', logoSvg);
  fs.writeFileSync('client/src/assets/logo/logo-white.svg', logoWhiteSvg);
  fs.writeFileSync('client/src/assets/logo/logo-mono.svg', logoMonoSvg);
  console.log('Saved logo.svg, logo-white.svg, logo-mono.svg');

  // Now create side-by-side visual comparisons at 512px, 64px, 32px
  // Original PNG cropped to the same bounds
  const pngCropped = await sharp(file)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png()
    .toBuffer();

  const comparisonSizes = [512, 64, 32];
  const outCompDir = path.resolve('client/public/logo-comparison');
  fs.mkdirSync(outCompDir, { recursive: true });

  for (const s of comparisonSizes) {
    // Render PNG at size s (aspect fit inside s x s)
    const pngResized = await sharp(pngCropped)
      .resize({ width: s, height: s, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    // Render SVG at size s
    const svgResized = await sharp(Buffer.from(logoSvg))
      .resize({ width: s, height: s, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    // Side-by-side canvas: width: s * 2 + 20, height: s + 40 with labels
    const gap = Math.max(10, Math.round(s * 0.1));
    const labelHeight = s >= 64 ? 30 : 0;
    const totalW = s * 2 + gap * 3;
    const totalH = s + labelHeight + gap * 2;

    const sideBySide = await sharp({
      create: {
        width: totalW,
        height: totalH,
        channels: 4,
        background: { r: 245, g: 247, b: 250, alpha: 1 } // light neutral background to clearly view transparency and edges
      }
    })
      .composite([
        { input: pngResized, left: gap, top: gap + labelHeight },
        { input: svgResized, left: gap * 2 + s, top: gap + labelHeight }
      ])
      .png()
      .toFile(path.join(outCompDir, `compare-${s}px.png`));

    console.log(`Saved comparison at ${s}px: ${totalW}x${totalH}`);
  }
}

buildSvg().catch(err => {
  console.error(err);
  process.exit(1);
});
