export interface StateBannerSource {
  type: string;
  srcSet: string;
}

export interface StateBanner {
  src: string;
  blur: string;
  width: number;
  height: number;
  sources: StateBannerSource[];
  srcsetWebp?: string;
  srcsetAvif?: string;
  cardSrc?: string;
}

// Eagerly resolve all optimized state assets with Vite
const bannerImages = import.meta.glob<string>(
  '../assets/images/states/*/*.{webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

export function getStateBanner(slug: string): StateBanner | null {
  if (!slug) return null;

  const key1600Webp = `../assets/images/states/${slug}/1600.webp`;
  const key800Webp = `../assets/images/states/${slug}/800.webp`;
  const key400Webp = `../assets/images/states/${slug}/400.webp`;
  const key1600Avif = `../assets/images/states/${slug}/1600.avif`;
  const key800Avif = `../assets/images/states/${slug}/800.avif`;
  const key400Avif = `../assets/images/states/${slug}/400.avif`;
  const keyBlur = `../assets/images/states/${slug}/blur.webp`;

  const src1600Webp = bannerImages[key1600Webp];
  const src800Webp = bannerImages[key800Webp];
  const src400Webp = bannerImages[key400Webp];
  const src1600Avif = bannerImages[key1600Avif];
  const src800Avif = bannerImages[key800Avif];
  const src400Avif = bannerImages[key400Avif];
  const blur = bannerImages[keyBlur] || '';

  if (!src1600Webp && !src800Webp) {
    if (import.meta.env.DEV) {
      console.warn(`[stateBanner] No photographic banner found for state slug "${slug}", falling back to gradient.`);
    }
    return null;
  }

  // Compose responsive srcSets
  const avifParts: string[] = [];
  if (src400Avif) avifParts.push(`${src400Avif} 400w`);
  if (src800Avif) avifParts.push(`${src800Avif} 800w`);
  if (src1600Avif) avifParts.push(`${src1600Avif} 1600w`);

  const webpParts: string[] = [];
  if (src400Webp) webpParts.push(`${src400Webp} 400w`);
  if (src800Webp) webpParts.push(`${src800Webp} 800w`);
  if (src1600Webp) webpParts.push(`${src1600Webp} 1600w`);

  const sources: StateBannerSource[] = [];
  if (avifParts.length > 0) {
    sources.push({
      type: 'image/avif',
      srcSet: avifParts.join(', ')
    });
  }
  if (webpParts.length > 0) {
    sources.push({
      type: 'image/webp',
      srcSet: webpParts.join(', ')
    });
  }

  return {
    src: src1600Webp || src800Webp,
    blur,
    width: 1600,
    height: 900,
    sources,
    srcsetWebp: webpParts.join(', '),
    srcsetAvif: avifParts.join(', '),
    cardSrc: src800Webp || src1600Webp
  };
}
