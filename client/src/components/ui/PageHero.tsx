import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { BreadcrumbItem } from './Breadcrumbs';
import Reveal from './Reveal';

export interface PageHeroStat {
  label: string;
  value: string;
  hint?: string;
}

export interface PageHeroProps {
  variant?: 'full' | 'split' | 'compact' | 'image';
  theme?: 'navy' | 'ivory' | 'surface';
  eyebrow?: React.ReactNode | string;
  eyebrowIcon?: React.ReactNode;
  title: React.ReactNode | string;
  highlightedTitle?: string;
  description?: React.ReactNode | string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  visual?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  stats?: PageHeroStat[];
  className?: string;
  // Image Hero props (Phase H2 Left-Text Hero)
  backgroundImage?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  focalPoint?: string | { desktop?: string; mobile?: string };
}

export const PageHero: React.FC<PageHeroProps> = ({
  variant = 'compact',
  theme = 'navy',
  eyebrow,
  eyebrowIcon,
  title,
  highlightedTitle,
  description,
  primaryAction,
  secondaryAction,
  visual,
  breadcrumbs,
  stats,
  className = '',
  backgroundImage,
  imageSrc,
  imageAlt,
  imageWidth = 2752,
  imageHeight = 1536,
  focalPoint,
}) => {
  const isNavy = theme === 'navy';

  // Base background and text colors
  const themeClasses = isNavy
    ? 'bg-dark text-white border-b border-slate-800'
    : theme === 'surface'
    ? 'bg-surfaceAlt/80 text-ink border-b border-border'
    : 'bg-canvas text-ink border-b border-border';

  // Breadcrumbs element
  const breadcrumbsEl = breadcrumbs && breadcrumbs.length > 0 && (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <li key={crumb.label + idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className={`w-3.5 h-3.5 ${isNavy ? 'text-slate-500' : 'text-muted'}`} />
              )}
              {isLast || !crumb.href ? (
                <span className={`font-semibold ${isNavy ? 'text-canvas' : 'text-ink'}`}>
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className={`transition-colors hover:underline ${
                    isNavy ? 'text-slate-400 hover:text-white' : 'text-secondaryText hover:text-ink'
                  }`}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  // Eyebrow badge element
  const eyebrowEl = eyebrow && (
    <div className="mb-3.5 inline-flex items-center">
      {typeof eyebrow === 'string' ? (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
            isNavy
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'bg-gold/10 text-gold-text border border-gold/25'
          }`}
        >
          {eyebrowIcon && <span className="w-3.5 h-3.5 shrink-0">{eyebrowIcon}</span>}
          <span>{eyebrow}</span>
        </span>
      ) : (
        eyebrow
      )}
    </div>
  );

  // Title rendering with dual-color styling (pure white + signature warm gold gradient)
  const renderTitleContent = () => {
    if (highlightedTitle) {
      return (
        <>
          <span className="block">{title}</span>
          <span
            className={`block mt-1 ${
              isNavy
                ? 'bg-gradient-to-r from-accent via-[#F2D399] to-white bg-clip-text text-transparent'
                : 'text-gold-text'
            }`}
          >
            {highlightedTitle}
          </span>
        </>
      );
    }

    if (typeof title === 'string' && isNavy) {
      // Automatic split for dual color if natural separator exists
      let primary = title;
      let secondary: string | null = null;

      if (title.includes(' & ')) {
        const parts = title.split(' & ');
        primary = parts[0];
        secondary = `& ${parts.slice(1).join(' & ')}`;
      } else if (title.includes(', ')) {
        const idx = title.indexOf(', ');
        primary = title.slice(0, idx + 1);
        secondary = title.slice(idx + 2);
      } else if (title.includes(' Across ')) {
        const parts = title.split(' Across ');
        primary = parts[0];
        secondary = `Across ${parts.slice(1).join(' Across ')}`;
      } else if (title.includes(' to ')) {
        const parts = title.split(' to ');
        primary = parts[0];
        secondary = `to ${parts.slice(1).join(' to ')}`;
      }

      if (secondary) {
        return (
          <>
            <span className="block">{primary}</span>
            <span className="block bg-gradient-to-r from-accent via-[#F2D399] to-white bg-clip-text text-transparent mt-1">
              {secondary}
            </span>
          </>
        );
      }
    }

    return title;
  };

  const titleEl = (
    <h1
      className={`font-heading font-extrabold tracking-tight ${
        variant === 'compact'
          ? 'text-2xl sm:text-3xl lg:text-4xl'
          : 'text-3xl sm:text-4xl lg:text-5xl leading-[1.14]'
      } ${isNavy ? 'text-white' : 'text-ink'}`}
    >
      {renderTitleContent()}
    </h1>
  );

  // Description
  const descriptionEl = description && (
    <p
      className={`mt-4 font-body leading-relaxed max-w-2xl ${
        variant === 'compact' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
      } ${isNavy ? 'text-slate-300' : 'text-secondaryText'}`}
    >
      {description}
    </p>
  );

  // Actions row
  const actionsEl = (primaryAction || secondaryAction) && (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {primaryAction}
      {secondaryAction}
    </div>
  );

  // Stats strip
  const statsEl = stats && stats.length > 0 && (
    <div
      className={`mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-6 border-t ${
        isNavy ? 'border-slate-800' : 'border-border'
      }`}
    >
      {stats.map((stat, sIdx) => (
        <div key={stat.label + sIdx}>
          <div className={`text-2xl sm:text-3xl font-heading font-bold tabular-nums ${isNavy ? 'text-white' : 'text-ink'}`}>
            {stat.value}
          </div>
          <div className={`text-xs font-medium uppercase tracking-wider mt-0.5 ${isNavy ? 'text-gold' : 'text-gold-text'}`}>
            {stat.label}
          </div>
          {stat.hint && (
            <div className={`text-xs mt-0.5 ${isNavy ? 'text-slate-400' : 'text-muted'}`}>
              {stat.hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Variant: Left-Text Image Hero (Phase H2: Real background image, left column typography, robust overlay)
  const heroImage = backgroundImage || imageSrc;
  if (heroImage || variant === 'image') {
    if (!heroImage) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[PageHero] imageSrc / backgroundImage is missing. Falling back to default theme gradient.');
      }
    } else {
      const focalDesktop =
        typeof focalPoint === 'object' && focalPoint?.desktop
          ? focalPoint.desktop
          : typeof focalPoint === 'string'
          ? focalPoint
          : '70% center';

      const focalMobile =
        typeof focalPoint === 'object' && focalPoint?.mobile
          ? focalPoint.mobile
          : '75% 35%';

      return (
        <section
          className={`relative overflow-hidden min-h-[380px] md:min-h-[420px] lg:min-h-[480px] flex items-center bg-[#0A1F44] text-white border-b border-slate-800 ${className}`}
          style={{
            ['--hero-focal-desktop' as string]: focalDesktop,
            ['--hero-focal-mobile' as string]: focalMobile,
          }}
        >
          {/* Real <picture> / <img> element for Vite module optimization & cache hashing */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <picture>
              <img
                src={heroImage}
                alt={imageAlt || ''}
                width={imageWidth}
                height={imageHeight}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hero-bg-img hero-ambient-zoom motion-reduce:transform-none"
              />
            </picture>

            {/* Readability Overlays:
                - Desktop (>= 768px): Deep navy gradient from the left (94% -> 88% -> 45% -> 0% at 75% width).
                  Keeps text at 100% legibility (WCAG AAA contrast) while leaving the right-side subject vivid.
                - Mobile (< 768px): Vertical top-to-bottom navy gradient (96% at top over text, fading down toward subject).
            */}
            <div
              className="absolute inset-0 hidden md:block pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, rgba(10, 31, 68, 0.95) 0%, rgba(10, 31, 68, 0.88) 35%, rgba(10, 31, 68, 0.45) 58%, rgba(10, 31, 68, 0) 75%)',
              }}
            />
            <div
              className="absolute inset-0 md:hidden pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(10, 31, 68, 0.96) 0%, rgba(10, 31, 68, 0.88) 55%, rgba(10, 31, 68, 0.5) 85%, rgba(10, 31, 68, 0.25) 100%)',
              }}
            />
            {/* Grounding bottom gradient to blend smoothly into page content */}
            <div
              className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(10, 31, 68, 0.75) 0%, transparent 100%)',
              }}
            />
          </div>

          {/* Left-Aligned Single Column Text Container (matches container-custom padding) */}
          <div className="container-custom relative z-10 w-full py-12 sm:py-16 lg:py-20">
            <div className="max-w-[560px] text-left">
              <Reveal direction="up" duration={0.4}>
                {breadcrumbsEl}
                {eyebrow && (
                  <div className="mb-3.5 inline-flex items-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                      {eyebrowIcon && <span className="w-3.5 h-3.5 shrink-0">{eyebrowIcon}</span>}
                      <span>{eyebrow}</span>
                    </span>
                  </div>
                )}
                <h1 className="font-fraunces font-semibold text-white tracking-tight leading-[1.14] text-[clamp(2rem,4vw,3.25rem)]">
                  {renderTitleContent()}
                </h1>
                {description && (
                  <p className="mt-4 font-body text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl">
                    {description}
                  </p>
                )}
                {actionsEl}
              </Reveal>
            </div>
          </div>
        </section>
      );
    }
  }

  // Variant: Compact (subpages, portals, queries)
  if (variant === 'compact') {
    return (
      <section className={`relative overflow-hidden py-8 sm:py-10 ${themeClasses} ${className}`}>
        {/* Decorative Grid on Navy */}
        {isNavy && (
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #C8A24A 1px, transparent 1px), linear-gradient(to bottom, #C8A24A 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        )}
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              {breadcrumbsEl}
              {eyebrowEl}
              {titleEl}
              {descriptionEl}
              {actionsEl}
            </div>
            {visual && <div className="shrink-0">{visual}</div>}
          </div>
          {statsEl}
        </div>
      </section>
    );
  }

  // Variant: Split (directory, about, track)
  if (variant === 'split') {
    return (
      <section className={`relative overflow-hidden py-12 sm:py-16 lg:py-20 ${themeClasses} ${className}`}>
        {isNavy && (
          <>
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #C8A24A 1px, transparent 1px), linear-gradient(to bottom, #C8A24A 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          </>
        )}
        <div className="container-custom relative z-10">
          {breadcrumbsEl}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              {eyebrowEl}
              {titleEl}
              {descriptionEl}
              {actionsEl}
              {statsEl}
            </div>
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              {visual}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variant: Full (immersive landing / service banner)
  return (
    <section className={`relative overflow-hidden py-14 sm:py-20 lg:py-24 text-center ${themeClasses} ${className}`}>
      {isNavy && (
        <>
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #C8A24A 1px, transparent 1px), linear-gradient(to bottom, #C8A24A 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-hover/30 rounded-full blur-3xl pointer-events-none" />
        </>
      )}
      <div className="container-custom relative z-10 flex flex-col items-center">
        {breadcrumbsEl}
        {eyebrowEl}
        <div className="max-w-4xl">{titleEl}</div>
        <div className="max-w-2xl">{descriptionEl}</div>
        {actionsEl}
        {statsEl}
        {visual && <div className="mt-10 w-full max-w-4xl">{visual}</div>}
      </div>
    </section>
  );
};

export default PageHero;
