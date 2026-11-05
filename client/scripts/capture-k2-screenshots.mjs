import { chromium } from 'playwright-core';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { CIVIC_TAXONOMY } from '../../server/src/seed/civicTaxonomy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';
const docsDir = path.resolve(__dirname, '../../docs/civic-taxonomy/screenshots/k2');

fs.mkdirSync(docsDir, { recursive: true });
if (fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const viewports = [
  { name: '360px', width: 360, height: 750 },
  { name: '768px', width: 768, height: 950 },
  { name: '1280px', width: 1280, height: 900 },
  { name: '1536px', width: 1536, height: 950 },
];

async function capture() {
  console.log('=== Capturing real browser screenshots for Phase K2 (Card Polish & Deep Link Pre-selection) ===');

  const previewServer = await preview({
    root,
    preview: { port: 5184 },
    logLevel: 'error',
  });
  const address = previewServer.httpServer?.address();
  const baseUrl = typeof address === 'object' && address ? `http://localhost:${address.port}` : 'http://localhost:5184';

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();

  // Mock categories API
  await page.route('**/api/**', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

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
          body: JSON.stringify({ success: true, data: { ...found, _id: `civic_cat_${found.slug}` } }),
        });
      }
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: CIVIC_TAXONOMY.map((c) => ({ ...c, _id: `civic_cat_${c.slug}` })),
      }),
    });
  });

  await page.route('**/api/categories', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: CIVIC_TAXONOMY.map((c) => ({ ...c, _id: `civic_cat_${c.slug}` })),
      }),
    });
  });

  await page.route('**/api/auth/me', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          user: {
            _id: 'citizen_123',
            name: 'Priya Sharma',
            email: 'priya@example.com',
            role: 'User',
            phone: '+91 98765 43210',
          },
        },
      }),
    });
  });

  await page.route('**/api/issues/estimate-quote', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          baseFeePaise: 60000,
          adjustedFeePaise: 60000,
          advancePaise: 30000,
          balancePaise: 30000,
          estimatedHours: 48,
        },
      }),
    });
  });

  async function scrollAndSettle() {
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      for (const img of imgs) {
        img.scrollIntoView({ block: 'center' });
        if (!img.complete) {
          await new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            setTimeout(resolve, 300);
          });
        }
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
  }

  // 1. Services page screenshots (State-card feel + subtle pills)
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await scrollAndSettle();

    const filename = `k2-services-${vp.name}.png`;
    const docPath = path.join(docsDir, filename);
    const artPath = path.join(artifactDir, filename);

    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(docPath, artPath);
    }
    console.log(`Saved screenshot: ${filename}`);

    if (vp.name === '1280px') {
      const fullFilename = `k2-services-full-1280px.png`;
      const fullDocPath = path.join(docsDir, fullFilename);
      const fullArtPath = path.join(artifactDir, fullFilename);
      await page.screenshot({ path: fullDocPath, fullPage: true });
      if (fs.existsSync(artifactDir)) {
        fs.copyFileSync(fullDocPath, fullArtPath);
      }
      console.log(`Saved screenshot: ${fullFilename}`);
    }
  }

  // 2. Home page category grid screenshots
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    // Scroll to category grid
    await page.evaluate(() => {
      const el = document.getElementById('categories') || document.querySelector('.grid');
      if (el) el.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(500);
    await scrollAndSettle();

    const filename = `k2-home-grid-${vp.name}.png`;
    const docPath = path.join(docsDir, filename);
    const artPath = path.join(artifactDir, filename);

    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(docPath, artPath);
    }
    console.log(`Saved screenshot: ${filename}`);
  }

  // 3. User Report Form pre-selected screenshot
  await page.setViewportSize({ width: 1280, height: 950 });
  await page.goto(`${baseUrl}/user/report-issue?category=roads-transportation&sub=road-potholes`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#civic-category-select', { timeout: 10000 });
  await page.waitForTimeout(800);

  const reportFilename = `k2-report-form-preselected-1280px.png`;
  const reportDocPath = path.join(docsDir, reportFilename);
  const reportArtPath = path.join(artifactDir, reportFilename);
  await page.screenshot({ path: reportDocPath, fullPage: false });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(reportDocPath, reportArtPath);
  }
  console.log(`Saved screenshot: ${reportFilename}`);

  await browser.close();
  await previewServer.close();
  console.log('\nAll Phase K2 responsive screenshots captured successfully.');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});

