import { chromium } from 'playwright-core';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';
const docsDir = path.resolve(__dirname, '../../docs/civic-taxonomy/screenshots/k0');

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
  console.log('=== Capturing real browser screenshots for Phase K0 ===');

  const previewServer = await preview({
    root,
    preview: { port: 5178 },
    logLevel: 'error',
  });
  const address = previewServer.httpServer?.address();
  const baseUrl = typeof address === 'object' && address ? `http://localhost:${address.port}` : 'http://localhost:5178';

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();

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

  // 1. Services page
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${baseUrl}/services`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await scrollAndSettle();

    const filename = `services-page-${vp.name}.png`;
    const docPath = path.join(docsDir, filename);
    const artPath = path.join(artifactDir, filename);

    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(docPath, artPath);
    }
    console.log(`Saved screenshot: ${filename}`);
  }

  // 2. Category page: roads-transportation
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${baseUrl}/services/roads-transportation`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    await scrollAndSettle();

    const filename = `category-roads-${vp.name}.png`;
    const docPath = path.join(docsDir, filename);
    const artPath = path.join(artifactDir, filename);

    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(docPath, artPath);
    }
    console.log(`Saved screenshot: ${filename}`);
  }

  // 3. Home page category grid
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Scroll to the categories section
    await page.evaluate(() => {
      const section = Array.from(document.querySelectorAll('section')).find((s) =>
        s.textContent?.includes('Certified Civic Categories') || s.textContent?.includes('Explore Municipal Services')
      );
      if (section) section.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(800);

    const filename = `home-categories-${vp.name}.png`;
    const docPath = path.join(docsDir, filename);
    const artPath = path.join(artifactDir, filename);

    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(docPath, artPath);
    }
    console.log(`Saved screenshot: ${filename}`);
  }

  await browser.close();
  await previewServer.close();
  console.log('=== All K0 screenshots captured successfully ===');
}

capture().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
