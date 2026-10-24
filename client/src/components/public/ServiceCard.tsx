import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Wrench } from 'lucide-react';
import { Category } from '../../services/category.service';
import Card from '../ui/Card';

interface ServiceCardProps {
  category: Category;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ category }) => {
  const baseFeeInr = ((category.baseFeePaise || 0) / 100).toFixed(2);

  return (
    <Card isInteractive className="h-full flex flex-col justify-between border-[#E2E8F0] hover:border-[#7C3AED]/40 hover:shadow-md transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-1 rounded-full border border-[#DDD6FE]/60">
            From ₹{baseFeeInr}
          </span>
        </div>

        <h3 className="font-heading font-bold text-base text-[#1E293B] mb-1.5 group-hover:text-[#7C3AED] transition-colors">
          {category.name}
        </h3>

        <p className="text-xs text-[#64748B] leading-relaxed mb-4 line-clamp-3">
          {category.description || 'Certified municipal remediation with geo-proximity contractor dispatch.'}
        </p>
      </div>

      <div>
        <div className="pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-2 text-[11px] text-[#64748B] mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>{category.estimatedResolutionHours || 48}h SLA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>{category.freeRadiusKm || 5} km Free Base</span>
          </div>
        </div>

        <Link
          to={`/user/report-issue?category=${encodeURIComponent(category._id)}`}
          className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-[#F8F7FC] hover:bg-[#EDE9FE] text-[#7C3AED] text-xs font-semibold transition-colors group"
        >
          <span>Report This Issue</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

export default ServiceCard;
