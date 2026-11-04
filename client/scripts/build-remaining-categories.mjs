import { buildCategorySubImages } from './build-category-sub-images.mjs';

const REMAINING_CATEGORIES = [
  'environment',
  'parks-greenery',
  'public-safety',
  'public-transport',
  'animal-welfare',
  'encroachment',
  'public-amenities',
  'fire-emergency',
  'urban-planning',
  'commercial-areas',
  'public-property'
];

async function main() {
  console.log('--- Processing All 11 Remaining Categories for Phase V4 ---');
  for (const cat of REMAINING_CATEGORIES) {
    await buildCategorySubImages(cat);
  }
  console.log('\n✓ Successfully built original images and updated credits for all 11 categories!');
}

main().catch(err => {
  console.error('Batch build error:', err);
  process.exit(1);
});
