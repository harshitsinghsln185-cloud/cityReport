import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { CIVIC_TAXONOMY } = require('../../server/src/seed/civicTaxonomy.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const designSourceDir = path.resolve(__dirname, '../design-source/civic');
const outHtmlPath = path.resolve(__dirname, '../../docs/civic-taxonomy/CONTACT_SHEET.html');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function buildContactSheet() {
  console.log('Generating updated dynamic CONTACT_SHEET.html...');

  let totalCategories = CIVIC_TAXONOMY.length;
  let totalSubIssues = 0;
  let generatedCovers = 0;
  let generatedSubs = 0;

  for (const cat of CIVIC_TAXONOMY) {
    totalSubIssues += cat.subCategories.length;
    if (fs.existsSync(path.join(designSourceDir, cat.slug, '_category.png'))) {
      generatedCovers++;
    }
    for (const sub of cat.subCategories) {
      if (fs.existsSync(path.join(designSourceDir, cat.slug, `${sub.slug}.png`))) {
        generatedSubs++;
      }
    }
  }

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Civic Taxonomy Art Direction Contact Sheet | Crowd Report</title>
  <style>
    :root {
      --primary: #0A1F44;
      --accent: #E8A33D;
      --canvas: #FAF8F3;
      --card-bg: #FFFFFF;
      --border: #E7E2D6;
      --ink: #101828;
      --muted: #5B6577;
      --critical: #B42318;
      --high: #B54708;
      --medium: #0A1F44;
      --low: #475467;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--canvas);
      color: var(--ink);
      padding: 32px 24px;
      line-height: 1.5;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 36px;
      padding-bottom: 24px;
      border-bottom: 2px solid var(--border);
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 8px;
    }
    p.lead {
      color: var(--muted);
      font-size: 15px;
      max-width: 900px;
      margin-bottom: 16px;
    }
    .stats-bar {
      display: flex;
      gap: 20px;
      background: #FFFFFF;
      padding: 16px 20px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .stat-pill {
      font-size: 13px;
      color: var(--muted);
    }
    .stat-pill strong {
      color: var(--primary);
      font-size: 16px;
    }
    .section-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--primary);
      margin: 40px auto 20px;
      max-width: 1400px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-critical { background: #FEE4E2; color: var(--critical); }
    .badge-high { background: #FEF0C7; color: var(--high); }
    .badge-medium { background: #EEF2FF; color: var(--primary); }
    .badge-low { background: #F2F4F7; color: var(--low); }

    .grid-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card-img-wrap {
      position: relative;
      background: #101828;
      overflow: hidden;
    }
    .card-img-wrap.aspect-16-9 {
      padding-top: 56.25%;
    }
    .card-img-wrap.aspect-4-3 {
      padding-top: 75%;
    }
    .card-img-wrap img {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
    }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 8px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
    }
    .card-slug {
      font-family: monospace;
      font-size: 12px;
      color: var(--muted);
      background: #F8F9FC;
      padding: 2px 6px;
      border-radius: 4px;
      align-self: flex-start;
    }
    .meta-row {
      font-size: 12px;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #F2F4F7;
      padding-top: 8px;
      margin-top: auto;
    }
  </style>
</head>
<body>
  <header>
    <h1>Civic Taxonomy Art Direction Contact Sheet</h1>
    <p class="lead">Audit interface for Crowd Report civic infrastructure category covers (16:9) and sub-issue cards (4:3). Grounded in the CroudReport Complete Civic Issues List reference specification.</p>
    <div class="stats-bar">
      <div class="stat-pill">Category Covers: <strong>${generatedCovers} / ${totalCategories}</strong></div>
      <div class="stat-pill">Sub-Issues Produced: <strong>${generatedSubs} / ${totalSubIssues}</strong></div>
      <div class="stat-pill">Progress: <strong>${Math.round((generatedSubs / totalSubIssues) * 100)}%</strong></div>
      <div class="stat-pill">Target Standards: <strong>16:9 / 4:3, EXIF-stripped, CC-licensed</strong></div>
    </div>
  </header>

  <h2 class="section-title">Section 1: 16 Main Category Covers (16:9)</h2>
  <div class="grid-container">
`;

  // Render Category Covers
  for (const cat of CIVIC_TAXONOMY) {
    const relImgPath = `../../client/design-source/civic/${cat.slug}/_category.png`;
    html += `
    <div class="card">
      <div class="card-img-wrap aspect-16-9">
        <img src="${relImgPath}" alt="${escapeXml(cat.name)}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-title">${escapeXml(cat.name)}</div>
        <div class="card-slug">${escapeXml(cat.slug)}</div>
        <div class="meta-row">
          <span>16:9 Cover</span>
          <span>${cat.subCategories.length} Sub-Issues</span>
        </div>
      </div>
    </div>`;
  }

  html += `</div>`;

  // Render Sub-Issue Categories that have generated images
  for (const cat of CIVIC_TAXONOMY) {
    const subsWithImages = cat.subCategories.filter(s => {
      return fs.existsSync(path.join(designSourceDir, cat.slug, `${s.slug}.png`));
    });

    if (subsWithImages.length === 0) continue;

    html += `
    <h2 class="section-title">Section: ${escapeXml(cat.name)} (${subsWithImages.length} / ${cat.subCategories.length} Sub-Issues)</h2>
    <div class="grid-container">
    `;

    for (const sub of subsWithImages) {
      const relImgPath = `../../client/design-source/civic/${cat.slug}/${sub.slug}.png`;
      const priorityClass = `badge-${(sub.defaultPriority || 'medium').toLowerCase()}`;

      html += `
      <div class="card">
        <div class="card-img-wrap aspect-4-3">
          <img src="${relImgPath}" alt="${escapeXml(sub.name)}" loading="lazy">
        </div>
        <div class="card-body">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="card-title">${escapeXml(sub.name)}</div>
            <span class="badge ${priorityClass}">${escapeXml(sub.defaultPriority || 'Medium')}</span>
          </div>
          <div class="card-slug">${escapeXml(sub.slug)}</div>
          <div class="meta-row">
            <span>4:3 Ratio</span>
            <span>${sub.imageKey ? 'Shared: ' + escapeXml(sub.imageKey) : 'Unique Asset'}</span>
          </div>
        </div>
      </div>`;
    }

    html += `</div>`;
  }

  html += `
</body>
</html>`;

  fs.writeFileSync(outHtmlPath, html, 'utf8');
  console.log(`✓ Wrote ${outHtmlPath}`);

  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(outHtmlPath, path.join(artifactDir, 'CONTACT_SHEET.html'));
    console.log(`✓ Copied to artifacts directory: ${artifactDir}`);
  }
}

buildContactSheet().catch(err => {
  console.error('Fatal error building contact sheet:', err);
  process.exit(1);
});
