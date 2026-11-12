// Single source of truth for civic taxonomy content, alt text, focal points, and intro descriptions.
// Generated from server/src/seed/civicTaxonomy.js

export interface CategoryContentItem {
  slug: string;
  name: string;
  description: string;
  alt: string;
  focal: { x: number; y: number };
  introParagraph: string;
  responsibleAgencyNote: string;
  resolutionSteps: string[];
  isEmergency?: boolean;
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

export const CATEGORY_CONTENT: Record<string, CategoryContentItem> = {
  "roads-transportation": {
    "slug": "roads-transportation",
    "name": "Roads & Transportation",
    "description": "Municipal road surfacing, pedestrian footpaths, traffic signals, and bridge structural safety.",
    "alt": "Damaged asphalt road with deep water-filled potholes and cracked edges during golden hour",
    "focal": {
      "x": 0.68,
      "y": 0.55
    },
    "introParagraph": "Road networks and traffic corridors form the backbone of urban mobility across Indian cities. This category covers potholes, surface wear, missing signage, traffic signals, and pedestrian footpath obstructions. Prompt reporting helps road departments and transit authorities identify defects and schedule maintenance.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Inspect surface damage, pavement wear, and sub-base stability at the reported coordinates",
        "Issue work scope and dispatch asphalt, concrete, or road maintenance crew",
        "Carry out surface milling, hot-mix patching, or curb restoration with traffic safety barricades",
        "Record timestamped photographic proof to verify complete hazard clearance"
    ],
    "isEmergency": false
  },
  "garbage-management": {
    "slug": "garbage-management",
    "name": "Garbage Management",
    "description": "Domestic waste collection, municipal dustbin overflows, illegal dumping, and sanitary clearance.",
    "alt": "Overflowing municipal dumpster on a sidewalk curb with spilled garbage bags under warm sunlight",
    "focal": {
      "x": 0.72,
      "y": 0.50
    },
    "introParagraph": "Municipal solid waste management encompasses daily neighborhood cleaning, community dustbins, and disposal facilities. Issues in this section include overflowing containers, uncollected domestic refuse, open dumping, and littering on public land. Swift notifications enable sanitation teams to clear blockages and prevent environmental hazards.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Assess waste volume, accumulation footprint, and sanitation requirements",
        "Dispatch municipal refuse vehicle and sanitation crew to the site",
        "Clear accumulation, sweep peripheral waste, and apply neutralizing disinfectant",
        "Capture post-cleanup photo evidence confirming public thoroughfare restoration"
    ],
    "isEmergency": false
  },
  "water-drainage": {
    "slug": "water-drainage",
    "name": "Water & Drainage",
    "description": "Drinking water pipelines, sewer blockages, drainage overflow, and municipal water pressure.",
    "alt": "Ruptured underground water pipe leaking through cracked road asphalt into an open roadside drain",
    "focal": {
      "x": 0.70,
      "y": 0.55
    },
    "introParagraph": "Stormwater networks and municipal water supply systems prevent urban flooding and supply drinking water to households. This section covers pipeline leakages, contaminated water, clogged drains, open manholes, and street waterlogging. Early alerts assist water supply and sewerage boards in undertaking repairs.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Locate pipeline leak, clogged culvert, or drain blockage source",
        "Deploy suction or jetting equipment to extract silt and obstructions",
        "Repair damaged pipe fitting, clear drain channel, or restore proper runoff slope",
        "Confirm water flow restoration and upload verified before-and-after proof"
    ],
    "isEmergency": false
  },
  "electricity-lighting": {
    "slug": "electricity-lighting",
    "name": "Electricity & Lighting",
    "description": "Public street illumination, fallen power lines, hazardous transformers, and junction boxes.",
    "alt": "Leaning concrete electric utility pole with a broken streetlight fixture and tangled overhead cables at dusk",
    "focal": {
      "x": 0.68,
      "y": 0.50
    },
    "introParagraph": "Public electrical infrastructure powers roadway lighting, traffic control, and neighborhood safety after dark. Sub-issues include burnt streetlights, damaged poles, open junction boxes, and low-hanging cables. Notifying distribution companies and municipal lighting cells helps eliminate electrocution hazards.",
    "responsibleAgencyNote": "In case of sparking cables, fallen live wires, or active electrical hazards, keep a safe distance and call emergency services at 112 immediately. The responsible electricity distribution company or municipal lighting department can differ by city.",
    "resolutionSteps": [
        "Survey damaged luminaire, pole defect, or electrical cable fault",
        "De-energize circuit section and dispatch qualified line maintenance technicians",
        "Replace burnt lamps, repair wiring connections, or secure open junction covers",
        "Conduct illumination and voltage stability check with photographic proof"
    ],
    "isEmergency": true
  },
  "public-health": {
    "slug": "public-health",
    "name": "Public Health",
    "description": "Community sanitation, public restroom hygiene, vector breeding containment, and market cleanliness.",
    "alt": "Neglected municipal public toilet block with weathered tiles, rusted door, and standing puddle in an urban lane",
    "focal": {
      "x": 0.70,
      "y": 0.52
    },
    "introParagraph": "Public health maintenance centers on sanitary surroundings, disease vector control, and hygienic food environments. Citizens can report mosquito breeding grounds, open defecation, medical waste dumping, and unsanitary food vendors. Reports support health inspectorates and municipal epidemiology units.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Identify sanitary hazard, stagnant water breeding zone, or biological waste",
        "Deploy municipal health workers equipped with protective safety gear",
        "Clear sanitary waste, apply larvicidal treatment, and disinfect surroundings",
        "Record photographic proof confirming sanitary compliance and public safety"
    ],
    "isEmergency": false
  },
  "environment": {
    "slug": "environment",
    "name": "Environment",
    "description": "Ambient air quality, urban water bodies, industrial emissions, construction dust, and tree protection.",
    "alt": "Dried-up urban canal bed with cracked parched mud, scattered plastic waste, and dry scrub under hazy sky",
    "focal": {
      "x": 0.65,
      "y": 0.55
    },
    "introParagraph": "Urban ecological health depends on air quality protection, water body conservation, and green buffer management. This category tracks tree felling, garbage burning, industrial smoke, lake contamination, and plastic waste accumulation. Reports assist pollution control committees and urban foresters.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Inspect reported pollution source, illegal burning, or tree damage location",
        "Coordinate with municipal environmental inspectors and ward officers",
        "Halt unauthorized activity, clear polluting residue, and secure the area",
        "Document environmental remediation and log findings for regulatory records"
    ],
    "isEmergency": false
  },
  "parks-greenery": {
    "slug": "parks-greenery",
    "name": "Parks & Greenery",
    "description": "Neighborhood park upkeep, children play equipment, horticulture, pathways, and green space lighting.",
    "alt": "Overgrown municipal park corner with a broken bench and wild thorny weeds bursting through a stone walking path",
    "focal": {
      "x": 0.68,
      "y": 0.50
    },
    "introParagraph": "Public parks, botanical gardens, and roadside green strips provide recreational open space in urban clusters. Issues include broken play equipment, dying plant beds, damaged walking tracks, missing lighting, and park encroachment. Reports guide horticulture departments in maintaining urban green spaces.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Survey broken park fixtures, fallen branches, or damaged walking tracks",
        "Dispatch horticulture crew with pruning, landscaping, and civil repair tools",
        "Prune hazardous tree limbs, repair recreational benches, and remove green waste",
        "Photograph revitalized park grounds and restored pedestrian walkways"
    ],
    "isEmergency": false
  },
  "public-safety": {
    "slug": "public-safety",
    "name": "Public Safety",
    "description": "Hazardous trenches, structural instability, fallen trees, building collapse risks, and emergency access.",
    "alt": "Dim unlit pedestrian corridor entrance with peeling plaster walls, broken flagstones, and defunct streetlamp bracket",
    "focal": {
      "x": 0.68,
      "y": 0.55
    },
    "introParagraph": "Public safety covers physical security risks, dark streets, hazardous structures, and anti-social behavior in civic spaces. Documenting unlit corners, missing police booths, open construction pits, and dilapidated buildings aids municipal enforcement and local police jurisdictions.",
    "responsibleAgencyNote": "If someone is in immediate danger or an active crime is taking place, dial 112 immediately. The responsible municipal or law enforcement agency can differ by city.",
    "resolutionSteps": [
        "Assess structural hazard, missing guardrail, or open construction trench",
        "Cordon off the hazardous perimeter with high-visibility safety barriers",
        "Dispatch civil engineering technicians to repair, secure, or reinforce the structure",
        "Verify physical stability and record completed safety remediation proof"
    ],
    "isEmergency": true
  },
  "public-transport": {
    "slug": "public-transport",
    "name": "Public Transport",
    "description": "Transit shelters, bus stops, pedestrian crossing safety, traffic signals, and parking facility order.",
    "alt": "Dilapidated municipal transit bus shelter with a bent corrugated metal roof and rusted frame beside an open road",
    "focal": {
      "x": 0.65,
      "y": 0.50
    },
    "introParagraph": "Public transport networks comprise city buses, metro stations, auto stands, and transit interchanges. This section covers broken bus shelters, missing route charts, overcrowded stops, and reckless commercial driving. Civic reporting provides field feedback to municipal transport undertakings.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Inspect damaged bus shelter, broken bench, or transit stop signage defect",
        "Schedule transit maintenance team with replacement shelter panels or hardware",
        "Repair shelter roof, install updated route displays, and secure passenger seating",
        "Submit photo proof verifying functional public transit stop restoration"
    ],
    "isEmergency": false
  },
  "animal-welfare": {
    "slug": "animal-welfare",
    "name": "Animal Welfare",
    "description": "Stray animal safety, traffic obstruction by cattle, carcass disposal, and veterinary sanitization.",
    "alt": "Indie street dog with an ear-notch resting near an overturned wooden cart on a quiet sunlit street corner",
    "focal": {
      "x": 0.70,
      "y": 0.55
    },
    "introParagraph": "Urban animal management balances public safety with humane treatment of stray and injured animals. This category includes aggressive stray packs, injured cattle, dead animal carcass removal, and rabies concerns. Submissions help municipal veterinary departments and partner animal welfare organizations.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Assess animal distress, carcass removal need, or stray obstruction on road",
        "Deploy certified municipal veterinary team or specialized animal rescue van",
        "Provide humane rescue, medical triage, or sanitized carcass disposal",
        "Upload photo confirmation and log veterinary shelter transfer records"
    ],
    "isEmergency": false
  },
  "encroachment": {
    "slug": "encroachment",
    "name": "Encroachment",
    "description": "Footpath obstruction, illegal street vending, unauthorized construction, and public land misuse.",
    "alt": "Makeshift wooden vendor stalls, stacked crates, and tarpaulin awnings completely occupying a pedestrian footpath",
    "focal": {
      "x": 0.72,
      "y": 0.50
    },
    "introParagraph": "Encroachment concerns the unauthorized occupation of public roads, pedestrian walkways, and government land. Issues include street vendor blockages, unauthorized construction, illegal parking structures, and occupied pavements. Timely notices support anti-encroachment squads and town planning enforcement.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Survey public footpath or road margin obstruction against municipal records",
        "Issue administrative compliance notice and coordinate ward clearance team",
        "Remove unauthorized stalls, banners, or barriers to reopen public access",
        "Document unobstructed pedestrian right-of-way with geo-tagged photographs"
    ],
    "isEmergency": false
  },
  "public-amenities": {
    "slug": "public-amenities",
    "name": "Public Amenities",
    "description": "Drinking water taps, public seating, community halls, disabled ramps, and municipal elevators.",
    "alt": "Damaged municipal drinking water booth with a broken brass tap dripping into an algae-stained cracked stone basin",
    "focal": {
      "x": 0.68,
      "y": 0.50
    },
    "introParagraph": "Public amenities provide essential civic conveniences including community toilets, drinking water stations, benches, and public libraries. Issues include non-functional toilets, damaged water taps, vandalized bus shelters, and broken public clocks. Reports assist maintenance contractors and ward committees.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Check reported defect in public restroom, water kiosk, or civic amenity",
        "Assign plumbing, electrical, or civil technicians with required replacement parts",
        "Replace broken fixtures, restore water or lighting connections, and deep-clean facility",
        "Verify fully operational civic amenity with detailed photo records"
    ],
    "isEmergency": false
  },
  "fire-emergency": {
    "slug": "fire-emergency",
    "name": "Fire & Emergency",
    "description": "Fire hydrants, emergency evacuation routes, public extinguisher stations, and fire hazard prevention.",
    "alt": "Red municipal fire hydrant obstructed by parked two-wheelers and stacked timber against a brick wall with emergency hose box",
    "focal": {
      "x": 0.68,
      "y": 0.55
    },
    "introParagraph": "Fire safety and disaster readiness safeguard lives and commercial assets during civic emergencies. Issues include blocked fire hydrants, narrow emergency access lanes, missing fire exits, and electrical transformer hazards. Alerting agencies assists disaster management units and municipal fire brigades.",
    "responsibleAgencyNote": "For active fires, gas leaks, or life-threatening emergencies, call the Fire Service at 101 or emergency helpline 112 without delay. The responsible municipal fire brigade or disaster management authority can differ by city.",
    "resolutionSteps": [
        "Inspect reported fire hazard, blocked hydrant, or obstructed emergency exit",
        "Remove combustible debris, service hydrant valve, or clear evacuation lane",
        "Conduct water pressure check on hydrants and verify clear egress paths",
        "Submit photographic verification confirming fire safety compliance"
    ],
    "isEmergency": true
  },
  "urban-planning": {
    "slug": "urban-planning",
    "name": "Urban Planning",
    "description": "Master plan compliance, underserved settlements, drainage planning, and pedestrian infrastructure.",
    "alt": "Unfinished elevated flyover concrete pillar with exposed rebar and construction barricades in a dusty urban corridor",
    "focal": {
      "x": 0.68,
      "y": 0.50
    },
    "introParagraph": "Urban planning monitors zoning compliance, construction permissions, stormwater drainage reservation, and infrastructure setbacks. This section tracks illegal building additions, lack of rainwater harvesting, missing pedestrian corridors, and unauthorized land use changes. Feedback aids urban development authorities.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Inspect site for unauthorized construction or zoning setback violations",
        "Cross-reference ward master plan zoning and statutory building permissions",
        "Compile field survey findings and issue notice to relevant urban planning authority",
        "Photograph site conditions and archive spatial documentation for municipal review"
    ],
    "isEmergency": false
  },
  "commercial-areas": {
    "slug": "commercial-areas",
    "name": "Commercial Areas",
    "description": "Public market sanitation, commercial waste removal, market parking, and vendor corridor order.",
    "alt": "Crowded market bazaar lane with shop goods and cartons spilling onto the walkway under tangled overhead wiring",
    "focal": {
      "x": 0.70,
      "y": 0.50
    },
    "introParagraph": "Commercial hubs and local bazaars experience high footfall, trade waste, loading congestion, and signage proliferation. Issues include blocked shopping lanes, illegal advertising hoardings, unregulated loading vehicles, and poor market sanitation. Reports help market associations and commercial licensing inspectorates.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Assess commercial market congestion, trade waste accumulation, or lane obstruction",
        "Coordinate focused sanitation sweep and enforce designated vendor zones",
        "Repair broken market pavers, street lighting, and public waste receptacles",
        "Provide photographic evidence of clean, orderly commercial thoroughfares"
    ],
    "isEmergency": false
  },
  "public-property": {
    "slug": "public-property",
    "name": "Public Property",
    "description": "Municipal asset protection, heritage monument upkeep, street furniture repair, and anti-vandalism.",
    "alt": "Vandalized municipal park pavilion with chipped stone pillars, broken iron railings, and missing roof sheets",
    "focal": {
      "x": 0.70,
      "y": 0.55
    },
    "introParagraph": "Public property includes municipal buildings, historic monuments, civic statues, boundary walls, and public furniture. Reports cover graffiti, vandalism, broken boundary walls, damaged commemorative plaques, and neglected public offices. Submissions support municipal asset management and heritage conservation units.",
    "responsibleAgencyNote": "The responsible municipal corporation, development authority, or utility provider can differ by city.",
    "resolutionSteps": [
        "Inspect damaged public building wall, broken street furniture, or vandalized monument",
        "Schedule masonry, carpentry, painting, or specialized surface restoration",
        "Remove graffiti, repair masonry or metalwork, and apply protective sealant",
        "Upload comprehensive before-and-after photos of restored public asset"
    ],
    "isEmergency": false
  }
};

