import React from 'react';
import { Camera, ShieldCheck, UserCheck, Search, FileText, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';

interface ProtectionPillar {
  title: string;
  description: string;
  badge: string;
  icon: React.FC<{ className?: string }>;
}

const PROTECTION_PILLARS: ProtectionPillar[] = [
  {
    title: 'Photo & Location Evidence',
    description:
      'Every civic report requires geo-tagged physical photos and exact street coordinates, ensuring resolvers dispatch to the precise defect site.',
    badge: 'Verified Submission',
    icon: Camera,
  },
  {
    title: '50% Advance & Completion Balance',
    description:
      'Pay 50% advance to initiate contractor mobilization. The remaining 50% balance is payable only after you inspect and accept completion photos.',
    badge: 'Milestone Payments',
    icon: ShieldCheck,
  },
  {
    title: 'Admin Verification Review',
    description:
      'Platform administrators examine Before and After photographic proofs and contractor completion notes prior to closing any issue.',
    badge: 'Photo Verified',
    icon: UserCheck,
  },
  {
    title: 'Real-Time Status Tracking',
    description:
      'Use your unique tracking code to follow every dispatch update, resolver acceptance, on-site arrival, and resolution timestamp.',
    badge: 'Public Transparency',
    icon: Search,
  },
  {
    title: 'Itemized GST Invoices',
    description:
      'Every paid milestone generates an official, downloadable GST tax invoice with an itemized breakdown of base service fee and travel rate.',
    badge: 'Audit Trail',
    icon: FileText,
  },
];

export const TestimonialsTrust: React.FC = () => {
  return (
    <section className="py-20 bg-canvas border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Platform Protection"
            eyebrowVariant="neutral"
            title="How We Protect Citizens & Resolvers"
            subtitle="Every repair on Crowd Report is backed by physical verification, milestone funding, and complete transparency."
            align="center"
          />
        </Reveal>

        {/* Protection Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PROTECTION_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={idx * 0.08}>
                <Card
                  variant="base"
                  className="h-full flex flex-col justify-between bg-surface border border-border hover:shadow-cardHover transition-all duration-200 p-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/15">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-base text-ink mb-2">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border flex items-center gap-2 text-xs text-muted">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Standard platform safeguard</span>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsTrust;
