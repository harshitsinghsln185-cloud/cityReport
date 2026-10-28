import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Users,
  CreditCard,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';
import Button from '../ui/Button';

interface StepData {
  step: string;
  stepNum: number;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  highlights: Array<{ label: string; detail: string }>;
}

const STEPS: StepData[] = [
  {
    step: 'Step 01',
    stepNum: 1,
    title: 'Report with Photo & GPS Pin',
    badge: 'Immediate Citizen Logging',
    description:
      'Pinpoint the exact GPS location on the interactive map, choose the public hazard category, and upload photographic evidence directly from your phone. An immutable ticket code is issued instantly.',
    icon: <MapPin className="w-5 h-5 text-primary" />,
    highlights: [
      { label: 'EXIF Metadata Proof', detail: 'Extracts real location and timestamps to verify authentic reports.' },
      { label: 'Instant Zone Routing', detail: 'Routes ticket to designated municipal zone and ward contractors.' },
    ],
  },
  {
    step: 'Step 02',
    stepNum: 2,
    title: 'Geo-Matched Contractor Assigned',
    badge: 'Rapid Proximity Dispatch',
    description:
      'A background-checked, licensed local contractor within your ward coverage radius accepts the job and mobilizes crew and materials with a clear turnaround SLA.',
    icon: <Users className="w-5 h-5 text-primary" />,
    highlights: [
      { label: 'Screened Resolvers', detail: 'Identity-screened local contractors with verified municipal records.' },
      { label: 'Direct Milestone Mobilization', detail: 'Fast dispatch without waiting for distant bureaucratic delays.' },
    ],
  },
  {
    step: 'Step 03',
    stepNum: 3,
    title: '50% Advance to Start Work',
    badge: 'Transparent Ledger Split',
    description:
      'Citizen covers a 50% advance to initiate repair mobilization, with real-time tracking along the timeline. The contractor is backed by guaranteed payment upon certified work.',
    icon: <CreditCard className="w-5 h-5 text-primary" />,
    highlights: [
      { label: 'Advance Payment Protection', detail: 'Secures contractor commitment while protecting citizen funds.' },
      { label: 'Live Timeline Updates', detail: 'Track status changes in real-time as crew begins work on site.' },
    ],
  },
  {
    step: 'Step 04',
    stepNum: 4,
    title: 'Photo-Verified Completion & Balance',
    badge: 'Verified Sign-Off',
    description:
      'The contractor uploads geotagged After photos matching the original angle. Admin verifies completion proof, citizen approves the resolution, and balance payment is disbursed.',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
    highlights: [
      { label: 'Before & After Proof', detail: 'Geotagged photos side-by-side for unmistakable verification.' },
      { label: 'Citizen Sign-Off', detail: 'Balance released only after photographic resolution is validated.' },
    ],
  },
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll spy on desktop to track active step
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      stepRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        if (scrollPos >= top && scrollPos <= bottom) {
          setActiveStep(index + 1);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-24 bg-canvas border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Milestone Protocol"
            eyebrowVariant="primary"
            title="How Crowd Report Solves Civic Hazards"
            subtitle="From citizen report to photo-verified resolution and contractor payout, every milestone is tracked with complete transparency."
            align="center"
            className="mb-16"
          />
        </Reveal>

        {/* Desktop & Tablet: Sticky Progress Line Scroll Story */}
        <div ref={containerRef} className="relative hidden md:block">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left Sticky Progress Rail (4 cols) */}
            <div className="col-span-4 sticky top-28 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-card-border shadow-xs">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded-md border border-primary/20">
                  Step {activeStep} of 4
                </span>

                <h3 className="font-heading font-bold text-xl text-ink mt-3 mb-2">
                  {STEPS[activeStep - 1].title}
                </h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  {STEPS[activeStep - 1].description}
                </p>

                {/* Progress Indicators */}
                <div className="space-y-3 pt-4 border-t border-card-border mt-4">
                  {STEPS.map((s) => (
                    <div
                      key={s.step}
                      className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                        activeStep === s.stepNum
                          ? 'bg-primary-light/60 border border-primary/20'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                      onClick={() => {
                        stepRefs.current[s.stepNum - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                          activeStep === s.stepNum
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        0{s.stepNum}
                      </div>
                      <span className="text-xs font-semibold text-ink truncate">
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-5">
                  <Button to="/user/report-issue" variant="primary" size="sm" isFullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Report a Hazard
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Scrollable Story Cards (8 cols) */}
            <div className="col-span-8 space-y-8 pl-4 border-l-2 border-slate-200">
              {STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  ref={(el) => (stepRefs.current[idx] = el)}
                  className={`p-8 rounded-2xl bg-white border transition-all duration-300 ${
                    activeStep === step.stepNum
                      ? 'border-primary/40 shadow-card ring-2 ring-primary/10'
                      : 'border-card-border shadow-xs opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-mono font-bold text-sm shadow-xs">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-lg text-ink">
                          {step.title}
                        </h4>
                        <span className="text-xs text-muted font-medium">
                          {step.badge}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-card-border flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <p className="text-sm text-secondaryText leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-card-border">
                    {step.highlights.map((h) => (
                      <div key={h.label} className="p-3.5 rounded-xl bg-canvas border border-card-border text-xs">
                        <strong className="text-ink font-semibold block mb-0.5">
                          {h.label}
                        </strong>
                        <span className="text-muted leading-relaxed">
                          {h.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View: Horizontal Snap Scroll with Step Counter */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-muted">Swipe steps horizontally</span>
            <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full">
              4 Steps Total
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-1">
            {STEPS.map((step) => (
              <div
                key={step.step}
                className="min-w-[85vw] snap-center p-6 rounded-2xl bg-white border border-card-border shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-primary text-white">
                      {step.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h4 className="font-heading font-bold text-base text-ink mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted font-medium mb-3">
                    {step.badge}
                  </p>
                  <p className="text-xs text-secondaryText leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-card-border">
                  {step.highlights.map((h) => (
                    <div key={h.label} className="p-2.5 rounded-lg bg-canvas text-xs">
                      <strong className="text-ink font-semibold block">{h.label}</strong>
                      <span className="text-muted text-xs">{h.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button to="/user/report-issue" variant="primary" size="md" isFullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
              Report an Issue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
