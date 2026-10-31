import React from 'react';
import {
  MapPin,
  Users,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';
import Button from '../ui/Button';
import Accordion, { AccordionItemData } from '../ui/Accordion';

const STEP_ITEMS: AccordionItemData[] = [
  {
    id: 'step-1',
    title: (
      <span className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary-light text-primary border border-primary/20 shrink-0">
          Step 01
        </span>
        <span className="font-heading font-bold text-base text-ink tracking-tight">
          Report with Photo &amp; GPS Pin
        </span>
      </span>
    ),
    icon: <MapPin className="w-4 h-4 text-primary shrink-0" />,
    content: (
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-block text-[11px] font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full border border-primary/15">
            Immediate Citizen Logging
          </span>
        </div>
        <p className="text-sm text-secondaryText leading-relaxed">
          Pinpoint the exact GPS location on the interactive map, choose the public hazard category, and upload photographic evidence directly from your phone. An immutable ticket code is issued instantly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white border border-card-border text-xs">
            <strong className="text-ink font-semibold block mb-0.5">EXIF Metadata Proof</strong>
            <span className="text-muted leading-relaxed">Extracts real location and timestamps to verify authentic reports.</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-card-border text-xs">
            <strong className="text-ink font-semibold block mb-0.5">Instant Zone Routing</strong>
            <span className="text-muted leading-relaxed">Routes ticket to designated municipal zone and ward contractors.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step-2',
    title: (
      <span className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary-light text-primary border border-primary/20 shrink-0">
          Step 02
        </span>
        <span className="font-heading font-bold text-base text-ink tracking-tight">
          Geo-Matched Contractor Assigned
        </span>
      </span>
    ),
    icon: <Users className="w-4 h-4 text-primary shrink-0" />,
    content: (
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-block text-[11px] font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full border border-primary/15">
            Rapid Proximity Dispatch
          </span>
        </div>
        <p className="text-sm text-secondaryText leading-relaxed">
          A background-checked, licensed local contractor within your ward coverage radius accepts the job and mobilizes crew and materials with a clear turnaround SLA.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white border border-card-border text-xs">
            <strong className="text-ink font-semibold block mb-0.5">Screened Resolvers</strong>
            <span className="text-muted leading-relaxed">Identity-screened local contractors with verified municipal records.</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-card-border text-xs">
            <strong className="text-ink font-semibold block mb-0.5">Direct Milestone Mobilization</strong>
            <span className="text-muted leading-relaxed">Fast dispatch without waiting for distant bureaucratic delays.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step-3',
    title: (
      <span className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary-light text-primary border border-primary/20 shrink-0">
          Step 03
        </span>
        <span className="font-heading font-bold text-base text-ink tracking-tight">
          50% Advance to Start Work
        </span>
      </span>
    ),
    icon: <CreditCard className="w-4 h-4 text-primary shrink-0" />,
    content: (
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-block text-[11px] font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full border border-primary/15">
            Transparent Ledger Split
          </span>
        </div>
        <p className="text-sm text-secondaryText leading-relaxed">
          Citizen covers a 50% advance to initiate repair mobilization, with real-time tracking along the timeline. The contractor is backed by guaranteed payment upon certified work.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white border border-card-border text-xs">
            <strong className="text-ink font-semibold block mb-0.5">Advance Payment Protection</strong>
            <span className="text-muted leading-relaxed">Secures contractor commitment while protecting citizen funds.</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-card-border text-xs">
            <strong className="text-ink font-semibold block mb-0.5">Live Timeline Updates</strong>
            <span className="text-muted leading-relaxed">Track status changes in real-time as crew begins work on site.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step-4',
    title: (
      <span className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary-light text-primary border border-primary/20 shrink-0">
          Step 04
        </span>
        <span className="font-heading font-bold text-base text-ink tracking-tight">
          Photo-Verified Completion &amp; Balance
        </span>
      </span>
    ),
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    content: (
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Verified Sign-Off
          </span>
        </div>
        <p className="text-sm text-secondaryText leading-relaxed">
          The contractor uploads geotagged After photos matching the original angle. Admin verifies completion proof, citizen approves the resolution, and balance payment is disbursed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white border border-card-border text-xs">
            <strong className="text-ink font-semibold block mb-0.5">Before &amp; After Proof</strong>
            <span className="text-muted leading-relaxed">Geotagged photos side-by-side for unmistakable verification.</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-card-border text-xs">
            <strong className="text-ink font-semibold block mb-0.5">Citizen Sign-Off</strong>
            <span className="text-muted leading-relaxed">Balance released only after photographic resolution is validated.</span>
          </div>
        </div>
      </div>
    ),
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-canvas border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading and Support Action */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal>
              <SectionHeader
                eyebrow="Milestone Protocol"
                eyebrowVariant="violet"
                title="How Crowd Report Solves Civic Hazards"
                subtitle="From citizen report to photo-verified resolution and contractor payout, every milestone is tracked with complete transparency."
                align="left"
                className="mb-6"
              />

              <div className="p-6 rounded-card bg-gradient-to-br from-primary-light/60 via-white to-primary/5 border border-border shadow-subtle space-y-3 mb-6 relative overflow-hidden">
                <div className="flex items-center gap-2 text-ink font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Milestone-Protected Resolution</span>
                </div>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Every civic ticket is backed by verified before-and-after photo evidence and structured milestone disbursements so work is completed reliably.
                </p>
              </div>

              <Button to="/user/report-issue" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Report a Hazard
              </Button>
            </Reveal>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <Accordion items={STEP_ITEMS} defaultOpenId="step-1" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
