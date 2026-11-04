import { CIVIC_CONTENT, CATEGORY_CONTENT } from '../data/civicContent';

export interface CivicImageSource {
  type: string;
  srcSet: string;
}

export interface CivicImage {
  src: string;
  blur: string;
  width: number;
  height: number;
  sources: CivicImageSource[];
  srcsetWebp: string;
  srcsetAvif: string;
  cardSrc: string;
  alt: string;
  focalPoint?: { x: number; y: number };
}

// Eagerly resolve all optimized civic assets with Vite
const civicImages = import.meta.glob<string>(
  '../assets/images/civic/*/*/*.{webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

/**
 * Returns optimized responsive image data for a main category cover (16:9).
 * Falls back to null if files are missing or slug is invalid.
 */
export function getCategoryImage(slug: string): CivicImage | null {
  if (!slug) return null;

  const key1920Webp = `../assets/images/civic/${slug}/_category/1920.webp`;
  const key1280Webp = `../assets/images/civic/${slug}/_category/1280.webp`;
  const key768Webp = `../assets/images/civic/${slug}/_category/768.webp`;
  const key800Webp = `../assets/images/civic/${slug}/_category/800.webp`;
  const key480Webp = `../assets/images/civic/${slug}/_category/480.webp`;

  const key1920Avif = `../assets/images/civic/${slug}/_category/1920.avif`;
  const key1280Avif = `../assets/images/civic/${slug}/_category/1280.avif`;
  const key768Avif = `../assets/images/civic/${slug}/_category/768.avif`;
  const key800Avif = `../assets/images/civic/${slug}/_category/800.avif`;
  const key480Avif = `../assets/images/civic/${slug}/_category/480.avif`;

  const keyBlur = `../assets/images/civic/${slug}/_category/blur.webp`;

  const src1920Webp = civicImages[key1920Webp];
  const src1280Webp = civicImages[key1280Webp];
  const src768Webp = civicImages[key768Webp];
  const src800Webp = civicImages[key800Webp];
  const src480Webp = civicImages[key480Webp];

  const src1920Avif = civicImages[key1920Avif];
  const src1280Avif = civicImages[key1280Avif];
  const src768Avif = civicImages[key768Avif];
  const src800Avif = civicImages[key800Avif];
  const src480Avif = civicImages[key480Avif];

  const blur = civicImages[keyBlur] || '';

  if (!src1920Webp && !src800Webp) {
    return null;
  }

  const avifParts: string[] = [];
  if (src480Avif) avifParts.push(`${src480Avif} 480w`);
  if (src768Avif) avifParts.push(`${src768Avif} 768w`);
  if (src800Avif) avifParts.push(`${src800Avif} 800w`);
  if (src1280Avif) avifParts.push(`${src1280Avif} 1280w`);
  if (src1920Avif) avifParts.push(`${src1920Avif} 1920w`);

  const webpParts: string[] = [];
  if (src480Webp) webpParts.push(`${src480Webp} 480w`);
  if (src768Webp) webpParts.push(`${src768Webp} 768w`);
  if (src800Webp) webpParts.push(`${src800Webp} 800w`);
  if (src1280Webp) webpParts.push(`${src1280Webp} 1280w`);
  if (src1920Webp) webpParts.push(`${src1920Webp} 1920w`);

  const sources: CivicImageSource[] = [];
  if (avifParts.length > 0) {
    sources.push({ type: 'image/avif', srcSet: avifParts.join(', ') });
  }
  if (webpParts.length > 0) {
    sources.push({ type: 'image/webp', srcSet: webpParts.join(', ') });
  }

  const meta = CATEGORY_CONTENT[slug];

  return {
    src: src1920Webp || src800Webp,
    blur,
    width: 1920,
    height: 1080,
    sources,
    srcsetWebp: webpParts.join(', '),
    srcsetAvif: avifParts.join(', '),
    cardSrc: src800Webp || src480Webp || src1920Webp,
    alt: meta?.alt || `${meta?.name || slug} category overview`,
    focalPoint: meta?.focal || { x: 0.5, y: 0.5 },
  };
}

/**
 * Returns optimized responsive image data for a specific sub-issue card (4:3).
 * Falls back to null if files are missing or slug is invalid.
 */
export function getSubIssueImage(categorySlug: string, subSlug: string): CivicImage | null {
  if (!categorySlug || !subSlug) return null;

  let key800Webp = `../assets/images/civic/${categorySlug}/${subSlug}/800.webp`;
  let key480Webp = `../assets/images/civic/${categorySlug}/${subSlug}/480.webp`;
  let key800Avif = `../assets/images/civic/${categorySlug}/${subSlug}/800.avif`;
  let key480Avif = `../assets/images/civic/${categorySlug}/${subSlug}/480.avif`;
  let keyBlur = `../assets/images/civic/${categorySlug}/${subSlug}/blur.webp`;

  let src800Webp = civicImages[key800Webp];
  let src480Webp = civicImages[key480Webp];
  let src800Avif = civicImages[key800Avif];
  let src480Avif = civicImages[key480Avif];
  let blur = civicImages[keyBlur] || '';

  // Check alias / imageKey if direct path not present
  if (!src800Webp) {
    const content = CIVIC_CONTENT[`${categorySlug}/${subSlug}`];
    if (content?.imageKey) {
      const [aliasCat, aliasSub] = content.imageKey.split('/');
      if (aliasCat && aliasSub) {
        key800Webp = `../assets/images/civic/${aliasCat}/${aliasSub}/800.webp`;
        key480Webp = `../assets/images/civic/${aliasCat}/${aliasSub}/480.webp`;
        key800Avif = `../assets/images/civic/${aliasCat}/${aliasSub}/800.avif`;
        key480Avif = `../assets/images/civic/${aliasCat}/${aliasSub}/480.avif`;
        keyBlur = `../assets/images/civic/${aliasCat}/${aliasSub}/blur.webp`;

        src800Webp = civicImages[key800Webp];
        src480Webp = civicImages[key480Webp];
        src800Avif = civicImages[key800Avif];
        src480Avif = civicImages[key480Avif];
        blur = civicImages[keyBlur] || '';
      }
    }
  }

  if (!src800Webp) {
    return null;
  }

  const avifParts: string[] = [];
  if (src480Avif) avifParts.push(`${src480Avif} 480w`);
  if (src800Avif) avifParts.push(`${src800Avif} 800w`);

  const webpParts: string[] = [];
  if (src480Webp) webpParts.push(`${src480Webp} 480w`);
  if (src800Webp) webpParts.push(`${src800Webp} 800w`);

  const sources: CivicImageSource[] = [];
  if (avifParts.length > 0) {
    sources.push({ type: 'image/avif', srcSet: avifParts.join(', ') });
  }
  if (webpParts.length > 0) {
    sources.push({ type: 'image/webp', srcSet: webpParts.join(', ') });
  }

  const meta = CIVIC_CONTENT[`${categorySlug}/${subSlug}`];

  return {
    src: src800Webp,
    blur,
    width: 800,
    height: 600,
    sources,
    srcsetWebp: webpParts.join(', '),
    srcsetAvif: avifParts.join(', '),
    cardSrc: src480Webp || src800Webp,
    alt: meta?.alt || `${meta?.name || subSlug} issue illustration`,
    focalPoint: meta?.focal || { x: 0.5, y: 0.5 },
  };
}

