import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Lock,
} from 'lucide-react';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-dark text-white pt-14 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative ambient gradient orbs & grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #C8A24A 1px, transparent 1px), linear-gradient(to bottom, #C8A24A 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-hover/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left">
          {/* Left Column: Headline, Copy & CTAs */}
          <div>
            <Reveal direction="down">
              {/* Social Proof & Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-xs font-semibold text-gold mb-6 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Over 12,000 hazards resolved across 36 states & UTs</span>
                <span className="w-1 h-1 rounded-full bg-gold" />
                <span className="text-emerald-300 font-medium hidden sm:inline">100% Escrow Protected</span>
              </div>
            </Reveal>

            {/* Main Fraunces Headline */}
            <Reveal delay={0.1}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.12] mb-6 text-white">
                Empowering Citizens,{' '}
                <span className="bg-gradient-to-r from-gold via-[#E2C375] to-white bg-clip-text text-transparent">
                  Restoring Neighborhoods
                </span>
              </h1>
            </Reveal>

            {/* Crisp Subheading */}
            <Reveal delay={0.2}>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl font-sans">
                Report dangerous potholes, broken streetlights, water pipeline leaks, or uncollected garbage. Get routed to certified nearby municipal contractors with transparent quotes, 50% advance escrow, and photo-verified completion.
              </p>
            </Reveal>

            {/* Dual CTAs */}
            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
                <Link to="/user/report-issue">
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full sm:w-auto shadow-lg shadow-gold/20 flex items-center justify-center gap-2 group"
                  >
                    <span>Report an Issue</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>

                <Link to="/track">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/15 hover:border-white/30 backdrop-blur-sm flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4 text-lavender" />
                    <span>Track by Issue Code</span>
                  </Button>
                </Link>

                <Link to="/states" className="sm:hidden">
                  <Button
                    variant="ghost"
                    size="md"
                    className="w-full text-slate-300 hover:text-white"
                  >
                    View All 36 States & UTs →
                  </Button>
                </Link>
              </div>
            </Reveal>

            {/* Trust Assurances */}
            <Reveal delay={0.4}>
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">100% Photo Proof</p>
                    <p className="text-[10px] text-slate-400">Geo-Tagged & Sealed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">24-48h SLA</p>
                    <p className="text-[10px] text-slate-400">Automated Dispatch</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">25 km Radius</p>
                    <p className="text-[10px] text-slate-400">Local Resolvers</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">50% Escrow</p>
                    <p className="text-[10px] text-slate-400">Zero Fund Leakage</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
