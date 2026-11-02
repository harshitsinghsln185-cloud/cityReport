import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../../docs/page-heroes/screenshots');
fs.mkdirSync(outDir, { recursive: true });

const pagesDir = path.resolve(__dirname, '../src/assets/pages');

const pages = [
  {
    key: 'services',
    title: 'Services Directory',
    imageFile: 'services.png',
    eyebrow: 'MUNICIPAL SERVICES',
    h1: 'Public Infrastructure Repair Directory',
    desc: 'Transparent rates and contractor dispatch for road repairs, streetlights, drainage, and waste management.',
    buttons: ['Report a Hazard', 'Track Existing Ticket'],
    focalDesktop: { x: 0.72, y: 0.5 },
    focalMobile: { x: 0.80, y: 0.35 }
  },
  {
    key: 'states',
    title: 'States & UTs Directory',
    imageFile: 'states.png',
    eyebrow: 'STATES DIRECTORY',
    h1: 'Civic Directory of States and Union Territories',
    desc: 'Explore local civic resolution priorities, verified contractor coverage, and infrastructure data across all states and union territories.',
    buttons: ['Filter by Zone', 'Report Local Defect'],
    focalDesktop: { x: 0.70, y: 0.5 },
    focalMobile: { x: 0.75, y: 0.35 }
  },
  {
    key: 'track',
    title: 'Track Status',
    imageFile: 'track.png',
    eyebrow: 'ISSUE TRACKING',
    h1: 'Track Civic Issue Resolution Status',
    desc: 'Enter your unique tracking code to inspect contractor dispatch, photographic resolution proof, and verified milestone progress.',
    buttons: [],
    focalDesktop: { x: 0.70, y: 0.5 },
    focalMobile: { x: 0.78, y: 0.40 }
  },
  {
    key: 'about',
    title: 'About & Governance',
    imageFile: 'about.png',
    eyebrow: 'ABOUT CROWD REPORT',
    h1: 'Built for Transparent Civic Infrastructure Repair',
    desc: 'Crowd Report connects citizens reporting public hazards with verified local contractors through upfront pricing and photographic proof.',
    buttons: ['Read Operating Model', 'Contact Secretariat Desk'],
    focalDesktop: { x: 0.68, y: 0.5 },
    focalMobile: { x: 0.72, y: 0.35 }
  },
  {
    key: 'contact',
    title: 'Contact & Help Desk',
    imageFile: 'contact.png',
    eyebrow: 'HELP DESK',
    h1: 'Citizen Inquiries and Civic Help Desk',
    desc: 'Submit inquiries regarding ward coverage, contractor accreditation, municipal fee tariffs, or platform assistance.',
    buttons: [],
    focalDesktop: { x: 0.70, y: 0.5 },
    focalMobile: { x: 0.76, y: 0.40 }
  }
];

const viewports = [
  { name: '360px', width: 360, height: 380, isMobile: true },
  { name: '768px', width: 768, height: 400, isTablet: true },
  { name: '1280px', width: 1280, height: 460, isDesktop: true },
  { name: '1536px', width: 1536, height: 480, isWide: true }
];

console.log('Rendering hero screenshots into docs/page-heroes/screenshots...');

