import React from 'react';
import {
  MapPin,
  CreditCard,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Report with Geo-Tag',
      description:
        'Citizens pinpoint the exact location on our map, choose the civic category, and upload photo evidence.',
      icon: MapPin,
      badge: 'Civic Report',
    },
    {
      step: '02',
      title: 'Fair Quote & Advance',
      description:
        'System automatically discovers nearby certified resolvers, calculates transparent quote, and secures 50% advance in escrow.',
      icon: CreditCard,
      badge: '50% Escrow',
    },
    {
      step: '03',
      title: 'Certified Remediation',
      description:
        'A vetted local contractor accepts the task, remediates the hazard on-site, and submits verifiable Before/After photo proof.',
      icon: Wrench,
      badge: 'Photo Verified',
    },
    {
      step: '04',
      title: 'Inspection & Closure',
      description:
        'Municipal administration verifies photo proof, final balance is settled, tax invoice is generated, and payout is disbursed.',
      icon: CheckCircle2,
      badge: 'Legal Closure',
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
            Transparent Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#1E293B] mt-3 mb-4">
            How Crowd Report Works
          </h2>
          <p className="text-sm sm:text-base text-[#64748B]">
            From citizen hazard reporting to photo-verified resolution and contractor disbursement, every milestone is tracked with complete audit transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-[#F8F7FC] border border-[#E2E8F0] hover:border-[#7C3AED]/40 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-heading font-extrabold text-[#7C3AED]/30 group-hover:text-[#7C3AED] transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED]">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#7C3AED] mb-4 shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#1E293B] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#CBD5E1]">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
