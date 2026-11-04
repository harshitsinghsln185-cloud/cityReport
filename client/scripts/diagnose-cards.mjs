import { chromium } from 'playwright-core';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function runDiagnosis() {
  console.log('=== K0 DIAGNOSIS ON PRODUCTION PREVIEW (Vite preview) ===\n');

  const previewServer = await preview({
    root,
    preview: { port: 5175 },
    logLevel: 'error',
  });
  const address = previewServer.httpServer?.address();
  const baseUrl = typeof address === 'object' && address ? `http://localhost:${address.port}` : 'http://localhost:5175';
  console.log(`Vite preview running at: ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[BROWSER CONSOLE error] ${msg.text()}`);
    }
  });

  // 1. Diagnose /services
  console.log('\n--- 1. Testing /services page in production build ---');
  await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Scroll down to trigger lazy loading of all cards
  await page.evaluate(async () => {
    const scrollStep = 400;
    for (let y = 0; y < document.body.scrollHeight; y += scrollStep) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2000);

  const servicesCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/services/"], a[href*="/user/report-issue"]'));
    return cards.map((card, idx) => {
      const heading = card.querySelector('h3')?.textContent?.trim() || `Card #${idx}`;
      const img = card.querySelector('img');
      const picture = card.querySelector('picture');
      const fallback = card.querySelector('.bg-navy\\/90');
      return {
        heading,
        href: card.getAttribute('href'),
        hasPicture: !!picture,
        hasImg: !!img,
        currentSrc: img ? img.currentSrc.substring(0, 80) : null,
        naturalWidth: img ? img.naturalWidth : 0,
        naturalHeight: img ? img.naturalHeight : 0,
        hasFallbackIcon: !!fallback,
      };
    });
  });

  console.log(`Found ${servicesCards.length} cards on /services:`);
  let loadedCardsCount = 0;
  for (const c of servicesCards) {
    if (c.hasImg && c.naturalWidth > 0) loadedCardsCount++;
    console.log(`  "${c.heading}": img=${c.hasImg}, naturalWidth=${c.naturalWidth}, fallback=${c.hasFallbackIcon}, src=${c.currentSrc || 'NONE'}`);
  }
  console.log(`Summary: ${loadedCardsCount}/${servicesCards.length} cards loaded real images with naturalWidth > 0.`);

  // 2. Diagnose Home page (/)
  console.log('\n--- 2. Testing Home page (/) in production build ---');
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Scroll down to services section
  await page.evaluate(async () => {
    window.scrollTo(0, 1400);
    await new Promise((r) => setTimeout(r, 1500));
  });

  const homeCards = await page.evaluate(() => {
    // Look for service cards
    const cards = Array.from(document.querySelectorAll('a[href*="/services/"]'));
    return cards.map((card, idx) => {
      const heading = card.querySelector('h3')?.textContent?.trim() || `Card #${idx}`;
      const img = card.querySelector('img');
      const fallback = card.querySelector('.bg-navy\\/90');
      return {
        heading,
        href: card.getAttribute('href'),
        hasImg: !!img,
        naturalWidth: img ? img.naturalWidth : 0,
        hasFallbackIcon: !!fallback,
        currentSrc: img ? img.currentSrc.substring(0, 80) : null,
      };
    });
  });

  console.log(`Found ${homeCards.length} category cards on Home page:`);
  for (const c of homeCards) {
    console.log(`  Home "${c.heading}": img=${c.hasImg}, naturalWidth=${c.naturalWidth}, fallback=${c.hasFallbackIcon}, src=${c.currentSrc || 'NONE'}`);
  }

  // 3. Diagnose Category detail (/services/roads-transportation)
  console.log('\n--- 3. Testing Category detail (/services/roads-transportation) in production build ---');
  await page.goto(`${baseUrl}/services/roads-transportation`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Scroll down through sub-issues
  await page.evaluate(async () => {
    const scrollStep = 500;
    for (let y = 0; y < document.body.scrollHeight; y += scrollStep) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2000);

  const catPage = await page.evaluate(() => {
    const title = document.querySelector('h1')?.textContent?.trim() || '';
    const notFound = document.body.innerText.includes('Category Not Found');
    const heroImg = document.querySelector('section img');

    const subCardEls = Array.from(document.querySelectorAll('.grid h3')).map(h3 => {
      const card = h3.closest('.group') || h3.parentElement?.parentElement;
      const img = card?.querySelector('img');
      const fallback = card?.querySelector('.bg-navy\\/90');
      return {
        name: h3.textContent?.trim(),
        hasImg: !!img,
        naturalWidth: img?.naturalWidth || 0,
        currentSrc: img ? img.currentSrc.substring(0, 80) : null,
        hasFallback: !!fallback,
      };
    });

    return {
      title,
      notFound,
      heroImgSrc: heroImg?.getAttribute('src')?.substring(0, 80) || null,
      heroNaturalWidth: heroImg?.naturalWidth || 0,
      subIssuesCount: subCardEls.length,
      sampleSubIssues: subCardEls.slice(0, 6),
      allLoadedCount: subCardEls.filter(s => s.hasImg && s.naturalWidth > 0).length,
    };
  });

  console.log('Category page inspection result:');
  console.log(JSON.stringify(catPage, null, 2));

  await browser.close();
  await previewServer.close();
  console.log('\n=== K0 PRODUCTION PREVIEW DIAGNOSIS FINISHED ===');
}

runDiagnosis().catch((err) => {
  console.error('Diagnosis error:', err);
  process.exit(1);
});
