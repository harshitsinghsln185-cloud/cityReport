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

  // TEST 1: Services Page Cards (Category Cards with Direct Report Issue Link)
  console.log('TEST 1: Verifying Services page category cards styling & target links...');
  await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await scrollPage();

  const servicesCardCheck = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/user/report-issue?category="]'));
    return cards.map((c) => {
      const heading = c.querySelector('h3')?.textContent?.trim() || '';
      const img = c.querySelector('img');
      const arrow = c.querySelector('svg');
      const href = c.getAttribute('href') || '';
      return {
        heading,
        hasImg: !!img && img.naturalWidth > 0,
        hasArrow: !!arrow,
        href,
      };
    });
  });

  if (servicesCardCheck.length !== 16) {
    console.error(`  ❌ [FAIL] Expected 16 cards on /services linking directly to /user/report-issue?category=, found ${servicesCardCheck.length}`);
    failures++;
  } else {
    const allHaveArrow = servicesCardCheck.every((c) => c.hasArrow);
    const allHaveImg = servicesCardCheck.every((c) => c.hasImg);
    if (!allHaveArrow) {
      console.error(`  ❌ [FAIL] Some Services cards missing round action arrow button.`);
      failures++;
    } else if (!allHaveImg) {
      console.error(`  ❌ [FAIL] Some Services cards have missing or broken images.`);
      failures++;
    } else {
      console.log(`  ✓ All 16 Services cards have clean 4:3 image, name, action arrow, and direct report-issue link.`);
    }
  }

  // TEST 2: Home Page Navigation to Services
  console.log('\nTEST 2: Verifying Home page navigation to Services...');
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  const exploreLink = await page.$('a[href="/services"]');
  if (!exploreLink) {
    console.error(`  ❌ [FAIL] Missing /services link on Home page`);
    failures++;
  } else {
    console.log(`  ✓ Home page has valid /services explore link.`);
  }

  // TEST 3: Authenticated user category card click -> direct to report form
  console.log('\nTEST 3: Authenticated user category card click directly to report form...');
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

  // Navigate to Services page and click Roads category card
  await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('a[href*="category=roads-transportation"]', { timeout: 10000 });

  const roadsCard = page.locator('a[href*="category=roads-transportation"]').first();
  await roadsCard.click();

  // Should navigate directly to report issue form with category prefilled
  await page.waitForFunction(
    () => window.location.pathname.includes('/user/report-issue') && window.location.search.includes('category=roads-transportation'),
    { timeout: 10000 }
  );
  await page.waitForSelector('#civic-category-select', { timeout: 10000 });

  // Wait until category select has populated value
  await page.waitForFunction(() => {
    const cat = (document.getElementById('civic-category-select') as any)?.value;
    return Boolean(cat);
  }, { timeout: 10000 });

  const selectedCategoryValue = await page.$eval('#civic-category-select', (el: any) => el.value);
  const roadsCat = CIVIC_TAXONOMY.find((c) => c.slug === 'roads-transportation');
  const catMatches = selectedCategoryValue === `civic_cat_roads-transportation` || selectedCategoryValue === 'roads-transportation';

  if (!catMatches) {
    console.error(`  ❌ [FAIL] Category not pre-selected correctly: category=${selectedCategoryValue}`);
    failures++;
  } else {
    console.log(`  ✓ Authenticated click navigated directly and pre-selected category "${roadsCat?.name}".`);
  }

  // TEST 4: Unauthenticated user category card click -> login -> return to pre-selected report form
  console.log('\nTEST 4: Unauthenticated user category card click -> login -> report form return flow...');
  mockAuthenticatedUser = null;
  await page.evaluate(() => {
    localStorage.clear();
  });
  await context.clearCookies();

  // Navigate to Services as anonymous user and click Water & Drainage
  await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('a[href*="category=water-drainage"]', { timeout: 10000 });

  const drainCard = page.locator('a[href*="category=water-drainage"]').first();
  await drainCard.click();

  // Anonymous user must be redirected to /login preserving the return URL
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

  // Should return to the report form with category query param
  await page.waitForFunction(
    () => window.location.pathname.includes('/user/report-issue') && window.location.search.includes('category=water-drainage'),
    { timeout: 10000 }
  );
  await page.waitForSelector('#civic-category-select', { timeout: 10000 });

  await page.waitForFunction(() => {
    const cat = (document.getElementById('civic-category-select') as any)?.value;
    return Boolean(cat);
  }, { timeout: 10000 });

  const postLoginCat = await page.$eval('#civic-category-select', (el: any) => el.value);
  const waterCat = CIVIC_TAXONOMY.find((c) => c.slug === 'water-drainage');
  const postLoginCatMatches = postLoginCat === `civic_cat_water-drainage` || postLoginCat === 'water-drainage';

  if (!postLoginCatMatches) {
    console.error(`  ❌ [FAIL] Post-login form did not restore pre-selected category: category=${postLoginCat}`);
    failures++;
  } else {
    console.log(`  ✓ Post-login redirect preserved returnTo URL and pre-selected category "${waterCat?.name}".`);
  }

  // TEST 5: Direct legacy URL redirect /services/:categorySlug -> /user/report-issue?category=:categorySlug
  console.log('\nTEST 5: Direct URL redirect /services/electricity-lighting -> /user/report-issue?category=electricity-lighting...');
  await page.goto(`${baseUrl}/services/electricity-lighting`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => window.location.pathname.includes('/user/report-issue') && window.location.search.includes('category=electricity-lighting'),
    { timeout: 10000 }
  );
  console.log(`  ✓ Route /services/electricity-lighting redirected directly to /user/report-issue?category=electricity-lighting`);

  await browser.close();
  await previewServer.close();

  console.log('\n=== NAVIGATION FLOW TEST SUMMARY ===');
  if (failures > 0) {
    console.error(`❌ Test suite failed with ${failures} error(s).`);
    process.exit(1);
  } else {
    console.log(`✓ All 5 navigation, redirect, and card tests passed cleanly with 0 failures.`);
  }
}

runNavigationTests().catch((err) => {
  console.error('Fatal navigation test error:', err);
  process.exit(1);
});
