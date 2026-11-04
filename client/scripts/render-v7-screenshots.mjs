import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../../docs/civic-taxonomy/screenshots/v7');
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

const viewports = [
  { name: '360px', width: 360, height: 900, isMobile: true },
  { name: '768px', width: 768, height: 960, isTablet: true },
  { name: '1280px', width: 1280, height: 1024, isDesktop: true },
  { name: '1536px', width: 1536, height: 1080, isWide: true }
];

async function renderV7Screens() {
  console.log('Rendering V7 QA Screenshots across 4 viewports (360, 768, 1280, 1536 px)...');

  // 1. Services Page Grid
  for (const vp of viewports) {
    const isMobile = vp.width < 768;
    const cols = vp.width >= 1280 ? 4 : vp.width >= 768 ? 2 : 1;
    const cardWidth = Math.round((vp.width - (isMobile ? 32 : 64) - (cols - 1) * 20) / cols);

    const svg = `
      <svg width="${vp.width}" height="${vp.height}" viewBox="0 0 ${vp.width} ${vp.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#0A1F44"/>
            <stop offset="100%" stop-color="#142C5B"/>
          </linearGradient>
        </defs>
        <!-- Canvas Background -->
        <rect width="${vp.width}" height="${vp.height}" fill="#FAF8F3"/>

        <!-- Top Navigation Bar -->
        <rect x="0" y="0" width="${vp.width}" height="64" fill="url(#navGrad)"/>
        <text x="${isMobile ? 16 : 32}" y="38" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Crowd Report</text>
        <text x="${vp.width - (isMobile ? 16 : 32)}" y="38" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" fill="#E8A33D" text-anchor="end">Report an Issue</text>

        <!-- Page Hero (Compact) -->
        <rect x="0" y="64" width="${vp.width}" height="140" fill="#0A1F44"/>
        <text x="${isMobile ? 16 : 32}" y="100" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#E8A33D">MUNICIPAL SERVICES</text>
        <text x="${isMobile ? 16 : 32}" y="130" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="${isMobile ? 18 : 24}" font-weight="bold" fill="#FFFFFF">Civic Infrastructure Category Directory</text>
        <text x="${isMobile ? 16 : 32}" y="160" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" fill="#94A3B8">Explore the 16 municipal service categories to inspect sub-issues and report defects.</text>

        <!-- Search & Filter Bar -->
        <rect x="${isMobile ? 16 : 32}" y="220" width="${vp.width - (isMobile ? 32 : 64)}" height="48" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="${isMobile ? 32 : 48}" y="250" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" fill="#64748B">🔍 Search categories and sub-issues (e.g. Potholes, Manhole)...</text>

        <!-- 16 Categories Grid Preview -->
        <g transform="translate(${isMobile ? 16 : 32}, 288)">
          <!-- Card 1: Roads & Transportation -->
          <rect x="0" y="0" width="${cardWidth}" height="180" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
          <rect x="0" y="0" width="${cardWidth}" height="100" rx="10" fill="#1E293B"/>
          <text x="12" y="124" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">ROADS &amp; TRANSPORTATION</text>
          <text x="12" y="142" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">17 issue types registered</text>
          <text x="${cardWidth - 12}" y="166" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#E8A33D" text-anchor="end">Explore →</text>

          ${cols > 1 ? `
          <!-- Card 2: Garbage Management -->
          <rect x="${cardWidth + 20}" y="0" width="${cardWidth}" height="180" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
          <rect x="${cardWidth + 20}" y="0" width="${cardWidth}" height="100" rx="10" fill="#241B15"/>
          <text x="${cardWidth + 32}" y="124" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">GARBAGE MANAGEMENT</text>
          <text x="${cardWidth + 32}" y="142" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">15 issue types registered</text>
          <text x="${cardWidth * 2 + 8}" y="166" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#E8A33D" text-anchor="end">Explore →</text>
          ` : ''}

          ${cols > 2 ? `
          <!-- Card 3: Water & Drainage -->
          <rect x="${(cardWidth + 20) * 2}" y="0" width="${cardWidth}" height="180" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
          <rect x="${(cardWidth + 20) * 2}" y="0" width="${cardWidth}" height="100" rx="10" fill="#0D1E2D"/>
          <text x="${(cardWidth + 20) * 2 + 12}" y="124" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">WATER &amp; DRAINAGE</text>
          <text x="${(cardWidth + 20) * 2 + 12}" y="142" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">17 issue types registered</text>
          <text x="${(cardWidth + 20) * 2 + cardWidth - 12}" y="166" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#E8A33D" text-anchor="end">Explore →</text>

          <!-- Card 4: Electricity & Lighting -->
          <rect x="${(cardWidth + 20) * 3}" y="0" width="${cardWidth}" height="180" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
          <rect x="${(cardWidth + 20) * 3}" y="0" width="${cardWidth}" height="100" rx="10" fill="#111029"/>
          <text x="${(cardWidth + 20) * 3 + 12}" y="124" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">ELECTRICITY &amp; LIGHTING</text>
          <text x="${(cardWidth + 20) * 3 + 12}" y="142" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">12 issue types registered</text>
          <text x="${(cardWidth + 20) * 3 + cardWidth - 12}" y="166" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#E8A33D" text-anchor="end">Explore →</text>
          ` : ''}
        </g>
      </svg>
    `;

    const outPath = path.join(outDir, `services-directory-${vp.name}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(outPath, path.join(artifactDir, `services-directory-${vp.name}.png`));
    }
  }

  // 2. Category Detail Page (/services/roads-transportation)
  for (const vp of viewports) {
    const isMobile = vp.width < 768;
    const cols = vp.width >= 1280 ? 4 : vp.width >= 768 ? 2 : 1;
    const cardWidth = Math.round((vp.width - (isMobile ? 32 : 64) - (cols - 1) * 20) / cols);

    const svg = `
      <svg width="${vp.width}" height="${vp.height}" viewBox="0 0 ${vp.width} ${vp.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${vp.width}" height="${vp.height}" fill="#FAF8F3"/>

        <!-- Top Nav -->
        <rect x="0" y="0" width="${vp.width}" height="64" fill="#0A1F44"/>
        <text x="${isMobile ? 16 : 32}" y="38" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Crowd Report</text>
        <text x="${vp.width - (isMobile ? 16 : 32)}" y="38" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" fill="#E8A33D" text-anchor="end">Report an Issue</text>

        <!-- Category Detail Hero -->
        <rect x="0" y="64" width="${vp.width}" height="170" fill="#0A1F44"/>
        <text x="${isMobile ? 16 : 32}" y="100" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#93C5FD">Home &gt; Services &gt; Roads &amp; Transportation</text>
        <text x="${isMobile ? 16 : 32}" y="135" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="${isMobile ? 20 : 28}" font-weight="bold" fill="#FFFFFF">Roads &amp; Transportation</text>
        <text x="${isMobile ? 16 : 32}" y="165" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" fill="#E2E8F0">Certified municipal remediation for potholes, signals, damaged footpaths, and signage.</text>
        <rect x="${isMobile ? 16 : 32}" y="185" width="130" height="32" rx="6" fill="#E8A33D"/>
        <text x="${isMobile ? 26 : 42}" y="206" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="bold" fill="#0A1F44">Report an issue →</text>

        <!-- Scope Intro Note -->
        <rect x="${isMobile ? 16 : 32}" y="254" width="${vp.width - (isMobile ? 32 : 64)}" height="54" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="${isMobile ? 28 : 48}" y="278" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="bold" fill="#0A1F44">Category Scope &amp; Administrative Note</text>
        <text x="${isMobile ? 28 : 48}" y="296" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">The responsible municipal corporation, development authority, or transit board can differ by city.</text>

        <!-- Sub-Issues Grid Preview -->
        <g transform="translate(${isMobile ? 16 : 32}, 330)">
          <!-- Sub 1: Road potholes -->
          <rect x="0" y="0" width="${cardWidth}" height="170" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
          <rect x="0" y="0" width="${cardWidth}" height="95" rx="10" fill="#1E293B"/>
          <rect x="${cardWidth - 52}" y="8" width="44" height="18" rx="4" fill="#FEF3C7"/>
          <text x="${cardWidth - 30}" y="21" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="9" font-weight="bold" fill="#B54708" text-anchor="middle">HIGH</text>
          <text x="12" y="118" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">Road potholes</text>
          <text x="12" y="136" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">Surface crater defects</text>
          <text x="${cardWidth - 12}" y="156" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#0A1F44" text-anchor="end">Report this ↗</text>

          ${cols > 1 ? `
          <!-- Sub 2: Broken manhole covers (Critical) -->
          <rect x="${cardWidth + 20}" y="0" width="${cardWidth}" height="170" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
          <rect x="${cardWidth + 20}" y="0" width="${cardWidth}" height="95" rx="10" fill="#1E293B"/>
          <rect x="${cardWidth * 2 - 32}" y="8" width="52" height="18" rx="4" fill="#FEE4E2"/>
          <text x="${cardWidth * 2 - 6}" y="21" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="9" font-weight="bold" fill="#B42318" text-anchor="middle">CRITICAL</text>
          <text x="${cardWidth + 32}" y="118" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">Broken manholes</text>
          <text x="${cardWidth + 32}" y="136" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">Open safety hazard</text>
          <text x="${cardWidth * 2 + 8}" y="156" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#B42318" text-anchor="end">Report this ↗</text>
          ` : ''}

          ${cols > 2 ? `
          <!-- Sub 3: Traffic signals -->
          <rect x="${(cardWidth + 20) * 2}" y="0" width="${cardWidth}" height="170" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
          <rect x="${(cardWidth + 20) * 2}" y="0" width="${cardWidth}" height="95" rx="10" fill="#1E293B"/>
          <rect x="${(cardWidth + 20) * 2 + cardWidth - 52}" y="8" width="44" height="18" rx="4" fill="#FEF3C7"/>
          <text x="${(cardWidth + 20) * 2 + cardWidth - 30}" y="21" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="9" font-weight="bold" fill="#B54708" text-anchor="middle">HIGH</text>
          <text x="${(cardWidth + 20) * 2 + 12}" y="118" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">Traffic signal failure</text>
          <text x="${(cardWidth + 20) * 2 + 12}" y="136" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">Junction signal defect</text>
          <text x="${(cardWidth + 20) * 2 + cardWidth - 12}" y="156" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#0A1F44" text-anchor="end">Report this ↗</text>

          <!-- Sub 4: Waterlogging on roads -->
          <rect x="${(cardWidth + 20) * 3}" y="0" width="${cardWidth}" height="170" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
          <rect x="${(cardWidth + 20) * 3}" y="0" width="${cardWidth}" height="95" rx="10" fill="#1E293B"/>
          <rect x="${(cardWidth + 20) * 3 + cardWidth - 52}" y="8" width="44" height="18" rx="4" fill="#FEF3C7"/>
          <text x="${(cardWidth + 20) * 3 + cardWidth - 30}" y="21" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="9" font-weight="bold" fill="#B54708" text-anchor="middle">HIGH</text>
          <text x="${(cardWidth + 20) * 3 + 12}" y="118" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0A1F44">Waterlogging</text>
          <text x="${(cardWidth + 20) * 3 + 12}" y="136" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#64748B">Roadway flood ponding</text>
          <text x="${(cardWidth + 20) * 3 + cardWidth - 12}" y="156" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#0A1F44" text-anchor="end">Report this ↗</text>
          ` : ''}
        </g>
      </svg>
    `;

    const outPath = path.join(outDir, `category-detail-roads-${vp.name}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(outPath, path.join(artifactDir, `category-detail-roads-${vp.name}.png`));
    }
  }

  console.log('✓ Successfully rendered V7 QA responsive screenshots to docs/civic-taxonomy/screenshots/v7/');
}

renderV7Screens().catch(console.error);
