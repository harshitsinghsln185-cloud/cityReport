import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { CIVIC_TAXONOMY } = require('../../server/src/seed/civicTaxonomy.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, '../src/data/civicContent.ts');

const CATEGORY_INTROS = {
  'roads-transportation': 'Road networks and traffic corridors form the backbone of urban mobility across Indian cities. This category covers potholes, surface wear, missing signage, traffic signals, and pedestrian footpath obstructions. Prompt reporting helps road departments and transit authorities identify defects and schedule maintenance.',
  'garbage-management': 'Municipal solid waste management encompasses daily neighborhood cleaning, community dustbins, and disposal facilities. Issues in this section include overflowing containers, uncollected domestic refuse, open dumping, and littering on public land. Swift notifications enable sanitation teams to clear blockages and prevent environmental hazards.',
  'water-drainage': 'Stormwater networks and municipal water supply systems prevent urban flooding and supply drinking water to households. This section covers pipeline leakages, contaminated water, clogged drains, open manholes, and street waterlogging. Early alerts assist water supply and sewerage boards in undertaking repairs.',
  'electricity-lighting': 'Public electrical infrastructure powers roadway lighting, traffic control, and neighborhood safety after dark. Sub-issues include burnt streetlights, damaged poles, open junction boxes, and low-hanging cables. Notifying distribution companies and municipal lighting cells helps eliminate electrocution hazards.',
  'public-health': 'Public health maintenance centers on sanitary surroundings, disease vector control, and hygienic food environments. Citizens can report mosquito breeding grounds, open defecation, medical waste dumping, and unsanitary food vendors. Reports support health inspectorates and municipal epidemiology units.',
  'environment': 'Urban ecological health depends on air quality protection, water body conservation, and green buffer management. This category tracks tree felling, garbage burning, industrial smoke, lake contamination, and plastic waste accumulation. Reports assist pollution control committees and urban foresters.',
  'parks-greenery': 'Public parks, botanical gardens, and roadside green strips provide recreational open space in urban clusters. Issues include broken play equipment, dying plant beds, damaged walking tracks, missing lighting, and park encroachment. Reports guide horticulture departments in maintaining urban green spaces.',
  'public-safety': 'Public safety covers physical security risks, dark streets, hazardous structures, and anti-social behavior in civic spaces. Documenting unlit corners, missing police booths, open construction pits, and dilapidated buildings aids municipal enforcement and local police jurisdictions.',
  'public-transport': 'Public transport networks comprise city buses, metro stations, auto stands, and transit interchanges. This section covers broken bus shelters, missing route charts, overcrowded stops, and reckless commercial driving. Civic reporting provides field feedback to municipal transport undertakings.',
  'animal-welfare': 'Urban animal management balances public safety with humane treatment of stray and injured animals. This category includes aggressive stray packs, injured cattle, dead animal carcass removal, and rabies concerns. Submissions help municipal veterinary departments and partner animal welfare organizations.',
  'encroachment': 'Encroachment concerns the unauthorized occupation of public roads, pedestrian walkways, and government land. Issues include street vendor blockages, unauthorized construction, illegal parking structures, and occupied pavements. Timely notices support anti-encroachment squads and town planning enforcement.',
  'public-amenities': 'Public amenities provide essential civic conveniences including community toilets, drinking water stations, benches, and public libraries. Issues include non-functional toilets, damaged water taps, vandalized bus shelters, and broken public clocks. Reports assist maintenance contractors and ward committees.',
  'fire-emergency': 'Fire safety and disaster readiness safeguard lives and commercial assets during civic emergencies. Issues include blocked fire hydrants, narrow emergency access lanes, missing fire exits, and electrical transformer hazards. Alerting agencies assists disaster management units and municipal fire brigades.',
  'urban-planning': 'Urban planning monitors zoning compliance, construction permissions, stormwater drainage reservation, and infrastructure setbacks. This section tracks illegal building additions, lack of rainwater harvesting, missing pedestrian corridors, and unauthorized land use changes. Feedback aids urban development authorities.',
  'commercial-areas': 'Commercial hubs and local bazaars experience high footfall, trade waste, loading congestion, and signage proliferation. Issues include blocked shopping lanes, illegal advertising hoardings, unregulated loading vehicles, and poor market sanitation. Reports help market associations and commercial licensing inspectorates.',
  'public-property': 'Public property includes municipal buildings, historic monuments, civic statues, boundary walls, and public furniture. Reports cover graffiti, vandalism, broken boundary walls, damaged commemorative plaques, and neglected public offices. Submissions support municipal asset management and heritage conservation units.',
};

const EMERGENCY_NOTES = {
  'electricity-lighting': 'In case of sparking cables, fallen live wires, or active electrical hazards, keep a safe distance and call emergency services at 112 immediately. The responsible electricity distribution company or municipal lighting department can differ by city.',
  'public-safety': 'If someone is in immediate danger or an active crime is taking place, dial 112 immediately. The responsible municipal or law enforcement agency can differ by city.',
  'fire-emergency': 'For active fires, gas leaks, or life-threatening emergencies, call the Fire Service at 101 or emergency helpline 112 without delay. The responsible municipal fire brigade or disaster management authority can differ by city.',
};

function generateContent() {
  console.log('Generating client/src/data/civicContent.ts...');

  const categoryContent = {};
  const civicContent = {};

  for (const cat of CIVIC_TAXONOMY) {
    categoryContent[cat.slug] = {
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      alt: `${cat.name} urban civic infrastructure and community maintenance`,
      focal: { x: 0.5, y: 0.5 },
      introParagraph: CATEGORY_INTROS[cat.slug] || `${cat.name} forms a core component of daily city life. Proper reporting assists municipal bodies in prioritizing maintenance and keeping public infrastructure safe.`,
      responsibleAgencyNote: EMERGENCY_NOTES[cat.slug] || 'The responsible municipal corporation, development authority, or utility provider can differ by city.',
    };

    for (const sub of cat.subCategories) {
      const key = `${cat.slug}/${sub.slug}`;
      civicContent[key] = {
        slug: sub.slug,
        name: sub.name,
        categorySlug: cat.slug,
        description: `${sub.name} reported in public areas requiring municipal inspection and remedial action.`,
        alt: `${sub.name} in an urban setting`,
        focal: { x: 0.5, y: 0.5 },
        defaultPriority: sub.defaultPriority || 'Medium',
        imageKey: sub.imageKey || undefined,
      };
    }
  }

  const fileContent = `// Single source of truth for civic taxonomy content, alt text, focal points, and intro descriptions.
// Generated from server/src/seed/civicTaxonomy.js

export interface CategoryContentItem {
  slug: string;
  name: string;
  description: string;
  alt: string;
  focal: { x: number; y: number };
  introParagraph: string;
  responsibleAgencyNote: string;
}

export interface CivicContentItem {
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  alt: string;
  focal: { x: number; y: number };
  defaultPriority: 'Critical' | 'High' | 'Medium' | 'Low';
  imageKey?: string;
}

export const CATEGORY_CONTENT: Record<string, CategoryContentItem> = ${JSON.stringify(categoryContent, null, 2)};

export const CIVIC_CONTENT: Record<string, CivicContentItem> = ${JSON.stringify(civicContent, null, 2)};
`;

  fs.writeFileSync(outPath, fileContent, 'utf8');
  console.log(`✓ Wrote ${outPath} with 16 categories and ${Object.keys(civicContent).length} sub-issues.`);
}

generateContent();

