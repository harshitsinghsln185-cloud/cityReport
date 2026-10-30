import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../services/category.service';

interface ServiceCardProps {
  category: Category;
  index?: number;
}

const getCategoryPhoto = (name: string, slug?: string): string => {
  const key = `${name} ${slug || ''}`.toLowerCase();
  if (key.includes('road') || key.includes('pothole') || key.includes('pavement') || key.includes('traffic')) {
    return 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  }
  if (key.includes('water') || key.includes('pipe') || key.includes('supply')) {
    return 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80';
  }
  if (key.includes('drain') || key.includes('sewer') || key.includes('sewage')) {
    return 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80';
  }
  if (key.includes('light') || key.includes('electric') || key.includes('lamp') || key.includes('power') || key.includes('zap')) {
    return 'https://images.unsplash.com/photo-1508873696983-2df570464756?auto=format&fit=crop&w=800&q=80';
  }
  if (key.includes('garbage') || key.includes('waste') || key.includes('sanitation') || key.includes('trash')) {
    return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
  }
  if (key.includes('tree') || key.includes('park') || key.includes('garden')) {
    return 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ category, index = 0 }) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const photoUrl = getCategoryPhoto(category.name, category.slug);
  const stepNumber = String(index + 1).padStart(2, '0');

  const baseFeeInr = ((category.baseFeePaise || 0) / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Link
      to={`/user/report-issue?category=${encodeURIComponent(category._id)}`}
      className="group block h-full rounded-2xl bg-white border border-border hover:border-accent/80 hover:shadow-cardHover transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Top Image Container */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
          {!imageError ? (
            <img
              src={photoUrl}
              alt={category.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy via-navy-light to-primary flex items-center justify-center p-6 text-center">
              <span className="font-heading font-bold text-white text-lg tracking-wider uppercase opacity-85">
                {category.name}
              </span>
            </div>
          )}

          {/* Dark gradient overlay for bottom text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

          {/* Step Number on Bottom-Left */}
          <span className="absolute bottom-3 left-4 text-xs font-mono font-bold text-accent tracking-wider drop-shadow-sm">
            {stepNumber}
          </span>

          {/* Floating Action Button on Top-Right */}
          <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-xl bg-white/95 group-hover:bg-accent text-navy flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6">
          {/* Uppercase Bold Heading */}
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
            {category.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-secondaryText leading-relaxed line-clamp-2 mb-4">
            {category.description || 'Certified municipal remediation with geo-proximity contractor dispatch and photo proof.'}
          </p>
        </div>
      </div>

      {/* Footer Area with Explore service link & Pricing */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-border/60 flex items-center justify-between mt-auto">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink group-hover:text-accent transition-colors">
          <span>Explore service</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>

        <span className="text-[11px] font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full border border-primary/20">
          From ₹{baseFeeInr}
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;
