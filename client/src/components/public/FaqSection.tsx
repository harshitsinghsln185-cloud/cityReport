import React from 'react';
import Accordion, { AccordionItemData } from '../ui/Accordion';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';
import Button from '../ui/Button';
import { HelpCircle, Shield, Clock, Calculator, Camera, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

const FAQ_ITEMS: AccordionItemData[] = [
  {
    id: 'milestone-payments',
    title: 'How does the 50% advance and completion milestone work?',
    icon: <Shield className="w-4 h-4 text-primary" />,
    content: (
      <p>
        When you approve a repair quote, 50% advance is paid to dispatch the verified local resolver to your location. The resolver receives the balance settlement only after they complete the physical repair on-site, upload verified Before and After photos, and the resolution is approved by platform administrators.
      </p>
    ),
  },
  {
    id: 'contractor-dispatch',
    title: 'What happens if an assigned contractor cannot attend to the issue?',
    icon: <Clock className="w-4 h-4 text-primary" />,
    content: (
      <p>
        If an assigned resolver is unable to accept the task or attend to the site, our routing system automatically searches for alternative verified resolvers within the local coverage area. If no alternate resolver can be assigned, the advance payment is fully refunded to the reporter.
      </p>
    ),
  },
  {
    id: 'quote-pricing',
    title: 'How are repair quotes calculated?',
    icon: <Calculator className="w-4 h-4 text-primary" />,
    content: (
      <p>
        Quotes are generated transparently using category base fees and travel distance rates. Each civic category includes a base service fee within a standard service radius, plus a per-kilometer travel rate beyond that distance. Priority adjustments for critical hazards are clearly itemized upfront.
      </p>
    ),
  },
  {
    id: 'photo-verification',
    title: 'How does the platform verify Before and After repair photos?',
    icon: <Camera className="w-4 h-4 text-primary" />,
    content: (
      <p>
        When resolvers submit resolution proof, they provide clear Before and After photographs taken on site. Platform administrators review the completion evidence against the reported issue before the ticket can transition to Closed status.
      </p>
    ),
  },
  {
    id: 'dispute-reopen',
    title: 'Can citizens dispute or reopen an unsatisfactory repair?',
    icon: <AlertTriangle className="w-4 h-4 text-primary" />,
    content: (
      <p>
        Yes. Citizens have a review window after work completion. If a repaired defect reoccurs or requires rework, you can click &ldquo;Reopen Issue&rdquo; directly from your tracking page, submit feedback with a fresh photo, and request admin review.
      </p>
    ),
  },
  {
    id: 'tax-invoices',
    title: 'Do citizens receive formal GST tax invoices?',
    icon: <FileText className="w-4 h-4 text-primary" />,
    content: (
      <p>
        Yes. For every completed repair payment, the platform automatically generates a downloadable GST-compliant tax invoice itemizing service fees, travel costs, and payment transaction IDs. These invoices are archived in your citizen dashboard.
      </p>
    ),
  },
];

export const FaqSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading and Support Action */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal>
              <SectionHeader
                eyebrow="Civic Transparency"
                eyebrowVariant="violet"
                title="Frequently Asked Questions"
                subtitle="Straightforward answers about our milestone payments, contractor dispatch, and verification standards."
                align="left"
                className="mb-6"
              />

              <div className="p-6 rounded-card bg-gradient-to-br from-primary-light/60 via-white to-primary/5 border border-border shadow-subtle space-y-3 mb-6 relative overflow-hidden">
                <div className="flex items-center gap-2 text-ink font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>Have a Specific Inquiry?</span>
                </div>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Our civic administrative desk assists citizens, resident welfare associations, and contractors with questions regarding reports, dispatch, and billing.
                </p>
              </div>

              <Button to="/query" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Contact Civic Desk
                </Button>
            </Reveal>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <Accordion items={FAQ_ITEMS} defaultOpenId="milestone-payments" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
