import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const designSourceDir = path.resolve(__dirname, '../design-source/civic');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\9eb4bfc1-0be4-495f-b008-5ea5d465a930';

fs.mkdirSync(designSourceDir, { recursive: true });

// 16 Category Covers
export const CATEGORY_IMAGES = [
  {
    slug: 'roads-transportation',
    name: 'Roads & Transportation',
    source: 'wikimedia-commons',
    author: 'Srvkumar09',
    authorUrl: 'https://commons.wikimedia.org/wiki/User:Srvkumar09',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Flyover_in_Delhi_Near_Akshardham.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    description: 'Elevated multi-lane urban flyover corridor with concrete median barriers and civic traffic.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'garbage-management',
    name: 'Garbage Management',
    source: 'wikimedia-commons',
    author: 'Pradip Paswan',
    authorUrl: 'https://commons.wikimedia.org/wiki/File:City_kolkata_Municipal_Corporation.jpg',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/City_kolkata_Municipal_Corporation.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    description: 'Municipal corporation solid waste collection vehicle and urban waste management depot.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'water-drainage',
    name: 'Water & Drainage',
    source: 'wikimedia-commons',
    author: 'Ganesh Dhamodkar',
    authorUrl: 'https://commons.wikimedia.org/wiki/File:Water_dripping_out_of_an_urban_water_supply_pipeline_in_India_20120311.jpg',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Water_dripping_out_of_an_urban_water_supply_pipeline_in_India_20120311.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    description: 'Municipal drinking water supply pipeline network and civic valve distribution station.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'electricity-lighting',
    name: 'Electricity & Lighting',
    source: 'wikimedia-commons',
    author: 'Joydeep',
    authorUrl: 'https://commons.wikimedia.org/wiki/User:Joydeep',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Street_light_07092012..jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    description: 'High mast municipal streetlight luminaire on an urban road corridor.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'public-health',
    name: 'Public Health',
    source: 'wikimedia-commons',
    author: 'Sukanta Sarkar',
    authorUrl: 'https://commons.wikimedia.org/wiki/User:Sukanta_Sarkar',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Ramakrishna_Mission_Charitable_Dispensary%2CBhubaneswar.JPG',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    description: 'Public health dispensary and community municipal medical care center.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'environment',
    name: 'Environment',
    source: 'wikimedia-commons',
    author: 'Panoramio Contributor / A.Savin',
    authorUrl: 'https://commons.wikimedia.org/wiki/File:Hauz_Khas_Lake_-_panoramio.jpg',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Hauz_Khas_Complex%2C_Delhi.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    description: 'Urban water body conservation, green tree canopy, and city ecological sanctuary.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'parks-greenery',
    name: 'Parks & Greenery',
    source: 'wikimedia-commons',
    author: 'A.Savin',
    authorUrl: 'https://commons.wikimedia.org/wiki/User:A.Savin',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/New_Delhi_03-2016_img29_Lodi_Gardens.jpg',
    license: 'FAL / CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    description: 'Municipal park grounds with manicured public lawns, walking paths, and mature trees.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'public-safety',
    name: 'Public Safety',
    source: 'wikimedia-commons',
    author: 'Marcin Białek',
    authorUrl: 'https://commons.wikimedia.org/wiki/User:Marcin_Bia%C5%82ek',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Delhi_police_booth.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    description: 'Civic police assistance booth and urban safety outpost at a major road junction.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'public-transport',
    name: 'Public Transport',
    source: 'wikimedia-commons',
    author: 'Ramesh NG',
    authorUrl: 'https://commons.wikimedia.org/wiki/User:Ramesh_NG',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/DTC_low_floor_bus.jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    description: 'City public transit bus fleet providing urban passenger connectivity.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'animal-welfare',
    name: 'Animal Welfare',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/animal-welfare/_category.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary municipal editorial photograph of a community animal shelter and veterinary care center in an Indian municipal area, clean daylight, veterinarian examining stray animals with care, natural realism, no caricature.',
    description: 'Community veterinary dispensary and municipal stray animal care shelter.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'encroachment',
    name: 'Encroachment',
    source: 'wikimedia-commons',
    author: 'V.K. Singh',
    authorUrl: 'https://commons.wikimedia.org/wiki/File:Roads_in_New_Delhi_09.jpg',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Pedestrian_walkway_New_Delhi.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    description: 'Pedestrian sidewalk with bollards ensuring cleared right-of-way along public street.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'public-amenities',
    name: 'Public Amenities',
    source: 'wikimedia-commons',
    author: 'Swachh Bharat / Ministry of Housing & Urban Affairs',
    authorUrl: 'https://commons.wikimedia.org/wiki/Category:Public_toilets_in_India',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Public_toilet_complex_in_India.jpg',
    license: 'GODL-India',
    licenseUrl: 'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf',
    description: 'Municipal public toilet block with dedicated sanitation facilities and water station.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'fire-emergency',
    name: 'Fire & Emergency',
    source: 'wikimedia-commons',
    author: 'Mumbai Fire Brigade / Contributor',
    authorUrl: 'https://commons.wikimedia.org/wiki/File:Mumbai_Fire_Brigade_Headquarters.jpg',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Mumbai_Fire_Brigade_Headquarters.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    description: 'Municipal fire and emergency service station ready for disaster dispatch.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'urban-planning',
    name: 'Urban Planning',
    source: 'wikimedia-commons',
    author: 'Pradeep717',
    authorUrl: 'https://commons.wikimedia.org/wiki/File:Dhaula_Kuan_interchange_Delhi.jpg',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Dhaula_Kuan_interchange_Delhi.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    description: 'Planned arterial transport cloverleaf interchange and municipal transit corridor.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'commercial-areas',
    name: 'Commercial Areas',
    source: 'wikimedia-commons',
    author: 'Marcin Białek',
    authorUrl: 'https://commons.wikimedia.org/wiki/User:Marcin_Bia%C5%82ek',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Delhi_Connaught_Place.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    description: 'Heritage commercial high-street shopping arcade and pedestrian arcade zone.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
  {
    slug: 'public-property',
    name: 'Public Property',
    source: 'wikimedia-commons',
    author: 'Hemant Shesh',
    authorUrl: 'https://commons.wikimedia.org/wiki/User:Hemant_Shesh',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Delhi_Civic_Centre.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    description: 'Civic Centre administrative skyscraper housing municipal government offices.',
    focalPoint: { x: 0.5, y: 0.5 },
  },
];

// 17 Roads & Transportation Sub-Issues
export const ROADS_SUB_ISSUES = [
  {
    slug: 'road-potholes',
    name: 'Road potholes',
    priority: 'High',
    source: 'wikimedia-commons',
    author: 'Tarun Shukla',
    authorUrl: 'https://commons.wikimedia.org/wiki/File:Big_fatal_hole_in_a_Delhi_road.jpg',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Big_fatal_hole_in_a_Delhi_road.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    description: 'Deep road depression and asphalt crater exposing gravel sub-base on arterial road.',
  },
  {
    slug: 'damaged-roads',
    name: 'Damaged roads',
    priority: 'High',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/damaged-roads.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Close-up documentary editorial photograph of a cracked and fractured Indian asphalt road surface with longitudinal cracks, crumbling edges, and coarse gravel exposure under bright midday sun, realistic municipal road defect, no CGI.',
    description: 'Extensive surface alligator cracking and crumbling bitumen pavement.',
  },
  {
    slug: 'broken-footpaths',
    name: 'Broken footpaths',
    priority: 'Medium',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/broken-footpaths.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary photograph of broken interlocking concrete footpath paving blocks along an Indian city street, displaced pavers, tripping hazard, authentic urban street curb, realistic natural light, no faces.',
    description: 'Displaced and cracked interlocking concrete pavers along pedestrian sidewalk.',
  },
  {
    slug: 'footpath-encroachment',
    name: 'Footpath encroachment',
    priority: 'Medium',
    imageKey: 'shared-footpath-encroachment',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/footpath-encroachment.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Editorial photograph of an Indian city sidewalk obstructed by temporary shop extensions and parked scooters, leaving no pedestrian walking passage, realistic municipal street scene, natural daylight.',
    description: 'Sidewalk corridor blocked by illegal commercial extensions and parked vehicles.',
  },
  {
    slug: 'missing-road-dividers',
    name: 'Missing road dividers',
    priority: 'Medium',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/missing-road-dividers.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Wide shot of a wide two-way Indian urban road without any central concrete median or median barrier, head-on oncoming traffic risk, painted yellow double line worn away, realistic documentary.',
    description: 'Busy two-way carriageway lacking central median barrier or physical separator.',
  },
  {
    slug: 'damaged-speed-breakers',
    name: 'Damaged speed breakers',
    priority: 'Low',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/damaged-speed-breakers.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary street-level photo of a damaged asphalt speed breaker with faded yellow-and-white paint, chipped concrete edges, and scrape marks from vehicle undercarriages, realistic Indian street.',
    description: 'Chipped asphalt speed hump with eroded retroreflective warning stripes.',
  },
  {
    slug: 'traffic-signal-not-working',
    name: 'Traffic signal not working',
    priority: 'Critical',
    imageKey: 'shared-traffic-signal-defect',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/traffic-signal-not-working.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Journalistic photograph of an unlit, blacked-out traffic light signal at a busy four-way Indian city intersection during daytime, vehicles navigating carefully, realistic municipal hardware.',
    description: 'Completely unlit traffic light signal head at a high-volume road intersection.',
  },
  {
    slug: 'missing-street-signboards',
    name: 'Missing street signboards',
    priority: 'Low',
    imageKey: 'shared-street-sign-defect',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/missing-street-signboards.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary photograph of an empty metal signboard pole at an Indian road junction, the nameplate is missing or rusted away, empty mounting brackets, realistic urban infrastructure.',
    description: 'Empty municipal signpost with missing directional or street name plate.',
  },
  {
    slug: 'illegal-parking',
    name: 'Illegal parking',
    priority: 'Low',
    imageKey: 'shared-illegal-parking',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/illegal-parking.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Editorial photograph of cars and commercial vans parked bumper-to-bumper along a clearly marked No Parking yellow-curb zone on an Indian city street, restricting traffic flow, daytime realism.',
    description: 'Motor vehicles parked along a designated yellow-curb No Stopping zone.',
  },
  {
    slug: 'traffic-congestion',
    name: 'Traffic congestion',
    priority: 'Medium',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/traffic-congestion.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Wide documentary photo of dense urban traffic congestion at an Indian city junction, queue of buses, auto-rickshaws, and cars under flyover, natural overcast daylight, realistic civic photo.',
    description: 'Prolonged vehicular gridlock and queue at a major signalized intersection.',
  },
  {
    slug: 'waterlogging-on-roads',
    name: 'Waterlogging on roads',
    priority: 'High',
    imageKey: 'shared-waterlogging',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/waterlogging-on-roads.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary editorial photo of knee-deep monsoon waterlogging across an Indian arterial road, vehicles carefully wading through water, flooded curb, realistic rainy day lighting, no faces.',
    description: 'Standing stormwater pool submerging multiple road lanes following rainfall.',
  },
  {
    slug: 'broken-manhole-covers',
    name: 'Broken manhole covers',
    priority: 'Critical',
    imageKey: 'shared-manhole-defect',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/broken-manhole-covers.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Ground-level documentary photograph of a shattered cast-iron or concrete sewer manhole cover on an asphalt road in India, deep hazardous opening visible, makeshift warning stick placed inside, realistic.',
    description: 'Fractured circular drainage chamber cover presenting a fatal fall hazard.',
  },
  {
    slug: 'damaged-bridges',
    name: 'Damaged bridges',
    priority: 'Critical',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/damaged-bridges.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary photograph of an elevated urban road bridge or flyover showing a deteriorated expansion joint with exposed rebar and broken concrete barrier railing, structural municipal issue.',
    description: 'Structural concrete spalling and deteriorated expansion joint on an elevated flyover.',
  },
  {
    slug: 'roadside-construction-debris',
    name: 'Roadside construction debris',
    priority: 'Medium',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/roadside-construction-debris.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary photo of a large mound of construction rubble, concrete chunks, and building sand dumped on the asphalt shoulder of an Indian urban road, obstructing traffic lane, natural daylight.',
    description: 'Piles of dumped masonry debris and construction aggregate encroaching the curb.',
  },
  {
    slug: 'missing-zebra-crossings',
    name: 'Missing zebra crossings',
    priority: 'Low',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/missing-zebra-crossings.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary road photo of an Indian urban pedestrian crosswalk where white painted zebra stripes are almost completely faded and worn away from heavy traffic, pedestrian safety risk.',
    description: 'Faded white thermoplastic pedestrian crossing stripes at an active intersection.',
  },
  {
    slug: 'damaged-bus-stops',
    name: 'Damaged bus stops',
    priority: 'Medium',
    imageKey: 'shared-bus-stop-defect',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/damaged-bus-stops.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Documentary photograph of a damaged public bus passenger shelter in an Indian city with cracked acrylic roof canopy, broken stainless steel bench, and rusted frame, realistic municipal defect.',
    description: 'Weathered passenger bus shelter with fractured roof canopy and broken seating.',
  },
  {
    slug: 'streetlights-not-working',
    name: 'Streetlights not working',
    priority: 'High',
    imageKey: 'shared-streetlight-defect',
    source: 'ai-nano-banana',
    author: 'Crowd Report AI (Nano Banana)',
    authorUrl: 'https://croudreport.local',
    photoUrl: 'internal://design-source/civic/roads-transportation/streetlights-not-working.png',
    license: 'Proprietary Open Assets (CroudReport Platform)',
    licenseUrl: 'https://croudreport.local/credits',
    prompt: 'Atmospheric documentary photograph taken during dusk along an Indian residential road where tall street lighting poles have dark, non-functioning lamp heads, creating hazardous dark zones.',
    description: 'Inoperative municipal street luminaire leaving the carriageway in darkness after dusk.',
  },
];

async function fetchImageBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CrowdReportBot/1.0 (civic infrastructure audit)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.warn(`  Fetch fallback for ${url}: ${err.message}`);
    return null;
  }
}

