export interface CivicSubCategory {
  name: string;
  slug: string;
  order: number;
  defaultPriority: 'Critical' | 'High' | 'Medium' | 'Low';
  isActive?: boolean;
  imageKey?: string;
}

export interface CivicCategoryTaxonomy {
  _id?: string;
  name: string;
  slug: string;
  order: number;
  icon: string;
  description: string;
  baseFeePaise: number;
  estimatedResolutionHours: number;
  freeRadiusKm: number;
  isActive?: boolean;
  subCategories: CivicSubCategory[];
}

export const CIVIC_TAXONOMY: CivicCategoryTaxonomy[] = [
  {
    "name": "Roads & Transportation",
    "slug": "roads-transportation",
    "order": 1,
    "icon": "navigation",
    "description": "Municipal road surfacing, pedestrian footpaths, traffic signals, and bridge structural safety.",
    "baseFeePaise": 60000,
    "estimatedResolutionHours": 48,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Road potholes",
        "slug": "road-potholes",
        "order": 1,
        "defaultPriority": "High"
      },
      {
        "name": "Damaged roads",
        "slug": "damaged-roads",
        "order": 2,
        "defaultPriority": "High"
      },
      {
        "name": "Broken footpaths",
        "slug": "broken-footpaths",
        "order": 3,
        "defaultPriority": "Medium"
      },
      {
        "name": "Footpath encroachment",
        "slug": "footpath-encroachment",
        "order": 4,
        "defaultPriority": "Medium",
        "imageKey": "shared-footpath-encroachment"
      },
      {
        "name": "Missing road dividers",
        "slug": "missing-road-dividers",
        "order": 5,
        "defaultPriority": "Medium"
      },
      {
        "name": "Damaged speed breakers",
        "slug": "damaged-speed-breakers",
        "order": 6,
        "defaultPriority": "Low"
      },
      {
        "name": "Traffic signal not working",
        "slug": "traffic-signal-not-working",
        "order": 7,
        "defaultPriority": "Critical",
        "imageKey": "shared-traffic-signal-defect"
      },
      {
        "name": "Missing street signboards",
        "slug": "missing-street-signboards",
        "order": 8,
        "defaultPriority": "Low",
        "imageKey": "shared-street-sign-defect"
      },
      {
        "name": "Illegal parking",
        "slug": "illegal-parking",
        "order": 9,
        "defaultPriority": "Low",
        "imageKey": "shared-illegal-parking"
      },
      {
        "name": "Traffic congestion",
        "slug": "traffic-congestion",
        "order": 10,
        "defaultPriority": "Medium"
      },
      {
        "name": "Waterlogging on roads",
        "slug": "waterlogging-on-roads",
        "order": 11,
        "defaultPriority": "High",
        "imageKey": "shared-waterlogging"
      },
      {
        "name": "Broken manhole covers",
        "slug": "broken-manhole-covers",
        "order": 12,
        "defaultPriority": "Critical",
        "imageKey": "shared-manhole-defect"
      },
      {
        "name": "Damaged bridges",
        "slug": "damaged-bridges",
        "order": 13,
        "defaultPriority": "Critical"
      },
      {
        "name": "Roadside construction debris",
        "slug": "roadside-construction-debris",
        "order": 14,
        "defaultPriority": "Medium"
      },
      {
        "name": "Missing zebra crossings",
        "slug": "missing-zebra-crossings",
        "order": 15,
        "defaultPriority": "Low"
      },
      {
        "name": "Damaged bus stops",
        "slug": "damaged-bus-stops",
        "order": 16,
        "defaultPriority": "Medium",
        "imageKey": "shared-bus-stop-defect"
      },
      {
        "name": "Streetlights not working",
        "slug": "streetlights-not-working",
        "order": 17,
        "defaultPriority": "High",
        "imageKey": "shared-streetlight-defect"
      }
    ]
  },
  {
    "name": "Garbage Management",
    "slug": "garbage-management",
    "order": 2,
    "icon": "trash-2",
    "description": "Domestic waste collection, municipal dustbin overflows, illegal dumping, and sanitary clearance.",
    "baseFeePaise": 30000,
    "estimatedResolutionHours": 24,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Garbage overflowing from dustbins",
        "slug": "garbage-overflowing-from-dustbins",
        "order": 1,
        "defaultPriority": "Medium"
      },
      {
        "name": "Garbage not collected",
        "slug": "garbage-not-collected",
        "order": 2,
        "defaultPriority": "Medium"
      },
      {
        "name": "Illegal garbage dumping",
        "slug": "illegal-garbage-dumping",
        "order": 3,
        "defaultPriority": "High"
      },
      {
        "name": "Open garbage burning",
        "slug": "open-garbage-burning",
        "order": 4,
        "defaultPriority": "High",
        "imageKey": "shared-garbage-burning"
      },
      {
        "name": "Plastic waste pollution",
        "slug": "plastic-waste-pollution",
        "order": 5,
        "defaultPriority": "Medium"
      },
      {
        "name": "Construction waste dumping",
        "slug": "construction-waste-dumping",
        "order": 6,
        "defaultPriority": "Medium"
      },
      {
        "name": "Dead animal disposal",
        "slug": "dead-animal-disposal",
        "order": 7,
        "defaultPriority": "High",
        "imageKey": "shared-animal-carcass"
      },
      {
        "name": "Damaged public dustbins",
        "slug": "damaged-public-dustbins",
        "order": 8,
        "defaultPriority": "Low",
        "imageKey": "shared-dustbin-defect"
      },
      {
        "name": "Garbage scattered on roads",
        "slug": "garbage-scattered-on-roads",
        "order": 9,
        "defaultPriority": "Medium"
      },
      {
        "name": "Waste segregation problems",
        "slug": "waste-segregation-problems",
        "order": 10,
        "defaultPriority": "Low"
      },
      {
        "name": "Biomedical waste dumping",
        "slug": "biomedical-waste-dumping",
        "order": 11,
        "defaultPriority": "Critical"
      },
      {
        "name": "Market waste accumulation",
        "slug": "market-waste-accumulation",
        "order": 12,
        "defaultPriority": "High"
      },
      {
        "name": "Open waste dumping grounds",
        "slug": "open-waste-dumping-grounds",
        "order": 13,
        "defaultPriority": "High"
      },
      {
        "name": "Garbage collection vehicle not arriving",
        "slug": "garbage-collection-vehicle-not-arriving",
        "order": 14,
        "defaultPriority": "Medium"
      },
      {
        "name": "Bad smell from garbage areas",
        "slug": "bad-smell-from-garbage-areas",
        "order": 15,
        "defaultPriority": "Medium"
      }
    ]
  },
  {
    "name": "Water & Drainage",
    "slug": "water-drainage",
    "order": 3,
    "icon": "droplets",
    "description": "Drinking water pipelines, sewer blockages, drainage overflow, and municipal water pressure.",
    "baseFeePaise": 45000,
    "estimatedResolutionHours": 36,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Water pipeline leakage",
        "slug": "water-pipeline-leakage",
        "order": 1,
        "defaultPriority": "High"
      },
      {
        "name": "No water supply",
        "slug": "no-water-supply",
        "order": 2,
        "defaultPriority": "High"
      },
      {
        "name": "Low water pressure",
        "slug": "low-water-pressure",
        "order": 3,
        "defaultPriority": "Low"
      },
      {
        "name": "Contaminated drinking water",
        "slug": "contaminated-drinking-water",
        "order": 4,
        "defaultPriority": "Critical"
      },
      {
        "name": "Dirty water supply",
        "slug": "dirty-water-supply",
        "order": 5,
        "defaultPriority": "High"
      },
      {
        "name": "Broken water pipelines",
        "slug": "broken-water-pipelines",
        "order": 6,
        "defaultPriority": "High"
      },
      {
        "name": "Open drainage",
        "slug": "open-drainage",
        "order": 7,
        "defaultPriority": "High"
      },
      {
        "name": "Blocked drains",
        "slug": "blocked-drains",
        "order": 8,
        "defaultPriority": "High"
      },
      {
        "name": "Drainage overflow",
        "slug": "drainage-overflow",
        "order": 9,
        "defaultPriority": "High"
      },
      {
        "name": "Sewage leakage",
        "slug": "sewage-leakage",
        "order": 10,
        "defaultPriority": "Critical"
      },
      {
        "name": "Waterlogging",
        "slug": "waterlogging",
        "order": 11,
        "defaultPriority": "High",
        "imageKey": "shared-waterlogging"
      },
      {
        "name": "Flooded streets",
        "slug": "flooded-streets",
        "order": 12,
        "defaultPriority": "High",
        "imageKey": "shared-waterlogging"
      },
      {
        "name": "Broken manhole covers",
        "slug": "broken-manhole-covers",
        "order": 13,
        "defaultPriority": "Critical",
        "imageKey": "shared-manhole-defect"
      },
      {
        "name": "Rainwater drainage blockage",
        "slug": "rainwater-drainage-blockage",
        "order": 14,
        "defaultPriority": "High"
      },
      {
        "name": "Illegal water connections",
        "slug": "illegal-water-connections",
        "order": 15,
        "defaultPriority": "Medium"
      },
      {
        "name": "Sewer line blockage",
        "slug": "sewer-line-blockage",
        "order": 16,
        "defaultPriority": "High"
      },
      {
        "name": "Overflowing septic tanks",
        "slug": "overflowing-septic-tanks",
        "order": 17,
        "defaultPriority": "High"
      }
    ]
  },
  {
    "name": "Electricity & Lighting",
    "slug": "electricity-lighting",
    "order": 4,
    "icon": "zap",
    "description": "Public street illumination, fallen power lines, hazardous transformers, and junction boxes.",
    "baseFeePaise": 35000,
    "estimatedResolutionHours": 24,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Streetlights not working",
        "slug": "streetlights-not-working",
        "order": 1,
        "defaultPriority": "High",
        "imageKey": "shared-streetlight-defect"
      },
      {
        "name": "Damaged electric poles",
        "slug": "damaged-electric-poles",
        "order": 2,
        "defaultPriority": "High"
      },
      {
        "name": "Exposed electrical wires",
        "slug": "exposed-electrical-wires",
        "order": 3,
        "defaultPriority": "Critical"
      },
      {
        "name": "Fallen electric wires",
        "slug": "fallen-electric-wires",
        "order": 4,
        "defaultPriority": "Critical"
      },
      {
        "name": "Damaged transformers",
        "slug": "damaged-transformers",
        "order": 5,
        "defaultPriority": "Critical"
      },
      {
        "name": "Electricity supply interruption",
        "slug": "electricity-supply-interruption",
        "order": 6,
        "defaultPriority": "High"
      },
      {
        "name": "Sparking electrical connections",
        "slug": "sparking-electrical-connections",
        "order": 7,
        "defaultPriority": "Critical"
      },
      {
        "name": "Open electrical junction boxes",
        "slug": "open-electrical-junction-boxes",
        "order": 8,
        "defaultPriority": "Critical"
      },
      {
        "name": "Broken streetlight poles",
        "slug": "broken-streetlight-poles",
        "order": 9,
        "defaultPriority": "Medium"
      },
      {
        "name": "Dark public areas",
        "slug": "dark-public-areas",
        "order": 10,
        "defaultPriority": "High",
        "imageKey": "shared-streetlight-defect"
      },
      {
        "name": "Illegal electricity connections",
        "slug": "illegal-electricity-connections",
        "order": 11,
        "defaultPriority": "Medium"
      },
      {
        "name": "Electrical safety hazards",
        "slug": "electrical-safety-hazards",
        "order": 12,
        "defaultPriority": "Critical"
      }
    ]
  },
  {
    "name": "Public Health",
    "slug": "public-health",
    "order": 5,
    "icon": "heart-pulse",
    "description": "Community sanitation, public restroom hygiene, vector breeding containment, and market cleanliness.",
    "baseFeePaise": 35000,
    "estimatedResolutionHours": 24,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Dirty public toilets",
        "slug": "dirty-public-toilets",
        "order": 1,
        "defaultPriority": "Medium",
        "imageKey": "shared-public-toilet-defect"
      },
      {
        "name": "Public toilets not maintained",
        "slug": "public-toilets-not-maintained",
        "order": 2,
        "defaultPriority": "Medium",
        "imageKey": "shared-public-toilet-defect"
      },
      {
        "name": "Mosquito breeding areas",
        "slug": "mosquito-breeding-areas",
        "order": 3,
        "defaultPriority": "High"
      },
      {
        "name": "Open defecation",
        "slug": "open-defecation",
        "order": 4,
        "defaultPriority": "High"
      },
      {
        "name": "Unhygienic public places",
        "slug": "unhygienic-public-places",
        "order": 5,
        "defaultPriority": "Medium"
      },
      {
        "name": "Public urination",
        "slug": "public-urination",
        "order": 6,
        "defaultPriority": "Low"
      },
      {
        "name": "Pest infestation",
        "slug": "pest-infestation",
        "order": 7,
        "defaultPriority": "Medium"
      },
      {
        "name": "Stray animal waste",
        "slug": "stray-animal-waste",
        "order": 8,
        "defaultPriority": "Low"
      },
      {
        "name": "Contaminated public water facilities",
        "slug": "contaminated-public-water-facilities",
        "order": 9,
        "defaultPriority": "Critical"
      },
      {
        "name": "Poor sanitation in public markets",
        "slug": "poor-sanitation-in-public-markets",
        "order": 10,
        "defaultPriority": "High"
      },
      {
        "name": "Unhygienic food market surroundings",
        "slug": "unhygienic-food-market-surroundings",
        "order": 11,
        "defaultPriority": "High"
      },
      {
        "name": "Public health hazards caused by sewage",
        "slug": "public-health-hazards-caused-by-sewage",
        "order": 12,
        "defaultPriority": "Critical"
      }
    ]
  },
  {
    "name": "Environment",
    "slug": "environment",
    "order": 6,
    "icon": "leaf",
    "description": "Ambient air quality, urban water bodies, industrial emissions, construction dust, and tree protection.",
    "baseFeePaise": 30000,
    "estimatedResolutionHours": 48,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Air pollution",
        "slug": "air-pollution",
        "order": 1,
        "defaultPriority": "High"
      },
      {
        "name": "Water pollution",
        "slug": "water-pollution",
        "order": 2,
        "defaultPriority": "High"
      },
      {
        "name": "Noise pollution",
        "slug": "noise-pollution",
        "order": 3,
        "defaultPriority": "Medium"
      },
      {
        "name": "Soil pollution",
        "slug": "soil-pollution",
        "order": 4,
        "defaultPriority": "Medium"
      },
      {
        "name": "Industrial smoke pollution",
        "slug": "industrial-smoke-pollution",
        "order": 5,
        "defaultPriority": "High"
      },
      {
        "name": "Burning of garbage",
        "slug": "burning-of-garbage",
        "order": 6,
        "defaultPriority": "High",
        "imageKey": "shared-garbage-burning"
      },
      {
        "name": "Illegal tree cutting",
        "slug": "illegal-tree-cutting",
        "order": 7,
        "defaultPriority": "High"
      },
      {
        "name": "Tree damage",
        "slug": "tree-damage",
        "order": 8,
        "defaultPriority": "Low"
      },
      {
        "name": "River pollution",
        "slug": "river-pollution",
        "order": 9,
        "defaultPriority": "High"
      },
      {
        "name": "Pond and lake pollution",
        "slug": "pond-and-lake-pollution",
        "order": 10,
        "defaultPriority": "High"
      },
      {
        "name": "Plastic pollution",
        "slug": "plastic-pollution",
        "order": 11,
        "defaultPriority": "Medium"
      },
      {
        "name": "Dust pollution from construction",
        "slug": "dust-pollution-from-construction",
        "order": 12,
        "defaultPriority": "Medium"
      },
      {
        "name": "Chemical waste dumping",
        "slug": "chemical-waste-dumping",
        "order": 13,
        "defaultPriority": "Critical"
      },
      {
        "name": "Encroachment on green spaces",
        "slug": "encroachment-on-green-spaces",
        "order": 14,
        "defaultPriority": "High"
      },
      {
        "name": "Loss of urban greenery",
        "slug": "loss-of-urban-greenery",
        "order": 15,
        "defaultPriority": "Medium"
      }
    ]
  },
  {
    "name": "Parks & Greenery",
    "slug": "parks-greenery",
    "order": 7,
    "icon": "trees",
    "description": "Neighborhood park upkeep, children play equipment, horticulture, pathways, and green space lighting.",
    "baseFeePaise": 30000,
    "estimatedResolutionHours": 48,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Poor park maintenance",
        "slug": "poor-park-maintenance",
        "order": 1,
        "defaultPriority": "Low"
      },
      {
        "name": "Damaged park benches",
        "slug": "damaged-park-benches",
        "order": 2,
        "defaultPriority": "Low",
        "imageKey": "shared-public-bench-defect"
      },
      {
        "name": "Broken children's swings",
        "slug": "broken-childrens-swings",
        "order": 3,
        "defaultPriority": "Medium"
      },
      {
        "name": "Damaged playground equipment",
        "slug": "damaged-playground-equipment",
        "order": 4,
        "defaultPriority": "Medium"
      },
      {
        "name": "Overgrown grass",
        "slug": "overgrown-grass",
        "order": 5,
        "defaultPriority": "Low"
      },
      {
        "name": "Trees requiring trimming",
        "slug": "trees-requiring-trimming",
        "order": 6,
        "defaultPriority": "Medium"
      },
      {
        "name": "Dead plants",
        "slug": "dead-plants",
        "order": 7,
        "defaultPriority": "Low"
      },
      {
        "name": "Damaged walking tracks",
        "slug": "damaged-walking-tracks",
        "order": 8,
        "defaultPriority": "Low"
      },
      {
        "name": "Broken park lights",
        "slug": "broken-park-lights",
        "order": 9,
        "defaultPriority": "Medium",
        "imageKey": "shared-streetlight-defect"
      },
      {
        "name": "Public park encroachment",
        "slug": "public-park-encroachment",
        "order": 10,
        "defaultPriority": "High"
      },
      {
        "name": "Illegal dumping in parks",
        "slug": "illegal-dumping-in-parks",
        "order": 11,
        "defaultPriority": "Medium"
      },
      {
        "name": "Damaged public fountains",
        "slug": "damaged-public-fountains",
        "order": 12,
        "defaultPriority": "Low"
      },
      {
        "name": "Public garden water supply issue",
        "slug": "public-garden-water-supply-issue",
        "order": 13,
        "defaultPriority": "Low"
      },
      {
        "name": "Lack of dustbins in parks",
        "slug": "lack-of-dustbins-in-parks",
        "order": 14,
        "defaultPriority": "Low",
        "imageKey": "shared-dustbin-defect"
      }
    ]
  },
  {
    "name": "Public Safety",
    "slug": "public-safety",
    "order": 8,
    "icon": "shield-alert",
    "description": "Hazardous trenches, structural instability, fallen trees, building collapse risks, and emergency access.",
    "baseFeePaise": 50000,
    "estimatedResolutionHours": 24,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Open manholes",
        "slug": "open-manholes",
        "order": 1,
        "defaultPriority": "Critical",
        "imageKey": "shared-manhole-defect"
      },
      {
        "name": "Damaged manhole covers",
        "slug": "damaged-manhole-covers",
        "order": 2,
        "defaultPriority": "Critical",
        "imageKey": "shared-manhole-defect"
      },
      {
        "name": "Fallen trees blocking roads",
        "slug": "fallen-trees-blocking-roads",
        "order": 3,
        "defaultPriority": "High"
      },
      {
        "name": "Dangerous hanging wires",
        "slug": "dangerous-hanging-wires",
        "order": 4,
        "defaultPriority": "Critical"
      },
      {
        "name": "Damaged public structures",
        "slug": "damaged-public-structures",
        "order": 5,
        "defaultPriority": "High"
      },
      {
        "name": "Unsafe bridges",
        "slug": "unsafe-bridges",
        "order": 6,
        "defaultPriority": "Critical"
      },
      {
        "name": "Damaged public staircases",
        "slug": "damaged-public-staircases",
        "order": 7,
        "defaultPriority": "High"
      },
      {
        "name": "Broken safety railings",
        "slug": "broken-safety-railings",
        "order": 8,
        "defaultPriority": "High"
      },
      {
        "name": "Dangerous construction sites",
        "slug": "dangerous-construction-sites",
        "order": 9,
        "defaultPriority": "High"
      },
      {
        "name": "Risk of building collapse",
        "slug": "risk-of-building-collapse",
        "order": 10,
        "defaultPriority": "Critical"
      },
      {
        "name": "Uncovered construction pits",
        "slug": "uncovered-construction-pits",
        "order": 11,
        "defaultPriority": "Critical"
      },
      {
        "name": "Damaged public property",
        "slug": "damaged-public-property",
        "order": 12,
        "defaultPriority": "Medium"
      },
      {
        "name": "Fire safety hazards",
        "slug": "fire-safety-hazards",
        "order": 13,
        "defaultPriority": "Critical",
        "imageKey": "shared-fire-hazard"
      },
      {
        "name": "Blocked emergency access",
        "slug": "blocked-emergency-access",
        "order": 14,
        "defaultPriority": "Critical",
        "imageKey": "shared-emergency-access-blocked"
      },
      {
        "name": "Unsafe public buildings",
        "slug": "unsafe-public-buildings",
        "order": 15,
        "defaultPriority": "Critical"
      }
    ]
  },
  {
    "name": "Public Transport",
    "slug": "public-transport",
    "order": 9,
    "icon": "bus",
    "description": "Transit shelters, bus stops, pedestrian crossing safety, traffic signals, and parking facility order.",
    "baseFeePaise": 40000,
    "estimatedResolutionHours": 48,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Damaged bus stops",
        "slug": "damaged-bus-stops",
        "order": 1,
        "defaultPriority": "Medium",
        "imageKey": "shared-bus-stop-defect"
      },
      {
        "name": "Missing bus shelters",
        "slug": "missing-bus-shelters",
        "order": 2,
        "defaultPriority": "Medium",
        "imageKey": "shared-bus-stop-defect"
      },
      {
        "name": "Bus stop cleanliness issues",
        "slug": "bus-stop-cleanliness-issues",
        "order": 3,
        "defaultPriority": "Low"
      },
      {
        "name": "Illegal roadside parking",
        "slug": "illegal-roadside-parking",
        "order": 4,
        "defaultPriority": "Medium",
        "imageKey": "shared-illegal-parking"
      },
      {
        "name": "Parking space encroachment",
        "slug": "parking-space-encroachment",
        "order": 5,
        "defaultPriority": "Medium"
      },
      {
        "name": "Damaged public parking facilities",
        "slug": "damaged-public-parking-facilities",
        "order": 6,
        "defaultPriority": "Medium"
      },
      {
        "name": "Broken traffic signals",
        "slug": "broken-traffic-signals",
        "order": 7,
        "defaultPriority": "Critical",
        "imageKey": "shared-traffic-signal-defect"
      },
      {
        "name": "Missing traffic signs",
        "slug": "missing-traffic-signs",
        "order": 8,
        "defaultPriority": "Low",
        "imageKey": "shared-street-sign-defect"
      },
      {
        "name": "Missing bus route information",
        "slug": "missing-bus-route-information",
        "order": 9,
        "defaultPriority": "Low"
      },
      {
        "name": "Public transport accessibility issues",
        "slug": "public-transport-accessibility-issues",
        "order": 10,
        "defaultPriority": "Medium"
      },
      {
        "name": "Blocked pedestrian crossings",
        "slug": "blocked-pedestrian-crossings",
        "order": 11,
        "defaultPriority": "Medium"
      },
      {
        "name": "Auto and taxi stand encroachment",
        "slug": "auto-and-taxi-stand-encroachment",
        "order": 12,
        "defaultPriority": "Medium"
      },
      {
        "name": "Unsafe pedestrian crossings",
        "slug": "unsafe-pedestrian-crossings",
        "order": 13,
        "defaultPriority": "High"
      },
      {
        "name": "Damaged bus terminal facilities",
        "slug": "damaged-bus-terminal-facilities",
        "order": 14,
        "defaultPriority": "Medium"
      }
    ]
  },
  {
    "name": "Animal Welfare",
    "slug": "animal-welfare",
    "order": 10,
    "icon": "paw-print",
    "description": "Stray animal safety, traffic obstruction by cattle, carcass disposal, and veterinary sanitization.",
    "baseFeePaise": 35000,
    "estimatedResolutionHours": 24,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Stray cattle on roads",
        "slug": "stray-cattle-on-roads",
        "order": 1,
        "defaultPriority": "Medium"
      },
      {
        "name": "Stray dogs",
        "slug": "stray-dogs",
        "order": 2,
        "defaultPriority": "Medium"
      },
      {
        "name": "Injured stray animals",
        "slug": "injured-stray-animals",
        "order": 3,
        "defaultPriority": "High"
      },
      {
        "name": "Dead animals on roads",
        "slug": "dead-animals-on-roads",
        "order": 4,
        "defaultPriority": "High",
        "imageKey": "shared-animal-carcass"
      },
      {
        "name": "Animal carcass disposal",
        "slug": "animal-carcass-disposal",
        "order": 5,
        "defaultPriority": "High",
        "imageKey": "shared-animal-carcass"
      },
      {
        "name": "Illegal animal shelters",
        "slug": "illegal-animal-shelters",
        "order": 6,
        "defaultPriority": "Low"
      },
      {
        "name": "Animal cruelty",
        "slug": "animal-cruelty",
        "order": 7,
        "defaultPriority": "High"
      },
      {
        "name": "Stray animals near schools",
        "slug": "stray-animals-near-schools",
        "order": 8,
        "defaultPriority": "Medium"
      },
      {
        "name": "Cattle blocking traffic",
        "slug": "cattle-blocking-traffic",
        "order": 9,
        "defaultPriority": "Medium"
      },
      {
        "name": "Abandoned animals",
        "slug": "abandoned-animals",
        "order": 10,
        "defaultPriority": "Low"
      },
      {
        "name": "Unhygienic animal shelters",
        "slug": "unhygienic-animal-shelters",
        "order": 11,
        "defaultPriority": "Low"
      },
      {
        "name": "Illegal slaughterhouse waste disposal",
        "slug": "illegal-slaughterhouse-waste-disposal",
        "order": 12,
        "defaultPriority": "Critical"
      }
    ]
  },
  {
    "name": "Encroachment",
    "slug": "encroachment",
    "order": 11,
    "icon": "alert-octagon",
    "description": "Footpath obstruction, illegal street vending, unauthorized construction, and public land misuse.",
    "baseFeePaise": 40000,
    "estimatedResolutionHours": 72,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Illegal roadside shops",
        "slug": "illegal-roadside-shops",
        "order": 1,
        "defaultPriority": "Medium"
      },
      {
        "name": "Footpath encroachment",
        "slug": "footpath-encroachment",
        "order": 2,
        "defaultPriority": "Medium",
        "imageKey": "shared-footpath-encroachment"
      },
      {
        "name": "Road encroachment",
        "slug": "road-encroachment",
        "order": 3,
        "defaultPriority": "High"
      },
      {
        "name": "Illegal construction",
        "slug": "illegal-construction",
        "order": 4,
        "defaultPriority": "High"
      },
      {
        "name": "Unauthorized building extensions",
        "slug": "unauthorized-building-extensions",
        "order": 5,
        "defaultPriority": "Medium"
      },
      {
        "name": "Illegal hoardings",
        "slug": "illegal-hoardings",
        "order": 6,
        "defaultPriority": "Low"
      },
      {
        "name": "Unauthorized street vendors blocking roads",
        "slug": "unauthorized-street-vendors-blocking-roads",
        "order": 7,
        "defaultPriority": "Medium"
      },
      {
        "name": "Public land encroachment",
        "slug": "public-land-encroachment",
        "order": 8,
        "defaultPriority": "High"
      },
      {
        "name": "Illegal parking structures",
        "slug": "illegal-parking-structures",
        "order": 9,
        "defaultPriority": "Medium"
      },
      {
        "name": "Construction beyond approved limits",
        "slug": "construction-beyond-approved-limits",
        "order": 10,
        "defaultPriority": "High"
      },
      {
        "name": "Illegal dumping on public land",
        "slug": "illegal-dumping-on-public-land",
        "order": 11,
        "defaultPriority": "Medium"
      },
      {
        "name": "Encroachment on drainage channels",
        "slug": "encroachment-on-drainage-channels",
        "order": 12,
        "defaultPriority": "Critical"
      }
    ]
  },
  {
    "name": "Public Amenities",
    "slug": "public-amenities",
    "order": 12,
    "icon": "building-2",
    "description": "Drinking water taps, public seating, community halls, disabled ramps, and municipal elevators.",
    "baseFeePaise": 35000,
    "estimatedResolutionHours": 48,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Damaged public benches",
        "slug": "damaged-public-benches",
        "order": 1,
        "defaultPriority": "Low",
        "imageKey": "shared-public-bench-defect"
      },
      {
        "name": "Broken public drinking water taps",
        "slug": "broken-public-drinking-water-taps",
        "order": 2,
        "defaultPriority": "Medium"
      },
      {
        "name": "Public toilets unavailable",
        "slug": "public-toilets-unavailable",
        "order": 3,
        "defaultPriority": "Medium",
        "imageKey": "shared-public-toilet-defect"
      },
      {
        "name": "Damaged bus shelters",
        "slug": "damaged-bus-shelters",
        "order": 4,
        "defaultPriority": "Medium",
        "imageKey": "shared-bus-stop-defect"
      },
      {
        "name": "Broken public dustbins",
        "slug": "broken-public-dustbins",
        "order": 5,
        "defaultPriority": "Low",
        "imageKey": "shared-dustbin-defect"
      },
      {
        "name": "Damaged community halls",
        "slug": "damaged-community-halls",
        "order": 6,
        "defaultPriority": "Low"
      },
      {
        "name": "Poorly maintained public markets",
        "slug": "poorly-maintained-public-markets",
        "order": 7,
        "defaultPriority": "Medium"
      },
      {
        "name": "Damaged public playgrounds",
        "slug": "damaged-public-playgrounds",
        "order": 8,
        "defaultPriority": "Medium"
      },
      {
        "name": "Lack of public seating",
        "slug": "lack-of-public-seating",
        "order": 9,
        "defaultPriority": "Low",
        "imageKey": "shared-public-bench-defect"
      },
      {
        "name": "Missing disabled-access ramps",
        "slug": "missing-disabled-access-ramps",
        "order": 10,
        "defaultPriority": "High"
      },
      {
        "name": "Broken public elevators",
        "slug": "broken-public-elevators",
        "order": 11,
        "defaultPriority": "High"
      },
      {
        "name": "Public facility accessibility issues",
        "slug": "public-facility-accessibility-issues",
        "order": 12,
        "defaultPriority": "High"
      }
    ]
  },
  {
    "name": "Fire & Emergency",
    "slug": "fire-emergency",
    "order": 13,
    "icon": "flame",
    "description": "Fire hydrants, emergency evacuation routes, public extinguisher stations, and fire hazard prevention.",
    "baseFeePaise": 50000,
    "estimatedResolutionHours": 12,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Damaged fire hydrants",
        "slug": "damaged-fire-hydrants",
        "order": 1,
        "defaultPriority": "Critical"
      },
      {
        "name": "Blocked fire hydrants",
        "slug": "blocked-fire-hydrants",
        "order": 2,
        "defaultPriority": "Critical"
      },
      {
        "name": "Blocked fire exits",
        "slug": "blocked-fire-exits",
        "order": 3,
        "defaultPriority": "Critical"
      },
      {
        "name": "Missing fire extinguishers in public facilities",
        "slug": "missing-fire-extinguishers-in-public-facilities",
        "order": 4,
        "defaultPriority": "High"
      },
      {
        "name": "Blocked emergency access roads",
        "slug": "blocked-emergency-access-roads",
        "order": 5,
        "defaultPriority": "Critical",
        "imageKey": "shared-emergency-access-blocked"
      },
      {
        "name": "Fire hazards in public markets",
        "slug": "fire-hazards-in-public-markets",
        "order": 6,
        "defaultPriority": "Critical",
        "imageKey": "shared-fire-hazard"
      },
      {
        "name": "Dangerous electrical short circuits",
        "slug": "dangerous-electrical-short-circuits",
        "order": 7,
        "defaultPriority": "Critical"
      },
      {
        "name": "Fire incidents in public buildings",
        "slug": "fire-incidents-in-public-buildings",
        "order": 8,
        "defaultPriority": "Critical"
      },
      {
        "name": "Obstructed emergency response access",
        "slug": "obstructed-emergency-response-access",
        "order": 9,
        "defaultPriority": "Critical",
        "imageKey": "shared-emergency-access-blocked"
      }
    ]
  },
  {
    "name": "Urban Planning",
    "slug": "urban-planning",
    "order": 14,
    "icon": "map-pin",
    "description": "Master plan compliance, underserved settlements, drainage planning, and pedestrian infrastructure.",
    "baseFeePaise": 40000,
    "estimatedResolutionHours": 72,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Poorly maintained public housing",
        "slug": "poorly-maintained-public-housing",
        "order": 1,
        "defaultPriority": "High"
      },
      {
        "name": "Sanitation problems in underserved settlements",
        "slug": "sanitation-problems-in-underserved-settlements",
        "order": 2,
        "defaultPriority": "High"
      },
      {
        "name": "Illegal land-use changes",
        "slug": "illegal-land-use-changes",
        "order": 3,
        "defaultPriority": "Medium"
      },
      {
        "name": "Unauthorized building construction",
        "slug": "unauthorized-building-construction",
        "order": 4,
        "defaultPriority": "High"
      },
      {
        "name": "Unsafe residential structures",
        "slug": "unsafe-residential-structures",
        "order": 5,
        "defaultPriority": "Critical"
      },
      {
        "name": "Poor street layout",
        "slug": "poor-street-layout",
        "order": 6,
        "defaultPriority": "Low"
      },
      {
        "name": "Inadequate public infrastructure",
        "slug": "inadequate-public-infrastructure",
        "order": 7,
        "defaultPriority": "Medium"
      },
      {
        "name": "Lack of pedestrian infrastructure",
        "slug": "lack-of-pedestrian-infrastructure",
        "order": 8,
        "defaultPriority": "Medium"
      },
      {
        "name": "Improper drainage planning",
        "slug": "improper-drainage-planning",
        "order": 9,
        "defaultPriority": "High"
      },
      {
        "name": "Unplanned urban development",
        "slug": "unplanned-urban-development",
        "order": 10,
        "defaultPriority": "Medium"
      },
      {
        "name": "Public land misuse",
        "slug": "public-land-misuse",
        "order": 11,
        "defaultPriority": "Medium"
      },
      {
        "name": "Inaccessible public infrastructure",
        "slug": "inaccessible-public-infrastructure",
        "order": 12,
        "defaultPriority": "High"
      }
    ]
  },
  {
    "name": "Commercial Areas",
    "slug": "commercial-areas",
    "order": 15,
    "icon": "store",
    "description": "Public market sanitation, commercial waste removal, market parking, and vendor corridor order.",
    "baseFeePaise": 35000,
    "estimatedResolutionHours": 24,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Dirty market areas",
        "slug": "dirty-market-areas",
        "order": 1,
        "defaultPriority": "Medium"
      },
      {
        "name": "Garbage accumulation in markets",
        "slug": "garbage-accumulation-in-markets",
        "order": 2,
        "defaultPriority": "High"
      },
      {
        "name": "Blocked market drainage",
        "slug": "blocked-market-drainage",
        "order": 3,
        "defaultPriority": "High"
      },
      {
        "name": "Illegal market encroachment",
        "slug": "illegal-market-encroachment",
        "order": 4,
        "defaultPriority": "Medium"
      },
      {
        "name": "Damaged market roads",
        "slug": "damaged-market-roads",
        "order": 5,
        "defaultPriority": "Medium"
      },
      {
        "name": "Lack of public toilets",
        "slug": "lack-of-public-toilets",
        "order": 6,
        "defaultPriority": "Medium",
        "imageKey": "shared-public-toilet-defect"
      },
      {
        "name": "Broken market streetlights",
        "slug": "broken-market-streetlights",
        "order": 7,
        "defaultPriority": "High",
        "imageKey": "shared-streetlight-defect"
      },
      {
        "name": "Unhygienic meat and fish market surroundings",
        "slug": "unhygienic-meat-and-fish-market-surroundings",
        "order": 8,
        "defaultPriority": "High"
      },
      {
        "name": "Illegal waste disposal",
        "slug": "illegal-waste-disposal",
        "order": 9,
        "defaultPriority": "High"
      },
      {
        "name": "Poor market parking management",
        "slug": "poor-market-parking-management",
        "order": 10,
        "defaultPriority": "Low"
      }
    ]
  },
  {
    "name": "Public Property",
    "slug": "public-property",
    "order": 16,
    "icon": "landmark",
    "description": "Municipal asset protection, heritage monument upkeep, street furniture repair, and anti-vandalism.",
    "baseFeePaise": 35000,
    "estimatedResolutionHours": 48,
    "freeRadiusKm": 3,
    "subCategories": [
      {
        "name": "Broken public benches",
        "slug": "broken-public-benches",
        "order": 1,
        "defaultPriority": "Low",
        "imageKey": "shared-public-bench-defect"
      },
      {
        "name": "Damaged street signs",
        "slug": "damaged-street-signs",
        "order": 2,
        "defaultPriority": "Low",
        "imageKey": "shared-street-sign-defect"
      },
      {
        "name": "Broken bus stop structures",
        "slug": "broken-bus-stop-structures",
        "order": 3,
        "defaultPriority": "Medium",
        "imageKey": "shared-bus-stop-defect"
      },
      {
        "name": "Damaged public toilets",
        "slug": "damaged-public-toilets",
        "order": 4,
        "defaultPriority": "Medium",
        "imageKey": "shared-public-toilet-defect"
      },
      {
        "name": "Wall graffiti",
        "slug": "wall-graffiti",
        "order": 5,
        "defaultPriority": "Low"
      },
      {
        "name": "Damage to public monuments",
        "slug": "damage-to-public-monuments",
        "order": 6,
        "defaultPriority": "High"
      },
      {
        "name": "Broken park equipment",
        "slug": "broken-park-equipment",
        "order": 7,
        "defaultPriority": "Medium"
      },
      {
        "name": "Damaged public dustbins",
        "slug": "damaged-public-dustbins",
        "order": 8,
        "defaultPriority": "Low",
        "imageKey": "shared-dustbin-defect"
      },
      {
        "name": "Theft of public infrastructure",
        "slug": "theft-of-public-infrastructure",
        "order": 9,
        "defaultPriority": "Critical"
      },
      {
        "name": "Vandalism of public property",
        "slug": "vandalism-of-public-property",
        "order": 10,
        "defaultPriority": "Medium"
      }
    ]
  }
];
