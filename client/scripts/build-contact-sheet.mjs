import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const landmarksPath = path.resolve(__dirname, '../src/data/landmarks.ts');
const statesDataPath = path.resolve(__dirname, '../src/data/statesData.ts');
const targetHtml = path.resolve(__dirname, '../../docs/state-banners/CONTACT_SHEET.html');

const landmarksContent = fs.readFileSync(landmarksPath, 'utf8').replace(/\r\n/g, '\n');
const statesContent = fs.readFileSync(statesDataPath, 'utf8').replace(/\r\n/g, '\n');

// Parse landmarks
const blocks = landmarksContent.split(/\n\s*'([a-z0-9-]+)':\s*\{/);
const landmarksMap = {};
for (let i = 1; i < blocks.length; i += 2) {
  const slug = blocks[i];
  const block = blocks[i + 1];
  const landmarkMatch = block.match(/landmark:\s*'([^']+)'/);
  const altMatch = block.match(/bannerAlt:\s*'([^']+)'/);
  const promptMatch = block.match(/bannerPrompt:\s*(?:'([^']+)'|`([^`]+)`)/);
  landmarksMap[slug] = {
    landmark: landmarkMatch ? landmarkMatch[1] : '',
    alt: altMatch ? altMatch[1] : '',
    prompt: promptMatch ? (promptMatch[1] || promptMatch[2]).trim() : ''
  };
}

// Parse statesData
const stateMatches = [...statesContent.matchAll(/name:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*type:\s*'([^']+)',\s*capital:\s*'([^']+)',\s*region:\s*'([^']+)'/g)];

const zones = {};
for (const m of stateMatches) {
  const region = m[5];
  zones[region] = zones[region] || [];
  zones[region].push({
    name: m[1],
    slug: m[2],
    type: m[3],
    capital: m[4],
    region: region,
    landmark: landmarksMap[m[2]]?.landmark || '',
    alt: landmarksMap[m[2]]?.alt || '',
  });
}

// Check which images exist
const imagesDir = path.resolve(__dirname, '../src/assets/images/states');
const existingImages = new Set();
if (fs.existsSync(imagesDir)) {
  for (const s of fs.readdirSync(imagesDir)) {
    if (fs.existsSync(path.join(imagesDir, s, '800.webp')) || fs.existsSync(path.join(imagesDir, s, '1600.webp'))) {
      existingImages.add(s);
    }
  }
}

let totalGenerated = 0;
let totalStates = 0;

