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
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Accordion, { AccordionItemData } from '../ui/Accordion';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';
import Button from '../ui/Button';

const HOW_IT_WORKS_STEPS: AccordionItemData[] = [
  {
    id: 'step-01',
    title: (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#5B4FE1] text-white shadow-xs shrink-0">
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
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#5B4FE1] text-white shadow-xs shrink-0">
          Step 02
        </span>
        <span className="font-heading font-semibold text-base text-ink">
          Automated Quote & Milestone Payments
        </span>
      </div>
    ),
    icon: <CreditCard className="w-4 h-4 text-primary" />,
    content: (
      <div className="space-y-3">
        <p className="text-secondaryText leading-relaxed">
          Our pricing engine calculates a transparent upfront repair fee based on standard civic rates. A 50% advance is paid before contractor mobilization, with the balance due only after verified completion.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <div className="p-3 rounded-lg bg-canvas border border-border flex items-start gap-2 text-xs">
            <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold block">50% Advance Protection</strong>
              <span className="text-muted">Structured milestone split; zero contractor risk of non-payment or arbitrary price gouging.</span>
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
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#5B4FE1] text-white shadow-xs shrink-0">
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
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#5B4FE1] text-white shadow-xs shrink-0">
          Step 04
        </span>
        <span className="font-heading font-semibold text-base text-ink">
          Photo Verification & Final Settlement
        </span>
      </div>
    ),
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
    content: (
      <div className="space-y-3">
        <p className="text-secondaryText leading-relaxed">
          The contractor uploads high-resolution After photos stamped with real GPS coordinates and timestamp proof. Upon citizen verification and administrative sign-off, the remaining 50% balance settles and a tax receipt is issued.
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
    <section className="py-20 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading and Process Overview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal>
              <SectionHeader
                eyebrow="Mathematical Accountability"
                eyebrowVariant="violet"
                title="How Crowd Report Solves Civic Hazards"
                subtitle="From citizen report to photo-verified resolution and contractor disbursement, every milestone is tracked with complete audit transparency."
                align="left"
                className="mb-6"
              />

              <div className="p-6 rounded-card bg-gradient-to-br from-primary-light/60 via-white to-[#5B4FE1]/10 border border-[#5B4FE1]/30 shadow-subtle space-y-3 text-xs mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#5B4FE1]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 font-bold text-ink">
                  <div className="w-7 h-7 rounded-lg bg-[#5B4FE1] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-sm">The 4-Stage Resolution Protocol</span>
                </div>
                <p className="text-secondaryText leading-relaxed">
                  Every civic hazard moves strictly through 4 verified gateways. No contractor receives final disbursement until digital photo proof meets inspection standards.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link to="/user/report-issue">
                  <Button variant="purple" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Report a Hazard
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="md">
                    Learn Operating Model
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <Accordion items={HOW_IT_WORKS_STEPS} defaultOpenId="step-01" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
