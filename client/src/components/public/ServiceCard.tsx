import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Car,
  Trash2,
  Droplets,
  Zap,
  HeartPulse,
  Trees,
  Flower2,
  ShieldAlert,
  Bus,
  PawPrint,
  Building,
  Sparkles,
  Flame,
  Compass,
  Store,
  Landmark,
  Wrench,
} from 'lucide-react';
import { Category } from '../../services/category.service';
import { getCategoryImage } from '../../lib/civicImage';

interface ServiceCardProps {
  category: Category;
  index?: number;
  matchingSubIssues?: string[];
}

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'roads-transportation': Car,
  'garbage-management': Trash2,
  'water-drainage': Droplets,
  'electricity-lighting': Zap,
  'public-health': HeartPulse,
  'environment': Trees,
  'parks-greenery': Flower2,
  'public-safety': ShieldAlert,
  'public-transport': Bus,
  'animal-welfare': PawPrint,
  'encroachment': Building,
  'public-amenities': Sparkles,
  'fire-emergency': Flame,
  'urban-planning': Compass,
  'commercial-areas': Store,
  'public-property': Landmark,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  category,
  index = 0,
  matchingSubIssues = [],
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const cleanSlug = category.slug?.toLowerCase().trim() || '';
  const civicImage = cleanSlug ? getCategoryImage(cleanSlug) : null;
  const IconComponent = (cleanSlug && CATEGORY_ICON_MAP[cleanSlug]) || Wrench;
  const stepNumber = String(index + 1).padStart(2, '0');

  const subIssueCount = category.subCategories?.length || 0;
  const targetUrl = cleanSlug
    ? `/services/${cleanSlug}`
    : `/user/report-issue?category=${encodeURIComponent(category._id)}`;

  return (
    <Link
      to={targetUrl}
      className="group block h-full rounded-2xl bg-white border border-border hover:border-accent/80 hover:shadow-cardHover hover:-translate-y-[3px] transition-all duration-300 motion-reduce:transform-none overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Top Image Container (4:3 ratio) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
          {civicImage && !imageError ? (
            <picture>
              {civicImage.sources.map((src, i) => (
                <source
                  key={i}
                  type={src.type}
                  srcSet={src.srcSet}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              ))}
              <img
                src={civicImage.cardSrc}
                alt={civicImage.alt}
                width={civicImage.width}
                height={civicImage.height}
                loading={index < 4 ? 'eager' : 'lazy'}
                fetchPriority={index < 2 ? 'high' : 'auto'}
                decoding="async"
                onError={() => setImageError(true)}
                style={{
                  objectPosition: civicImage.focalPoint
                    ? `${civicImage.focalPoint.x * 100}% ${civicImage.focalPoint.y * 100}%`
                    : 'center',
                }}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 motion-reduce:transform-none"
              />
            </picture>
          ) : (
            <div className="w-full h-full bg-navy/90 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                <IconComponent className="w-6 h-6 text-accent" />
              </div>
              <span className="font-heading font-bold text-white text-base tracking-wider uppercase opacity-90">
                {category.name}
              </span>
            </div>
          )}

          {/* Dark gradient overlay for bottom badge contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Step Number on Bottom-Left */}
          <span className="absolute bottom-3 left-4 text-xs font-mono font-bold text-accent tracking-wider drop-shadow-sm">
            {stepNumber}
          </span>

          {/* Icon chip on Top-Left */}
          <div className="absolute top-3.5 left-3.5 w-8 h-8 rounded-lg bg-navy/80 backdrop-blur-xs text-white flex items-center justify-center shadow-md">
            <IconComponent className="w-4 h-4 text-accent" />
          </div>

          {/* Floating Action Arrow on Top-Right */}
          <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-xl bg-white/95 group-hover:bg-accent text-navy flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform motion-reduce:transform-none" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink uppercase tracking-wide group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-secondaryText leading-relaxed line-clamp-2 mb-3">
            {category.description || 'Certified municipal remediation with geo-proximity contractor dispatch.'}
          </p>

          {/* Matched Sub-Issues snippet when searching */}
          {matchingSubIssues.length > 0 && (
            <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <span className="font-semibold">Matching sub-issues: </span>
              <span>{matchingSubIssues.slice(0, 3).join(', ')}</span>
              {matchingSubIssues.length > 3 && <span> +{matchingSubIssues.length - 3} more</span>}
            </div>
          )}
        </div>
      </div>

      {/* Footer Area with Sub-Issue Count & Link */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-border/60 flex items-center justify-between mt-auto">
        <span className="text-xs font-medium text-muted">
          {subIssueCount} {subIssueCount === 1 ? 'issue type' : 'issue types'}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-ink group-hover:text-accent transition-colors">
          <span>Explore category</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform motion-reduce:transform-none" />
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;
