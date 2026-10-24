import React from 'react';
import Accordion, { AccordionItemData } from '../ui/Accordion';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';
import { HelpCircle, Shield, Clock, Calculator, Camera, AlertTriangle, FileText } from 'lucide-react';

const FAQ_ITEMS: AccordionItemData[] = [
  {
    id: 'escrow-protection',
    title: 'How does the 50% advance escrow guarantee work?',
    icon: <Shield className="w-4 h-4" />,
    content: (
      <p>
        When you approve a remediation quote, 50% of the total cost is deposited into an audited civic escrow account, calculated in exact integer paise. The contractor does not receive the final settlement until they complete the physical work on-site, submit verifiable Before/After photo proof with geo-stamps, and the municipal inspector or reporter formally approves the remediation.
      </p>
    ),
  },
  {
    id: 'contractor-sla',
    title: 'What happens if an assigned contractor misses the response SLA?',
    icon: <Clock className="w-4 h-4" />,
    content: (
      <p>
        Every service category has a strictly defined SLA window (typically 24 to 48 hours). If a contractor does not accept the assignment or arrive on-site within the window, our proximity-routing engine automatically re-triggers contractor discovery within a 25 km radius. If no alternate certified contractor can be assigned, the escrowed advance is automatically released back to the citizen or public budget.
      </p>
    ),
  },
  {
    id: 'quote-pricing',
    title: 'How are remediation quotes calculated?',
    icon: <Calculator className="w-4 h-4" />,
    content: (
      <p>
        Quotes are generated using certified municipal Schedule of Rates (SOR). Each category has a transparent base fee covering initial mobilization within a free base radius (e.g. 5 km). Extra distance beyond the base radius is priced at a fixed per-kilometer rate. Emergency priority surcharges (e.g. 20% for critical hazards like open manholes) are clearly itemized with zero arbitrary markups.
      </p>
    ),
  },
  {
    id: 'photo-verification',
    title: 'How does the platform verify Before and After repair photos?',
    icon: <Camera className="w-4 h-4" />,
    content: (
      <p>
        When contractors upload completion proof, our image pipeline validates embedded EXIF metadata (geographic latitude/longitude coordinates matching the reported hazard within 50 meters, timestamp matching the work duration). Images are rendered in high resolution for municipal audit and citizen inspection before the ticket can transition to Resolved status.
      </p>
    ),
  },
  {
    id: 'dispute-reopen',
    title: 'Can citizens dispute or reopen an unsatisfactory repair?',
    icon: <AlertTriangle className="w-4 h-4" />,
    content: (
      <p>
        Yes. Citizens have a 7-day inspection window after resolution. If a repaired pothole caves in or street fixture fails, you can click "Reopen Issue" directly from your tracking page, specify the discrepancy with a fresh photo, and trigger an immediate quality audit by municipal supervisory staff.
      </p>
    ),
  },
  {
    id: 'tax-invoices',
    title: 'Do citizens or RWAs receive formal GST tax invoices?',
    icon: <FileText className="w-4 h-4" />,
    content: (
      <p>
        Yes. For every settled remediation, the platform automatically generates a downloadable GST-compliant tax invoice itemizing contractor labor, materials, municipal cess, and payment transaction IDs. These invoices are archived in your citizen dashboard for accounting and society audits.
      </p>
    ),
  },
];

export const FaqSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Civic Transparency"
            eyebrowVariant="violet"
            title="Frequently Asked Questions"
            subtitle="Straightforward answers about our escrow guarantees, contractor dispatch algorithms, and municipal verification standards."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <Accordion items={FAQ_ITEMS} defaultOpenId="escrow-protection" />
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-12 p-6 rounded-card bg-canvas border border-border text-center">
            <h4 className="font-heading font-semibold text-base text-ink mb-1">
              Have a specific ward question or municipal enquiry?
            </h4>
            <p className="text-xs sm:text-sm text-secondaryText max-w-lg mx-auto mb-4">
              Our civic administrative team responds to citizen inquiries within 24 business hours.
            </p>
            <a
              href="/query"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover hover:underline"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Contact the Civic Desk</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FaqSection;
