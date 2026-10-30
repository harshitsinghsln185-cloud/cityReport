import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const landmarksPath = path.resolve(__dirname, '../src/data/landmarks.ts');
const content = fs.readFileSync(landmarksPath, 'utf8').replace(/\r\n/g, '\n');

// Extract all slugs and bannerPrompts
const blocks = content.split(/\n\s*'([a-z0-9-]+)':\s*\{/);
const prompts = {};

for (let i = 1; i < blocks.length; i += 2) {
  const slug = blocks[i];
  const block = blocks[i + 1];
  const promptMatch = block.match(/bannerPrompt:\s*(?:'([^']+)'|`([^`]+)`)/);
  const altMatch = block.match(/bannerAlt:\s*'([^']+)'/);
  const landmarkMatch = block.match(/landmark:\s*'([^']+)'/);
  const nameMatch = block.match(/name:\s*'([^']+)'/);
  const capitalMatch = block.match(/capital:\s*'([^']+)'/);
  if (promptMatch) {
    prompts[slug] = {
      slug,
      name: nameMatch ? nameMatch[1] : slug,
      capital: capitalMatch ? capitalMatch[1] : '',
      landmark: landmarkMatch ? landmarkMatch[1] : '',
      prompt: (promptMatch[1] || promptMatch[2]).replace(/\s+/g, ' ').trim(),
      alt: altMatch ? altMatch[1] : ''
    };
  }
}

fs.writeFileSync(path.resolve(__dirname, '../src/data/prompts.json'), JSON.stringify(prompts, null, 2));
console.log('Extracted', Object.keys(prompts).length, 'prompts successfully to prompts.json');