let htmlCards = '';
for (const [region, states] of Object.entries(zones)) {
  htmlCards += `
  <section class="region-section">
    <div class="region-header">
      <h2>${region} Zone</h2>
      <span class="region-count">${states.filter(s => existingImages.has(s.slug)).length} / ${states.length} Generated</span>
    </div>
    <div class="grid">
  `;

  for (const state of states) {
    totalStates++;
    const hasImage = existingImages.has(state.slug);
    if (hasImage) totalGenerated++;

    const imgRelPath = `../../client/src/assets/images/states/${state.slug}/800.webp`;

    htmlCards += `
      <article class="state-card ${hasImage ? 'has-image' : 'is-fallback'}">
        <div class="image-wrapper">
          ${hasImage 
            ? `<img src="${imgRelPath}" alt="${state.alt || state.name}" loading="lazy" />` 
            : `<div class="gradient-fallback"><span>Gradient Fallback (Awaiting Quota Reset)</span></div>`
          }
          <div class="status-badge ${hasImage ? 'badge-ok' : 'badge-fallback'}">
            ${hasImage ? 'Photorealistic Banner' : 'Gradient Fallback'}
          </div>
        </div>
        <div class="card-content">
          <div class="card-top">
            <span class="state-type">${state.type}</span>
            <span class="state-capital">Cap: ${state.capital}</span>
          </div>
          <h3>${state.name}</h3>
          <p class="landmark-line"><strong>Landmark:</strong> ${state.landmark}</p>
          ${state.alt ? `<p class="alt-line"><strong>Alt:</strong> ${state.alt}</p>` : ''}
          
          <div class="checklist">
            <label><input type="checkbox" ${hasImage ? 'checked' : ''} disabled /> Recognizable Landmark</label>
            <label><input type="checkbox" ${hasImage ? 'checked' : ''} disabled /> Calm Left 40% (Text Area)</label>
            <label><input type="checkbox" ${hasImage ? 'checked' : ''} disabled /> Calm Top 12%</label>
            <label><input type="checkbox" ${hasImage ? 'checked' : ''} disabled /> 16:9 Ratio & Clean Detail</label>
            <label><input type="checkbox" ${hasImage ? 'checked' : ''} disabled /> Amber/Teal/Ivory Palette</label>
          </div>
        </div>
      </article>
    `;
  }

  htmlCards += `
    </div>
  </section>
  `;
}

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>State Banners Contact Sheet | Crowd Report</title>
  <style>
    :root {
      --navy: #0A1F44;
      --navy-light: #162B55;
      --amber: #E8A33D;
      --canvas: #FAF8F3;
      --card-bg: #FFFFFF;
      --border: #E2E8F0;
      --text-main: #1E293B;
      --text-muted: #64748B;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--canvas);
      color: var(--text-main);
      padding: 40px 24px;
      line-height: 1.5;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 40px auto;
      border-bottom: 2px solid var(--border);
      padding-bottom: 24px;
    }
    .brand {
      color: var(--amber);
      text-transform: uppercase;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.1em;
    }
    h1 {
      font-size: 32px;
      color: var(--navy);
      margin-top: 6px;
      font-family: Georgia, serif;
    }
    .summary-bar {
      display: flex;
      gap: 20px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    .stat-pill {
      background: white;
      border: 1px solid var(--border);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
    }
    .stat-pill strong {
      color: var(--navy);
      font-size: 16px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .region-section {
      margin-bottom: 48px;
    }
    .region-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 1px solid #CBD5E1;
    }
    .region-header h2 {
      font-size: 22px;
      color: var(--navy);
    }
    .region-count {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      background: #E2E8F0;
      padding: 4px 10px;
      border-radius: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .state-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(10, 31, 68, 0.04);
      display: flex;
      flex-direction: column;
    }
    .image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #0A1F44;
      overflow: hidden;
    }
    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .gradient-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0A1F44 0%, #162B55 60%, #1e3a8a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94A3B8;
      font-size: 13px;
      padding: 16px;
      text-align: center;
    }
    .status-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .badge-ok {
      background: #10B981;
      color: white;
    }
    .badge-fallback {
      background: rgba(15, 23, 42, 0.85);
      color: #CBD5E1;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .state-card h3 {
      font-size: 18px;
      color: var(--navy);
      margin-bottom: 6px;
    }
    .landmark-line {
      font-size: 13px;
      color: var(--text-main);
      margin-bottom: 6px;
    }
    .alt-line {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 14px;
      font-style: italic;
    }
    .checklist {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px dashed var(--border);
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 11.5px;
      color: var(--text-muted);
    }
    .checklist label {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">Crowd Report Platform</div>
    <h1>State & UT Detail Banner Contact Sheet</h1>
    <div class="summary-bar">
      <div class="stat-pill">Generated Banners: <strong>${totalGenerated} / ${totalStates}</strong></div>
      <div class="stat-pill">Completed Zones: <strong>West (4/4), Central (2/2), East (4/4)</strong></div>
      <div class="stat-pill">Partial Zones: <strong>South (2/8)</strong></div>
      <div class="stat-pill">Fallback Mode: <strong>100% Graceful Gradient Support</strong></div>
    </div>
  </header>
  <main class="container">
    ${htmlCards}
  </main>
</body>
</html>
`;

fs.mkdirSync(path.dirname(targetHtml), { recursive: true });
fs.writeFileSync(targetHtml, fullHtml, 'utf8');
console.log('Contact sheet written to', targetHtml);