export const CIVIC_CONTENT: Record<string, CivicContentItem> = {
  "roads-transportation/road-potholes": {
    "slug": "road-potholes",
    "name": "Road potholes",
    "categorySlug": "roads-transportation",
    "description": "Road potholes reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Road potholes in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "roads-transportation/damaged-roads": {
    "slug": "damaged-roads",
    "name": "Damaged roads",
    "categorySlug": "roads-transportation",
    "description": "Damaged roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged roads in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "roads-transportation/broken-footpaths": {
    "slug": "broken-footpaths",
    "name": "Broken footpaths",
    "categorySlug": "roads-transportation",
    "description": "Broken footpaths reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken footpaths in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "roads-transportation/footpath-encroachment": {
    "slug": "footpath-encroachment",
    "name": "Footpath encroachment",
    "categorySlug": "roads-transportation",
    "description": "Footpath encroachment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Footpath encroachment in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-footpath-encroachment"
  },
  "roads-transportation/missing-road-dividers": {
    "slug": "missing-road-dividers",
    "name": "Missing road dividers",
    "categorySlug": "roads-transportation",
    "description": "Missing road dividers reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Missing road dividers in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "roads-transportation/damaged-speed-breakers": {
    "slug": "damaged-speed-breakers",
    "name": "Damaged speed breakers",
    "categorySlug": "roads-transportation",
    "description": "Damaged speed breakers reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged speed breakers in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "roads-transportation/traffic-signal-not-working": {
    "slug": "traffic-signal-not-working",
    "name": "Traffic signal not working",
    "categorySlug": "roads-transportation",
    "description": "Traffic signal not working reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Traffic signal not working in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-traffic-signal-defect"
  },
  "roads-transportation/missing-street-signboards": {
    "slug": "missing-street-signboards",
    "name": "Missing street signboards",
    "categorySlug": "roads-transportation",
    "description": "Missing street signboards reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Missing street signboards in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-street-sign-defect"
  },
  "roads-transportation/illegal-parking": {
    "slug": "illegal-parking",
    "name": "Illegal parking",
    "categorySlug": "roads-transportation",
    "description": "Illegal parking reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal parking in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-illegal-parking"
  },
  "roads-transportation/traffic-congestion": {
    "slug": "traffic-congestion",
    "name": "Traffic congestion",
    "categorySlug": "roads-transportation",
    "description": "Traffic congestion reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Traffic congestion in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "roads-transportation/waterlogging-on-roads": {
    "slug": "waterlogging-on-roads",
    "name": "Waterlogging on roads",
    "categorySlug": "roads-transportation",
    "description": "Waterlogging on roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Waterlogging on roads in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-waterlogging"
  },
  "roads-transportation/broken-manhole-covers": {
    "slug": "broken-manhole-covers",
    "name": "Broken manhole covers",
    "categorySlug": "roads-transportation",
    "description": "Broken manhole covers reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken manhole covers in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-manhole-defect"
  },
  "roads-transportation/damaged-bridges": {
    "slug": "damaged-bridges",
    "name": "Damaged bridges",
    "categorySlug": "roads-transportation",
    "description": "Damaged bridges reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged bridges in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "roads-transportation/roadside-construction-debris": {
    "slug": "roadside-construction-debris",
    "name": "Roadside construction debris",
    "categorySlug": "roads-transportation",
    "description": "Roadside construction debris reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Roadside construction debris in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "roads-transportation/missing-zebra-crossings": {
    "slug": "missing-zebra-crossings",
    "name": "Missing zebra crossings",
    "categorySlug": "roads-transportation",
    "description": "Missing zebra crossings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Missing zebra crossings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "roads-transportation/damaged-bus-stops": {
    "slug": "damaged-bus-stops",
    "name": "Damaged bus stops",
    "categorySlug": "roads-transportation",
    "description": "Damaged bus stops reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged bus stops in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-bus-stop-defect"
  },
  "roads-transportation/streetlights-not-working": {
    "slug": "streetlights-not-working",
    "name": "Streetlights not working",
    "categorySlug": "roads-transportation",
    "description": "Streetlights not working reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Streetlights not working in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-streetlight-defect"
  },
  "garbage-management/garbage-overflowing-from-dustbins": {
    "slug": "garbage-overflowing-from-dustbins",
    "name": "Garbage overflowing from dustbins",
    "categorySlug": "garbage-management",
    "description": "Garbage overflowing from dustbins reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Garbage overflowing from dustbins in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "garbage-management/garbage-not-collected": {
    "slug": "garbage-not-collected",
    "name": "Garbage not collected",
    "categorySlug": "garbage-management",
    "description": "Garbage not collected reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Garbage not collected in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "garbage-management/illegal-garbage-dumping": {
    "slug": "illegal-garbage-dumping",
    "name": "Illegal garbage dumping",
    "categorySlug": "garbage-management",
    "description": "Illegal garbage dumping reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal garbage dumping in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "garbage-management/open-garbage-burning": {
    "slug": "open-garbage-burning",
    "name": "Open garbage burning",
    "categorySlug": "garbage-management",
    "description": "Open garbage burning reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Open garbage burning in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-garbage-burning"
  },
  "garbage-management/plastic-waste-pollution": {
    "slug": "plastic-waste-pollution",
    "name": "Plastic waste pollution",
    "categorySlug": "garbage-management",
    "description": "Plastic waste pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Plastic waste pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "garbage-management/construction-waste-dumping": {
    "slug": "construction-waste-dumping",
    "name": "Construction waste dumping",
    "categorySlug": "garbage-management",
    "description": "Construction waste dumping reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Construction waste dumping in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "garbage-management/dead-animal-disposal": {
    "slug": "dead-animal-disposal",
    "name": "Dead animal disposal",
    "categorySlug": "garbage-management",
    "description": "Dead animal disposal reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dead animal disposal in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-animal-carcass"
  },
  "garbage-management/damaged-public-dustbins": {
    "slug": "damaged-public-dustbins",
    "name": "Damaged public dustbins",
    "categorySlug": "garbage-management",
    "description": "Damaged public dustbins reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public dustbins in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-dustbin-defect"
  },
  "garbage-management/garbage-scattered-on-roads": {
    "slug": "garbage-scattered-on-roads",
    "name": "Garbage scattered on roads",
    "categorySlug": "garbage-management",
    "description": "Garbage scattered on roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Garbage scattered on roads in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "garbage-management/waste-segregation-problems": {
    "slug": "waste-segregation-problems",
    "name": "Waste segregation problems",
    "categorySlug": "garbage-management",
    "description": "Waste segregation problems reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Waste segregation problems in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "garbage-management/biomedical-waste-dumping": {
    "slug": "biomedical-waste-dumping",
    "name": "Biomedical waste dumping",
    "categorySlug": "garbage-management",
    "description": "Biomedical waste dumping reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Biomedical waste dumping in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "garbage-management/market-waste-accumulation": {
    "slug": "market-waste-accumulation",
    "name": "Market waste accumulation",
    "categorySlug": "garbage-management",
    "description": "Market waste accumulation reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Market waste accumulation in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "garbage-management/open-waste-dumping-grounds": {
    "slug": "open-waste-dumping-grounds",
    "name": "Open waste dumping grounds",
    "categorySlug": "garbage-management",
    "description": "Open waste dumping grounds reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Open waste dumping grounds in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "garbage-management/garbage-collection-vehicle-not-arriving": {
    "slug": "garbage-collection-vehicle-not-arriving",
    "name": "Garbage collection vehicle not arriving",
    "categorySlug": "garbage-management",
    "description": "Garbage collection vehicle not arriving reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Garbage collection vehicle not arriving in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "garbage-management/bad-smell-from-garbage-areas": {
    "slug": "bad-smell-from-garbage-areas",
    "name": "Bad smell from garbage areas",
    "categorySlug": "garbage-management",
    "description": "Bad smell from garbage areas reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Bad smell from garbage areas in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "water-drainage/water-pipeline-leakage": {
    "slug": "water-pipeline-leakage",
    "name": "Water pipeline leakage",
    "categorySlug": "water-drainage",
    "description": "Water pipeline leakage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Water pipeline leakage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/no-water-supply": {
    "slug": "no-water-supply",
    "name": "No water supply",
    "categorySlug": "water-drainage",
    "description": "No water supply reported in public areas requiring municipal inspection and remedial action.",
    "alt": "No water supply in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/low-water-pressure": {
    "slug": "low-water-pressure",
    "name": "Low water pressure",
    "categorySlug": "water-drainage",
    "description": "Low water pressure reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Low water pressure in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "water-drainage/contaminated-drinking-water": {
    "slug": "contaminated-drinking-water",
    "name": "Contaminated drinking water",
    "categorySlug": "water-drainage",
    "description": "Contaminated drinking water reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Contaminated drinking water in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "water-drainage/dirty-water-supply": {
    "slug": "dirty-water-supply",
    "name": "Dirty water supply",
    "categorySlug": "water-drainage",
    "description": "Dirty water supply reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dirty water supply in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/broken-water-pipelines": {
    "slug": "broken-water-pipelines",
    "name": "Broken water pipelines",
    "categorySlug": "water-drainage",
    "description": "Broken water pipelines reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken water pipelines in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/open-drainage": {
    "slug": "open-drainage",
    "name": "Open drainage",
    "categorySlug": "water-drainage",
    "description": "Open drainage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Open drainage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/blocked-drains": {
    "slug": "blocked-drains",
    "name": "Blocked drains",
    "categorySlug": "water-drainage",
    "description": "Blocked drains reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Blocked drains in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/drainage-overflow": {
    "slug": "drainage-overflow",
    "name": "Drainage overflow",
    "categorySlug": "water-drainage",
    "description": "Drainage overflow reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Drainage overflow in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/sewage-leakage": {
    "slug": "sewage-leakage",
    "name": "Sewage leakage",
    "categorySlug": "water-drainage",
    "description": "Sewage leakage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Sewage leakage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "water-drainage/waterlogging": {
    "slug": "waterlogging",
    "name": "Waterlogging",
    "categorySlug": "water-drainage",
    "description": "Waterlogging reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Waterlogging in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-waterlogging"
  },
  "water-drainage/flooded-streets": {
    "slug": "flooded-streets",
    "name": "Flooded streets",
    "categorySlug": "water-drainage",
    "description": "Flooded streets reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Flooded streets in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-waterlogging"
  },
  "water-drainage/broken-manhole-covers": {
    "slug": "broken-manhole-covers",
    "name": "Broken manhole covers",
    "categorySlug": "water-drainage",
    "description": "Broken manhole covers reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken manhole covers in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-manhole-defect"
  },
  "water-drainage/rainwater-drainage-blockage": {
    "slug": "rainwater-drainage-blockage",
    "name": "Rainwater drainage blockage",
    "categorySlug": "water-drainage",
    "description": "Rainwater drainage blockage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Rainwater drainage blockage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/illegal-water-connections": {
    "slug": "illegal-water-connections",
    "name": "Illegal water connections",
    "categorySlug": "water-drainage",
    "description": "Illegal water connections reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal water connections in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "water-drainage/sewer-line-blockage": {
    "slug": "sewer-line-blockage",
    "name": "Sewer line blockage",
    "categorySlug": "water-drainage",
    "description": "Sewer line blockage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Sewer line blockage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "water-drainage/overflowing-septic-tanks": {
    "slug": "overflowing-septic-tanks",
    "name": "Overflowing septic tanks",
    "categorySlug": "water-drainage",
    "description": "Overflowing septic tanks reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Overflowing septic tanks in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "electricity-lighting/streetlights-not-working": {
    "slug": "streetlights-not-working",
    "name": "Streetlights not working",
    "categorySlug": "electricity-lighting",
    "description": "Streetlights not working reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Streetlights not working in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-streetlight-defect"
  },
  "electricity-lighting/damaged-electric-poles": {
    "slug": "damaged-electric-poles",
    "name": "Damaged electric poles",
    "categorySlug": "electricity-lighting",
    "description": "Damaged electric poles reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged electric poles in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "electricity-lighting/exposed-electrical-wires": {
    "slug": "exposed-electrical-wires",
    "name": "Exposed electrical wires",
    "categorySlug": "electricity-lighting",
    "description": "Exposed electrical wires reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Exposed electrical wires in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "electricity-lighting/fallen-electric-wires": {
    "slug": "fallen-electric-wires",
    "name": "Fallen electric wires",
    "categorySlug": "electricity-lighting",
    "description": "Fallen electric wires reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Fallen electric wires in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "electricity-lighting/damaged-transformers": {
    "slug": "damaged-transformers",
    "name": "Damaged transformers",
    "categorySlug": "electricity-lighting",
    "description": "Damaged transformers reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged transformers in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "electricity-lighting/electricity-supply-interruption": {
    "slug": "electricity-supply-interruption",
    "name": "Electricity supply interruption",
    "categorySlug": "electricity-lighting",
    "description": "Electricity supply interruption reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Electricity supply interruption in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "electricity-lighting/sparking-electrical-connections": {
    "slug": "sparking-electrical-connections",
    "name": "Sparking electrical connections",
    "categorySlug": "electricity-lighting",
    "description": "Sparking electrical connections reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Sparking electrical connections in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "electricity-lighting/open-electrical-junction-boxes": {
    "slug": "open-electrical-junction-boxes",
    "name": "Open electrical junction boxes",
    "categorySlug": "electricity-lighting",
    "description": "Open electrical junction boxes reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Open electrical junction boxes in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "electricity-lighting/broken-streetlight-poles": {
    "slug": "broken-streetlight-poles",
    "name": "Broken streetlight poles",
    "categorySlug": "electricity-lighting",
    "description": "Broken streetlight poles reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken streetlight poles in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "electricity-lighting/dark-public-areas": {
    "slug": "dark-public-areas",
    "name": "Dark public areas",
    "categorySlug": "electricity-lighting",
    "description": "Dark public areas reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dark public areas in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-streetlight-defect"
  },
  "electricity-lighting/illegal-electricity-connections": {
    "slug": "illegal-electricity-connections",
    "name": "Illegal electricity connections",
    "categorySlug": "electricity-lighting",
    "description": "Illegal electricity connections reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal electricity connections in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "electricity-lighting/electrical-safety-hazards": {
    "slug": "electrical-safety-hazards",
    "name": "Electrical safety hazards",
    "categorySlug": "electricity-lighting",
    "description": "Electrical safety hazards reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Electrical safety hazards in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-health/dirty-public-toilets": {
    "slug": "dirty-public-toilets",
    "name": "Dirty public toilets",
    "categorySlug": "public-health",
    "description": "Dirty public toilets reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dirty public toilets in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-public-toilet-defect"
  },
  "public-health/public-toilets-not-maintained": {
    "slug": "public-toilets-not-maintained",
    "name": "Public toilets not maintained",
    "categorySlug": "public-health",
    "description": "Public toilets not maintained reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public toilets not maintained in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-public-toilet-defect"
  },
  "public-health/mosquito-breeding-areas": {
    "slug": "mosquito-breeding-areas",
    "name": "Mosquito breeding areas",
    "categorySlug": "public-health",
    "description": "Mosquito breeding areas reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Mosquito breeding areas in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-health/open-defecation": {
    "slug": "open-defecation",
    "name": "Open defecation",
    "categorySlug": "public-health",
    "description": "Open defecation reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Open defecation in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-health/unhygienic-public-places": {
    "slug": "unhygienic-public-places",
    "name": "Unhygienic public places",
    "categorySlug": "public-health",
    "description": "Unhygienic public places reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unhygienic public places in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-health/public-urination": {
    "slug": "public-urination",
    "name": "Public urination",
    "categorySlug": "public-health",
    "description": "Public urination reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public urination in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-health/pest-infestation": {
    "slug": "pest-infestation",
    "name": "Pest infestation",
    "categorySlug": "public-health",
    "description": "Pest infestation reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Pest infestation in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-health/stray-animal-waste": {
    "slug": "stray-animal-waste",
    "name": "Stray animal waste",
    "categorySlug": "public-health",
    "description": "Stray animal waste reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Stray animal waste in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-health/contaminated-public-water-facilities": {
    "slug": "contaminated-public-water-facilities",
    "name": "Contaminated public water facilities",
    "categorySlug": "public-health",
    "description": "Contaminated public water facilities reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Contaminated public water facilities in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-health/poor-sanitation-in-public-markets": {
    "slug": "poor-sanitation-in-public-markets",
    "name": "Poor sanitation in public markets",
    "categorySlug": "public-health",
    "description": "Poor sanitation in public markets reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Poor sanitation in public markets in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-health/unhygienic-food-market-surroundings": {
    "slug": "unhygienic-food-market-surroundings",
    "name": "Unhygienic food market surroundings",
    "categorySlug": "public-health",
    "description": "Unhygienic food market surroundings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unhygienic food market surroundings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-health/public-health-hazards-caused-by-sewage": {
    "slug": "public-health-hazards-caused-by-sewage",
    "name": "Public health hazards caused by sewage",
    "categorySlug": "public-health",
    "description": "Public health hazards caused by sewage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public health hazards caused by sewage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "environment/air-pollution": {
    "slug": "air-pollution",
    "name": "Air pollution",
    "categorySlug": "environment",
    "description": "Air pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Air pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "environment/water-pollution": {
    "slug": "water-pollution",
    "name": "Water pollution",
    "categorySlug": "environment",
    "description": "Water pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Water pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "environment/noise-pollution": {
    "slug": "noise-pollution",
    "name": "Noise pollution",
    "categorySlug": "environment",
    "description": "Noise pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Noise pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "environment/soil-pollution": {
    "slug": "soil-pollution",
    "name": "Soil pollution",
    "categorySlug": "environment",
    "description": "Soil pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Soil pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "environment/industrial-smoke-pollution": {
    "slug": "industrial-smoke-pollution",
    "name": "Industrial smoke pollution",
    "categorySlug": "environment",
    "description": "Industrial smoke pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Industrial smoke pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "environment/burning-of-garbage": {
    "slug": "burning-of-garbage",
    "name": "Burning of garbage",
    "categorySlug": "environment",
    "description": "Burning of garbage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Burning of garbage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-garbage-burning"
  },
  "environment/illegal-tree-cutting": {
    "slug": "illegal-tree-cutting",
    "name": "Illegal tree cutting",
    "categorySlug": "environment",
    "description": "Illegal tree cutting reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal tree cutting in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "environment/tree-damage": {
    "slug": "tree-damage",
    "name": "Tree damage",
    "categorySlug": "environment",
    "description": "Tree damage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Tree damage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "environment/river-pollution": {
    "slug": "river-pollution",
    "name": "River pollution",
    "categorySlug": "environment",
    "description": "River pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "River pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "environment/pond-and-lake-pollution": {
    "slug": "pond-and-lake-pollution",
    "name": "Pond and lake pollution",
    "categorySlug": "environment",
    "description": "Pond and lake pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Pond and lake pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "environment/plastic-pollution": {
    "slug": "plastic-pollution",
    "name": "Plastic pollution",
    "categorySlug": "environment",
    "description": "Plastic pollution reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Plastic pollution in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "environment/dust-pollution-from-construction": {
    "slug": "dust-pollution-from-construction",
    "name": "Dust pollution from construction",
    "categorySlug": "environment",
    "description": "Dust pollution from construction reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dust pollution from construction in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "environment/chemical-waste-dumping": {
    "slug": "chemical-waste-dumping",
    "name": "Chemical waste dumping",
    "categorySlug": "environment",
    "description": "Chemical waste dumping reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Chemical waste dumping in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "environment/encroachment-on-green-spaces": {
    "slug": "encroachment-on-green-spaces",
    "name": "Encroachment on green spaces",
    "categorySlug": "environment",
    "description": "Encroachment on green spaces reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Encroachment on green spaces in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "environment/loss-of-urban-greenery": {
    "slug": "loss-of-urban-greenery",
    "name": "Loss of urban greenery",
    "categorySlug": "environment",
    "description": "Loss of urban greenery reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Loss of urban greenery in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "parks-greenery/poor-park-maintenance": {
    "slug": "poor-park-maintenance",
    "name": "Poor park maintenance",
    "categorySlug": "parks-greenery",
    "description": "Poor park maintenance reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Poor park maintenance in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "parks-greenery/damaged-park-benches": {
    "slug": "damaged-park-benches",
    "name": "Damaged park benches",
    "categorySlug": "parks-greenery",
    "description": "Damaged park benches reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged park benches in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-public-bench-defect"
  },
  "parks-greenery/broken-childrens-swings": {
    "slug": "broken-childrens-swings",
    "name": "Broken children's swings",
    "categorySlug": "parks-greenery",
    "description": "Broken children's swings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken children's swings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "parks-greenery/damaged-playground-equipment": {
    "slug": "damaged-playground-equipment",
    "name": "Damaged playground equipment",
    "categorySlug": "parks-greenery",
    "description": "Damaged playground equipment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged playground equipment in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "parks-greenery/overgrown-grass": {
    "slug": "overgrown-grass",
    "name": "Overgrown grass",
    "categorySlug": "parks-greenery",
    "description": "Overgrown grass reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Overgrown grass in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "parks-greenery/trees-requiring-trimming": {
    "slug": "trees-requiring-trimming",
    "name": "Trees requiring trimming",
    "categorySlug": "parks-greenery",
    "description": "Trees requiring trimming reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Trees requiring trimming in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "parks-greenery/dead-plants": {
    "slug": "dead-plants",
    "name": "Dead plants",
    "categorySlug": "parks-greenery",
    "description": "Dead plants reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dead plants in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "parks-greenery/damaged-walking-tracks": {
    "slug": "damaged-walking-tracks",
    "name": "Damaged walking tracks",
    "categorySlug": "parks-greenery",
    "description": "Damaged walking tracks reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged walking tracks in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "parks-greenery/broken-park-lights": {
    "slug": "broken-park-lights",
    "name": "Broken park lights",
    "categorySlug": "parks-greenery",
    "description": "Broken park lights reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken park lights in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-streetlight-defect"
  },
  "parks-greenery/public-park-encroachment": {
    "slug": "public-park-encroachment",
    "name": "Public park encroachment",
    "categorySlug": "parks-greenery",
    "description": "Public park encroachment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public park encroachment in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "parks-greenery/illegal-dumping-in-parks": {
    "slug": "illegal-dumping-in-parks",
    "name": "Illegal dumping in parks",
    "categorySlug": "parks-greenery",
    "description": "Illegal dumping in parks reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal dumping in parks in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "parks-greenery/damaged-public-fountains": {
    "slug": "damaged-public-fountains",
    "name": "Damaged public fountains",
    "categorySlug": "parks-greenery",
    "description": "Damaged public fountains reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public fountains in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "parks-greenery/public-garden-water-supply-issue": {
    "slug": "public-garden-water-supply-issue",
    "name": "Public garden water supply issue",
    "categorySlug": "parks-greenery",
    "description": "Public garden water supply issue reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public garden water supply issue in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "parks-greenery/lack-of-dustbins-in-parks": {
    "slug": "lack-of-dustbins-in-parks",
    "name": "Lack of dustbins in parks",
    "categorySlug": "parks-greenery",
    "description": "Lack of dustbins in parks reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Lack of dustbins in parks in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-dustbin-defect"
  },
  "public-safety/open-manholes": {
    "slug": "open-manholes",
    "name": "Open manholes",
    "categorySlug": "public-safety",
    "description": "Open manholes reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Open manholes in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-manhole-defect"
  },
  "public-safety/damaged-manhole-covers": {
    "slug": "damaged-manhole-covers",
    "name": "Damaged manhole covers",
    "categorySlug": "public-safety",
    "description": "Damaged manhole covers reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged manhole covers in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-manhole-defect"
  },
  "public-safety/fallen-trees-blocking-roads": {
    "slug": "fallen-trees-blocking-roads",
    "name": "Fallen trees blocking roads",
    "categorySlug": "public-safety",
    "description": "Fallen trees blocking roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Fallen trees blocking roads in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-safety/dangerous-hanging-wires": {
    "slug": "dangerous-hanging-wires",
    "name": "Dangerous hanging wires",
    "categorySlug": "public-safety",
    "description": "Dangerous hanging wires reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dangerous hanging wires in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-safety/damaged-public-structures": {
    "slug": "damaged-public-structures",
    "name": "Damaged public structures",
    "categorySlug": "public-safety",
    "description": "Damaged public structures reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public structures in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-safety/unsafe-bridges": {
    "slug": "unsafe-bridges",
    "name": "Unsafe bridges",
    "categorySlug": "public-safety",
    "description": "Unsafe bridges reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unsafe bridges in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-safety/damaged-public-staircases": {
    "slug": "damaged-public-staircases",
    "name": "Damaged public staircases",
    "categorySlug": "public-safety",
    "description": "Damaged public staircases reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public staircases in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-safety/broken-safety-railings": {
    "slug": "broken-safety-railings",
    "name": "Broken safety railings",
    "categorySlug": "public-safety",
    "description": "Broken safety railings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken safety railings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-safety/dangerous-construction-sites": {
    "slug": "dangerous-construction-sites",
    "name": "Dangerous construction sites",
    "categorySlug": "public-safety",
    "description": "Dangerous construction sites reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dangerous construction sites in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-safety/risk-of-building-collapse": {
    "slug": "risk-of-building-collapse",
    "name": "Risk of building collapse",
    "categorySlug": "public-safety",
    "description": "Risk of building collapse reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Risk of building collapse in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-safety/uncovered-construction-pits": {
    "slug": "uncovered-construction-pits",
    "name": "Uncovered construction pits",
    "categorySlug": "public-safety",
    "description": "Uncovered construction pits reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Uncovered construction pits in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-safety/damaged-public-property": {
    "slug": "damaged-public-property",
    "name": "Damaged public property",
    "categorySlug": "public-safety",
    "description": "Damaged public property reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public property in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-safety/fire-safety-hazards": {
    "slug": "fire-safety-hazards",
    "name": "Fire safety hazards",
    "categorySlug": "public-safety",
    "description": "Fire safety hazards reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Fire safety hazards in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-fire-hazard"
  },
  "public-safety/blocked-emergency-access": {
    "slug": "blocked-emergency-access",
    "name": "Blocked emergency access",
    "categorySlug": "public-safety",
    "description": "Blocked emergency access reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Blocked emergency access in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-emergency-access-blocked"
  },
  "public-safety/unsafe-public-buildings": {
    "slug": "unsafe-public-buildings",
    "name": "Unsafe public buildings",
    "categorySlug": "public-safety",
    "description": "Unsafe public buildings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unsafe public buildings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-transport/damaged-bus-stops": {
    "slug": "damaged-bus-stops",
    "name": "Damaged bus stops",
    "categorySlug": "public-transport",
    "description": "Damaged bus stops reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged bus stops in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-bus-stop-defect"
  },
  "public-transport/missing-bus-shelters": {
    "slug": "missing-bus-shelters",
    "name": "Missing bus shelters",
    "categorySlug": "public-transport",
    "description": "Missing bus shelters reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Missing bus shelters in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-bus-stop-defect"
  },
  "public-transport/bus-stop-cleanliness-issues": {
    "slug": "bus-stop-cleanliness-issues",
    "name": "Bus stop cleanliness issues",
    "categorySlug": "public-transport",
    "description": "Bus stop cleanliness issues reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Bus stop cleanliness issues in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-transport/illegal-roadside-parking": {
    "slug": "illegal-roadside-parking",
    "name": "Illegal roadside parking",
    "categorySlug": "public-transport",
    "description": "Illegal roadside parking reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal roadside parking in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-illegal-parking"
  },
  "public-transport/parking-space-encroachment": {
    "slug": "parking-space-encroachment",
    "name": "Parking space encroachment",
    "categorySlug": "public-transport",
    "description": "Parking space encroachment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Parking space encroachment in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-transport/damaged-public-parking-facilities": {
    "slug": "damaged-public-parking-facilities",
    "name": "Damaged public parking facilities",
    "categorySlug": "public-transport",
    "description": "Damaged public parking facilities reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public parking facilities in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-transport/broken-traffic-signals": {
    "slug": "broken-traffic-signals",
    "name": "Broken traffic signals",
    "categorySlug": "public-transport",
    "description": "Broken traffic signals reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken traffic signals in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-traffic-signal-defect"
  },
  "public-transport/missing-traffic-signs": {
    "slug": "missing-traffic-signs",
    "name": "Missing traffic signs",
    "categorySlug": "public-transport",
    "description": "Missing traffic signs reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Missing traffic signs in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-street-sign-defect"
  },
  "public-transport/missing-bus-route-information": {
    "slug": "missing-bus-route-information",
    "name": "Missing bus route information",
    "categorySlug": "public-transport",
    "description": "Missing bus route information reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Missing bus route information in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-transport/public-transport-accessibility-issues": {
    "slug": "public-transport-accessibility-issues",
    "name": "Public transport accessibility issues",
    "categorySlug": "public-transport",
    "description": "Public transport accessibility issues reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public transport accessibility issues in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-transport/blocked-pedestrian-crossings": {
    "slug": "blocked-pedestrian-crossings",
    "name": "Blocked pedestrian crossings",
    "categorySlug": "public-transport",
    "description": "Blocked pedestrian crossings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Blocked pedestrian crossings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-transport/auto-and-taxi-stand-encroachment": {
    "slug": "auto-and-taxi-stand-encroachment",
    "name": "Auto and taxi stand encroachment",
    "categorySlug": "public-transport",
    "description": "Auto and taxi stand encroachment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Auto and taxi stand encroachment in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-transport/unsafe-pedestrian-crossings": {
    "slug": "unsafe-pedestrian-crossings",
    "name": "Unsafe pedestrian crossings",
    "categorySlug": "public-transport",
    "description": "Unsafe pedestrian crossings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unsafe pedestrian crossings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-transport/damaged-bus-terminal-facilities": {
    "slug": "damaged-bus-terminal-facilities",
    "name": "Damaged bus terminal facilities",
    "categorySlug": "public-transport",
    "description": "Damaged bus terminal facilities reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged bus terminal facilities in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "animal-welfare/stray-cattle-on-roads": {
    "slug": "stray-cattle-on-roads",
    "name": "Stray cattle on roads",
    "categorySlug": "animal-welfare",
    "description": "Stray cattle on roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Stray cattle and a bull resting along an asphalt road kerb at an Indian street corner with traffic slowing down",
    "focal": {
      "x": 0.55,
      "y": 0.52
    },
    "defaultPriority": "Medium"
  },
  "animal-welfare/stray-dogs": {
    "slug": "stray-dogs",
    "name": "Stray dogs",
    "categorySlug": "animal-welfare",
    "description": "Stray dogs reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Group of native Indian stray dogs resting peacefully along an urban street curb and paved sidewalk",
    "focal": {
      "x": 0.5,
      "y": 0.55
    },
    "defaultPriority": "Medium"
  },
  "animal-welfare/injured-stray-animals": {
    "slug": "injured-stray-animals",
    "name": "Injured stray animals",
    "categorySlug": "animal-welfare",
    "description": "Injured stray animals reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Rescued stray indie dog resting on a paved sidewalk with a neat white medical bandage on its leg",
    "focal": {
      "x": 0.5,
      "y": 0.55
    },
    "defaultPriority": "High"
  },
  "animal-welfare/dead-animals-on-roads": {
    "slug": "dead-animals-on-roads",
    "name": "Dead animals on roads",
    "categorySlug": "animal-welfare",
    "description": "Dead animals on roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Municipal emergency hazard service truck parked alongside a cordoned roadside clearance zone with cones",
    "focal": {
      "x": 0.55,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "animal-welfare/animal-carcass-disposal": {
    "slug": "animal-carcass-disposal",
    "name": "Animal carcass disposal",
    "categorySlug": "animal-welfare",
    "description": "Animal carcass disposal reported in public areas requiring municipal inspection and remedial action.",
    "alt": "White municipal sanitation utility pickup truck with covered waste containment units and safety cones",
    "focal": {
      "x": 0.52,
      "y": 0.52
    },
    "defaultPriority": "High"
  },
  "animal-welfare/illegal-animal-shelters": {
    "slug": "illegal-animal-shelters",
    "name": "Illegal animal shelters",
    "categorySlug": "animal-welfare",
    "description": "Illegal animal shelters reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Makeshift unauthorized animal enclosure constructed from corrugated tin sheets and wire mesh on public land",
    "focal": {
      "x": 0.5,
      "y": 0.52
    },
    "defaultPriority": "Low"
  },
  "animal-welfare/animal-cruelty": {
    "slug": "animal-cruelty",
    "name": "Animal cruelty",
    "categorySlug": "animal-welfare",
    "description": "Animal cruelty reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Overloaded wooden cart stacked with heavy gunny sacks pulled along an urban road by a draught ox",
    "focal": {
      "x": 0.55,
      "y": 0.52
    },
    "defaultPriority": "High"
  },
  "animal-welfare/stray-animals-near-schools": {
    "slug": "stray-animals-near-schools",
    "name": "Stray animals near schools",
    "categorySlug": "animal-welfare",
    "description": "Stray animals near schools reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Stray cow and dogs wandering along the road verge outside a public school perimeter wall and gate",
    "focal": {
      "x": 0.52,
      "y": 0.55
    },
    "defaultPriority": "Medium"
  },
  "animal-welfare/cattle-blocking-traffic": {
    "slug": "cattle-blocking-traffic",
    "name": "Cattle blocking traffic",
    "categorySlug": "animal-welfare",
    "description": "Cattle blocking traffic reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Three stray cattle sitting in the center lane of an Indian city roadway causing traffic to slow down",
    "focal": {
      "x": 0.52,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "animal-welfare/abandoned-animals": {
    "slug": "abandoned-animals",
    "name": "Abandoned animals",
    "categorySlug": "animal-welfare",
    "description": "Abandoned animals reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Abandoned mixed-breed pet dog with a faded collar sitting patiently near a sidewalk curb next to a water bowl",
    "focal": {
      "x": 0.5,
      "y": 0.55
    },
    "defaultPriority": "Low"
  },
  "animal-welfare/unhygienic-animal-shelters": {
    "slug": "unhygienic-animal-shelters",
    "name": "Unhygienic animal shelters",
    "categorySlug": "animal-welfare",
    "description": "Unhygienic animal shelters reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unhygienic animal shelter yard with muddy ground, stagnant water puddles, scattered straw, and rusted fencing",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "animal-welfare/illegal-slaughterhouse-waste-disposal": {
    "slug": "illegal-slaughterhouse-waste-disposal",
    "name": "Illegal slaughterhouse waste disposal",
    "categorySlug": "animal-welfare",
    "description": "Illegal slaughterhouse waste disposal reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Discarded heavy black municipal waste sacks and bagged organic refuse dumped near a roadside drain ditch",
    "focal": {
      "x": 0.52,
      "y": 0.52
    },
    "defaultPriority": "Critical"
  },
  "encroachment/illegal-roadside-shops": {
    "slug": "illegal-roadside-shops",
    "name": "Illegal roadside shops",
    "categorySlug": "encroachment",
    "description": "Illegal roadside shops reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Roadside vegetable stall and wooden crates encroaching along a public street in India",
    "focal": {
      "x": 0.52,
      "y": 0.52
    },
    "defaultPriority": "Medium"
  },
  "encroachment/footpath-encroachment": {
    "slug": "footpath-encroachment",
    "name": "Footpath encroachment",
    "categorySlug": "encroachment",
    "description": "Footpath encroachment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Handcart, goods, and merchandise obstructing a pedestrian sidewalk in an Indian city",
    "focal": {
      "x": 0.5,
      "y": 0.55
    },
    "defaultPriority": "Medium"
  },
  "encroachment/road-encroachment": {
    "slug": "road-encroachment",
    "name": "Road encroachment",
    "categorySlug": "encroachment",
    "description": "Road encroachment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Commercial market stalls and parked vehicles encroaching onto active driving lanes of a busy road",
    "focal": {
      "x": 0.55,
      "y": 0.52
    },
    "defaultPriority": "High"
  },
  "encroachment/illegal-construction": {
    "slug": "illegal-construction",
    "name": "Illegal construction",
    "categorySlug": "encroachment",
    "description": "Illegal construction reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Multi-story concrete building under construction with exposed framework and missing setbacks",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "encroachment/unauthorized-building-extensions": {
    "slug": "unauthorized-building-extensions",
    "name": "Unauthorized building extensions",
    "categorySlug": "encroachment",
    "description": "Unauthorized building extensions reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Overhanging building extensions and upper balconies protruding into public street airspace in Chandni Chowk",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "encroachment/illegal-hoardings": {
    "slug": "illegal-hoardings",
    "name": "Illegal hoardings",
    "categorySlug": "encroachment",
    "description": "Illegal hoardings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Towering iron billboard advertising hoarding erected over a public city roadway in Bangalore",
    "focal": {
      "x": 0.52,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "encroachment/unauthorized-street-vendors-blocking-roads": {
    "slug": "unauthorized-street-vendors-blocking-roads",
    "name": "Unauthorized street vendors blocking roads",
    "categorySlug": "encroachment",
    "description": "Unauthorized street vendors blocking roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Mobile street vegetable vendor with pushcart set up along the road margin creating traffic bottleneck",
    "focal": {
      "x": 0.52,
      "y": 0.55
    },
    "defaultPriority": "Medium"
  },
  "encroachment/public-land-encroachment": {
    "slug": "public-land-encroachment",
    "name": "Public land encroachment",
    "categorySlug": "encroachment",
    "description": "Public land encroachment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Temporary makeshift huts and informal structures occupying vacant municipal reserve land",
    "focal": {
      "x": 0.5,
      "y": 0.52
    },
    "defaultPriority": "High"
  },
  "encroachment/illegal-parking-structures": {
    "slug": "illegal-parking-structures",
    "name": "Illegal parking structures",
    "categorySlug": "encroachment",
    "description": "Illegal parking structures reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Makeshift parking barriers, chains, and vehicles crowding a paved pedestrian pavement border",
    "focal": {
      "x": 0.52,
      "y": 0.52
    },
    "defaultPriority": "Medium"
  },
  "encroachment/construction-beyond-approved-limits": {
    "slug": "construction-beyond-approved-limits",
    "name": "Construction beyond approved limits",
    "categorySlug": "encroachment",
    "description": "Construction beyond approved limits reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Extensive bamboo scaffolding extending outward from a building facade across the public street corridor",
    "focal": {
      "x": 0.5,
      "y": 0.52
    },
    "defaultPriority": "High"
  },
  "encroachment/illegal-dumping-on-public-land": {
    "slug": "illegal-dumping-on-public-land",
    "name": "Illegal dumping on public land",
    "categorySlug": "encroachment",
    "description": "Illegal dumping on public land reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Piles of dumped solid waste, construction rubble, and refuse scattered along open public roadside land",
    "focal": {
      "x": 0.5,
      "y": 0.52
    },
    "defaultPriority": "Medium"
  },
  "encroachment/encroachment-on-drainage-channels": {
    "slug": "encroachment-on-drainage-channels",
    "name": "Encroachment on drainage channels",
    "categorySlug": "encroachment",
    "description": "Encroachment on drainage channels reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Open roadside stormwater drainage canal alignment showing ground encroachments and obstructions",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-amenities/damaged-public-benches": {
    "slug": "damaged-public-benches",
    "name": "Damaged public benches",
    "categorySlug": "public-amenities",
    "description": "Damaged public benches reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public park bench with splintered wooden slats and worn weathered iron frame",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-amenities/broken-public-drinking-water-taps": {
    "slug": "broken-public-drinking-water-taps",
    "name": "Broken public drinking water taps",
    "categorySlug": "public-amenities",
    "description": "Broken public drinking water taps reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public community drinking water standpost tap with concrete basin requiring municipal repair",
    "focal": {
      "x": 0.5,
      "y": 0.52
    },
    "defaultPriority": "Medium"
  },
  "public-amenities/public-toilets-unavailable": {
    "slug": "public-toilets-unavailable",
    "name": "Public toilets unavailable",
    "categorySlug": "public-amenities",
    "description": "Public toilets unavailable reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Municipal public toilet block exterior in an urban neighborhood requiring sanitation maintenance",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-amenities/damaged-bus-shelters": {
    "slug": "damaged-bus-shelters",
    "name": "Damaged bus shelters",
    "categorySlug": "public-amenities",
    "description": "Damaged bus shelters reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Weathered roadside commuter bus stop shelter with aging corrugated roof and worn platform",
    "focal": {
      "x": 0.5,
      "y": 0.52
    },
    "defaultPriority": "Medium"
  },
  "public-amenities/broken-public-dustbins": {
    "slug": "broken-public-dustbins",
    "name": "Broken public dustbins",
    "categorySlug": "public-amenities",
    "description": "Broken public dustbins reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Cylindrical public street litter bin mounted along a paved sidewalk requiring municipal attention",
    "focal": {
      "x": 0.52,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-amenities/damaged-community-halls": {
    "slug": "damaged-community-halls",
    "name": "Damaged community halls",
    "categorySlug": "public-amenities",
    "description": "Damaged community halls reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Aging weathered public civic community building with peeling paint, weathered roof, and exterior wear",
    "focal": {
      "x": 0.5,
      "y": 0.52
    },
    "defaultPriority": "Low"
  },
  "public-amenities/poorly-maintained-public-markets": {
    "slug": "poorly-maintained-public-markets",
    "name": "Poorly maintained public markets",
    "categorySlug": "public-amenities",
    "description": "Poorly maintained public markets reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Traditional municipal public market arcade with weathered stall structures in Hyderabad",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-amenities/damaged-public-playgrounds": {
    "slug": "damaged-public-playgrounds",
    "name": "Damaged public playgrounds",
    "categorySlug": "public-amenities",
    "description": "Damaged public playgrounds reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Outdoor children playground swings in a public civic nature park requiring equipment maintenance",
    "focal": {
      "x": 0.5,
      "y": 0.55
    },
    "defaultPriority": "Medium"
  },
  "public-amenities/lack-of-public-seating": {
    "slug": "lack-of-public-seating",
    "name": "Lack of public seating",
    "categorySlug": "public-amenities",
    "description": "Lack of public seating reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broad paved public pedestrian plaza completely devoid of benches or seating facilities for citizens",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-amenities/missing-disabled-access-ramps": {
    "slug": "missing-disabled-access-ramps",
    "name": "Missing disabled-access ramps",
    "categorySlug": "public-amenities",
    "description": "Missing disabled-access ramps reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Steep grand public entrance flight of stairs presenting physical access barriers for wheelchair users",
    "focal": {
      "x": 0.5,
      "y": 0.52
    },
    "defaultPriority": "High"
  },
  "public-amenities/broken-public-elevators": {
    "slug": "broken-public-elevators",
    "name": "Broken public elevators",
    "categorySlug": "public-amenities",
    "description": "Broken public elevators reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public passenger lift tower structure displaying out of order maintenance status",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-amenities/public-facility-accessibility-issues": {
    "slug": "public-facility-accessibility-issues",
    "name": "Public facility accessibility issues",
    "categorySlug": "public-amenities",
    "description": "Public facility accessibility issues reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Wheelchair access ramp installation at public facility entrance in Tamil Nadu requiring accessibility audit",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "fire-emergency/damaged-fire-hydrants": {
    "slug": "damaged-fire-hydrants",
    "name": "Damaged fire hydrants",
    "categorySlug": "fire-emergency",
    "description": "Damaged fire hydrants reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged fire hydrants in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "fire-emergency/blocked-fire-hydrants": {
    "slug": "blocked-fire-hydrants",
    "name": "Blocked fire hydrants",
    "categorySlug": "fire-emergency",
    "description": "Blocked fire hydrants reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Blocked fire hydrants in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "fire-emergency/blocked-fire-exits": {
    "slug": "blocked-fire-exits",
    "name": "Blocked fire exits",
    "categorySlug": "fire-emergency",
    "description": "Blocked fire exits reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Blocked fire exits in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "fire-emergency/missing-fire-extinguishers-in-public-facilities": {
    "slug": "missing-fire-extinguishers-in-public-facilities",
    "name": "Missing fire extinguishers in public facilities",
    "categorySlug": "fire-emergency",
    "description": "Missing fire extinguishers in public facilities reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Missing fire extinguishers in public facilities in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "fire-emergency/blocked-emergency-access-roads": {
    "slug": "blocked-emergency-access-roads",
    "name": "Blocked emergency access roads",
    "categorySlug": "fire-emergency",
    "description": "Blocked emergency access roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Blocked emergency access roads in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-emergency-access-blocked"
  },
  "fire-emergency/fire-hazards-in-public-markets": {
    "slug": "fire-hazards-in-public-markets",
    "name": "Fire hazards in public markets",
    "categorySlug": "fire-emergency",
    "description": "Fire hazards in public markets reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Fire hazards in public markets in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-fire-hazard"
  },
  "fire-emergency/dangerous-electrical-short-circuits": {
    "slug": "dangerous-electrical-short-circuits",
    "name": "Dangerous electrical short circuits",
    "categorySlug": "fire-emergency",
    "description": "Dangerous electrical short circuits reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dangerous electrical short circuits in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "fire-emergency/fire-incidents-in-public-buildings": {
    "slug": "fire-incidents-in-public-buildings",
    "name": "Fire incidents in public buildings",
    "categorySlug": "fire-emergency",
    "description": "Fire incidents in public buildings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Fire incidents in public buildings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "fire-emergency/obstructed-emergency-response-access": {
    "slug": "obstructed-emergency-response-access",
    "name": "Obstructed emergency response access",
    "categorySlug": "fire-emergency",
    "description": "Obstructed emergency response access reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Obstructed emergency response access in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical",
    "imageKey": "shared-emergency-access-blocked"
  },
  "urban-planning/poorly-maintained-public-housing": {
    "slug": "poorly-maintained-public-housing",
    "name": "Poorly maintained public housing",
    "categorySlug": "urban-planning",
    "description": "Poorly maintained public housing reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Poorly maintained public housing in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "urban-planning/sanitation-problems-in-underserved-settlements": {
    "slug": "sanitation-problems-in-underserved-settlements",
    "name": "Sanitation problems in underserved settlements",
    "categorySlug": "urban-planning",
    "description": "Sanitation problems in underserved settlements reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Sanitation problems in underserved settlements in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "urban-planning/illegal-land-use-changes": {
    "slug": "illegal-land-use-changes",
    "name": "Illegal land-use changes",
    "categorySlug": "urban-planning",
    "description": "Illegal land-use changes reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal land-use changes in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "urban-planning/unauthorized-building-construction": {
    "slug": "unauthorized-building-construction",
    "name": "Unauthorized building construction",
    "categorySlug": "urban-planning",
    "description": "Unauthorized building construction reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unauthorized building construction in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "urban-planning/unsafe-residential-structures": {
    "slug": "unsafe-residential-structures",
    "name": "Unsafe residential structures",
    "categorySlug": "urban-planning",
    "description": "Unsafe residential structures reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unsafe residential structures in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "urban-planning/poor-street-layout": {
    "slug": "poor-street-layout",
    "name": "Poor street layout",
    "categorySlug": "urban-planning",
    "description": "Poor street layout reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Poor street layout in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "urban-planning/inadequate-public-infrastructure": {
    "slug": "inadequate-public-infrastructure",
    "name": "Inadequate public infrastructure",
    "categorySlug": "urban-planning",
    "description": "Inadequate public infrastructure reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Inadequate public infrastructure in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "urban-planning/lack-of-pedestrian-infrastructure": {
    "slug": "lack-of-pedestrian-infrastructure",
    "name": "Lack of pedestrian infrastructure",
    "categorySlug": "urban-planning",
    "description": "Lack of pedestrian infrastructure reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Lack of pedestrian infrastructure in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "urban-planning/improper-drainage-planning": {
    "slug": "improper-drainage-planning",
    "name": "Improper drainage planning",
    "categorySlug": "urban-planning",
    "description": "Improper drainage planning reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Improper drainage planning in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "urban-planning/unplanned-urban-development": {
    "slug": "unplanned-urban-development",
    "name": "Unplanned urban development",
    "categorySlug": "urban-planning",
    "description": "Unplanned urban development reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unplanned urban development in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "urban-planning/public-land-misuse": {
    "slug": "public-land-misuse",
    "name": "Public land misuse",
    "categorySlug": "urban-planning",
    "description": "Public land misuse reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Public land misuse in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "urban-planning/inaccessible-public-infrastructure": {
    "slug": "inaccessible-public-infrastructure",
    "name": "Inaccessible public infrastructure",
    "categorySlug": "urban-planning",
    "description": "Inaccessible public infrastructure reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Inaccessible public infrastructure in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "commercial-areas/dirty-market-areas": {
    "slug": "dirty-market-areas",
    "name": "Dirty market areas",
    "categorySlug": "commercial-areas",
    "description": "Dirty market areas reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Dirty market areas in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "commercial-areas/garbage-accumulation-in-markets": {
    "slug": "garbage-accumulation-in-markets",
    "name": "Garbage accumulation in markets",
    "categorySlug": "commercial-areas",
    "description": "Garbage accumulation in markets reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Garbage accumulation in markets in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "commercial-areas/blocked-market-drainage": {
    "slug": "blocked-market-drainage",
    "name": "Blocked market drainage",
    "categorySlug": "commercial-areas",
    "description": "Blocked market drainage reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Blocked market drainage in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "commercial-areas/illegal-market-encroachment": {
    "slug": "illegal-market-encroachment",
    "name": "Illegal market encroachment",
    "categorySlug": "commercial-areas",
    "description": "Illegal market encroachment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal market encroachment in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "commercial-areas/damaged-market-roads": {
    "slug": "damaged-market-roads",
    "name": "Damaged market roads",
    "categorySlug": "commercial-areas",
    "description": "Damaged market roads reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged market roads in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "commercial-areas/lack-of-public-toilets": {
    "slug": "lack-of-public-toilets",
    "name": "Lack of public toilets",
    "categorySlug": "commercial-areas",
    "description": "Lack of public toilets reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Lack of public toilets in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-public-toilet-defect"
  },
  "commercial-areas/broken-market-streetlights": {
    "slug": "broken-market-streetlights",
    "name": "Broken market streetlights",
    "categorySlug": "commercial-areas",
    "description": "Broken market streetlights reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken market streetlights in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High",
    "imageKey": "shared-streetlight-defect"
  },
  "commercial-areas/unhygienic-meat-and-fish-market-surroundings": {
    "slug": "unhygienic-meat-and-fish-market-surroundings",
    "name": "Unhygienic meat and fish market surroundings",
    "categorySlug": "commercial-areas",
    "description": "Unhygienic meat and fish market surroundings reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Unhygienic meat and fish market surroundings in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "commercial-areas/illegal-waste-disposal": {
    "slug": "illegal-waste-disposal",
    "name": "Illegal waste disposal",
    "categorySlug": "commercial-areas",
    "description": "Illegal waste disposal reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Illegal waste disposal in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "commercial-areas/poor-market-parking-management": {
    "slug": "poor-market-parking-management",
    "name": "Poor market parking management",
    "categorySlug": "commercial-areas",
    "description": "Poor market parking management reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Poor market parking management in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-property/broken-public-benches": {
    "slug": "broken-public-benches",
    "name": "Broken public benches",
    "categorySlug": "public-property",
    "description": "Broken public benches reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken public benches in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-public-bench-defect"
  },
  "public-property/damaged-street-signs": {
    "slug": "damaged-street-signs",
    "name": "Damaged street signs",
    "categorySlug": "public-property",
    "description": "Damaged street signs reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged street signs in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-street-sign-defect"
  },
  "public-property/broken-bus-stop-structures": {
    "slug": "broken-bus-stop-structures",
    "name": "Broken bus stop structures",
    "categorySlug": "public-property",
    "description": "Broken bus stop structures reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken bus stop structures in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-bus-stop-defect"
  },
  "public-property/damaged-public-toilets": {
    "slug": "damaged-public-toilets",
    "name": "Damaged public toilets",
    "categorySlug": "public-property",
    "description": "Damaged public toilets reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public toilets in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium",
    "imageKey": "shared-public-toilet-defect"
  },
  "public-property/wall-graffiti": {
    "slug": "wall-graffiti",
    "name": "Wall graffiti",
    "categorySlug": "public-property",
    "description": "Wall graffiti reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Wall graffiti in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low"
  },
  "public-property/damage-to-public-monuments": {
    "slug": "damage-to-public-monuments",
    "name": "Damage to public monuments",
    "categorySlug": "public-property",
    "description": "Damage to public monuments reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damage to public monuments in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "High"
  },
  "public-property/broken-park-equipment": {
    "slug": "broken-park-equipment",
    "name": "Broken park equipment",
    "categorySlug": "public-property",
    "description": "Broken park equipment reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Broken park equipment in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  },
  "public-property/damaged-public-dustbins": {
    "slug": "damaged-public-dustbins",
    "name": "Damaged public dustbins",
    "categorySlug": "public-property",
    "description": "Damaged public dustbins reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Damaged public dustbins in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Low",
    "imageKey": "shared-dustbin-defect"
  },
  "public-property/theft-of-public-infrastructure": {
    "slug": "theft-of-public-infrastructure",
    "name": "Theft of public infrastructure",
    "categorySlug": "public-property",
    "description": "Theft of public infrastructure reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Theft of public infrastructure in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Critical"
  },
  "public-property/vandalism-of-public-property": {
    "slug": "vandalism-of-public-property",
    "name": "Vandalism of public property",
    "categorySlug": "public-property",
    "description": "Vandalism of public property reported in public areas requiring municipal inspection and remedial action.",
    "alt": "Vandalism of public property in an urban setting",
    "focal": {
      "x": 0.5,
      "y": 0.5
    },
    "defaultPriority": "Medium"
  }
};
