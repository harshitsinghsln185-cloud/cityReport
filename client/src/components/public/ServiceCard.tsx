import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Wrench } from 'lucide-react';
import { Category } from '../../services/category.service';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ServiceCardProps {
  category: Category;
}

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
      className="h-full flex flex-col justify-between group hover:border-primary/40 hover:shadow-cardHover transition-all duration-200"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="w-11 h-11 rounded-xl bg-lavender text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Wrench className="w-5 h-5" />
          </div>
          <Badge variant="gold" size="sm" className="font-semibold">
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
          className="inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg bg-canvas group-hover:bg-lavender/70 text-primary text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>Report This Hazard</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

export default ServiceCard;
