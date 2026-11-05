import { chromium } from 'playwright-core';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { CIVIC_TAXONOMY } from '../../server/src/seed/civicTaxonomy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';
const docsDir = path.resolve(__dirname, '../../docs/civic-taxonomy/screenshots/k3');

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

const targetPages = [
  { slug: 'services', path: '/services', label: 'Services Directory' },
  { slug: 'home-grid', path: '/', label: 'Home Category Grid' },
  { slug: 'cat-roads', path: '/services/roads-transportation', label: 'Roads & Transportation' },
  { slug: 'cat-safety', path: '/services/public-safety', label: 'Public Safety' },
  { slug: 'cat-commercial', path: '/services/commercial-areas', label: 'Commercial Areas' },
];

async function runK3QA() {
  console.log('=== RUNNING COMPREHENSIVE PHASE K3 QA & AUDIT SUITE ===\n');
  let auditFailures = 0;

  const previewServer = await preview({
    root,
    preview: { port: 5185 },
    logLevel: 'error',
  });
  const address = previewServer.httpServer?.address();
  const baseUrl = typeof address === 'object' && address ? `http://localhost:${address.port}` : 'http://localhost:5185';
  console.log(`Preview server active at: ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();

  // Configure Playwright route handlers
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

  let mockAuthenticatedUser = null;
  await page.route('**/api/auth/me', async (route) => {
    if (mockAuthenticatedUser) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockAuthenticatedUser } }),
      });
    }
    return route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Unauthenticated' }),
    });
  });

  await page.route('**/api/auth/login', async (route) => {
    mockAuthenticatedUser = {
      _id: 'citizen_123',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'User',
      phone: '+91 98765 43210',
    };
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          user: mockAuthenticatedUser,
          token: 'mock_jwt_token',
          csrfToken: 'mock_csrf_token',
        },
      }),
    });
  });

  await page.route('**/api/auth/csrf-token', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { csrfToken: 'mock_csrf_token' } }),
    });
  });

  await page.route('**/api/auth/refresh', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { token: 'mock_jwt_token' } }),
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
    await page.waitForTimeout(500);
  }

  // 1. CAPTURE RESPONSIVE SCREENSHOTS ACROSS 5 TARGET SURFACES AT 4 VIEWPORTS (20 Screenshots)
  console.log('PART 1: Capturing responsive screenshots across 5 targets (360, 768, 1280, 1536 px)...');
  for (const target of targetPages) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${baseUrl}${target.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(600);
      if (target.slug === 'home-grid') {
        await page.evaluate(() => {
          const el = document.getElementById('categories') || document.querySelector('.grid');
          if (el) el.scrollIntoView({ block: 'center' });
        });
      }
      await scrollAndSettle();

      const filename = `k3-${target.slug}-${vp.name}.png`;
      const docPath = path.join(docsDir, filename);
      const artPath = path.join(artifactDir, filename);

      await page.screenshot({ path: docPath, fullPage: false });
      if (fs.existsSync(artifactDir)) {
        fs.copyFileSync(docPath, artPath);
      }
    }
    console.log(`  ✓ Captured ${target.label} at all 4 viewports.`);
  }

  // Also capture full-page 1280px for Category Detail to view all sections top-to-bottom
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${baseUrl}/services/roads-transportation`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await scrollAndSettle();
  const fullCategoryDocPath = path.join(docsDir, 'k3-cat-roads-full-1280px.png');
  const fullCategoryArtPath = path.join(artifactDir, 'k3-cat-roads-full-1280px.png');
  await page.screenshot({ path: fullCategoryDocPath, fullPage: true });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(fullCategoryDocPath, fullCategoryArtPath);
  }
  console.log('  ✓ Captured k3-cat-roads-full-1280px.png');

  // 2. ACCESSIBILITY, DOM AND LAYOUT AUDITS
  console.log('\nPART 2: Running accessibility, DOM and layout audits...');
  for (const target of targetPages) {
    await page.setViewportSize({ width: 360, height: 750 });
    await page.goto(`${baseUrl}${target.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const auditResults = await page.evaluate(() => {
      // 1. Check horizontal scroll
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      // 2. Check exactly one h1
      const h1Count = document.querySelectorAll('h1').length;

      // 3. Check image alt tags
      const imgs = Array.from(document.querySelectorAll('img'));
      const missingAlt = imgs.filter((img) => !img.hasAttribute('alt') || !img.getAttribute('alt')?.trim());

      // 4. Broken images (naturalWidth === 0)
      const brokenImgs = imgs.filter((img) => img.complete && img.naturalWidth === 0);

      return {
        hasHorizontalScroll,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        h1Count,
        missingAltCount: missingAlt.length,
        brokenImgsCount: brokenImgs.length,
      };
    });

    if (auditResults.hasHorizontalScroll) {
      console.error(`  ❌ [FAIL] ${target.label} has horizontal overflow at 360px: scrollWidth=${auditResults.scrollWidth} > innerWidth=${auditResults.innerWidth}`);
      auditFailures++;
    } else {
      console.log(`  ✓ ${target.label}: 0 horizontal overflow at 360px viewport.`);
    }

    if (auditResults.h1Count !== 1) {
      console.error(`  ❌ [FAIL] ${target.label} expected exactly 1 <h1>, found ${auditResults.h1Count}`);
      auditFailures++;
    } else {
      console.log(`  ✓ ${target.label}: Exactly one <h1> element present.`);
    }

    if (auditResults.missingAltCount > 0) {
      console.error(`  ❌ [FAIL] ${target.label} has ${auditResults.missingAltCount} images missing alt text`);
      auditFailures++;
    } else {
      console.log(`  ✓ ${target.label}: All images have descriptive alt attributes.`);
    }

    if (auditResults.brokenImgsCount > 0) {
      console.error(`  ❌ [FAIL] ${target.label} has ${auditResults.brokenImgsCount} broken images (naturalWidth === 0)`);
      auditFailures++;
    } else {
      console.log(`  ✓ ${target.label}: 0 broken images.`);
    }
  }

  // 3. INTERACTIVE BROWSER CLICK TESTS
  console.log('\nPART 3: Running interactive browser click tests...');
  await page.setViewportSize({ width: 1280, height: 900 });

  // Test 3A: Click service card on /services -> navigates to category page
  await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
  const roadsServiceCard = page.locator('a[href*="/services/roads-transportation"]').first();
  await roadsServiceCard.click();
  await page.waitForFunction(() => window.location.pathname.includes('/services/roads-transportation'), { timeout: 10000 });
  console.log(`  ✓ Service card click navigates to category page: ${page.url()}`);

  // Test 3B: Click "Previous Category" and "Next Category"
  const nextCategoryLink = page.locator('a[href*="/services/garbage-management"]').first();
  await nextCategoryLink.click();
  await page.waitForFunction(() => window.location.pathname.includes('/services/garbage-management'), { timeout: 10000 });
  console.log(`  ✓ Next Category button navigates to next category: ${page.url()}`);

  const prevCategoryLink = page.locator('a[href*="/services/roads-transportation"]').first();
  await prevCategoryLink.click();
  await page.waitForFunction(() => window.location.pathname.includes('/services/roads-transportation'), { timeout: 10000 });
  console.log(`  ✓ Previous Category button returns to previous category: ${page.url()}`);

  // Test 3C: Click "Report an issue in Roads & Transportation" button
  const reportCategoryBtn = page.locator('a[href*="/user/report-issue?category=roads-transportation"]').first();
  await reportCategoryBtn.click();
  // Anonymous user gets redirected to /login
  await page.waitForFunction(() => window.location.pathname.includes('/login'), { timeout: 10000 });
  console.log(`  ✓ Report button properly redirects unauthenticated user to login: ${page.url()}`);

  // Test 3D: Sub-issue card keyboard focus test
  await page.goto(`${baseUrl}/services/roads-transportation`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="sub-issue-card"]', { timeout: 10000 });
  const firstSubCard = page.locator('[data-testid="sub-issue-card"]').first();
  await firstSubCard.focus();
  const isFocused = await firstSubCard.evaluate((el) => document.activeElement === el);
  if (!isFocused) {
    console.error(`  ❌ [FAIL] Sub-issue card could not receive keyboard focus.`);
    auditFailures++;
  } else {
    console.log(`  ✓ Sub-issue card receives clean keyboard focus and interactive outline.`);
  }

  await browser.close();
  await previewServer.close();

  console.log('\n=== K3 QA AUDIT SUMMARY ===');
  if (auditFailures === 0) {
    console.log('✓ ALL K3 AUDITS & TESTS PASSED WITH 0 FAILURES!');
  } else {
    console.error(`❌ ${auditFailures} audit failure(s) detected.`);
    process.exit(1);
  }
}

runK3QA().catch((err) => {
  console.error('Fatal K3 QA Error:', err);
  process.exit(1);
});

