import { chromium } from 'playwright-core';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { CIVIC_TAXONOMY } from '../../server/src/seed/civicTaxonomy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function runNavigationTests() {
  console.log('=== RUNNING PLAYWRIGHT NAVIGATION FLOW & CARD TESTS ===\n');
  let failures = 0;

  const previewServer = await preview({
    root,
    preview: { port: 5183 },
    logLevel: 'error',
  });
  const address = previewServer.httpServer?.address();
  const baseUrl = typeof address === 'object' && address ? `http://localhost:${address.port}` : 'http://localhost:5183';
  console.log(`Vite preview test server running at: ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('pageerror', (err) => console.error('[PAGE ERROR]', err.message));

  // Helper to scroll page and decode images
  async function scrollPage() {
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      for (const img of imgs) {
        img.scrollIntoView({ block: 'center' });
        if (!img.complete) {
          await new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            setTimeout(resolve, 400);
          });
        }
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
  }

  // Fallback route for all other /api requests (must be registered FIRST so specific routes registered later take precedence)
  await page.route('**/api/**', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  // Route /api categories
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

  // Auth mocking
  let mockAuthenticatedUser: any = null;
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

  // TEST 1: Services Page Cards (State-card feel + subtle sub-issue count pill)
  console.log('TEST 1: Verifying Services page cards styling...');
  await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await scrollPage();

  const servicesCardCheck = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/services/"]'));
    return cards.map((c) => {
      const heading = c.querySelector('h3')?.textContent?.trim() || '';
      const img = c.querySelector('img');
      const arrow = c.querySelector('svg');
      const pill = c.querySelector('span.rounded-full');
      return {
        heading,
        hasImg: !!img && img.naturalWidth > 0,
        hasArrow: !!arrow,
        pillText: pill?.textContent?.trim() || '',
      };
    });
  });

  if (servicesCardCheck.length !== 16) {
    console.error(`  ❌ [FAIL] Expected 16 cards on /services, found ${servicesCardCheck.length}`);
    failures++;
  } else {
    const allHaveArrow = servicesCardCheck.every((c) => c.hasArrow);
    const allHaveImg = servicesCardCheck.every((c) => c.hasImg);
    const allHavePill = servicesCardCheck.every((c) => c.pillText.includes('issue types'));
    if (!allHaveArrow) {
      console.error(`  ❌ [FAIL] Some Services cards missing round action arrow button.`);
      failures++;
    } else if (!allHaveImg) {
      console.error(`  ❌ [FAIL] Some Services cards have missing or broken images.`);
      failures++;
    } else if (!allHavePill) {
      console.error(`  ❌ [FAIL] Services cards should show subtle sub-issue count pill.`);
      failures++;
    } else {
      console.log(`  ✓ All 16 Services cards have clean 4:3 image, name, action arrow, and subtle count pill.`);
    }
  }

  // TEST 2: Home Page Category Grid (State-card feel, NO sub-issue count pill)
  console.log('\nTEST 2: Verifying Home page cards styling...');
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Scroll to category grid
  await page.evaluate(() => {
    const el = document.getElementById('categories') || document.querySelector('.grid');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await scrollPage();

  const homeCardCheck = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/services/"]'));
    return cards.map((c) => {
      const heading = c.querySelector('h3')?.textContent?.trim() || '';
      const img = c.querySelector('img');
      const arrow = c.querySelector('svg');
      const pill = c.querySelector('span.rounded-full');
      return {
        heading,
        hasImg: !!img && img.naturalWidth > 0,
        hasArrow: !!arrow,
        hasPill: !!pill && pill.textContent?.includes('issue types'),
      };
    });
  });

  if (homeCardCheck.length < 6) {
    console.error(`  ❌ [FAIL] Expected at least 6 category cards on Home page, found ${homeCardCheck.length}`);
    failures++;
  } else {
    const anyHasPill = homeCardCheck.some((c) => c.hasPill);
    const allHaveImg = homeCardCheck.every((c) => c.hasImg);
    if (anyHasPill) {
      console.error(`  ❌ [FAIL] Home category cards should NOT show the sub-issue count pill.`);
      failures++;
    } else if (!allHaveImg) {
      console.error(`  ❌ [FAIL] Some Home category cards have missing or broken images.`);
      failures++;
    } else {
      console.log(`  ✓ All ${homeCardCheck.length} Home cards have clean 4:3 image, name, and NO clutter/pill.`);
    }
  }

  // TEST 3: Authenticated user sub-issue card click -> direct to report form
  console.log('\nTEST 3: Authenticated user sub-issue card click...');
  mockAuthenticatedUser = {
    _id: 'citizen_123',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'User',
    phone: '+91 98765 43210',
  };

  // Perform clean UI login so AuthContext and localStorage are fully initialized
  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="email"]', 'priya@example.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => !window.location.pathname.includes('/login'), { timeout: 10000 });

  // Navigate to category page
  await page.goto(`${baseUrl}/services/roads-transportation`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="sub-issue-card"]', { timeout: 10000 });

  // Click sub-issue card for "road-potholes"
  const potholeCard = page.locator('a[href*="sub=road-potholes"]').first();
  await potholeCard.click();

  // Should navigate directly to report issue form WITHOUT going to login
  await page.waitForFunction(() => window.location.pathname.includes('/user/report-issue') && window.location.search.includes('sub=road-potholes'), { timeout: 10000 });
  await page.waitForSelector('#civic-category-select', { timeout: 10000 });

  // Wait until category select and subcategory select have populated values
  await page.waitForFunction(() => {
    const cat = (document.getElementById('civic-category-select') as any)?.value;
    const sub = (document.getElementById('civic-subcategory-select') as any)?.value;
    return Boolean(cat) && Boolean(sub);
  }, { timeout: 10000 });

  const selectedCategoryValue = await page.$eval('#civic-category-select', (el: any) => el.value);
  const selectedSubCategoryValue = await page.$eval('#civic-subcategory-select', (el: any) => el.value);

  const roadsCat = CIVIC_TAXONOMY.find((c) => c.slug === 'roads-transportation');
  const catMatches = selectedCategoryValue === `civic_cat_roads-transportation` || selectedCategoryValue === 'roads-transportation';
  const subMatches = selectedSubCategoryValue === 'road-potholes';

  if (!catMatches || !subMatches) {
    console.error(`  ❌ [FAIL] Dropdowns not pre-selected correctly: category=${selectedCategoryValue}, subCategory=${selectedSubCategoryValue}`);
    failures++;
  } else {
    console.log(`  ✓ Authenticated click navigated directly and pre-selected category "${roadsCat?.name}" and sub-issue "road-potholes".`);
  }

  // TEST 4: Unauthenticated user sub-issue card click -> login -> return to pre-selected report form
  console.log('\nTEST 4: Unauthenticated user click -> login -> report form return flow...');
  mockAuthenticatedUser = null;
  await page.evaluate(() => {
    localStorage.clear();
  });
  await context.clearCookies();

  // Navigate to category page as anonymous user
  await page.goto(`${baseUrl}/services/water-drainage`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=Sign In', { timeout: 10000 });
  await page.waitForSelector('[data-testid="sub-issue-card"]', { timeout: 10000 });

  const drainCard = page.locator('a[href*="sub=water-pipeline-leakage"]').first();
  await drainCard.click();

  // Anonymous user must be redirected to /login
  await page.waitForFunction(() => window.location.pathname.includes('/login'), { timeout: 10000 });
  console.log(`  ✓ Unauthenticated user redirected to login: ${page.url()}`);

  // Set mock authenticated user so login API response succeeds
  mockAuthenticatedUser = {
    _id: 'citizen_123',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'User',
    phone: '+91 98765 43210',
  };

  // Fill login credentials and submit
  await page.fill('input[type="email"]', 'priya@example.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');

  // Should return to the report form with category and sub query params
  await page.waitForFunction(() => window.location.pathname.includes('/user/report-issue') && window.location.search.includes('sub=water-pipeline-leakage'), { timeout: 10000 });
  await page.waitForSelector('#civic-category-select', { timeout: 10000 });

  // Wait until category select and subcategory select have populated values
  await page.waitForFunction(() => {
    const cat = (document.getElementById('civic-category-select') as any)?.value;
    const sub = (document.getElementById('civic-subcategory-select') as any)?.value;
    return Boolean(cat) && Boolean(sub);
  }, { timeout: 10000 });

  const postLoginCat = await page.$eval('#civic-category-select', (el: any) => el.value);
  const postLoginSub = await page.$eval('#civic-subcategory-select', (el: any) => el.value);

  const waterCat = CIVIC_TAXONOMY.find((c) => c.slug === 'water-drainage');
  const postLoginCatMatches = postLoginCat === `civic_cat_water-drainage` || postLoginCat === 'water-drainage';
  const postLoginSubMatches = postLoginSub === 'water-pipeline-leakage';

  if (!postLoginCatMatches || !postLoginSubMatches) {
    console.error(`  ❌ [FAIL] Post-login form did not restore pre-selected dropdowns: category=${postLoginCat}, subCategory=${postLoginSub}`);
    failures++;
  } else {
    console.log(`  ✓ Post-login redirect preserved returnTo URL and pre-selected category "${waterCat?.name}" and sub-issue "water-pipeline-leakage".`);
  }

  await browser.close();
  await previewServer.close();

  console.log('\n=== NAVIGATION FLOW TEST SUMMARY ===');
  if (failures > 0) {
    console.error(`❌ Test suite failed with ${failures} error(s).`);
    process.exit(1);
  } else {
    console.log(`✓ All 4 navigation and card tests passed cleanly with 0 failures.`);
  }
}

runNavigationTests().catch((err) => {
  console.error('Fatal navigation test error:', err);
  process.exit(1);
});
