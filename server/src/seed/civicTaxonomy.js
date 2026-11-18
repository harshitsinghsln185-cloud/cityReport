/**
 * Complete Civic Taxonomy Reference & Seed Data
 * Extracted from docs/reference/civic-issues-list.pdf ("CroudReport Complete Civic Issues List")
 * Single source of truth for categories. All 16 municipal categories preserved with sub-categories removed.
 */

export const CIVIC_TAXONOMY = [
  {
    "name": "Roads & Transportation",
    "slug": "roads-transportation",
    "order": 1,
    "icon": "navigation",
    "description": "Municipal road surfacing, pedestrian footpaths, traffic signals, and bridge structural safety.",
    "baseFeePaise": 60000,
    "estimatedResolutionHours": 48,
    "freeRadiusKm": 3,
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
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
    "subCategories": []
  }
];

export default {
  CIVIC_TAXONOMY,
};
