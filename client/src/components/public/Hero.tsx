import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import Button from '../ui/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#171A3B] via-[#1E1B4B] to-[#312E81] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Decorative ambient gradient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#312E81]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Municipal Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#EDE9FE] mb-6 backdrop-blur-sm animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Certified Civic Engagement Platform</span>
            <span className="w-1 h-1 rounded-full bg-[#A78BFA]" />
            <span className="text-emerald-400 font-medium">Municipal Verified</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.15] mb-6 text-white">
            Empowering Citizens,{' '}
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-white bg-clip-text text-transparent">
              Restoring Neighborhoods
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Report local potholes, broken streetlights, water leaks, or waste hazards. Get routed to certified nearby resolvers with transparent quotes, 50% advance escrow, and verifiable photo proof.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <Link to="/user/report-issue" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-[#7C3AED]/35 hover:shadow-[#7C3AED]/50 flex items-center justify-center gap-2"
              >
                <span>Report an Issue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/track" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-[#A78BFA]" />
                <span>Track by Issue Code</span>
              </button>
            </Link>
          </div>

          {/* Value Proof Badges */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/30 text-[#C4B5FD] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">100%</p>
                <p className="text-[11px] text-slate-400">Photo Proof Verified</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/30 text-[#C4B5FD] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">24-48h</p>
                <p className="text-[11px] text-slate-400">Average SLA Response</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/30 text-[#C4B5FD] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">25 km</p>
                <p className="text-[11px] text-slate-400">Local Radius Matching</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/30 text-[#C4B5FD] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">ID Vetted</p>
                <p className="text-[11px] text-slate-400">Certified Resolvers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