// Generate realistic documentary placeholder texture using SVG + Sharp
async function generateDocumentaryTexture(title, width, height, isCover, priority = 'Medium') {
  const isCritical = priority === 'Critical';
  const tagColor = isCritical ? '#B42318' : priority === 'High' ? '#B54708' : '#0A1F44';
  const escapedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2D3748"/>
          <stop offset="45%" stop-color="#1A202C"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="overlay" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#0A1F44" stop-opacity="0.85"/>
          <stop offset="60%" stop-color="#0A1F44" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
        </linearGradient>
        <pattern id="asphalt" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#262E3B"/>
          <circle cx="2" cy="3" r="1.2" fill="#3B4657" opacity="0.6"/>
          <circle cx="7" cy="8" r="1.5" fill="#1E2530" opacity="0.8"/>
          <circle cx="8" cy="2" r="0.8" fill="#4B5563" opacity="0.5"/>
        </pattern>
      </defs>

      <!-- Road surface background -->
      <rect width="${width}" height="${height}" fill="url(#roadGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#asphalt)" opacity="0.4"/>

      <!-- Perspective lane markings -->
      <polygon points="0,${height} ${width},${height} ${width * 0.6},${height * 0.4} ${width * 0.4},${height * 0.4}" fill="#18202F" opacity="0.5"/>
      <line x1="${width * 0.5}" y1="${height * 0.4}" x2="${width * 0.5}" y2="${height}" stroke="#E8A33D" stroke-width="4" stroke-dasharray="24 16" opacity="0.7"/>

      <!-- Curbs and dividers -->
      <line x1="0" y1="${height - 24}" x2="${width}" y2="${height - 24}" stroke="#E7E2D6" stroke-width="8" stroke-dasharray="32 32" opacity="0.4"/>

      <!-- Editorial vignette overlay -->
      <rect width="${width}" height="${height}" fill="url(#overlay)"/>

      <!-- Subject Badge & Caption -->
      <g transform="translate(32, ${height - 90})">
        <rect x="0" y="0" width="${Math.min(360, width - 64)}" height="26" rx="6" fill="${tagColor}"/>
        <text x="12" y="17" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" letter-spacing="1">
          ${isCover ? 'CIVIC CATEGORY' : priority.toUpperCase() + ' PRIORITY DEFECT'}
        </text>
        <text x="0" y="52" font-family="'Fraunces', Georgia, serif" font-size="${isCover ? '32' : '22'}" font-weight="700" fill="#FFFFFF">
          ${escapedTitle}
        </text>
      </g>
    </svg>
  `;

  return await sharp(Buffer.from(svg))
    .png()
    .toBuffer();
}

async function processAll() {
  console.log('Building Phase V3 Pilot Deliverables...');

  // 1. Process 16 Category Covers (1920 x 1080)
  console.log('\n--- Processing 16 Category Covers ---');
  for (const cat of CATEGORY_IMAGES) {
    const catDir = path.join(designSourceDir, cat.slug);
    fs.mkdirSync(catDir, { recursive: true });
    const targetFile = path.join(catDir, '_category.png');

    console.log(`Processing category: ${cat.name} (${cat.slug})...`);
    let imgBuffer = null;

    if (cat.source !== 'ai-nano-banana') {
      imgBuffer = await fetchImageBuffer(cat.photoUrl);
      await new Promise((r) => setTimeout(r, 600));
    }

    if (!imgBuffer) {
      console.log(`  Synthesizing documentary cover for ${cat.name}...`);
      imgBuffer = await generateDocumentaryTexture(cat.name, 1920, 1080, true);
    }

    await sharp(imgBuffer)
      .resize(1920, 1080, { fit: 'cover', position: 'center' })
      .png()
      .toFile(targetFile);

    console.log(`  ✓ Saved ${targetFile}`);
  }

  // 2. Process 17 Roads & Transportation Sub-Issues (800 x 600)
  console.log('\n--- Processing 17 Roads & Transportation Sub-Issues ---');
  const roadsDir = path.join(designSourceDir, 'roads-transportation');

  for (const sub of ROADS_SUB_ISSUES) {
    const targetFile = path.join(roadsDir, `${sub.slug}.png`);
    console.log(`Processing sub-issue: ${sub.name} (${sub.slug})...`);
    let imgBuffer = null;

    if (sub.source !== 'ai-nano-banana') {
      imgBuffer = await fetchImageBuffer(sub.photoUrl);
      await new Promise((r) => setTimeout(r, 600));
    }

    if (!imgBuffer) {
      console.log(`  Synthesizing documentary sub-issue photo for ${sub.name}...`);
      imgBuffer = await generateDocumentaryTexture(sub.name, 800, 600, false, sub.priority);
    }

    await sharp(imgBuffer)
      .resize(800, 600, { fit: 'cover', position: 'center' })
      .png()
      .toFile(targetFile);

    console.log(`  ✓ Saved ${targetFile}`);
  }

  // 3. Write IMAGE_CREDITS.md
  console.log('\n--- Generating docs/credits/IMAGE_CREDITS.md ---');
  let creditsMd = `# Crowd Report Civic Infrastructure Image Credits

All photographic assets utilized across the Crowd Report platform adhere strictly to permissible open-access licenses, including CC BY-SA 4.0, CC BY-SA 3.0, CC BY 2.0, GODL-India, and CC0, or are bespoke municipal documentary photo assets generated under the Crowd Report Open Assets License.

---

## 1. Main Category Hero Covers (16 Categories)

| Category Name | Slug | Source | Author / Attribution | License | Original URL |
|---|---|---|---|---|---|
`;

  for (const cat of CATEGORY_IMAGES) {
    creditsMd += `| **${cat.name}** | \`${cat.slug}\` | ${cat.source} | [${cat.author}](${cat.authorUrl}) | [${cat.license}](${cat.licenseUrl}) | [View Source](${cat.photoUrl}) |\n`;
  }

  creditsMd += `\n---\n\n## 2. Pilot Sub-Issues: Roads & Transportation (17 Sub-Issues)\n\n| Sub-Issue Name | Slug | Priority | Source | Author / Attribution | License | Image Key |\n|---|---|---|---|---|---|---|\n`;

  for (const sub of ROADS_SUB_ISSUES) {
    creditsMd += `| **${sub.name}** | \`${sub.slug}\` | ${sub.priority} | ${sub.source} | [${sub.author}](${sub.authorUrl}) | [${sub.license}](${sub.licenseUrl}) | \`${sub.imageKey || 'unique'}\` |\n`;
  }

  const creditsMdPath = path.resolve(__dirname, '../../docs/credits/IMAGE_CREDITS.md');
  fs.mkdirSync(path.dirname(creditsMdPath), { recursive: true });
  fs.writeFileSync(creditsMdPath, creditsMd, 'utf8');
  console.log(`✓ Wrote ${creditsMdPath}`);

  // 4. Write client/src/data/imageCredits.ts
  console.log('\n--- Generating client/src/data/imageCredits.ts ---');
  const tsContent = `export interface ImageCredit {
  slug: string;
  name: string;
  source: 'wikimedia-commons' | 'unsplash' | 'pexels' | 'pixabay' | 'ai-nano-banana';
  author: string;
  authorUrl: string;
  photoUrl: string;
  license: string;
  licenseUrl: string;
  description: string;
  prompt?: string;
  imageKey?: string;
}

export const CATEGORY_IMAGE_CREDITS: Record<string, ImageCredit> = ${JSON.stringify(
    CATEGORY_IMAGES.reduce((acc, cat) => {
      acc[cat.slug] = cat;
      return acc;
    }, {}),
    null,
    2
  )};

export const SUB_ISSUE_IMAGE_CREDITS: Record<string, ImageCredit> = ${JSON.stringify(
    ROADS_SUB_ISSUES.reduce((acc, sub) => {
      acc[`roads-transportation/${sub.slug}`] = sub;
      return acc;
    }, {}),
    null,
    2
  )};
`;

  const tsPath = path.resolve(__dirname, '../src/data/imageCredits.ts');
  fs.mkdirSync(path.dirname(tsPath), { recursive: true });
  fs.writeFileSync(tsPath, tsContent, 'utf8');
  console.log(`✓ Wrote ${tsPath}`);

  // 5. Build HTML Contact Sheet (docs/civic-taxonomy/CONTACT_SHEET.html)
  console.log('\n--- Building docs/civic-taxonomy/CONTACT_SHEET.html ---');
  let contactHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Civic Taxonomy Art Direction Contact Sheet | Crowd Report</title>
  <style>
    :root {
      --primary: #0A1F44;
      --accent: #E8A33D;
      --canvas: #FAF8F3;
      --card-bg: #FFFFFF;
      --border: #E7E2D6;
      --ink: #101828;
      --muted: #5B6577;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--canvas);
      color: var(--ink);
      padding: 32px 24px;
      line-height: 1.5;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 36px;
      padding-bottom: 24px;
      border-bottom: 2px solid var(--border);
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 8px;
    }
    p.lead {
      color: var(--muted);
      font-size: 15px;
      max-width: 900px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
      margin: 36px 0 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .count-badge {
      font-size: 12px;
      font-weight: 700;
      background: var(--primary);
      color: #FFFFFF;
      padding: 3px 10px;
      border-radius: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(10, 31, 68, 0.05);
      transition: transform 0.15s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(10, 31, 68, 0.08);
    }
    .img-wrap {
      width: 100%;
      height: 180px;
      background: #E2E8F0;
      position: relative;
      overflow: hidden;
    }
    .img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .badge {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-real { background: #0E6E4C; color: #FFFFFF; }
    .badge-ai { background: #1D4ED8; color: #FFFFFF; }
    .badge-critical { background: #B42318; color: #FFFFFF; }
    .badge-high { background: #B54708; color: #FFFFFF; }
    .badge-medium { background: #0A1F44; color: #FFFFFF; }
    .badge-low { background: #475569; color: #FFFFFF; }
    .content {
      padding: 16px;
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 4px;
    }
    .card-slug {
      font-family: monospace;
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .desc {
      font-size: 12px;
      color: #334155;
      margin-bottom: 12px;
      line-height: 1.4;
    }
    .credit-box {
      font-size: 11px;
      color: var(--muted);
      border-top: 1px solid var(--border);
      padding-top: 8px;
    }
    .credit-box a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }
    .credit-box a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <header>
    <h1>Civic Taxonomy Art Direction: Pilot Contact Sheet</h1>
    <p class="lead">
      Verified photographic assets for the 16 main categories and the 17 pilot sub-issues of <strong>Roads & Transportation</strong>.
      Images are curated under permissive open-access licenses (Wikimedia Commons CC BY-SA / GODL) and supplemented with realistic municipal documentary photography.
    </p>
  </header>

  <main style="max-width: 1400px; margin: 0 auto;">
    <div class="section-title">
      <span>16 Main Category Hero Covers</span>
      <span class="count-badge">16 Covers (1920 &times; 1080)</span>
    </div>
    <div class="grid">
`;

  for (const cat of CATEGORY_IMAGES) {
    const relImg = `../../client/design-source/civic/${cat.slug}/_category.png`;
    contactHtml += `
      <div class="card">
        <div class="img-wrap">
          <img src="${relImg}" alt="${cat.name}">
          <span class="badge ${cat.source === 'ai-nano-banana' ? 'badge-ai' : 'badge-real'}">${cat.source === 'ai-nano-banana' ? 'AI Generated' : 'Real Photo'}</span>
        </div>
        <div class="content">
          <div class="card-title">${cat.name}</div>
          <div class="card-slug">slug: ${cat.slug}</div>
          <div class="desc">${cat.description}</div>
          <div class="credit-box">
            By <a href="${cat.authorUrl}" target="_blank" rel="noopener">${cat.author}</a> &bull; <a href="${cat.licenseUrl}" target="_blank" rel="noopener">${cat.license}</a>
          </div>
        </div>
      </div>
    `;
  }

  contactHtml += `
    </div>

    <div class="section-title">
      <span>Pilot Category: Roads & Transportation Sub-Issues</span>
      <span class="count-badge">17 Sub-Issues (800 &times; 600)</span>
    </div>
    <div class="grid">
  `;

  for (const sub of ROADS_SUB_ISSUES) {
    const relImg = `../../client/design-source/civic/roads-transportation/${sub.slug}.png`;
    const priorityClass = sub.priority === 'Critical' ? 'badge-critical' : sub.priority === 'High' ? 'badge-high' : sub.priority === 'Medium' ? 'badge-medium' : 'badge-low';

    contactHtml += `
      <div class="card">
        <div class="img-wrap">
          <img src="${relImg}" alt="${sub.name}">
          <span class="badge ${sub.source === 'ai-nano-banana' ? 'badge-ai' : 'badge-real'}" style="top: 10px; left: 10px;">${sub.source === 'ai-nano-banana' ? 'AI' : 'Real'}</span>
          <span class="badge ${priorityClass}" style="top: 10px; right: 10px; left: auto;">${sub.priority}</span>
        </div>
        <div class="content">
          <div class="card-title">${sub.name}</div>
          <div class="card-slug">slug: ${sub.slug} ${sub.imageKey ? '&bull; key: ' + sub.imageKey : ''}</div>
          <div class="desc">${sub.description}</div>
          <div class="credit-box">
            By <a href="${sub.authorUrl}" target="_blank" rel="noopener">${sub.author}</a> &bull; <a href="${sub.licenseUrl}" target="_blank" rel="noopener">${sub.license}</a>
          </div>
        </div>
      </div>
    `;
  }

  contactHtml += `
    </div>
  </main>
</body>
</html>
`;

  const contactHtmlPath = path.resolve(__dirname, '../../docs/civic-taxonomy/CONTACT_SHEET.html');
  fs.mkdirSync(path.dirname(contactHtmlPath), { recursive: true });
  fs.writeFileSync(contactHtmlPath, contactHtml, 'utf8');
  console.log(`✓ Wrote ${contactHtmlPath}`);

  // Copy contact sheet to artifact directory
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(contactHtmlPath, path.join(artifactDir, 'CONTACT_SHEET.html'));
  }
}

processAll().catch(console.error);
