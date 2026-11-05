import { chromium } from 'playwright-core';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { CIVIC_TAXONOMY } from '../../server/src/seed/civicTaxonomy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// All 16 canonical civic categories
const CATEGORY_SLUGS = [
  'roads-transportation',
  'garbage-management',
  'water-drainage',
  'electricity-lighting',
  'public-health',
  'environment',
  'parks-greenery',
  'public-safety',
  'public-transport',
  'animal-welfare',
  'encroachment',
  'public-amenities',
  'fire-emergency',
  'urban-planning',
  'commercial-areas',
  'public-property',
];

async function runTestSuite() {
  console.log('=== RUNNING PLAYWRIGHT CIVIC IMAGES TEST SUITE ===\n');
  let failures = 0;
  let totalCardsChecked = 0;

  const previewServer = await preview({
    root,
    preview: { port: 5176 },
    logLevel: 'error',
  });
  const address = previewServer.httpServer?.address();
  const baseUrl = typeof address === 'object' && address ? `http://localhost:${address.port}` : 'http://localhost:5176';
  console.log(`Vite preview test server running at: ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  // Route /api requests so tests are instant, deterministic, and isolated from external network latency
  await page.route('**/api/categories/**', async (route) => {
    const url = route.request().url();
    const parts = url.split('/categories/');
    const slug = parts[1] ? parts[1].split('?')[0].split('/')[0] : '';
    if (slug && slug !== 'active') {
      const found = CIVIC_TAXONOMY.find((c) => c.slug === slug);
      if (found) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: found }),
        });
      }
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: CIVIC_TAXONOMY }),
    });
  });

  await page.route('**/api/categories', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: CIVIC_TAXONOMY }),
    });
  });

  await page.route('**/api/**', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  // Helper to scroll page completely and ensure all images are decoded
  async function scrollPage() {
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      for (const img of imgs) {
        img.scrollIntoView({ block: 'center' });
        if (!img.complete) {
          await new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            setTimeout(resolve, 800);
          });
        }
      }
    });
    await page.waitForTimeout(600);
  }

  // 1. Test /services page
  console.log('1. Checking /services page cards...');
  await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await scrollPage();

  const servicesCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/services/"]'));
    return cards.map((c) => {
      const heading = c.querySelector('h3')?.textContent?.trim() || 'Unknown';
      const img = c.querySelector('img');
      const fallback = c.querySelector('.bg-navy\\/90');
      return {
        heading,
        hasImg: !!img,
        naturalWidth: img ? img.naturalWidth : 0,
        hasFallback: !!fallback,
        src: img ? img.currentSrc.substring(0, 60) : '',
      };
    });
  });

  console.log(`  Found ${servicesCards.length} category cards on /services.`);
  for (const card of servicesCards) {
    totalCardsChecked++;
    if (!card.hasImg || card.naturalWidth === 0 || card.hasFallback) {
      console.error(`  ❌ [FAIL] /services card "${card.heading}": hasImg=${card.hasImg}, naturalWidth=${card.naturalWidth}, fallback=${card.hasFallback}`);
      failures++;
    }
  }
  if (servicesCards.length < 16) {
    console.error(`  ❌ [FAIL] Expected 16 category cards on /services, found ${servicesCards.length}`);
    failures++;
  } else {
    console.log(`  ✓ All 16 category cards on /services verified with real images.`);
  }

  // 2. Test Home page category grid
  console.log('\n2. Checking Home page category grid (/)...');
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await scrollPage();

  const homeCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/services/"]'));
    return cards.map((c) => {
      const heading = c.querySelector('h3')?.textContent?.trim() || 'Unknown';
      const img = c.querySelector('img');
      const fallback = c.querySelector('.bg-navy\\/90');
      return {
        heading,
        hasImg: !!img,
        naturalWidth: img ? img.naturalWidth : 0,
        hasFallback: !!fallback,
      };
    });
  });

  console.log(`  Found ${homeCards.length} category cards on Home page.`);
  for (const card of homeCards) {
    totalCardsChecked++;
    if (!card.hasImg || card.naturalWidth === 0 || card.hasFallback) {
      console.error(`  ❌ [FAIL] Home category card "${card.heading}": hasImg=${card.hasImg}, naturalWidth=${card.naturalWidth}`);
      failures++;
    }
  }
  if (homeCards.length < 6) {
    console.error(`  ❌ [FAIL] Expected at least 6 category cards on Home, found ${homeCards.length}`);
    failures++;
  } else {
    console.log(`  ✓ All ${homeCards.length} Home category cards verified with real images.`);
  }

  // 3. Test every one of the 16 category pages
  console.log('\n3. Checking each of the 16 category pages for cover hero and sub-issue cards...');
  for (const slug of CATEGORY_SLUGS) {
    const url = `${baseUrl}/services/${slug}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    // Wait for loading spinner to disappear and content to render
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 }).catch(() => {});
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.waitForTimeout(500);
    await scrollPage();

    const result = await page.evaluate(() => {
      const notFound = document.body.innerText.includes('Category Not Found');
      const heroImg = document.querySelector('section img');
      const heroNaturalWidth = heroImg ? heroImg.naturalWidth : 0;

      const subCards = Array.from(document.querySelectorAll('[data-testid="sub-issue-card"]')).map((card) => {
        const h3 = card.querySelector('h3');
        const img = card.querySelector('img');
        const fallback = card.querySelector('.bg-navy\\/90');
        return {
          name: h3 ? h3.textContent?.trim() : 'Unknown Sub-issue',
          hasImg: !!img,
          naturalWidth: img ? img.naturalWidth : 0,
          hasFallback: !!fallback,
        };
      });

      return {
        notFound,
        heroNaturalWidth,
        subCards,
      };
    });

    if (result.notFound) {
      console.error(`  ❌ [FAIL] /services/${slug} displayed "Category Not Found"!`);
      failures++;
      continue;
    }

    if (result.heroNaturalWidth === 0) {
      console.error(`  ❌ [FAIL] /services/${slug} cover hero image naturalWidth is 0!`);
      failures++;
    }

    let catSubFailures = 0;
    for (const sub of result.subCards) {
      totalCardsChecked++;
      if (!sub.hasImg || sub.naturalWidth === 0 || sub.hasFallback) {
        console.error(`  ❌ [FAIL] /services/${slug} sub-issue "${sub.name}": hasImg=${sub.hasImg}, naturalWidth=${sub.naturalWidth}, fallback=${sub.hasFallback}`);
        catSubFailures++;
        failures++;
      }
    }

    if (catSubFailures === 0) {
      console.log(`  ✓ /services/${slug}: Hero cover OK, all ${result.subCards.length} sub-issue cards loaded real images.`);
    }
  }

  await browser.close();
  await previewServer.close();

  console.log('\n=== TEST SUITE SUMMARY ===');
  console.log(`Total card instances verified: ${totalCardsChecked}`);
  if (failures > 0) {
    console.error(`❌ Playwright test failed with ${failures} failure(s).`);
    process.exit(1);
  } else {
    console.log(`✓ 0 failures. All images across /services, Home grid, and all 16 category pages loaded with naturalWidth > 0!`);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
