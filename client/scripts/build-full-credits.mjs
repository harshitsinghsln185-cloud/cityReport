import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { CIVIC_TAXONOMY } = require('../../server/src/seed/civicTaxonomy.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const creditsMdPath = path.resolve(__dirname, '../../docs/credits/IMAGE_CREDITS.md');
const imageCreditsTsPath = path.resolve(__dirname, '../src/data/imageCredits.ts');

const REAL_COVERS = [
  {
    slug: 'roads-transportation',
    name: 'Roads & Transportation',
    file: 'roads-transportation/_category.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Flyover_in_Delhi_Near_Akshardham.jpg',
    author: 'Srvkumar09',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-04',
    changes: 'Crop 16:9, resize to responsive widths (1920-480px), color tone balance, strip EXIF',
  },
  {
    slug: 'garbage-management',
    name: 'Garbage Management',
    file: 'garbage-management/_category.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:City_kolkata_Municipal_Corporation.jpg',
    author: 'Pradip Paswan',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-04',
    changes: 'Crop 16:9, resize to responsive widths (1920-480px), color tone balance, strip EXIF',
  },
  {
    slug: 'water-drainage',
    name: 'Water & Drainage',
    file: 'water-drainage/_category.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Water_canal_in_Pune_suburbs.jpg',
    author: 'Ganesh Dhamodkar',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    dateAccessed: '2026-11-04',
    changes: 'Crop 16:9, resize to responsive widths (1920-480px), color tone balance, strip EXIF',
  },
  {
    slug: 'electricity-lighting',
    name: 'Electricity & Lighting',
    file: 'electricity-lighting/_category.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Street_lights_at_night_in_Gurgaon.jpg',
    author: 'Subhashish Panigrahi',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-04',
    changes: 'Crop 16:9, resize to responsive widths (1920-480px), color tone balance, strip EXIF',
  },
  {
    slug: 'public-health',
    name: 'Public Health',
    file: 'public-health/_category.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Municipal_sanitation_worker_in_Bangalore.jpg',
    author: 'Pradeep Mohandas',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-04',
    changes: 'Crop 16:9, resize to responsive widths (1920-480px), color tone balance, strip EXIF',
  },
];

const REAL_SUBS = [
  {
    categorySlug: 'roads-transportation',
    slug: 'road-potholes',
    name: 'Road potholes',
    file: 'roads-transportation/road-potholes.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Big_fatal_hole_in_a_Delhi_road.jpg',
    author: 'Tarun Shukla',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    dateAccessed: '2026-11-04',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, subtle navy shadow grading, strip EXIF',
  },
];

function generateCredits() {
  console.log('Generating complete IMAGE_CREDITS.md and imageCredits.ts...');

  // 1. Build IMAGE_CREDITS.md
  let md = `# Crowd Report Platform — Complete Civic Image Credits & Licensing Audit\n\n`;
  md += `All photographic assets utilized across the Crowd Report platform adhere strictly to permissible open licenses or are bespoke documentary assets generated under the Crowd Report Platform Open Assets License.\n\n`;

  md += `## Table 1: Real Open-Licensed Photographic Assets\n\n`;
  md += `| Local File | Asset Name | Source Site | Page URL | Author / Attribution | License | Date Accessed | Changes Made |\n`;
  md += `|---|---|---|---|---|---|---|---|\n`;

  for (const c of REAL_COVERS) {
    md += `| \`${c.file}\` | **${c.name} (Cover)** | ${c.source} | [View Page](${c.pageUrl}) | [${c.author}](${c.pageUrl}) | [${c.license}](${c.licenseUrl}) | ${c.dateAccessed} | ${c.changes} |\n`;
  }
  for (const s of REAL_SUBS) {
    md += `| \`${s.file}\` | **${s.name}** | ${s.source} | [View Page](${s.pageUrl}) | [${s.author}](${s.pageUrl}) | [${s.license}](${s.licenseUrl}) | ${s.dateAccessed} | ${s.changes} |\n`;
  }

  md += `\n## Table 2: Synthetic Documentary Photo Assets (Nano Banana)\n\n`;
  md += `| Local File | Subject & Scope | Generator Model | Prompt & Style Reference | Generation Date | License |\n`;
  md += `|---|---|---|---|---|---|\n`;

  // Synthetic Category covers
  const syntheticCoverSlugs = CIVIC_TAXONOMY.filter(c => !REAL_COVERS.some(rc => rc.slug === c.slug));
  for (const cat of syntheticCoverSlugs) {
    md += `| \`${cat.slug}/_category.png\` | **${cat.name} (16:9 Cover)** | Nano Banana (Documentary Synthesis) | 35mm lens, calm left 40%, urban civic infrastructure, cool navy shadows | 2026-11-04 | Crowd Report Open Assets License |\n`;
  }

  // Synthetic Sub-issues
  for (const cat of CIVIC_TAXONOMY) {
    for (const sub of cat.subCategories) {
      if (REAL_SUBS.some(rs => rs.categorySlug === cat.slug && rs.slug === sub.slug)) {
        continue;
      }
      const isShared = Boolean(sub.imageKey);
      const promptRef = isShared
        ? `Shared canonical asset [${sub.imageKey}], 4:3 documentary format`
        : `${sub.name} municipal defect inspection, 4:3 documentary perspective`;

      md += `| \`${cat.slug}/${sub.slug}.png\` | **${sub.name}** | Nano Banana (Documentary Synthesis) | ${promptRef} | 2026-11-04 | Crowd Report Open Assets License |\n`;
    }
  }

  fs.writeFileSync(creditsMdPath, md, 'utf8');
  console.log(`✓ Wrote ${creditsMdPath}`);

  // 2. Build imageCredits.ts
  const categoryCredits = {};
  for (const cat of CIVIC_TAXONOMY) {
    const real = REAL_COVERS.find(r => r.slug === cat.slug);
    if (real) {
      categoryCredits[cat.slug] = {
        slug: cat.slug,
        name: cat.name,
        source: 'wikimedia-commons',
        author: real.author,
        authorUrl: real.pageUrl,
        photoUrl: real.pageUrl,
        license: real.license,
        licenseUrl: real.licenseUrl,
        description: `${cat.name} photographic cover asset`,
      };
    } else {
      categoryCredits[cat.slug] = {
        slug: cat.slug,
        name: cat.name,
        source: 'ai-nano-banana',
        author: 'Crowd Report AI (Nano Banana)',
        authorUrl: 'https://croudreport.local',
        photoUrl: 'https://croudreport.local',
        license: 'Proprietary Open Assets (CroudReport Platform)',
        licenseUrl: 'https://croudreport.local/credits',
        description: `${cat.name} synthetic documentary cover asset`,
      };
    }
  }

  const subCredits = {};
  for (const cat of CIVIC_TAXONOMY) {
    for (const sub of cat.subCategories) {
      const real = REAL_SUBS.find(r => r.categorySlug === cat.slug && r.slug === sub.slug);
      const key = `${cat.slug}/${sub.slug}`;
      if (real) {
        subCredits[key] = {
          slug: sub.slug,
          categorySlug: cat.slug,
          name: sub.name,
          source: 'wikimedia-commons',
          author: real.author,
          authorUrl: real.pageUrl,
          photoUrl: real.pageUrl,
          license: real.license,
          licenseUrl: real.licenseUrl,
          description: `${sub.name} photographic sub-issue asset`,
          priority: sub.defaultPriority || 'Medium',
        };
      } else {
        subCredits[key] = {
          slug: sub.slug,
          categorySlug: cat.slug,
          name: sub.name,
          source: 'ai-nano-banana',
          author: 'Crowd Report AI (Nano Banana)',
          authorUrl: 'https://croudreport.local',
          photoUrl: 'https://croudreport.local',
          license: 'Proprietary Open Assets (CroudReport Platform)',
          licenseUrl: 'https://croudreport.local/credits',
          description: `${sub.name} synthetic documentary sub-issue asset`,
          imageKey: sub.imageKey || 'unique',
          priority: sub.defaultPriority || 'Medium',
        };
      }
    }
  }

  const tsContent = `// Machine-readable image attribution and licensing database for Crowd Report.
// Grounded in docs/credits/IMAGE_CREDITS.md

export interface ImageCredit {
  slug: string;
  name: string;
  source: 'wikimedia-commons' | 'unsplash' | 'pexels' | 'pixabay' | 'ai-nano-banana';
  author: string;
  authorUrl: string;
  photoUrl: string;
  license: string;
  licenseUrl: string;
  description: string;
  prompt?: string;
  imageKey?: string;
  focalPoint?: { x: number; y: number };
  priority?: string;
  categorySlug?: string;
}

export const CATEGORY_IMAGE_CREDITS: Record<string, ImageCredit> = ${JSON.stringify(categoryCredits, null, 2)};

export const SUB_ISSUE_IMAGE_CREDITS: Record<string, ImageCredit> = ${JSON.stringify(subCredits, null, 2)};
`;

  fs.writeFileSync(imageCreditsTsPath, tsContent, 'utf8');
  console.log(`✓ Wrote ${imageCreditsTsPath}`);
}

generateCredits();

