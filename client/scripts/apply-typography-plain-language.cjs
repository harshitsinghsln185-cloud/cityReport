const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Text sizes < 12px -> text-xs
  content = content.replace(/\btext-\[(?:10|11|9|8)px\]/g, 'text-xs');

  // 2. Eliminate font-black on headings (replace with font-bold)
  content = content.replace(/\bfont-heading\s+font-black\b/g, 'font-heading font-bold');
  content = content.replace(/\bfont-black\s+font-heading\b/g, 'font-bold font-heading');

  // 3. Plain language copy replacements
  content = content.replace(/Drainage Remediation/g, 'Drainage Repair');
  content = content.replace(/Pipe Rupture Remediation/g, 'Pipe Rupture Repair');
  content = content.replace(/Accidental Roadside Waste Remediation/g, 'Accidental Roadside Waste Cleanup');
  content = content.replace(/accidental roadside waste accumulation/g, 'roadside waste accumulation');
  content = content.replace(/Remediation Tasks/g, 'Repair Tasks');
  content = content.replace(/Active Remediation/g, 'Active Repair');
  content = content.replace(/Remediation Complete/g, 'Repair Complete');
  content = content.replace(/Contractor Remediation/g, 'Contractor Repair');
  content = content.replace(/contractor remediation/g, 'contractor repair');
  content = content.replace(/on-site remediation/g, 'on-site repair');
  content = content.replace(/civic remediation/g, 'civic repair');
  content = content.replace(/Civic Remediation/g, 'Civic Repair');
  content = content.replace(/public works remediation/g, 'public works repair');
  content = content.replace(/remediation focus areas/g, 'repair focus areas');
  content = content.replace(/under remediation/g, 'under repair');
  content = content.replace(/Remediation Task Rework/g, 'Repair Task Rework');
  content = content.replace(/Interactive Remediation Showcase/g, 'Interactive Repair Showcase');
  content = content.replace(/Remediation Milestone Status/g, 'Repair Milestone Status');
  content = content.replace(/Live Civic Remediation Ticker/g, 'Live Civic Repair Ticker');
  content = content.replace(/remediation states/g, 'repair states');
  content = content.replace(/group remediation work/g, 'group repair work');
  content = content.replace(/pipe remediation/g, 'pipe repair');
  content = content.replace(/hazard remediation/g, 'hazard repair');
  content = content.replace(/verified remediation/g, 'verified repair');
  content = content.replace(/Certified Civic Remediation Flow/g, 'Certified Civic Repair Flow');
  content = content.replace(/Before Remediation/g, 'Before Repair');
  content = content.replace(/After Remediation/g, 'After Repair');
  content = content.replace(/outside currently supported municipal jurisdiction/g, 'outside currently supported cities or service zones');
  content = content.replace(/Tariff Schedule & Base Tariffs/g, 'Pricing Rates & Base Tariffs');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

let modifiedCount = 0;
function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') scan(full);
    } else if (/\.(tsx|jsx|ts|js)$/.test(f)) {
      if (processFile(full)) {
        modifiedCount++;
        console.log(`Updated typography & plain language in: ${full.replace(/\\/g, '/')}`);
      }
    }
  }
}

scan('client/src');
console.log(`\nTotal files updated with accessible typography & plain language: ${modifiedCount}`);
