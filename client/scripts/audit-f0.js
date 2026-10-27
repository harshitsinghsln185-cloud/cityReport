import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src');

function getAllFiles(dir, exts) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

const tsxFiles = getAllFiles(SRC_DIR, ['.tsx']);
console.log(`Found ${tsxFiles.length} .tsx files in client/src`);

const hexColorRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const linkButtonRegex = /<Link[^>]*>\s*<Button/g;
const textSmallRegex = /text-\[(10|11)px\]/g;
const fontHeadingsRegex = /<(h[1-6])[^>]*className=["'][^"']*(font-mono|font-black|font-bold)[^"']*["']/g;
const claimsRegex = /(12,?[0-9]{3}|99\.4|36\s*States|escrow|municipal\s+inspector|24-48h|Background\s+Screened|thousands)/gi;

const findings = {
  hexColors: {},
  linkButtons: [],
  smallText: [],
  headingFonts: [],
  unprovenClaims: []
};

for (const file of tsxFiles) {
  const relPath = path.relative(path.resolve(__dirname, '../../'), file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // 1. Hex colors
    const hexMatches = line.match(hexColorRegex);
    if (hexMatches) {
      hexMatches.forEach(hex => {
        const lower = hex.toLowerCase();
        if (!findings.hexColors[lower]) findings.hexColors[lower] = [];
        findings.hexColors[lower].push(`${relPath}:${lineNum}`);
      });
    }

    // 2. Small text (10px, 11px)
    if (textSmallRegex.test(line)) {
      findings.smallText.push({ file: relPath, line: lineNum, text: line.trim() });
    }

    // 3. Claims
    let claimMatch;
    claimsRegex.lastIndex = 0;
    while ((claimMatch = claimsRegex.exec(line)) !== null) {
      findings.unprovenClaims.push({
        file: relPath,
        line: lineNum,
        match: claimMatch[0],
        text: line.trim()
      });
    }
  });

  // 4. Link wrapping Button
  let linkMatch;
  linkButtonRegex.lastIndex = 0;
  while ((linkMatch = linkButtonRegex.exec(content)) !== null) {
    const upToMatch = content.substring(0, linkMatch.index);
    const lineNum = upToMatch.split('\n').length;
    findings.linkButtons.push({ file: relPath, line: lineNum });
  }

  // 5. Headings with font-bold, font-black, font-mono
  let headingMatch;
  fontHeadingsRegex.lastIndex = 0;
  while ((headingMatch = fontHeadingsRegex.exec(content)) !== null) {
    const upToMatch = content.substring(0, headingMatch.index);
    const lineNum = upToMatch.split('\n').length;
    findings.headingFonts.push({
      file: relPath,
      line: lineNum,
      tag: headingMatch[1],
      fontClass: headingMatch[2]
    });
  }
}

console.log('--- AUDIT SUMMARY ---');
console.log(`Unique Hex Colors: ${Object.keys(findings.hexColors).length}`);
console.log(`Total Hex Occurrences: ${Object.values(findings.hexColors).reduce((a, b) => a + b.length, 0)}`);
console.log(`Link wrapping Button occurrences: ${findings.linkButtons.length}`);
console.log(`text-[10px]/text-[11px] occurrences: ${findings.smallText.length}`);
console.log(`Heading font-bold/font-black/font-mono occurrences: ${findings.headingFonts.length}`);
console.log(`Claims / unproven numbers occurrences: ${findings.unprovenClaims.length}`);

fs.writeFileSync(
  path.resolve(__dirname, 'audit-results.json'),
  JSON.stringify(findings, null, 2)
);
console.log('Saved audit results to client/scripts/audit-results.json');
