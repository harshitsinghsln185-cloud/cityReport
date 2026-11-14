import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const artDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';
const dlDir = path.resolve('client/design-source/civic/downloads');
const baseOut = path.resolve('client/design-source/civic');

const items = [
  // Commercial Areas (10)
  {
    category: 'commercial-areas',
    slug: 'dirty-market-areas',
    source: path.join(artDir, 'indian_market_debris_documentary_1794661718154.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'garbage-accumulation-in-markets',
    source: path.join(artDir, 'indian_market_overflowing_garbage_1794661755378.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'blocked-market-drainage',
    source: path.join(artDir, 'clogged_drainage_market_1794661761635.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'illegal-market-encroachment',
    source: path.join(artDir, 'market_encroachment_sidewalk_1794661774046.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'damaged-market-roads',
    source: path.join(artDir, 'damaged_market_road_civic_issue_1794661795108.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'lack-of-public-toilets',
    source: path.join(artDir, 'market_lane_sanitation_defect_1794661823512.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'broken-market-streetlights',
    source: path.join(artDir, 'broken_street_light_market_1794661838906.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'unhygienic-meat-and-fish-market-surroundings',
    source: path.join(artDir, 'civic_drainage_market_png_1794661843001.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'illegal-waste-disposal',
    source: path.join(artDir, 'commercial_waste_dump_drain_1794661839817.jpg')
  },
  {
    category: 'commercial-areas',
    slug: 'poor-market-parking-management',
    source: path.join(artDir, 'chaotic_market_parking_1794661850140.jpg')
  },

  // Public Property (10)
  {
    category: 'public-property',
    slug: 'broken-public-benches',
    source: path.join(artDir, 'broken_park_bench_1794661922295.jpg')
  },
  {
    category: 'public-property',
    slug: 'damaged-street-signs',
    source: path.join(artDir, 'damaged_traffic_sign_1794661921044.jpg')
  },
  {
    category: 'public-property',
    slug: 'broken-bus-stop-structures',
    source: path.join(artDir, 'damaged_bus_shelter_1794661925028.jpg')
  },
  {
    category: 'public-property',
    slug: 'damaged-public-toilets',
    source: path.join(dlDir, 'damaged-public-toilets-wikimedia.jpg')
  },
  {
    category: 'public-property',
    slug: 'wall-graffiti',
    source: path.join(dlDir, 'wall-graffiti-wikimedia.jpg')
  },
  {
    category: 'public-property',
    slug: 'damage-to-public-monuments',
    source: path.join(dlDir, 'damage-to-public-monuments-wikimedia.jpg')
  },
  {
    category: 'public-property',
    slug: 'broken-park-equipment',
    source: path.join(dlDir, 'broken-park-equipment-wikimedia.jpg')
  },
  {
    category: 'public-property',
    slug: 'damaged-public-dustbins',
    source: path.join(dlDir, 'damaged-public-dustbins-wikimedia.jpg')
  },
  {
    category: 'public-property',
    slug: 'theft-of-public-infrastructure',
    source: path.join(dlDir, 'theft-of-public-infrastructure-wikimedia.jpg')
  },
  {
    category: 'public-property',
    slug: 'vandalism-of-public-property',
    source: path.join(dlDir, 'vandalism-ticket-machine.jpg')
  }
];

async function run() {
  console.log(`Processing ${items.length} master design-source images (1200x900 PNG)...`);
  for (const item of items) {
    if (!fs.existsSync(item.source)) {
      throw new Error(`Source file missing: ${item.source}`);
    }
    const catDir = path.join(baseOut, item.category);
    fs.mkdirSync(catDir, { recursive: true });
    const outPath = path.join(catDir, `${item.slug}.png`);

    await sharp(item.source)
      .resize(1200, 900, {
        fit: 'cover',
        position: 'center'
      })
      .png({ compressionLevel: 8 })
      .toFile(outPath);

    const stat = fs.statSync(outPath);
    console.log(`✓ [${item.category}] ${item.slug}.png (${stat.size} bytes)`);
  }
  console.log('All 20 master images created successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
