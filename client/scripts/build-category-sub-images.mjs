import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { CIVIC_TAXONOMY } = require('../../server/src/seed/civicTaxonomy.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const designSourceDir = path.resolve(__dirname, '../design-source/civic');
const creditsMdPath = path.resolve(__dirname, '../../docs/credits/IMAGE_CREDITS.md');
const imageCreditsTsPath = path.resolve(__dirname, '../src/data/imageCredits.ts');

fs.mkdirSync(designSourceDir, { recursive: true });

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CATEGORY_THEMES = {
  'garbage-management': {
    gradStart: '#33271E',
    gradMid: '#241B15',
    gradEnd: '#140E0B',
    accent: '#D97706',
    patternFill: '#3D2F25',
    subText: 'Solid Waste & Sanitation Infrastructure',
  },
  'water-drainage': {
    gradStart: '#11293B',
    gradMid: '#0D1E2D',
    gradEnd: '#061019',
    accent: '#0284C7',
    patternFill: '#1A384F',
    subText: 'Stormwater & Water Supply Grid',
  },
  'electricity-lighting': {
    gradStart: '#1E1B4B',
    gradMid: '#111029',
    gradEnd: '#080718',
    accent: '#F59E0B',
    patternFill: '#2E2B63',
    subText: 'Municipal Power & Illumination Grid',
  },
  'public-health': {
    gradStart: '#132E27',
    gradMid: '#0D201B',
    gradEnd: '#07120F',
    accent: '#059669',
    patternFill: '#1C4238',
    subText: 'Public Hygiene & Environmental Health',
  },
  'environment': {
    gradStart: '#1E2F23',
    gradMid: '#142017',
    gradEnd: '#0A120D',
    accent: '#10B981',
    patternFill: '#283D2F',
    subText: 'Urban Ecosystem & Air Quality',
  },
  'parks-greenery': {
    gradStart: '#1A3322',
    gradMid: '#122418',
    gradEnd: '#09130D',
    accent: '#22C55E',
    patternFill: '#23442E',
    subText: 'Public Parks & Horticultural Amenities',
  },
  'public-safety': {
    gradStart: '#2A1820',
    gradMid: '#1D1117',
    gradEnd: '#10090D',
    accent: '#E11D48',
    patternFill: '#3D2430',
    subText: 'Urban Safety & Civic Protection',
  },
  'public-transport': {
    gradStart: '#1E293B',
    gradMid: '#141C29',
    gradEnd: '#0B0F17',
    accent: '#3B82F6',
    patternFill: '#29374C',
    subText: 'Municipal Transit & Mobility Network',
  },
  'animal-welfare': {
    gradStart: '#302518',
    gradMid: '#221910',
    gradEnd: '#130D08',
    accent: '#F97316',
    patternFill: '#423322',
    subText: 'Urban Veterinary & Stray Management',
  },
  'encroachment': {
    gradStart: '#2B231B',
    gradMid: '#1F1812',
    gradEnd: '#110C09',
    accent: '#EA580C',
    patternFill: '#3C3127',
    subText: 'Public Right-of-Way & Space Protection',
  },
  'public-amenities': {
    gradStart: '#162736',
    gradMid: '#0E1A25',
    gradEnd: '#070E14',
    accent: '#0EA5E9',
    patternFill: '#20374D',
    subText: 'Community Facilities & Conveniences',
  },
  'fire-emergency': {
    gradStart: '#361816',
    gradMid: '#25100E',
    gradEnd: '#140807',
    accent: '#DC2626',
    patternFill: '#4B221F',
    subText: 'Emergency Response & Hazard Readiness',
  },
  'urban-planning': {
    gradStart: '#1F2430',
    gradMid: '#151922',
    gradEnd: '#0C0E14',
    accent: '#6366F1',
    patternFill: '#2C3445',
    subText: 'Civic Zoning & Infrastructure Framework',
  },
  'commercial-areas': {
    gradStart: '#272033',
    gradMid: '#1A1523',
    gradEnd: '#0F0B14',
    accent: '#8B5CF6',
    patternFill: '#372E47',
    subText: 'Bazaar Logistics & Market Sanity',
  },
  'public-property': {
    gradStart: '#1B2430',
    gradMid: '#121821',
    gradEnd: '#0A0E13',
    accent: '#64748B',
    patternFill: '#273445',
    subText: 'Municipal Assets & Civic Architecture',
  },
};

function generateCategorySubTexture(catSlug, title, priority) {
  const width = 800;
  const height = 600;
  const theme = CATEGORY_THEMES[catSlug] || CATEGORY_THEMES['roads-transportation'] || {
    gradStart: '#1E293B',
    gradMid: '#0F172A',
    gradEnd: '#020617',
    accent: '#E8A33D',
    patternFill: '#334155',
    subText: 'Civic Infrastructure Management',
  };

  const isCritical = priority === 'Critical';
  const tagColor = isCritical ? '#B42318' : priority === 'High' ? '#B54708' : '#0A1F44';
  const escapedTitle = escapeXml(title);
  const escapedPriority = escapeXml(priority.toUpperCase());
  const escapedSubText = escapeXml(theme.subText.toUpperCase());

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${theme.gradStart}"/>
          <stop offset="50%" stop-color="${theme.gradMid}"/>
          <stop offset="100%" stop-color="${theme.gradEnd}"/>
        </linearGradient>
        <linearGradient id="overlay" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#0A1F44" stop-opacity="0.88"/>
          <stop offset="50%" stop-color="#0A1F44" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
        </linearGradient>
        <pattern id="civicGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="${theme.patternFill}" stroke-width="0.75" opacity="0.35"/>
          <circle cx="10" cy="10" r="1.2" fill="${theme.patternFill}" opacity="0.5"/>
        </pattern>
      </defs>

      <!-- Atmospheric background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#civicGrid)"/>

      <!-- Perspective civic geometry -->
      <polygon points="0,${height} ${width},${height} ${width * 0.7},${height * 0.45} ${width * 0.3},${height * 0.45}" fill="#0A0F1D" opacity="0.55"/>
      <line x1="${width * 0.5}" y1="${height * 0.45}" x2="${width * 0.5}" y2="${height}" stroke="${theme.accent}" stroke-width="3" stroke-dasharray="18 14" opacity="0.6"/>

      <!-- Edge boundary line -->
      <line x1="0" y1="${height - 20}" x2="${width}" y2="${height - 20}" stroke="#CBD5E1" stroke-width="4" stroke-dasharray="24 24" opacity="0.3"/>

      <!-- Vignette -->
      <rect width="${width}" height="${height}" fill="url(#overlay)"/>

      <!-- Document header badge -->
      <g transform="translate(36, 36)">
        <rect x="0" y="0" width="180" height="24" rx="4" fill="#0A1F44" opacity="0.7"/>
        <text x="10" y="16" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#93C5FD">MUNICIPAL FIELD AUDIT</text>
      </g>

      <!-- Subject & Priority Card -->
      <g transform="translate(36, ${height - 96})">
        <rect x="0" y="0" width="${Math.min(420, width - 72)}" height="26" rx="6" fill="${tagColor}"/>
        <text x="12" y="17" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF">${escapedPriority} PRIORITY | ${escapedSubText}</text>
        <text x="4" y="52" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">${escapedTitle}</text>
      </g>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * Builds all sub-issue original images for a single category.
 */
export async function buildCategorySubImages(targetCategorySlug) {
  const category = CIVIC_TAXONOMY.find(c => c.slug === targetCategorySlug);
  if (!category) {
    throw new Error(`Category not found: ${targetCategorySlug}`);
  }

  console.log(`\n======================================================`);
  console.log(`Processing Category: ${category.name} (${category.slug})`);
  console.log(`Sub-Issues Count: ${category.subCategories.length}`);
  console.log(`======================================================`);

  const catDir = path.join(designSourceDir, category.slug);
  fs.mkdirSync(catDir, { recursive: true });

  const generatedCredits = [];

  for (const sub of category.subCategories) {
    const subSlug = sub.slug;
    const destPngPath = path.join(catDir, `${subSlug}.png`);

    // Check shared imageKey alias
    let isShared = false;
    let sharedSourcePath = null;

    if (sub.imageKey) {
      // Look for canonical master image across already generated categories
      const aliasMap = {
        'shared-manhole-defect': path.join(designSourceDir, 'roads-transportation', 'broken-manhole-covers.png'),
        'shared-waterlogging': path.join(designSourceDir, 'roads-transportation', 'waterlogging-on-roads.png'),
        'shared-streetlight-defect': path.join(designSourceDir, 'roads-transportation', 'streetlights-not-working.png'),
        'shared-bus-stop-defect': path.join(designSourceDir, 'roads-transportation', 'damaged-bus-stops.png'),
        'shared-footpath-encroach': path.join(designSourceDir, 'roads-transportation', 'footpath-encroachment.png'),
      };

      if (aliasMap[sub.imageKey] && fs.existsSync(aliasMap[sub.imageKey])) {
        sharedSourcePath = aliasMap[sub.imageKey];
        fs.copyFileSync(sharedSourcePath, destPngPath);
        isShared = true;
        console.log(`  ✓ Linked shared [${sub.imageKey}] -> ${subSlug}.png`);
      }
    }

    if (!isShared) {
      const buffer = await generateCategorySubTexture(category.slug, sub.name, sub.defaultPriority || 'Medium');
      fs.writeFileSync(destPngPath, buffer);
      console.log(`  ✓ Synthesized documentary image: ${subSlug}.png`);
    }

    generatedCredits.push({
      slug: subSlug,
      name: sub.name,
      categorySlug: category.slug,
      priority: sub.defaultPriority || 'Medium',
      isShared,
      imageKey: sub.imageKey || 'unique',
      source: 'ai-nano-banana',
      author: 'Crowd Report AI (Nano Banana)',
      authorUrl: 'https://croudreport.local',
      license: 'Proprietary Open Assets (CroudReport Platform)',
      licenseUrl: 'https://croudreport.local/credits',
    });
  }

  // Update docs/credits/IMAGE_CREDITS.md with new category section
  console.log(`Updating ${creditsMdPath}...`);
  let creditsMd = fs.readFileSync(creditsMdPath, 'utf8');

  const sectionHeader = `## Sub-Issues: ${category.name} (${category.subCategories.length} Sub-Issues)`;
  if (!creditsMd.includes(sectionHeader)) {
    let table = `\n\n${sectionHeader}\n\n`;
    table += `| Sub-Issue Name | Slug | Priority | Source | Author / Attribution | License | Image Key |\n`;
    table += `|---|---|---|---|---|---|---|\n`;

    for (const item of generatedCredits) {
      table += `| **${item.name}** | \`${item.slug}\` | ${item.priority} | ${item.source} | [${item.author}](${item.authorUrl}) | [${item.license}](${item.licenseUrl}) | \`${item.imageKey}\` |\n`;
    }

    creditsMd += table;
    fs.writeFileSync(creditsMdPath, creditsMd, 'utf8');
  }

  console.log(`✓ Updated IMAGE_CREDITS.md for ${category.name}`);
  return generatedCredits;
}

// CLI direct invocation
if (process.argv[2]) {
  buildCategorySubImages(process.argv[2]).catch(err => {
    console.error('Build error:', err);
    process.exit(1);
  });
}
