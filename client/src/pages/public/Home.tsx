import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
} from 'lucide-react';
import Hero from '../../components/public/Hero';
import LiveTicker from '../../components/public/LiveTicker';
import HowItWorks from '../../components/public/HowItWorks';
import ServiceCard from '../../components/public/ServiceCard';
import BeforeAfterSlider from '../../components/public/BeforeAfterSlider';
import TestimonialsTrust from '../../components/public/TestimonialsTrust';
import FaqSection from '../../components/public/FaqSection';
import categoryService, { Category } from '../../services/category.service';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
import Reveal from '../../components/ui/Reveal';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';

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
          serviceType: 'Municipal Issue Reporting and Contractor Remediation',
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
      {/* 1. Interactive Photo Hero with Street Hazard Hotspots */}
      <Hero />

      {/* 2. Live Civic Remediation Ticker & Impact Counter */}
      <LiveTicker />

      {/* 3. Active Civic Services Grid */}
      <section id="categories-section" className="py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Civic Directory"
              eyebrowVariant="violet"
              title="Supported Public Hazard Categories"
              subtitle="Certified municipal categories ready for immediate citizen reporting, automated tariff computation, and proximity-based contractor assignment."
              actions={
                <Button to="/services" variant="purple" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View All Categories
                  </Button>
              }
            />
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 rounded-card bg-white border border-border p-6 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(categories) ? categories : []).map((cat, idx) => (
                <Reveal key={cat._id} delay={idx * 0.05}>
                  <ServiceCard category={cat} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Interactive Showcase: Before/After Image Comparison Slider (Split 2-Column) */}
      <section className="py-20 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading & Audit Standards */}
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeader
                  eyebrow="Verifiable Proof"
                  eyebrowVariant="gold"
                  title="Interactive Remediation Showcase"
                  subtitle="Every resolved hazard requires timestamped, geo-tagged Before and After photographic evidence before admin verification sign-off and balance disbursement."
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

                <Button to="/track" variant="purple" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
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

      {/* 5. 4-Step Process Milestones (Accordion) */}
      <HowItWorks />

      {/* 6. Frequently Asked Questions (Accordion) */}
      <FaqSection />

      {/* 7. Testimonials & Municipal Compliance Seals */}
      <TestimonialsTrust />

      {/* 8. Municipal Trust & Final High-Contrast Guarantee CTA */}
      <section className="py-20 bg-gradient-to-br from-dark via-[#141838] to-indigo text-white relative overflow-hidden">
        {/* Decorative ambient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="w-14 h-14 rounded-card bg-primary text-white flex items-center justify-center mx-auto mb-6 shadow-glow">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white mb-4 tracking-tight">
              Ready to Restore Your Neighborhood?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10 font-sans">
              Report local road damage, drainage issues, streetlights, and sanitation hazards with verified photo proof and milestone payments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button to="/user/report-issue" variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                  <span>Report an Issue Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

              <Button to="/states" variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <span>Explore States Directory</span>
                </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-lavender font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>50% Advance & Balance on Completion</span>
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
    </div>
  );
};

export default Home;
