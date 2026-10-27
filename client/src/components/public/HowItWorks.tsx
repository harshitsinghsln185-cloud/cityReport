import React from 'react';
import {
  MapPin,
  CreditCard,
  Wrench,
  CheckCircle2,
  Shield,
  FileCheck2,
  Lock,
  Camera,
} from 'lucide-react';
import Accordion, { AccordionItemData } from '../ui/Accordion';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';

const HOW_IT_WORKS_STEPS: AccordionItemData[] = [
  {
    id: 'step-01',
    title: (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-navy text-gold">
          Step 01
        </span>
        <span className="font-heading font-semibold text-base text-ink">
          Citizen Geo-Reports Hazard
        </span>
      </div>
    ),
    icon: <MapPin className="w-4 h-4 text-primary" />,
    content: (
      <div className="space-y-3">
        <p className="text-secondaryText leading-relaxed">
          Citizens pinpoint the exact GPS coordinates on our interactive Leaflet map, choose the civic hazard category, and upload photographic evidence directly from their device. The system instantly registers the defect and provisions an immutable public tracking code.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">EXIF Data Verification</strong>
              <span className="text-muted">Extracts location & timestamp metadata to eliminate fake or duplicate reports.</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">Ward Routing</strong>
              <span className="text-muted">Instantly routes ticket to designated municipal zone and ward councillors.</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step-02',
    title: (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-navy text-gold">
          Step 02
        </span>
        <span className="font-heading font-semibold text-base text-ink">
          Automated Quote & Milestone Escrow
        </span>
      </div>
    ),
    icon: <CreditCard className="w-4 h-4 text-primary" />,
    content: (
      <div className="space-y-3">
        <p className="text-secondaryText leading-relaxed">
          Our pricing engine calculates an integer-exact remediation tariff based on certified municipal Schedule of Rates (SOR). 50% advance is deposited into an audited institutional escrow account before any contractor mobilizes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">50% Advance Protection</strong>
              <span className="text-muted">Funds locked in escrow; zero contractor risk of non-payment or citizen gouging.</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">Integer Paise Accounting</strong>
              <span className="text-muted">Strict double-entry financial ledger accounting with zero rounding drift.</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step-03',
    title: (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-navy text-gold">
          Step 03
        </span>
        <span className="font-heading font-semibold text-base text-ink">
          Certified Municipal Resolver Remediates On-Site
        </span>
      </div>
    ),
    icon: <Wrench className="w-4 h-4 text-primary" />,
    content: (
      <div className="space-y-3">
        <p className="text-secondaryText leading-relaxed">
          A background-screened, trade-licensed municipal contractor within a 25 km proximity radius accepts the assignment, deploys certified crew and equipment, and performs the physical remediation on-site.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <FileCheck2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">Vetted Trade Contractors</strong>
              <span className="text-muted">100% municipal license, GSTIN, and identity screened ward contractors.</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">24-48 Hour SLA</strong>
              <span className="text-muted">Strictly bound to response SLA with automated reassignment if neglected.</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step-04',
    title: (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-navy text-gold">
          Step 04
        </span>
        <span className="font-heading font-semibold text-base text-ink">
          Photo Verification & Escrow Settlement
        </span>
      </div>
    ),
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
    content: (
      <div className="space-y-3">
        <p className="text-secondaryText leading-relaxed">
          The contractor uploads high-resolution After photos stamped with real GPS coordinates and timestamp proof. Upon citizen verification and municipal supervisory sign-off, the remaining 50% escrow settles and a GST tax invoice is issued.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <Camera className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">GPS Photo Proof</strong>
              <span className="text-muted">Before and After photos locked to geographic boundaries for audit inspection.</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">7-Day Warranty Window</strong>
              <span className="text-muted">Citizens can reopen tickets within 7 days if any workmanship defect recurs.</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-canvas border-y border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Mathematical Accountability"
            eyebrowVariant="violet"
            title="How Crowd Report Solves Civic Hazards"
            subtitle="From citizen report to photo-verified resolution and contractor disbursement, every milestone is tracked with complete audit transparency."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <Accordion items={HOW_IT_WORKS_STEPS} defaultOpenId="step-01" />
        </Reveal>
      </div>
    </section>
  );
};

export default HowItWorks;
