export interface ImageCredit {
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
  focalPoint?: { x: number; y: number };
  priority?: string;
  categorySlug?: string;
}

export const CATEGORY_IMAGE_CREDITS: Record<string, ImageCredit> = {
  "roads-transportation": {
    "slug": "roads-transportation",
    "name": "Roads & Transportation",
    "source": "wikimedia-commons",
    "author": "Srvkumar09",
    "authorUrl": "https://commons.wikimedia.org/wiki/User:Srvkumar09",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/2/29/Flyover_in_Delhi_Near_Akshardham.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "description": "Elevated multi-lane urban flyover corridor with concrete median barriers and civic traffic.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "garbage-management": {
    "slug": "garbage-management",
    "name": "Garbage Management",
    "source": "wikimedia-commons",
    "author": "Pradip Paswan",
    "authorUrl": "https://commons.wikimedia.org/wiki/File:City_kolkata_Municipal_Corporation.jpg",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/City_kolkata_Municipal_Corporation.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "description": "Municipal corporation solid waste collection vehicle and urban waste management depot.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "water-drainage": {
    "slug": "water-drainage",
    "name": "Water & Drainage",
    "source": "wikimedia-commons",
    "author": "Ganesh Dhamodkar",
    "authorUrl": "https://commons.wikimedia.org/wiki/File:Water_dripping_out_of_an_urban_water_supply_pipeline_in_India_20120311.jpg",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Water_dripping_out_of_an_urban_water_supply_pipeline_in_India_20120311.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "description": "Municipal drinking water supply pipeline network and civic valve distribution station.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "electricity-lighting": {
    "slug": "electricity-lighting",
    "name": "Electricity & Lighting",
    "source": "wikimedia-commons",
    "author": "Joydeep",
    "authorUrl": "https://commons.wikimedia.org/wiki/User:Joydeep",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Street_light_07092012..jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "description": "High mast municipal streetlight luminaire on an urban road corridor.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "public-health": {
    "slug": "public-health",
    "name": "Public Health",
    "source": "wikimedia-commons",
    "author": "Sukanta Sarkar",
    "authorUrl": "https://commons.wikimedia.org/wiki/User:Sukanta_Sarkar",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ramakrishna_Mission_Charitable_Dispensary%2CBhubaneswar.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "description": "Public health dispensary and community municipal medical care center.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "environment": {
    "slug": "environment",
    "name": "Environment",
    "source": "wikimedia-commons",
    "author": "Panoramio Contributor / A.Savin",
    "authorUrl": "https://commons.wikimedia.org/wiki/File:Hauz_Khas_Lake_-_panoramio.jpg",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Hauz_Khas_Complex%2C_Delhi.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "description": "Urban water body conservation, green tree canopy, and city ecological sanctuary.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "parks-greenery": {
    "slug": "parks-greenery",
    "name": "Parks & Greenery",
    "source": "wikimedia-commons",
    "author": "A.Savin",
    "authorUrl": "https://commons.wikimedia.org/wiki/User:A.Savin",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/New_Delhi_03-2016_img29_Lodi_Gardens.jpg",
    "license": "FAL / CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "description": "Municipal park grounds with manicured public lawns, walking paths, and mature trees.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "public-safety": {
    "slug": "public-safety",
    "name": "Public Safety",
    "source": "wikimedia-commons",
    "author": "Marcin Białek",
    "authorUrl": "https://commons.wikimedia.org/wiki/User:Marcin_Bia%C5%82ek",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Delhi_police_booth.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "description": "Civic police assistance booth and urban safety outpost at a major road junction.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "public-transport": {
    "slug": "public-transport",
    "name": "Public Transport",
    "source": "wikimedia-commons",
    "author": "Ramesh NG",
    "authorUrl": "https://commons.wikimedia.org/wiki/User:Ramesh_NG",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5f/DTC_low_floor_bus.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "description": "City public transit bus fleet providing urban passenger connectivity.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "animal-welfare": {
    "slug": "animal-welfare",
    "name": "Animal Welfare",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/animal-welfare/_category.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary municipal editorial photograph of a community animal shelter and veterinary care center in an Indian municipal area, clean daylight, veterinarian examining stray animals with care, natural realism, no caricature.",
    "description": "Community veterinary dispensary and municipal stray animal care shelter.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "encroachment": {
    "slug": "encroachment",
    "name": "Encroachment",
    "source": "wikimedia-commons",
    "author": "V.K. Singh",
    "authorUrl": "https://commons.wikimedia.org/wiki/File:Roads_in_New_Delhi_09.jpg",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Pedestrian_walkway_New_Delhi.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "description": "Pedestrian sidewalk with bollards ensuring cleared right-of-way along public street.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "public-amenities": {
    "slug": "public-amenities",
    "name": "Public Amenities",
    "source": "wikimedia-commons",
    "author": "Swachh Bharat / Ministry of Housing & Urban Affairs",
    "authorUrl": "https://commons.wikimedia.org/wiki/Category:Public_toilets_in_India",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/6/62/Public_toilet_complex_in_India.jpg",
    "license": "GODL-India",
    "licenseUrl": "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf",
    "description": "Municipal public toilet block with dedicated sanitation facilities and water station.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "fire-emergency": {
    "slug": "fire-emergency",
    "name": "Fire & Emergency",
    "source": "wikimedia-commons",
    "author": "Mumbai Fire Brigade / Contributor",
    "authorUrl": "https://commons.wikimedia.org/wiki/File:Mumbai_Fire_Brigade_Headquarters.jpg",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a1/Mumbai_Fire_Brigade_Headquarters.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "description": "Municipal fire and emergency service station ready for disaster dispatch.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "urban-planning": {
    "slug": "urban-planning",
    "name": "Urban Planning",
    "source": "wikimedia-commons",
    "author": "Pradeep717",
    "authorUrl": "https://commons.wikimedia.org/wiki/File:Dhaula_Kuan_interchange_Delhi.jpg",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Dhaula_Kuan_interchange_Delhi.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "description": "Planned arterial transport cloverleaf interchange and municipal transit corridor.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "commercial-areas": {
    "slug": "commercial-areas",
    "name": "Commercial Areas",
    "source": "wikimedia-commons",
    "author": "Marcin Białek",
    "authorUrl": "https://commons.wikimedia.org/wiki/User:Marcin_Bia%C5%82ek",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/5/55/Delhi_Connaught_Place.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "description": "Heritage commercial high-street shopping arcade and pedestrian arcade zone.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  },
  "public-property": {
    "slug": "public-property",
    "name": "Public Property",
    "source": "wikimedia-commons",
    "author": "Hemant Shesh",
    "authorUrl": "https://commons.wikimedia.org/wiki/User:Hemant_Shesh",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Delhi_Civic_Centre.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "description": "Civic Centre administrative skyscraper housing municipal government offices.",
    "focalPoint": {
      "x": 0.5,
      "y": 0.5
    }
  }
};

export const SUB_ISSUE_IMAGE_CREDITS: Record<string, ImageCredit> = {
  "roads-transportation/road-potholes": {
    "slug": "road-potholes",
    "name": "Road potholes",
    "priority": "High",
    "source": "wikimedia-commons",
    "author": "Tarun Shukla",
    "authorUrl": "https://commons.wikimedia.org/wiki/File:Big_fatal_hole_in_a_Delhi_road.jpg",
    "photoUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Big_fatal_hole_in_a_Delhi_road.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "description": "Deep road depression and asphalt crater exposing gravel sub-base on arterial road."
  },
  "roads-transportation/damaged-roads": {
    "slug": "damaged-roads",
    "name": "Damaged roads",
    "priority": "High",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/damaged-roads.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Close-up documentary editorial photograph of a cracked and fractured Indian asphalt road surface with longitudinal cracks, crumbling edges, and coarse gravel exposure under bright midday sun, realistic municipal road defect, no CGI.",
    "description": "Extensive surface alligator cracking and crumbling bitumen pavement."
  },
  "roads-transportation/broken-footpaths": {
    "slug": "broken-footpaths",
    "name": "Broken footpaths",
    "priority": "Medium",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/broken-footpaths.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary photograph of broken interlocking concrete footpath paving blocks along an Indian city street, displaced pavers, tripping hazard, authentic urban street curb, realistic natural light, no faces.",
    "description": "Displaced and cracked interlocking concrete pavers along pedestrian sidewalk."
  },
  "roads-transportation/footpath-encroachment": {
    "slug": "footpath-encroachment",
    "name": "Footpath encroachment",
    "priority": "Medium",
    "imageKey": "shared-footpath-encroachment",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/footpath-encroachment.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Editorial photograph of an Indian city sidewalk obstructed by temporary shop extensions and parked scooters, leaving no pedestrian walking passage, realistic municipal street scene, natural daylight.",
    "description": "Sidewalk corridor blocked by illegal commercial extensions and parked vehicles."
  },
  "roads-transportation/missing-road-dividers": {
    "slug": "missing-road-dividers",
    "name": "Missing road dividers",
    "priority": "Medium",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/missing-road-dividers.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Wide shot of a wide two-way Indian urban road without any central concrete median or median barrier, head-on oncoming traffic risk, painted yellow double line worn away, realistic documentary.",
    "description": "Busy two-way carriageway lacking central median barrier or physical separator."
  },
  "roads-transportation/damaged-speed-breakers": {
    "slug": "damaged-speed-breakers",
    "name": "Damaged speed breakers",
    "priority": "Low",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/damaged-speed-breakers.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary street-level photo of a damaged asphalt speed breaker with faded yellow-and-white paint, chipped concrete edges, and scrape marks from vehicle undercarriages, realistic Indian street.",
    "description": "Chipped asphalt speed hump with eroded retroreflective warning stripes."
  },
  "roads-transportation/traffic-signal-not-working": {
    "slug": "traffic-signal-not-working",
    "name": "Traffic signal not working",
    "priority": "Critical",
    "imageKey": "shared-traffic-signal-defect",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/traffic-signal-not-working.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Journalistic photograph of an unlit, blacked-out traffic light signal at a busy four-way Indian city intersection during daytime, vehicles navigating carefully, realistic municipal hardware.",
    "description": "Completely unlit traffic light signal head at a high-volume road intersection."
  },
  "roads-transportation/missing-street-signboards": {
    "slug": "missing-street-signboards",
    "name": "Missing street signboards",
    "priority": "Low",
    "imageKey": "shared-street-sign-defect",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/missing-street-signboards.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary photograph of an empty metal signboard pole at an Indian road junction, the nameplate is missing or rusted away, empty mounting brackets, realistic urban infrastructure.",
    "description": "Empty municipal signpost with missing directional or street name plate."
  },
  "roads-transportation/illegal-parking": {
    "slug": "illegal-parking",
    "name": "Illegal parking",
    "priority": "Low",
    "imageKey": "shared-illegal-parking",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/illegal-parking.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Editorial photograph of cars and commercial vans parked bumper-to-bumper along a clearly marked No Parking yellow-curb zone on an Indian city street, restricting traffic flow, daytime realism.",
    "description": "Motor vehicles parked along a designated yellow-curb No Stopping zone."
  },
  "roads-transportation/traffic-congestion": {
    "slug": "traffic-congestion",
    "name": "Traffic congestion",
    "priority": "Medium",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/traffic-congestion.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Wide documentary photo of dense urban traffic congestion at an Indian city junction, queue of buses, auto-rickshaws, and cars under flyover, natural overcast daylight, realistic civic photo.",
    "description": "Prolonged vehicular gridlock and queue at a major signalized intersection."
  },
  "roads-transportation/waterlogging-on-roads": {
    "slug": "waterlogging-on-roads",
    "name": "Waterlogging on roads",
    "priority": "High",
    "imageKey": "shared-waterlogging",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/waterlogging-on-roads.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary editorial photo of knee-deep monsoon waterlogging across an Indian arterial road, vehicles carefully wading through water, flooded curb, realistic rainy day lighting, no faces.",
    "description": "Standing stormwater pool submerging multiple road lanes following rainfall."
  },
  "roads-transportation/broken-manhole-covers": {
    "slug": "broken-manhole-covers",
    "name": "Broken manhole covers",
    "priority": "Critical",
    "imageKey": "shared-manhole-defect",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/broken-manhole-covers.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Ground-level documentary photograph of a shattered cast-iron or concrete sewer manhole cover on an asphalt road in India, deep hazardous opening visible, makeshift warning stick placed inside, realistic.",
    "description": "Fractured circular drainage chamber cover presenting a fatal fall hazard."
  },
  "roads-transportation/damaged-bridges": {
    "slug": "damaged-bridges",
    "name": "Damaged bridges",
    "priority": "Critical",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/damaged-bridges.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary photograph of an elevated urban road bridge or flyover showing a deteriorated expansion joint with exposed rebar and broken concrete barrier railing, structural municipal issue.",
    "description": "Structural concrete spalling and deteriorated expansion joint on an elevated flyover."
  },
  "roads-transportation/roadside-construction-debris": {
    "slug": "roadside-construction-debris",
    "name": "Roadside construction debris",
    "priority": "Medium",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/roadside-construction-debris.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary photo of a large mound of construction rubble, concrete chunks, and building sand dumped on the asphalt shoulder of an Indian urban road, obstructing traffic lane, natural daylight.",
    "description": "Piles of dumped masonry debris and construction aggregate encroaching the curb."
  },
  "roads-transportation/missing-zebra-crossings": {
    "slug": "missing-zebra-crossings",
    "name": "Missing zebra crossings",
    "priority": "Low",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/missing-zebra-crossings.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary road photo of an Indian urban pedestrian crosswalk where white painted zebra stripes are almost completely faded and worn away from heavy traffic, pedestrian safety risk.",
    "description": "Faded white thermoplastic pedestrian crossing stripes at an active intersection."
  },
  "roads-transportation/damaged-bus-stops": {
    "slug": "damaged-bus-stops",
    "name": "Damaged bus stops",
    "priority": "Medium",
    "imageKey": "shared-bus-stop-defect",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/damaged-bus-stops.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Documentary photograph of a damaged public bus passenger shelter in an Indian city with cracked acrylic roof canopy, broken stainless steel bench, and rusted frame, realistic municipal defect.",
    "description": "Weathered passenger bus shelter with fractured roof canopy and broken seating."
  },
  "roads-transportation/streetlights-not-working": {
    "slug": "streetlights-not-working",
    "name": "Streetlights not working",
    "priority": "High",
    "imageKey": "shared-streetlight-defect",
    "source": "ai-nano-banana",
    "author": "Crowd Report AI (Nano Banana)",
    "authorUrl": "https://croudreport.local",
    "photoUrl": "internal://design-source/civic/roads-transportation/streetlights-not-working.png",
    "license": "Proprietary Open Assets (CroudReport Platform)",
    "licenseUrl": "https://croudreport.local/credits",
    "prompt": "Atmospheric documentary photograph taken during dusk along an Indian residential road where tall street lighting poles have dark, non-functioning lamp heads, creating hazardous dark zones.",
    "description": "Inoperative municipal street luminaire leaving the carriageway in darkness after dusk."
  }
};
