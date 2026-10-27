#!/usr/bin/env node
/**
 * Dynamic Sitemap & Robots Generator
 * Generates sitemap.xml and robots.txt based on domain configured in .env (VITE_SITE_URL).
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 *   node scripts/generate-sitemap.js --domain https://customdomain.com
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.resolve(__dirname, '..');

// Helper to parse simple .env files without extra external dependencies
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = {};
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      // Remove surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  }
  return result;
}

// 1. Resolve site domain URL
function resolveSiteUrl() {
  // Check CLI arguments first (--domain https://...)
  const args = process.argv.slice(2);
  const domainArgIdx = args.indexOf('--domain');
  if (domainArgIdx !== -1 && args[domainArgIdx + 1]) {
    return args[domainArgIdx + 1].trim();
  }

  // Check process.env (e.g. injected in CI/CD)
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.trim();
  if (process.env.SITE_URL) return process.env.SITE_URL.trim();

  // Check client/.env.local, client/.env, or parent .env
  const candidateEnvFiles = [
    path.join(clientRoot, '.env.production'),
    path.join(clientRoot, '.env.local'),
    path.join(clientRoot, '.env'),
    path.resolve(clientRoot, '..', '.env'),
  ];

  for (const envFile of candidateEnvFiles) {
    const envVars = loadEnvFile(envFile);
    if (envVars.VITE_SITE_URL) return envVars.VITE_SITE_URL.trim();
    if (envVars.SITE_URL) return envVars.SITE_URL.trim();
  }

  return 'http://localhost:5173';
}

const rawDomain = resolveSiteUrl();
// Remove trailing slashes
const domain = rawDomain.replace(/\/+$/, '');
const today = new Date().toISOString().split('T')[0];

console.log(`[sitemap] Building sitemap for domain: ${domain}`);
console.log(`[sitemap] Generated on: ${today}`);

// 2. Core Public Routes
const coreRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/states', priority: '0.9', changefreq: 'daily' },
  { path: '/services', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/track', priority: '0.8', changefreq: 'daily' },
  { path: '/query', priority: '0.6', changefreq: 'monthly' },
  { path: '/login', priority: '0.5', changefreq: 'monthly' },
  { path: '/register', priority: '0.5', changefreq: 'monthly' },
  { path: '/register-resolver', priority: '0.6', changefreq: 'monthly' },
];

// 3. Extract 36 Indian States & UTs Slugs
let stateSlugs = [];
const statesDataPath = path.join(clientRoot, 'src', 'data', 'statesData.ts');

if (fs.existsSync(statesDataPath)) {
  try {
    const fileContent = fs.readFileSync(statesDataPath, 'utf-8');
    const matches = [...fileContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
    stateSlugs = [...new Set(matches.map((m) => m[1]))];
    console.log(`[sitemap] Extracted ${stateSlugs.length} state slugs from statesData.ts`);
  } catch (err) {
    console.warn(`[sitemap] Failed reading statesData.ts, falling back to static list. Error:`, err.message);
  }
}

// Fallback list of 36 Indian states & union territories if extraction fails
if (stateSlugs.length === 0) {
  stateSlugs = [
    'karnataka',
    'tamil-nadu',
    'telangana',
    'andhra-pradesh',
    'kerala',
    'maharashtra',
    'gujarat',
    'goa',
    'uttar-pradesh',
    'rajasthan',
    'punjab',
    'haryana',
    'himachal-pradesh',
    'uttarakhand',
    'west-bengal',
    'bihar',
    'odisha',
    'jharkhand',
    'madhya-pradesh',
    'chhattisgarh',
    'assam',
    'arunachal-pradesh',
    'manipur',
    'meghalaya',
    'mizoram',
    'nagaland',
    'tripura',
    'sikkim',
    'delhi',
    'chandigarh',
    'jammu-and-kashmir',
    'ladakh',
    'puducherry',
    'andaman-and-nicobar-islands',
    'dadra-and-nagar-haveli-and-daman-and-diu',
    'lakshadweep',
  ];
}

// 4. Construct XML Document
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

xml += `  <!-- Core Public Portals -->\n`;
for (const route of coreRoutes) {
  xml += `  <url>\n`;
  xml += `    <loc>${domain}${route.path}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
  xml += `    <priority>${route.priority}</priority>\n`;
  xml += `  </url>\n`;
}

xml += `\n  <!-- 36 States & Union Territories of India -->\n`;
for (const slug of stateSlugs) {
  xml += `  <url>\n`;
  xml += `    <loc>${domain}/states/${slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.85</priority>\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

// 5. Save to client/public/sitemap.xml
const publicDir = path.join(clientRoot, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapDest = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapDest, xml, 'utf-8');
console.log(`[sitemap] Successfully wrote ${coreRoutes.length + stateSlugs.length} URLs to: ${sitemapDest}`);

// 6. Synchronize client/public/robots.txt
const robotsDest = path.join(publicDir, 'robots.txt');
const robotsContent = `# Crowd Report Platform Robots Policy
User-agent: *
Allow: /
Allow: /states
Allow: /states/
Allow: /services
Allow: /about
Allow: /track
Allow: /query
Disallow: /admin/
Disallow: /resolver/
Disallow: /user/
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`;

fs.writeFileSync(robotsDest, robotsContent, 'utf-8');
console.log(`[sitemap] Successfully updated robots.txt at: ${robotsDest}`);
