import React from 'react';
import {
  Camera,
  ShieldCheck,
  Search,
  UserCheck,
  FileText,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';

interface ProtectionPillar {
  stepNum: number;
  title: string;
  description: string;
  badge: string;
  proof: string;
  icon: React.FC<{ className?: string }>;
}

const PROTECTION_PILLARS: ProtectionPillar[] = [
  {
    stepNum: 1,
    title: 'Photo & Location Evidence',
    description:
      'Every civic report requires geo-tagged physical photos and precise street coordinates for accurate resolver dispatch.',
    badge: 'Verified Submission',
    proof: 'Geo-tagged EXIF coordinates',
    icon: Camera,
  },
  {
    stepNum: 2,
    title: '50% Milestone Advance',
    description:
      'Initial advance funds contractor mobilization, held safely in platform escrow until physical work commences.',
    badge: 'Milestone Payments',
    proof: 'Escrow payment protection',
    icon: ShieldCheck,
  },
  {
    stepNum: 3,
    title: 'Real-Time Status Tracking',
    description:
      'Follow every dispatch milestone, contractor arrival, and repair progress with an immutable public tracking code.',
    badge: 'Public Transparency',
    proof: 'Live dispatch timeline',
    icon: Search,
  },
  {
    stepNum: 4,
    title: 'Admin Verification Review',
    description:
      'Platform administrators examine dual-angle Before and After photo evidence before signing off on resolution.',
    badge: 'Photo Verified',
    proof: 'Dual photo audit',
    icon: UserCheck,
  },
  {
    stepNum: 5,
    title: 'Itemized GST Invoices',
    description:
      'Final completion balance releases an official downloadable GST tax invoice with an itemized breakdown of all fees.',
    badge: 'Audit Trail',
    proof: 'GST tax compliant invoice',
    icon: FileText,
  },
];

export const TestimonialsTrust: React.FC = () => {
  return (
    <section className="py-20 bg-canvas border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Protection Protocol"
            eyebrowVariant="primary"
            title="How We Protect Citizens & Resolvers"
            subtitle="Every repair on Crowd Report is backed by physical verification, milestone funding, and complete transparency."
            align="center"
            className="mb-14 sm:mb-16"
          />
        </Reveal>

        {/* Desktop & Tablet: Horizontal Dashed Pipeline */}
        <div className="hidden md:block relative">
          {/* Dashed Connecting Line running through centers of all circles */}
          <div
            className="absolute top-10 sm:top-12 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-accent/60 z-0 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-5 gap-3 lg:gap-6 relative z-10">
            {PROTECTION_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;

              return (
                <Reveal key={pillar.title} delay={idx * 0.08}>
                  <div className="flex flex-col items-center text-center group">
                    {/* Circle Node with Floating Step Number */}
                    <div className="relative mb-5">
                      {/* Outer Cream/Gold Ring */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-light border-2 border-accent/40 shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        {/* Inner Dark Navy Circle */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-navy text-white flex items-center justify-center shadow-inner group-hover:bg-navy-light transition-colors">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                      </div>

                      {/* Floating Step Number Badge at Top-Right */}
                      <div className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-navy border-2 border-white text-accent flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold shadow-xs">
                        0{pillar.stepNum}
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-ink mb-2 min-h-[44px] flex items-center justify-center leading-snug tracking-tight">
                      {pillar.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs text-secondaryText leading-relaxed mb-3 max-w-[210px] mx-auto">
                      {pillar.description}
                    </p>

                    {/* Safeguard Badge */}
                    <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 mt-auto">
                      {pillar.badge}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Mobile View: Vertical Dashed Pipeline */}
        <div className="md:hidden relative">
          {/* Vertical Dashed Line running through circle centers */}
          <div
            className="absolute top-10 bottom-10 left-10 w-0.5 border-l-2 border-dashed border-accent/60 z-0 pointer-events-none"
            aria-hidden="true"
          />

          <div className="space-y-7 relative z-10">
            {PROTECTION_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;

              return (
                <Reveal key={pillar.title} delay={idx * 0.06}>
                  <div className="flex items-start gap-4">
                    {/* Circle Node with Floating Step Number */}
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-full bg-accent-light border-2 border-accent/40 shadow-sm flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center shadow-inner">
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-navy border-2 border-white text-accent flex items-center justify-center text-[10px] font-mono font-bold shadow-xs">
                        0{pillar.stepNum}
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 pt-1">
                      <h3 className="font-heading font-extrabold text-base text-ink mb-1 tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-secondaryText leading-relaxed mb-2">
                        {pillar.description}
                      </p>
                      <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                        {pillar.proof}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsTrust;
