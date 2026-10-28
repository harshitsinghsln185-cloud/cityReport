const fs = require('fs');
const path = require('path');

const purpleRegex = /(#(7c3aed|5b4fe1|6d28d9|ede9fe|ddd6fe|a78bfa|f8f7fc|c4b5fd|8b5cf6|4c1d95)|(purple|violet)-)/i;
const matches = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        scanDir(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (purpleRegex.test(line)) {
          matches.push({ file: fullPath.replace(/\\/g, '/'), line: idx + 1, content: line.trim() });
        }
      });
    }
  }
}

scanDir('client/src');
console.log('Total purple matches found in client/src:', matches.length);
matches.forEach(m => console.log(`${m.file}:${m.line} ${m.content}`));
