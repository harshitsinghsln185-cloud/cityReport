import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import Hero from '../../components/public/Hero';
import LiveTicker from '../../components/public/LiveTicker';
import HowItWorks from '../../components/public/HowItWorks';
import ServiceCard from '../../components/public/ServiceCard';
import BeforeAfterSlider from '../../components/public/BeforeAfterSlider';
import TestimonialsTrust from '../../components/public/TestimonialsTrust';
import FaqSection from '../../components/public/FaqSection';
import MobileBottomBar from '../../components/public/MobileBottomBar';
import categoryService, { Category } from '../../services/category.service';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
import Reveal from '../../components/ui/Reveal';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';

// Representative popular states for the quick jump strip
const FEATURED_STATES = [
  { slug: 'delhi', name: 'Delhi NCR', zone: 'North', issues: 'Active', zoneColor: 'border-blue-300 text-blue-700 bg-blue-50' },
  { slug: 'maharashtra', name: 'Maharashtra', zone: 'West', issues: 'Active', zoneColor: 'border-cyan-300 text-cyan-700 bg-cyan-50' },
  { slug: 'karnataka', name: 'Karnataka', zone: 'South', issues: 'Active', zoneColor: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', zone: 'South', issues: 'Active', zoneColor: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', zone: 'North', issues: 'Active', zoneColor: 'border-blue-300 text-blue-700 bg-blue-50' },
  { slug: 'west-bengal', name: 'West Bengal', zone: 'East', issues: 'Active', zoneColor: 'border-amber-300 text-amber-700 bg-amber-50' },
];

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getActiveCategories();
        const list = Array.isArray(data) ? data : [];
        setCategories(list.slice(0, 6));
      } catch (err) {
        console.error('Failed to load categories for homepage:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Civic Issue Reporting & Municipal Resolution Platform"
        description="Report civic issues, potholes, streetlights, and sanitation hazards. Track verified before-and-after photo proof with local contractor dispatch across Indian states."
        keywords={[
          'civic issues',
          'pothole repair',
          'street light repair',
          'municipal resolution',
          'citizen reporting',
          'verified contractor dispatch',
          'India civic portal',
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'GovernmentService',
          name: 'Crowd Report Civic Resolution Platform',
          serviceType: 'Municipal Issue Reporting and Contractor Repair',
          provider: {
            '@type': 'Organization',
            name: 'Crowd Report',
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.svg`,
          },
          areaServed: {
            '@type': 'Country',
            name: 'India',
          },
          availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: SITE_URL,
          },
        }}
      />

      {/* SECTION 1: Dark Primary Navy Hero (#0A1F44) */}
      <Hero />

      {/* Ticker Banner */}
      <LiveTicker />

      {/* SECTION 2: Warm Ivory Canvas States Quick Jump (#FAF8F3) */}
      <section className="py-14 bg-canvas border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Pan-India Coverage
                </span>
              </div>
              <h2 className="font-heading font-bold text-2xl text-ink">
                Select Your State or Territory
              </h2>
            </div>
            <Button
              to="/states"
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse All 36 States &amp; UTs
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FEATURED_STATES.map((st) => (
              <Button
                key={st.slug}
                to={`/states/${st.slug}`}
                variant="secondary"
                size="sm"
                isFullWidth
                className="flex flex-col items-start p-3 h-auto justify-between text-left border border-card-border hover:border-primary/40 bg-white"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${st.zoneColor}`}>
                    {st.zone}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted" />
                </div>
                <span className="font-heading font-bold text-sm text-ink truncate w-full">
                  {st.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: White Surface Service Categories Grid (#FFFFFF) */}
      <section id="categories-section" className="py-20 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Civic Directory"
              eyebrowVariant="primary"
              title="Supported Public Hazard Categories"
              subtitle="Certified municipal categories ready for immediate citizen reporting, transparent pricing computation, and proximity contractor assignment."
              actions={
                <Button to="/services" variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All Categories
                </Button>
              }
            />
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-canvas border border-card-border p-6 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(categories) ? categories : []).map((cat, idx) => (
                <Reveal key={cat._id} delay={idx * 0.05}>
                  <ServiceCard category={cat} index={idx} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* SECTION 6: White Surface Before/After Slider (#FFFFFF) */}
      <section className="py-20 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading & Audit Standards */}
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeader
                  eyebrow="Verifiable Proof"
                  eyebrowVariant="accent"
                  title="Interactive Repair Showcase"
                  subtitle="Every resolved hazard requires timestamped, geo-tagged Before and After photographic evidence before admin verification sign-off and balance payout."
                  align="left"
                  className="mb-6"
                />

                <div className="space-y-3 pt-2 mb-6">
                  <div className="flex items-center gap-2.5 text-xs text-secondaryText">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Geo-tagged coordinates recorded on submission</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-secondaryText">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Admin review of Before and After photographic proof</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-secondaryText">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>50% completion balance released upon verified photo proof</span>
                  </div>
                </div>

                <Button to="/track" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Verify a Repair Ticket
                </Button>
              </Reveal>
            </div>

            {/* Right Column: Before/After Slider */}
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <BeforeAfterSlider />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <FaqSection />

      {/* Trust & Community Proof Section */}
      <TestimonialsTrust />

      {/* SECTION 7: Deep Navy Final CTA Strip (#06132B) */}
      <section className="py-20 bg-gradient-to-br from-[#06132B] via-[#0A1F44] to-[#12306A] text-white relative overflow-hidden">
        {/* Decorative ambient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="w-14 h-14 rounded-2xl bg-accent text-navy flex items-center justify-center mx-auto mb-6 shadow-glow">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white mb-4 tracking-tight">
              Ready to Restore Your Neighborhood?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10 font-sans">
              Report local road damage, drainage issues, streetlights, and sanitation hazards with verified photo proof and milestone payments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                to="/user/report-issue"
                variant="accent"
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-black/30 flex items-center justify-center gap-2 font-bold text-navy"
              >
                <span>Report an Issue Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                to="/states"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <span>Explore States Directory</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>50% Advance &amp; Balance on Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Tracked Status Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Before/After Photo Proof</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mobile Sticky Bottom CTA Bar */}
      <MobileBottomBar />
    </div>
  );
};

export default Home;
