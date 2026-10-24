import React from 'react';
import { ShieldCheck, Star, CheckCircle2, Quote, Award } from 'lucide-react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../ui/Reveal';

interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  hazardType: string;
  rating: number;
  timeToResolve: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Dr. Radhika Sen',
    role: 'Resident Welfare Association President',
    location: 'Indiranagar 2nd Stage, Bengaluru',
    hazardType: 'Cave-in & Storm Drain Collapse',
    quote:
      'We had been sending physical letters to the municipal ward office for 4 months with zero follow-through. Through Crowd Report, the exact geo-tagged coordinates and photo evidence triggered an escrow-backed work order in 6 hours. The contractor completed the concrete culvert in 48 hours.',
    rating: 5,
    timeToResolve: 'Resolved in 48h',
  },
  {
    name: 'Amitabh Mukherjee',
    role: 'Commercial Market Association Secretary',
    location: 'Sector 18, Noida, Uttar Pradesh',
    hazardType: 'Exposed Commercial High-Voltage Cables',
    quote:
      'The 50% advance escrow system is revolutionary. Unlike typical public tenders where funds disappear, our association could see that the money was locked until the municipal inspector approved the Before and After high-resolution photo proof.',
    rating: 5,
    timeToResolve: 'Resolved in 26h',
  },
  {
    name: 'Kavitha Ramachandran',
    role: 'Citizen Reporter & School Trustee',
    location: 'Anna Nagar West, Chennai',
    hazardType: 'Hazardous Open Manhole near Primary School',
    quote:
      'The speed was astounding. I reported an open manhole at 8:00 AM on my commute. By 11:30 AM, a certified local resolver was on site installing a reinforced cast-iron cover. The tracking code kept our entire neighborhood informed.',
    rating: 5,
    timeToResolve: 'Resolved in 3.5h',
  },
];

export const TestimonialsTrust: React.FC = () => {
  return (
    <section className="py-20 bg-canvas border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Verified Civic Impact"
            eyebrowVariant="violet"
            title="Trusted by Citizens, Resident Welfare Associations & Ward Councils"
            subtitle="Real outcomes from neighborhood leaders who used Crowd Report to eliminate chronic hazards with mathematical transparency."
            align="center"
          />
        </Reveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 0.1}>
              <Card
                variant="base"
                className="h-full flex flex-col justify-between bg-white border-border hover:shadow-cardHover transition-all duration-200"
              >
                <div>
                  {/* Star Rating & SLA tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      {t.timeToResolve}
                    </span>
                  </div>

                  {/* Hazard context tag */}
                  <div className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-primary/40 shrink-0" />
                    <span>{t.hazardType}</span>
                  </div>

                  {/* Body quote */}
                  <p className="text-sm text-secondaryText leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-lavender text-primary font-heading font-bold flex items-center justify-center shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-sm text-ink truncate flex items-center gap-1.5">
                      <span>{t.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    </p>
                    <p className="text-[11px] text-muted truncate">{t.role}</p>
                    <p className="text-[11px] text-slate-400 truncate">{t.location}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Civic Technical Governance & Compliance Seals (SVG Only) */}
        <Reveal delay={0.3}>
          <div className="pt-10 border-t border-border/80">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted mb-6">
              Standards & Civic Governance Compliance
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-border flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-indigo/10 text-indigo flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink leading-tight">Escrow Protected</p>
                  <p className="text-[10px] text-muted">Paise-Exact Escrow Gate</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-border flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink leading-tight">Vetted Contractors</p>
                  <p className="text-[10px] text-muted">Municipal Skills Registry</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-border flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink leading-tight">Photo Audited</p>
                  <p className="text-[10px] text-muted">Geo-Tagged & Timestamped</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-border flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink leading-tight">All 36 States/UTs</p>
                  <p className="text-[10px] text-muted">India-Wide Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default TestimonialsTrust;
