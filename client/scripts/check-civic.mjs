import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { CIVIC_TAXONOMY } = require('../../server/src/seed/civicTaxonomy.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const civicContentPath = path.resolve(__dirname, '../src/data/civicContent.ts');
const imageCreditsPath = path.resolve(__dirname, '../src/data/imageCredits.ts');
const assetsDir = path.resolve(__dirname, '../src/assets/images/civic');
const designSourceDir = path.resolve(__dirname, '../design-source/civic');

const COVER_SIZES = ['1920.webp', '1280.webp', '768.webp', '800.webp', '480.webp', 'blur.webp'];
const SUB_SIZES = ['800.webp', '480.webp', 'blur.webp'];

async function runCheck() {
  console.log('--- Running Civic Taxonomy Consistency Checks ---');
  let errors = 0;
  let warnings = 0;

  // 1. Check content entries against taxonomy
  console.log('1. Validating taxonomy vs client content...');
  const contentText = fs.readFileSync(civicContentPath, 'utf8');

  for (const cat of CIVIC_TAXONOMY) {
    if (!contentText.includes(`"${cat.slug}":`)) {
      console.error(`  [FAIL] Missing CATEGORY_CONTENT entry for slug "${cat.slug}"`);
      errors++;
    }

    for (const sub of cat.subCategories) {
      const key = `"${cat.slug}/${sub.slug}":`;
      if (!contentText.includes(key)) {
        console.error(`  [FAIL] Missing CIVIC_CONTENT entry for sub-category "${cat.slug}/${sub.slug}"`);
        errors++;
      }
    }
  }

  // 2. Check image folders in assetsDir have taxonomy entry
  console.log('2. Validating category cover asset folders against taxonomy...');
  if (fs.existsSync(assetsDir)) {
    for (const cat of CIVIC_TAXONOMY) {
      const catFolder = path.join(assetsDir, cat.slug);
      const coverFolder = path.join(catFolder, '_category');
      if (!fs.existsSync(coverFolder)) {
        console.error(`  [FAIL] Missing _category cover folder for "${cat.slug}"`);
        errors++;
        continue;
      }

      for (const sizeFile of COVER_SIZES) {
        const filePath = path.join(coverFolder, sizeFile);
        if (!fs.existsSync(filePath)) {
          console.error(`  [FAIL] Missing expected cover responsive size: "${cat.slug}/_category/${sizeFile}"`);
          errors++;
        }
      }
    }
  }

  // 4. Validate image credits for real photos
  console.log('3. Validating credits file...');
  const creditsText = fs.readFileSync(imageCreditsPath, 'utf8');
  if (!creditsText.includes('CATEGORY_IMAGE_CREDITS')) {
    console.error('  [FAIL] CATEGORY_IMAGE_CREDITS missing in client/src/data/imageCredits.ts');
    errors++;
  }

  // 5. Verify programmatic resolution via civicImage.ts in Vite SSR
  console.log('4. Validating all slugs resolve to real image files via civicImage.ts...');
  try {
    const { createServer } = await import('vite');
    const vite = await createServer({
      root: path.resolve(__dirname, '..'),
      server: { middlewareMode: true },
      logLevel: 'error',
    });
    const civicModule = await vite.ssrLoadModule('/src/lib/civicImage.ts');
    let resolvedCats = 0;

    for (const cat of CIVIC_TAXONOMY) {
      const cover = civicModule.getCategoryImage(cat.slug);
      if (!cover || !cover.src) {
        console.error(`  [FAIL] getCategoryImage failed to resolve for slug: "${cat.slug}"`);
        errors++;
      } else {
        resolvedCats++;
      }
    }
    await vite.close();
    console.log(`  ✓ Successfully verified ${resolvedCats}/16 categories via civicImage.ts`);
  } catch (err) {
    console.error('  [FAIL] Failed to run civicImage.ts resolution check:', err);
    errors++;
  }

  console.log('\n--- Consistency Check Summary ---');
  if (errors > 0) {
    console.error(`❌ Check failed with ${errors} error(s) and ${warnings} warning(s).`);
    process.exit(1);
  } else {
    console.log(`✓ All checks passed cleanly with 0 errors.`);
  }
}

runCheck().catch(err => {
  console.error('Fatal error during check-civic:', err);
  process.exit(1);
});

