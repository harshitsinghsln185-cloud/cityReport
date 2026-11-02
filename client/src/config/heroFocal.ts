/**
 * Responsive focal point configuration for PageHero background images.
 * Controls object-position across desktop (>=768px) and mobile (<768px).
 * Allows the primary photographic subject (positioned in right-center)
 * to stay centered and clear while text occupies the left/top.
 */
export interface HeroFocalSetting {
  desktop: string;
  mobile: string;
}

export const HERO_FOCAL: Record<string, HeroFocalSetting> = {
  services: {
    desktop: '72% center',
    mobile: '80% 35%',
  },
  states: {
    desktop: '70% center',
    mobile: '75% 35%',
  },
  track: {
    desktop: '70% center',
    mobile: '78% 40%',
  },
  about: {
    desktop: '68% center',
    mobile: '72% 35%',
  },
  contact: {
    desktop: '70% center',
    mobile: '76% 40%',
  },
};

export default HERO_FOCAL;

