import { chromium } from 'playwright-core';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';
const docsDir = path.resolve(__dirname, '../../docs/civic-taxonomy/screenshots/m7');

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

const targets = [
  { slug: 'commercial-areas', path: '/services/commercial-areas' },
  { slug: 'public-property', path: '/services/public-property' }
];

async function capture() {
  console.log('=== Capturing responsive screenshots for Batch M7 (Commercial Areas & Public Property) ===');

  const previewServer = await preview({
    root,
    preview: { port: 5180 },
    logLevel: 'error',
  });
  const address = previewServer.httpServer?.address();
  const baseUrl = typeof address === 'object' && address ? `http://localhost:${address.port}` : 'http://localhost:5180';

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();

  for (const target of targets) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const targetUrl = `${baseUrl}${target.path}`;
      console.log(`Navigating to ${targetUrl} at ${vp.name}...`);
      await page.goto(targetUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const filename = `subissues-${target.slug}-${vp.name}.png`;
      const docPath = path.join(docsDir, filename);
      const artPath = path.join(artifactDir, filename);

      await page.screenshot({ path: docPath, fullPage: true });
      await page.screenshot({ path: artPath, fullPage: true });

      console.log(`✓ Saved ${filename}`);
    }
  }

  // Also capture /services at 1280px to demonstrate 100% full coverage
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${baseUrl}/services`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(docsDir, 'services-all-categories-1280px.png'), fullPage: true });
  await page.screenshot({ path: path.join(artifactDir, 'services-all-categories-1280px.png'), fullPage: true });
  console.log(`✓ Saved services-all-categories-1280px.png`);

  await browser.close();
  await previewServer.httpServer?.close();
  console.log('Screenshot capture complete!');
}

capture().catch(err => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
