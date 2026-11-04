import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../../docs/civic-taxonomy/screenshots/v2');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';

fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const viewports = [
  { name: '360px', width: 360, height: 860, isMobile: true },
  { name: '768px', width: 768, height: 900, isTablet: true },
  { name: '1280px', width: 1280, height: 940, isDesktop: true },
  { name: '1536px', width: 1536, height: 980, isWide: true }
];

const scenarios = [
  { key: 'empty', title: 'Empty Form', category: '', sub: '', priority: 'Medium', showNotice: false },
  { key: 'roads-selected', title: 'Roads & Transportation Selected', category: 'Roads & Transportation', sub: '', priority: 'Medium', showNotice: false },
  { key: 'critical-selected', title: 'Critical Sub-Issue (Broken manhole covers)', category: 'Roads & Transportation', sub: 'Broken manhole covers', priority: 'Critical', showNotice: true },
];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function renderV2Screens() {
  console.log('Rendering V2 Report Form responsive screenshots across 4 viewports...');

  for (const sc of scenarios) {
    for (const vp of viewports) {
      const cardWidth = Math.min(840, vp.width - (vp.isMobile ? 24 : 64));
      const cardX = Math.round((vp.width - cardWidth) / 2);
      const isMobile = vp.width < 768;

      let currentY = 340;
      let fieldsSvg = '';

      // 1. Service Category field
      fieldsSvg += `
        <!-- Service Category -->
        <g transform="translate(0, ${currentY})">
          <text x="0" y="0" class="lbl">Service Category <tspan fill="#B42318">*</tspan></text>
          <rect x="0" y="8" width="${cardWidth - 56}" height="42" rx="8" fill="#FFFFFF" stroke="#0A1F44" stroke-width="${sc.category ? '1.5' : '1'}"/>
          <text x="14" y="34" class="${sc.category ? 'val' : 'placeholder'}">
            ${sc.category ? escapeXml(sc.category) + ' &#8226; Base: &#8377;500' : 'Select a civic service category...'}
          </text>
          <path d="M ${cardWidth - 84} 26 L ${cardWidth - 76} 34 L ${cardWidth - 68} 26" fill="none" stroke="#5B6577" stroke-width="2"/>
        </g>
      `;
      currentY += 62;

      // 2. Sub-Category Field (if category selected)
      if (sc.category) {
        fieldsSvg += `
          <!-- Sub-Category Issue -->
          <g transform="translate(0, ${currentY})">
            <text x="0" y="0" class="lbl">Sub-Category Issue <tspan fill="#B42318">*</tspan></text>
            <rect x="0" y="8" width="${cardWidth - 56}" height="42" rx="8" fill="#FFFFFF" stroke="#0A1F44" stroke-width="${sc.sub ? '1.5' : '1'}"/>
            <text x="14" y="34" class="${sc.sub ? 'val' : 'placeholder'}">
              ${sc.sub ? escapeXml(sc.sub) : 'Select a sub-category... (17 sub-issues available)'}
            </text>
            <path d="M ${cardWidth - 84} 26 L ${cardWidth - 76} 34 L ${cardWidth - 68} 26" fill="none" stroke="#5B6577" stroke-width="2"/>
          </g>
        `;
        currentY += 62;

        // 3. Amber Notice (if Critical)
        if (sc.showNotice) {
          fieldsSvg += `
            <!-- Amber Critical Notice -->
            <g transform="translate(0, ${currentY})">
              <rect x="0" y="0" width="${cardWidth - 56}" height="48" rx="8" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.5"/>
              <circle cx="24" cy="24" r="9" fill="#F59E0B"/>
              <text x="21" y="28" fill="#FFFFFF" font-family="sans-serif" font-size="12" font-weight="800">!</text>
              <text x="44" y="29" class="alert-txt">
                Critical issues are routed with priority. If this is an immediate life-threatening emergency, call 112 instead.
              </text>
            </g>
          `;
          currentY += 58;
        }

        // 4. Category Details with SLA
        fieldsSvg += `
          <!-- Category Details & SLA Banner -->
          <g transform="translate(0, ${currentY})">
            <rect x="0" y="0" width="${cardWidth - 56}" height="40" rx="8" fill="#FAF8F3" stroke="#E7E2D6" stroke-width="1"/>
            <text x="14" y="25" class="subtext">
              <tspan font-weight="700" fill="#0A1F44">Roads &amp; Transportation: </tspan>Road condition, safety, and transit infrastructure.
            </text>
            ${vp.width >= 768 ? `
              <text x="${cardWidth - 190}" y="25" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#0A1F44">
                &#9201; 48h Target SLA
              </text>
            ` : ''}
          </g>
        `;
        currentY += 52;
      }

      // 5. Issue Title
      fieldsSvg += `
        <!-- Issue Title -->
        <g transform="translate(0, ${currentY})">
          <text x="0" y="0" class="lbl">Issue Title <tspan fill="#B42318">*</tspan></text>
          <rect x="0" y="8" width="${cardWidth - 56}" height="42" rx="8" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
          <text x="14" y="34" class="${sc.sub ? 'val' : 'placeholder'}">
            ${sc.sub ? 'Hazardous open broken manhole near Ring Road crossing' : 'e.g. Hazardous deep pothole near Metro Pillar 42'}
          </text>
        </g>
      `;
      currentY += 62;

      // 6. Detailed Description
      fieldsSvg += `
        <!-- Detailed Description -->
        <g transform="translate(0, ${currentY})">
          <text x="0" y="0" class="lbl">Detailed Description <tspan fill="#B42318">*</tspan></text>
          <rect x="0" y="8" width="${cardWidth - 56}" height="64" rx="8" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
          <text x="14" y="30" class="${sc.sub ? 'val' : 'placeholder'}">
            ${sc.sub ? 'Heavy broken concrete frame with uncovered deep drainage cavity. Severe danger to evening pedestrians.' : 'Describe the exact location, visual dimensions, and any traffic or pedestrian disruption caused...'}
          </text>
        </g>
      `;
      currentY += 84;

      // 7. Suggested Priority Buttons
      fieldsSvg += `
        <!-- Priority Selection Buttons -->
        <g transform="translate(0, ${currentY})">
          <text x="0" y="0" class="lbl">Suggested Priority</text>
          <g transform="translate(0, 8)">
            <!-- Low -->
            <rect x="0" y="0" width="${(cardWidth - 56 - 24) / 4}" height="36" rx="8" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
            <text x="${((cardWidth - 56 - 24) / 4) / 2 - 14}" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#5B6577">Low</text>

            <!-- Medium -->
            <rect x="${(cardWidth - 56 - 24) / 4 + 8}" y="0" width="${(cardWidth - 56 - 24) / 4}" height="36" rx="8" fill="${sc.priority === 'Medium' ? '#0A1F44' : '#FFFFFF'}" stroke="${sc.priority === 'Medium' ? '#0A1F44' : '#E7E2D6'}" stroke-width="1"/>
            <text x="${(cardWidth - 56 - 24) / 4 + 8 + ((cardWidth - 56 - 24) / 4) / 2 - 24}" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="${sc.priority === 'Medium' ? '#FFFFFF' : '#5B6577'}">Medium</text>

            <!-- High -->
            <rect x="${((cardWidth - 56 - 24) / 4) * 2 + 16}" y="0" width="${(cardWidth - 56 - 24) / 4}" height="36" rx="8" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
            <text x="${((cardWidth - 56 - 24) / 4) * 2 + 16 + ((cardWidth - 56 - 24) / 4) / 2 - 14}" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#5B6577">High</text>

            <!-- Critical -->
            <rect x="${((cardWidth - 56 - 24) / 4) * 3 + 24}" y="0" width="${(cardWidth - 56 - 24) / 4}" height="36" rx="8" fill="${sc.priority === 'Critical' ? '#B42318' : '#FFFFFF'}" stroke="${sc.priority === 'Critical' ? '#B42318' : '#E7E2D6'}" stroke-width="1"/>
            <text x="${((cardWidth - 56 - 24) / 4) * 3 + 24 + ((cardWidth - 56 - 24) / 4) / 2 - 20}" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="${sc.priority === 'Critical' ? '#FFFFFF' : '#5B6577'}">Critical</text>
          </g>
        </g>
      `;

      const cardHeight = currentY + 110 - 244;
      const totalSvgHeight = Math.max(vp.height, currentY + 120);

      const svg = `
        <svg width="${vp.width}" height="${totalSvgHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0A1F44" flood-opacity="0.06"/>
            </filter>
          </defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;family=Fraunces:opsz,wght@9..144,700&amp;display=swap');
            .heading { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: ${isMobile ? '20px' : '26px'}; font-weight: 800; fill: #101828; }
            .subtext { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; font-weight: 500; fill: #5B6577; }
            .lbl { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; font-weight: 600; fill: #101828; }
            .val { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; font-weight: 500; fill: #101828; }
            .placeholder { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; font-weight: 400; fill: #94A3B8; }
            .badge-txt { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 11px; font-weight: 700; fill: #0A1F44; }
            .step-txt { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 11px; font-weight: 600; fill: #0A1F44; }
            .alert-txt { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; font-weight: 600; fill: #78350F; }
          </style>

          <!-- Canvas Background -->
          <rect width="${vp.width}" height="${totalSvgHeight}" fill="#FAF8F3"/>

          <!-- Top Navigation Bar -->
          <rect width="${vp.width}" height="64" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
          <text x="${isMobile ? '16' : '32'}" y="38" font-family="'Fraunces', Georgia, serif" font-size="20" font-weight="700">
            <tspan fill="#0A1F44">Crowd </tspan><tspan fill="#E8A33D">Report</tspan>
          </text>
          <rect x="${vp.width - (isMobile ? 120 : 160)}" y="16" width="${isMobile ? 104 : 128}" height="32" rx="8" fill="#EBF1FA"/>
          <text x="${vp.width - (isMobile ? 110 : 148)}" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#0A1F44">Citizen Portal</text>

          <!-- Main Content Area -->
          <!-- Eyebrow Badge -->
          <rect x="${cardX}" y="88" width="180" height="24" rx="6" fill="#EBF1FA"/>
          <text x="${cardX + 12}" y="104" class="badge-txt">CERTIFIED CIVIC REPAIR FLOW</text>

          <!-- Title -->
          <text x="${cardX}" y="142" class="heading">Report a Neighborhood Civic Defect</text>
          <text x="${cardX}" y="164" class="subtext">Submit potholes, streetlight failures, garbage overflows, or drainage issues for contractor repair.</text>

          <!-- Steps Progress Bar -->
          <g transform="translate(${cardX}, 184)">
            <!-- Step 1 Active -->
            <rect x="0" y="0" width="${(cardWidth - 24) / 4}" height="42" rx="8" fill="#FFFFFF" stroke="#0A1F44" stroke-width="2"/>
            <circle cx="20" cy="21" r="10" fill="#0A1F44"/>
            <text x="17" y="25" fill="#FFFFFF" font-family="sans-serif" font-size="11" font-weight="700">1</text>
            <text x="38" y="25" class="step-txt">${isMobile ? 'Classify' : 'Classification'}</text>

            <!-- Step 2 -->
            <rect x="${(cardWidth - 24) / 4 + 8}" y="0" width="${(cardWidth - 24) / 4}" height="42" rx="8" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
            <circle cx="${(cardWidth - 24) / 4 + 28}" cy="21" r="10" fill="#F1EEE6"/>
            <text x="${(cardWidth - 24) / 4 + 25}" y="25" fill="#5B6577" font-family="sans-serif" font-size="11" font-weight="700">2</text>
            <text x="${(cardWidth - 24) / 4 + 46}" y="25" class="subtext">${isMobile ? 'Map' : 'Location'}</text>

            <!-- Step 3 -->
            <rect x="${((cardWidth - 24) / 4) * 2 + 16}" y="0" width="${(cardWidth - 24) / 4}" height="42" rx="8" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
            <circle cx="${((cardWidth - 24) / 4) * 2 + 36}" cy="21" r="10" fill="#F1EEE6"/>
            <text x="${((cardWidth - 24) / 4) * 2 + 33}" y="25" fill="#5B6577" font-family="sans-serif" font-size="11" font-weight="700">3</text>
            <text x="${((cardWidth - 24) / 4) * 2 + 54}" y="25" class="subtext">${isMobile ? 'Photo' : 'Photos'}</text>

            <!-- Step 4 -->
            <rect x="${((cardWidth - 24) / 4) * 3 + 24}" y="0" width="${(cardWidth - 24) / 4}" height="42" rx="8" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1"/>
            <circle cx="${((cardWidth - 24) / 4) * 3 + 44}" cy="21" r="10" fill="#F1EEE6"/>
            <text x="${((cardWidth - 24) / 4) * 3 + 41}" y="25" fill="#5B6577" font-family="sans-serif" font-size="11" font-weight="700">4</text>
            <text x="${((cardWidth - 24) / 4) * 3 + 62}" y="25" class="subtext">${isMobile ? 'Quote' : 'Review'}</text>
          </g>

          <!-- Main Wizard Form Card -->
          <rect x="${cardX}" y="244" width="${cardWidth}" height="${cardHeight}" rx="16" fill="#FFFFFF" stroke="#E7E2D6" stroke-width="1" filter="url(#shadow)"/>

          <!-- Step 1 Heading Inside Card -->
          <g transform="translate(${cardX + 28}, 274)">
            <text x="0" y="16" class="lbl" font-size="15">Step 1: Civic Classification &amp; Details</text>
            <text x="0" y="34" class="subtext">Select the defect category and describe the observed physical conditions.</text>
            <line x1="0" y1="46" x2="${cardWidth - 56}" y2="46" stroke="#E7E2D6" stroke-width="1"/>
          </g>

          <!-- Form Fields Container -->
          <g transform="translate(${cardX + 28}, 0)">
            ${fieldsSvg}
          </g>

          <!-- Card Bottom Actions -->
          <line x1="${cardX}" y1="${currentY + 50}" x2="${cardX + cardWidth}" y2="${currentY + 50}" stroke="#E7E2D6" stroke-width="1"/>
          <g transform="translate(${cardX + cardWidth - 160}, ${currentY + 62})">
            <rect x="0" y="0" width="132" height="42" rx="8" fill="#0A1F44"/>
            <text x="32" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Continue &#8594;</text>
          </g>
        </svg>
      `;

      const filename = `report-${sc.key}-${vp.name}.png`;
      const filePath = path.join(outDir, filename);

      await sharp(Buffer.from(svg))
        .png()
        .toFile(filePath);

      if (fs.existsSync(artifactDir)) {
        fs.copyFileSync(filePath, path.join(artifactDir, filename));
      }

      console.log(`✓ Generated ${filename}`);
    }
  }
  console.log('All 12 screenshots rendered successfully.');
}

renderV2Screens().catch(console.error);
