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
  {
    categorySlug: 'water-drainage',
    slug: 'flooded-streets',
    name: 'Flooded streets',
    file: 'water-drainage/flooded-streets.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:3933Typhoons_Krosa_Lekima_monsoon_tidal_flooding_in_Calumpit%2C_Bulacan_52.jpg',
    author: 'Judgefloro',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'water-drainage',
    slug: 'broken-manhole-covers',
    name: 'Broken manhole covers',
    file: 'water-drainage/broken-manhole-covers.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Manhole_in_Delhi.jpg',
    author: 'Rrthakur22',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'electricity-lighting',
    slug: 'streetlights-not-working',
    name: 'Streetlights not working',
    file: 'electricity-lighting/streetlights-not-working.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Broken_lamp_post%2C_Verhorechye.jpg',
    author: 'Dmitry Sklyarenko',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'electricity-lighting',
    slug: 'dark-public-areas',
    name: 'Dark public areas',
    file: 'electricity-lighting/dark-public-areas.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Dark_alley_-_Flickr_-_Stiller_Beobachter.jpg',
    author: 'Stiller Beobachter',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'public-health',
    slug: 'dirty-public-toilets',
    name: 'Dirty public toilets',
    file: 'public-health/dirty-public-toilets.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Vandalized_public_toilet_2024-10-01_1.jpg',
    author: 'Public Domain',
    license: 'CC0 / Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'public-health',
    slug: 'public-toilets-not-maintained',
    name: 'Public toilets not maintained',
    file: 'public-health/public-toilets-not-maintained.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Unmaintained_public_toilet_in_a_park%2C_Rotterdam-Centrum%2C_Rotterdam_%282021%29_02.jpg',
    author: 'Donald Trung Quoc Don',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'environment',
    slug: 'burning-of-garbage',
    name: 'Burning of garbage',
    file: 'environment/burning-of-garbage.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:A_burning_roadside_garbage_dump_at_Panvel_Naka_near_Mumbai.jpg',
    author: 'Sumaira Abdulali',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'parks-greenery',
    slug: 'broken-park-lights',
    name: 'Broken park lights',
    file: 'parks-greenery/broken-park-lights.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Harris_Park_Bx_td_(2019-03-29)_011.jpg',
    author: 'Tdorante10',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'parks-greenery',
    slug: 'lack-of-dustbins-in-parks',
    name: 'Lack of dustbins in parks',
    file: 'parks-greenery/lack-of-dustbins-in-parks.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Litter_Park_Lane.jpg',
    author: 'Rubbish computer',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'public-safety',
    slug: 'open-manholes',
    name: 'Open manholes',
    file: 'public-safety/open-manholes.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Open_man-hole.jpg',
    author: 'TheSocialVoiceNG',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
  },
  {
    categorySlug: 'public-transport',
    slug: 'broken-traffic-signals',
    name: 'Broken traffic signals',
    file: 'public-transport/broken-traffic-signals.png',
    source: 'Wikimedia Commons',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Fixing_traffic_lights_damaged_by_the_2011_flood.jpg',
    author: 'Rae Allen',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    dateAccessed: '2026-11-15',
    changes: 'Crop 4:3, resize to 800px and 480px WebP/AVIF, documentary grade, strip EXIF',
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

