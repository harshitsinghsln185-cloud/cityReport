const fs = require('fs');
const path = require('path');

const terms = [
  { name: 'remediation', regex: /\bremediation\b/gi, replace: 'repair' },
  { name: 'schedule of rates', regex: /schedule of rates/gi, replace: 'pricing rates' },
  { name: 'tariff schedule', regex: /tariff schedule/gi, replace: 'pricing list' },
  { name: 'municipal jurisdiction', regex: /municipal jurisdiction/gi, replace: 'city or state' },
  { name: 'pursuant to', regex: /pursuant to/gi, replace: 'under' },
  { name: 'aforementioned', regex: /aforementioned/gi, replace: 'mentioned' },
];

const matches = [];

function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') scan(full);
    } else if (/\.(tsx|jsx|ts|js)$/.test(f)) {
      const txt = fs.readFileSync(full, 'utf8');
      const lines = txt.split('\n');
      lines.forEach((l, idx) => {
        terms.forEach(t => {
          if (t.regex.test(l)) {
            matches.push({ file: full.replace(/\\/g, '/'), line: idx + 1, content: l.trim(), name: t.name });
          }
        });
      });
    }
  }
}

scan('client/src');
console.log('Total plain language matches found:', matches.length);
matches.forEach(m => console.log(`${m.file}:${m.line} [${m.name}] ${m.content}`));
