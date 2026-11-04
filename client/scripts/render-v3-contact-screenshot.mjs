import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const designSourceDir = path.resolve(__dirname, '../design-source/civic');
const outDir = path.resolve(__dirname, '../../docs/civic-taxonomy/screenshots/v3');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';

fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function renderContactSheet() {
  console.log('Rendering visual contact sheet image via Sharp...');

  const categories = [
    'roads-transportation', 'garbage-management', 'water-drainage', 'electricity-lighting',
    'public-health', 'environment', 'parks-greenery', 'public-safety',
    'public-transport', 'animal-welfare', 'encroachment', 'public-amenities',
    'fire-emergency', 'urban-planning', 'commercial-areas', 'public-property'
  ];

  const subIssues = [
    'road-potholes', 'damaged-roads', 'broken-footpaths', 'footpath-encroachment',
    'missing-road-dividers', 'damaged-speed-breakers', 'traffic-signal-not-working',
    'missing-street-signboards', 'illegal-parking', 'traffic-congestion',
    'waterlogging-on-roads', 'broken-manhole-covers', 'damaged-bridges',
    'roadside-construction-debris', 'missing-zebra-crossings', 'damaged-bus-stops',
    'streetlights-not-working'
  ];

  const cols = 4;
  const colWidth = 320;
  const colGap = 20;
  const rowGap = 24;
  const cardPad = 12;
  const imgWidth = colWidth - (cardPad * 2);
  const imgHeight = 160;
  const cardHeight = 240;

  const totalCatRows = Math.ceil(categories.length / cols);
  const totalSubRows = Math.ceil(subIssues.length / cols);

  const headerHeight = 140;
  const sectionTitleHeight = 60;
  const catSectionHeight = totalCatRows * (cardHeight + rowGap);
  const subSectionHeight = totalSubRows * (cardHeight + rowGap);

  const canvasWidth = 1400;
  const canvasHeight = headerHeight + sectionTitleHeight + catSectionHeight + sectionTitleHeight + subSectionHeight + 80;

  const composites = [];

  // 1. Base canvas background
  const baseSvg = `
  <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0A1F44"/>
        <stop offset="100%" stop-color="#1E3A8A"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="#FAF8F3"/>

    <!-- Header Banner -->
    <rect x="0" y="0" width="${canvasWidth}" height="100" fill="url(#headerGrad)"/>
    <text x="48" y="44" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF">Civic Taxonomy Art Direction Contact Sheet</text>
    <text x="48" y="74" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" fill="#93C5FD">Crowd Report Platform - Phase V3 Visual Audit | 16 Category Covers (16:9) + 17 Pilot Sub-Issues (4:3)</text>

    <!-- Categories Section Header -->
    <text x="48" y="145" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="bold" fill="#0A1F44">Section 1: 16 Main Category Covers (1920x1080 Originals)</text>
    <line x1="48" y1="155" x2="${canvasWidth - 48}" y2="155" stroke="#E2E8F0" stroke-width="2"/>

    <!-- Pilot Sub-Issues Section Header -->
    <text x="48" y="${headerHeight + sectionTitleHeight + catSectionHeight + 25}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="bold" fill="#0A1F44">Section 2: Pilot Sub-Issues - Roads &amp; Transportation (800x600 Originals)</text>
    <line x1="48" y1="${headerHeight + sectionTitleHeight + catSectionHeight + 35}" x2="${canvasWidth - 48}" y2="${headerHeight + sectionTitleHeight + catSectionHeight + 35}" stroke="#E2E8F0" stroke-width="2"/>
  </svg>
  `;

  // Start with empty canvas
  let canvas = sharp(Buffer.from(baseSvg));

  // Render Category Cards
  const startX = 48;
  let currentY = headerHeight + 30;

  for (let i = 0; i < categories.length; i++) {
    const slug = categories[i];
    const r = Math.floor(i / cols);
    const c = i % cols;
    const cardX = startX + c * (colWidth + colGap);
    const cardY = currentY + r * (cardHeight + rowGap);

    const imgPath = path.join(designSourceDir, slug, '_category.png');
    if (fs.existsSync(imgPath)) {
      const resizedImg = await sharp(imgPath)
        .resize(imgWidth, imgHeight, { fit: 'cover' })
        .toBuffer();

      composites.push({
        input: resizedImg,
        top: cardY + cardPad,
        left: cardX + cardPad,
      });
    }

    const cleanTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace('And', '&amp;');
    const cardOverlaySvg = `
    <svg width="${colWidth}" height="${cardHeight}" viewBox="0 0 ${colWidth} ${cardHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${colWidth}" height="${cardHeight}" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      <rect x="${cardPad - 1}" y="${cardPad - 1}" width="${imgWidth + 2}" height="${imgHeight + 2}" rx="4" fill="none" stroke="#CBD5E1" stroke-width="1"/>
      <text x="${cardPad}" y="${cardPad + imgHeight + 24}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">${cleanTitle}</text>
      <text x="${cardPad}" y="${cardPad + imgHeight + 42}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">${escapeXml(slug)}</text>
      <rect x="${colWidth - cardPad - 42}" y="${cardPad + imgHeight + 12}" width="42" height="18" rx="9" fill="#EEF2FF"/>
      <text x="${colWidth - cardPad - 21}" y="${cardPad + imgHeight + 25}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="bold" fill="#3730A3" text-anchor="middle">16:9</text>
    </svg>
    `;

    composites.push({
      input: Buffer.from(cardOverlaySvg),
      top: cardY,
      left: cardX,
      blend: 'dest-over', // card background sits under image
    });
  }

  // Render Sub-Issue Cards
  currentY = headerHeight + sectionTitleHeight + catSectionHeight + 50;

  for (let i = 0; i < subIssues.length; i++) {
    const slug = subIssues[i];
    const r = Math.floor(i / cols);
    const c = i % cols;
    const cardX = startX + c * (colWidth + colGap);
    const cardY = currentY + r * (cardHeight + rowGap);

    const imgPath = path.join(designSourceDir, 'roads-transportation', `${slug}.png`);
    if (fs.existsSync(imgPath)) {
      const resizedImg = await sharp(imgPath)
        .resize(imgWidth, imgHeight, { fit: 'cover' })
        .toBuffer();

      composites.push({
        input: resizedImg,
        top: cardY + cardPad,
        left: cardX + cardPad,
      });
    }

    const cleanTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const cardOverlaySvg = `
    <svg width="${colWidth}" height="${cardHeight}" viewBox="0 0 ${colWidth} ${cardHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${colWidth}" height="${cardHeight}" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      <rect x="${cardPad - 1}" y="${cardPad - 1}" width="${imgWidth + 2}" height="${imgHeight + 2}" rx="4" fill="none" stroke="#CBD5E1" stroke-width="1"/>
      <text x="${cardPad}" y="${cardPad + imgHeight + 24}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">${escapeXml(cleanTitle)}</text>
      <text x="${cardPad}" y="${cardPad + imgHeight + 42}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">${escapeXml(slug)}</text>
      <rect x="${colWidth - cardPad - 38}" y="${cardPad + imgHeight + 12}" width="38" height="18" rx="9" fill="#FEF3C7"/>
      <text x="${colWidth - cardPad - 19}" y="${cardPad + imgHeight + 25}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="bold" fill="#92400E" text-anchor="middle">4:3</text>
    </svg>
    `;

    composites.push({
      input: Buffer.from(cardOverlaySvg),
      top: cardY,
      left: cardX,
      blend: 'dest-over',
    });
  }

  // Composite all cards
  // First, card backgrounds onto the base canvas
  const bgComposites = composites.filter(c => c.blend === 'dest-over');
  const imgComposites = composites.filter(c => c.blend !== 'dest-over');

  // Composite backgrounds
  const intermediateBuffer = await canvas
    .composite(bgComposites.map(c => ({ input: c.input, top: c.top, left: c.left })))
    .png()
    .toBuffer();

  // Then composite images on top
  const finalImage = await sharp(intermediateBuffer)
    .composite(imgComposites)
    .png();

  const outPath = path.join(outDir, 'contact-sheet.png');
  await finalImage.toFile(outPath);
  console.log(`✓ Saved visual contact sheet to ${outPath}`);

  if (fs.existsSync(artifactDir)) {
    const artifactOutPath = path.join(artifactDir, 'contact-sheet.png');
    fs.copyFileSync(outPath, artifactOutPath);
    console.log(`✓ Copied to artifacts directory: ${artifactOutPath}`);
  }
}

renderContactSheet().catch(err => {
  console.error('Error rendering contact sheet:', err);
  process.exit(1);
});

