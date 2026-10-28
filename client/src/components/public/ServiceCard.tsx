import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Wrench, Lightbulb, Droplets, Trash2, Trees, ShieldAlert } from 'lucide-react';
import { Category } from '../../services/category.service';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ServiceCardProps {
  category: Category;
}

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('road') || lower.includes('pothole') || lower.includes('traffic')) return <Wrench className="w-5 h-5" />;
  if (lower.includes('light') || lower.includes('electric') || lower.includes('lamp')) return <Lightbulb className="w-5 h-5" />;
  if (lower.includes('water') || lower.includes('drain') || lower.includes('sewage')) return <Droplets className="w-5 h-5" />;
  if (lower.includes('garbage') || lower.includes('waste') || lower.includes('sanitation')) return <Trash2 className="w-5 h-5" />;
  if (lower.includes('tree') || lower.includes('park') || lower.includes('garden')) return <Trees className="w-5 h-5" />;
  return <ShieldAlert className="w-5 h-5" />;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ category }) => {
  const baseFeeInr = ((category.baseFeePaise || 0) / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card
      isInteractive
      radius="card"
      variant="base"
      className="h-full flex flex-col justify-between group hover:border-primary/40 hover:shadow-cardHover transition-all duration-200 bg-white border border-border overflow-hidden relative"
    >
      {/* Decorative top accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-navy-light to-accent opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5 pt-1">
          <div className="w-11 h-11 rounded-xl bg-primary-light text-primary border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
            {getCategoryIcon(category.name)}
          </div>
          <Badge variant="gold" size="sm" className="font-semibold shadow-xs">
            From ₹{baseFeeInr}
          </Badge>
        </div>

        <h3 className="font-heading font-semibold text-lg text-ink mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>

        <p className="text-xs text-secondaryText leading-relaxed mb-4 line-clamp-3">
          {category.description || 'Certified municipal remediation with geo-proximity contractor dispatch and photo proof.'}
        </p>
      </div>

      <div>
        <div className="pt-3.5 border-t border-border grid grid-cols-2 gap-2 text-xs text-muted mb-4 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="tabular-nums">{category.estimatedResolutionHours || 48}h SLA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="tabular-nums">{category.freeRadiusKm || 5} km Free Base</span>
          </div>
        </div>

        <Link
          to={`/user/report-issue?category=${encodeURIComponent(category._id)}`}
          className="inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg bg-canvas group-hover:bg-primary text-primary group-hover:text-white text-xs font-semibold transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span>Report This Hazard</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

export default ServiceCard;