for (const p of pages) {
  const imgPath = path.join(pagesDir, p.imageFile);
  if (!fs.existsSync(imgPath)) continue;

  const srcMeta = await sharp(imgPath).metadata();

  for (const vp of viewports) {
    // 1. Calculate focal crop
    const focal = vp.isMobile ? p.focalMobile : p.focalDesktop;
    const targetRatio = vp.width / vp.height;
    const srcRatio = srcMeta.width / srcMeta.height;

    let cropW = srcMeta.width;
    let cropH = srcMeta.height;

    if (srcRatio > targetRatio) {
      cropW = Math.round(srcMeta.height * targetRatio);
    } else {
      cropH = Math.round(srcMeta.width / targetRatio);
    }

    const left = Math.max(0, Math.min(srcMeta.width - cropW, Math.round(srcMeta.width * focal.x - cropW / 2)));
    const top = Math.max(0, Math.min(srcMeta.height - cropH, Math.round(srcMeta.height * focal.y - cropH / 2)));

    const bgCropped = await sharp(imgPath)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(vp.width, vp.height)
      .toBuffer();

    // 2. Generate SVG Overlay & Typography
    const isMobile = vp.width < 768;
    const h1Size = isMobile ? '26px' : (vp.width >= 1280 ? '38px' : '32px');
    const descSize = isMobile ? '13px' : '15px';
    const textWidth = Math.min(540, vp.width - 48);

    // Escape text for SVG XML
    const escapeXml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const overlaySvg = Buffer.from(`
      <svg width="${vp.width}" height="${vp.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="leftGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#0A1F44" stop-opacity="0.96"/>
            <stop offset="35%" stop-color="#0A1F44" stop-opacity="0.88"/>
            <stop offset="60%" stop-color="#0A1F44" stop-opacity="0.45"/>
            <stop offset="78%" stop-color="#0A1F44" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="mobileGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0A1F44" stop-opacity="0.97"/>
            <stop offset="55%" stop-color="#0A1F44" stop-opacity="0.88"/>
            <stop offset="85%" stop-color="#0A1F44" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#0A1F44" stop-opacity="0.25"/>
          </linearGradient>
          <linearGradient id="bottomShade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#0A1F44" stop-opacity="0.75"/>
            <stop offset="100%" stop-color="#0A1F44" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Readability Gradients -->
        <rect width="${vp.width}" height="${vp.height}" fill="${isMobile ? 'url(#mobileGrad)' : 'url(#leftGrad)'}"/>
        <rect y="${vp.height - 64}" width="${vp.width}" height="64" fill="url(#bottomShade)"/>

        <!-- Typography & Content -->
        <g transform="translate(${isMobile ? 24 : 64}, ${isMobile ? 32 : 55})">
          <!-- Breadcrumb -->
          <text x="0" y="0" font-family="-apple-system, sans-serif" font-size="11px" fill="#94A3B8">Home / ${escapeXml(p.title)}</text>

          <!-- Eyebrow Badge -->
          <g transform="translate(0, 14)">
            <rect width="130" height="22" rx="11" fill="#E8A33D" fill-opacity="0.15" stroke="#E8A33D" stroke-opacity="0.3"/>
            <text x="12" y="15" font-family="-apple-system, sans-serif" font-size="10px" font-weight="700" fill="#E8A33D" letter-spacing="1px">${escapeXml(p.eyebrow)}</text>
          </g>

          <!-- Title (h1) -->
          <text x="0" y="72" font-family="'Fraunces', Georgia, serif" font-size="${h1Size}" font-weight="600" fill="#FFFFFF">
            ${escapeXml(p.h1)}
          </text>

          <!-- Description -->
          <foreignObject x="0" y="${isMobile ? 90 : 100}" width="${textWidth}" height="90">
            <p xmlns="http://www.w3.org/1999/xhtml" style="font-family: -apple-system, sans-serif; font-size: ${descSize}; color: #F1F5F9; line-height: 1.5; margin: 0;">
              ${escapeXml(p.desc)}
            </p>
          </foreignObject>

          <!-- Actions -->
          ${p.buttons.length > 0 ? `
            <g transform="translate(0, ${isMobile ? 180 : 190})">
              <!-- Primary Button -->
              <rect width="${isMobile ? 140 : 160}" height="40" rx="8" fill="#E8A33D"/>
              <text x="18" y="25" font-family="-apple-system, sans-serif" font-size="13px" font-weight="700" fill="#0A1F44">${escapeXml(p.buttons[0])}</text>

              <!-- Secondary Button if present -->
              ${p.buttons[1] ? `
                <g transform="translate(${isMobile ? 150 : 175}, 0)">
                  <rect width="${isMobile ? 140 : 170}" height="40" rx="8" fill="transparent" stroke="rgba(255,255,255,0.3)"/>
                  <text x="16" y="25" font-family="-apple-system, sans-serif" font-size="13px" font-weight="600" fill="#FFFFFF">${escapeXml(p.buttons[1])}</text>
                </g>
              ` : ''}
            </g>
          ` : ''}
        </g>
      </svg>
    `);

    const outName = `${p.key}-${vp.name}.png`;
    await sharp(bgCropped)
      .composite([{ input: overlaySvg, left: 0, top: 0 }])
      .png()
      .toFile(path.join(outDir, outName));

    console.log(`✓ Generated ${outName}`);
  }
}

console.log('Finished rendering all hero screenshots.');

