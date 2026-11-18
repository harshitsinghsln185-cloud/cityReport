import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Wrench } from 'lucide-react';
import { Category } from '../../services/category.service';
import { getCategoryImage } from '../../lib/civicImage';

interface ServiceCardProps {
  category: Category;
  index?: number;
  matchingSubIssues?: string[];
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  category,
  index = 0,
  matchingSubIssues = [],
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const cleanSlug = category.slug?.toLowerCase().trim() || '';
  const civicImage = cleanSlug ? getCategoryImage(cleanSlug) : null;
  const targetUrl = cleanSlug
    ? `/user/report-issue?category=${encodeURIComponent(cleanSlug)}`
    : '/user/report-issue';

  return (
    <Link
      to={targetUrl}
      className="group block h-full rounded-2xl bg-white border border-border hover:border-accent/80 hover:shadow-cardHover hover:-translate-y-[2px] transition-all duration-200 overflow-hidden flex flex-col justify-between"
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
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 motion-reduce:transform-none"
              />
            </picture>
          ) : (
            <div className="w-full h-full bg-navy/90 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                <Wrench className="w-6 h-6 text-accent" />
              </div>
              <span className="font-heading font-bold text-white text-base tracking-wider uppercase opacity-90">
                {category.name}
              </span>
            </div>
          )}
        </div>

        {/* Content Area below photo: name + action arrow */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading font-bold text-sm sm:text-base text-ink group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {category.name}
            </h3>
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform motion-reduce:transform-none" />
            </div>
          </div>

          {/* Action indicator with base fee */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-secondaryText">
            <span className="font-semibold text-primary">
              Base fee: ₹{(category.baseFeePaise / 100).toLocaleString('en-IN')}
            </span>
            <span className="font-medium text-accent group-hover:underline flex items-center gap-0.5">
              Report Issue &rarr;
            </span>
          </div>

          {/* Matched Sub-Issues snippet when searching */}
          {matchingSubIssues.length > 0 && (
            <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <span className="font-semibold">Matching: </span>
              <span>{matchingSubIssues.slice(0, 3).join(', ')}</span>
              {matchingSubIssues.length > 3 && <span> +{matchingSubIssues.length - 3} more</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
