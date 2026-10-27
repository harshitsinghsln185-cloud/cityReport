export interface HeroHotspot {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  desktop: {
    x: number; // percentage (0 - 100)
    y: number; // percentage (0 - 100)
  };
  mobile?: {
    x: number; // percentage (0 - 100)
    y: number; // percentage (0 - 100)
  };
  iconName: 'AlertTriangle' | 'Trash2' | 'Zap' | 'Waves';
}

export const HERO_HOTSPOTS: HeroHotspot[] = [
  {
    id: 'pothole',
    name: 'Road damage & pothole',
    category: 'Road damage',
    categorySlug: 'road-damage',
    description: 'Deep rainwater-filled asphalt crater creating immediate vehicular and pedestrian hazard.',
    desktop: { x: 67.5, y: 82.5 },
    mobile: { x: 57.0, y: 82.5 },
    iconName: 'AlertTriangle',
  },
  {
    id: 'garbage',
    name: 'Overflowing municipal bin',
    category: 'Garbage',
    categorySlug: 'garbage',
    description: 'Uncollected refuse spilling onto pedestrian footpath causing sanitary risks.',
    desktop: { x: 72.5, y: 56.0 },
    mobile: { x: 68.0, y: 56.0 },
    iconName: 'Trash2',
  },
  {
    id: 'streetlight',
    name: 'Dark broken streetlight',
    category: 'Streetlight & electricity',
    categorySlug: 'streetlight-electricity',
    description: 'Unlit lamp fixture on weathered pole with exposed wiring reducing night visibility.',
    desktop: { x: 71.5, y: 15.5 },
    mobile: { x: 66.0, y: 15.5 },
    iconName: 'Zap',
  },
  {
    id: 'drain',
    name: 'Open roadside drain',
    category: 'Drainage',
    categorySlug: 'drainage',
    description: 'Uncovered concrete runoff ditch with stagnant runoff creating accident danger.',
    desktop: { x: 91.0, y: 74.0 },
    // Not shown on mobile 4:5 crop (3 hotspots on mobile as per spec)
    iconName: 'Waves',
  },
];
