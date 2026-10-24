import React, { useState } from 'react';
import {
  MapPin,
  CreditCard,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Shield,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Citizen Geo-Reports Hazard',
      shortTitle: 'Report',
      description:
        'Citizens pinpoint the exact GPS location on our interactive map, select the civic category, and upload clear photo evidence. The system immediately creates a public tracking code.',
      icon: MapPin,
      badge: 'Step 1: Citizen Input',
      details: 'High-precision coordinate pinning + EXIF metadata extraction to prevent duplicates.',
    },
    {
      step: '02',
      title: 'Automated Quote & Escrow',
      shortTitle: 'Escrow',
      description:
        'Our engine calculates an integer-exact fee based on official municipal Schedule of Rates (SOR). 50% advance is deposited into an audited civic escrow account before contractor dispatch.',
      icon: CreditCard,
      badge: 'Step 2: Fair Pricing',
      details: 'Zero opaque contractor price negotiations. Governed by municipal radius tariffs.',
    },
    {
      step: '03',
      title: 'Certified Resolver Remediates',
      shortTitle: 'Remediation',
      description:
        'A vetted municipal contractor within 25 km accepts the work order, remediates the hazard on-site, and uploads high-resolution completion proof through their contractor app.',
      icon: Wrench,
      badge: 'Step 3: On-Site Action',
      details: 'ID-vetted resolvers with verified municipal trade credentials and safety gear.',
    },
    {
      step: '04',
      title: 'Photo Verification & Payout',
      shortTitle: 'Verification',
      description:
        'Municipal inspectors verify Before and After photos against coordinate boundaries. Upon satisfaction, the balance is settled, a GST tax invoice is produced, and funds disburse.',
      icon: CheckCircle2,
      badge: 'Step 4: Audit & Closure',
      details: '7-day citizen re-inspection window. Full refund or re-assignment if repair fails.',
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Mathematical Accountability"
            eyebrowVariant="violet"
            title="How Crowd Report Solves Civic Hazards"
            subtitle="From citizen report to photo-verified resolution and contractor disbursement, every milestone is tracked with complete audit transparency."
            align="center"
          />
        </Reveal>

        {/* Step Progression Selector Tabs (Mobile & Desktop) */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto no-scrollbar py-1">
          {steps.map((item, index) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all select-none flex items-center gap-2 border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeStep === index
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-canvas text-secondaryText border-border hover:bg-slate-100 hover:text-ink'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                activeStep === index ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {index + 1}
              </span>
              <span>{item.shortTitle}</span>
            </button>
          ))}
        </div>

        {/* 4 Cards Grid with active highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isSelected = activeStep === index;

            return (
              <Reveal key={item.step} delay={index * 0.1}>
                <div
                  onClick={() => setActiveStep(index)}
                  className={`relative p-6 rounded-card border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                    isSelected
                      ? 'bg-white border-primary shadow-card ring-1 ring-primary/30 transform -translate-y-1'
                      : 'bg-canvas/60 border-border hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-2xl font-heading font-extrabold transition-colors ${
                        isSelected ? 'text-primary' : 'text-slate-300'
                      }`}>
                        {item.step}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lavender text-primary border border-primary/20">
                        {item.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform ${
                      isSelected
                        ? 'bg-primary text-white scale-105 shadow-md shadow-primary/25'
                        : 'bg-white border border-border text-primary'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-semibold text-base text-ink mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-secondaryText leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Micro Detail Pill */}
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-muted flex items-start gap-1.5 font-medium">
                    <Shield className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{item.details}</span>
                  </div>

                  {/* Arrow Indicator on Desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
