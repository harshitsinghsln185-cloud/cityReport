import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  Quote,
} from 'lucide-react';
import Badge from '../ui/Badge';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badgeText?: string;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle = 'Citizens, certified resolvers, and municipal operators',
  badgeText = 'Certified Civic Network',
  testimonialQuote = 'The 50% advance escrow and Before/After photo proof eliminated months of traditional municipal follow-up. Our street was repaired in 28 hours.',
  testimonialAuthor = 'Dr. Radhika Sen',
  testimonialRole = 'RWA President, Indiranagar Bengaluru',
}) => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-cardLg overflow-hidden border border-border shadow-modal bg-white">
          {/* Left Column: Auth Form */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo to-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-xl text-ink tracking-tight">
                  Crowd Report
                </span>
              </Link>

              {/* Title & Subtitle */}
              <div className="mb-8">
                <Badge variant="primary" size="sm" className="mb-3 font-semibold uppercase tracking-wider">
                  {badgeText}
                </Badge>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink tracking-tight mb-2">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Form Content */}
              {children}
            </div>

            {/* Micro Trust Footer */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted">
              <span>Encrypted Session</span>
              <span>•</span>
              <span>Paise-Exact Escrow Gate</span>
              <span>•</span>
              <span>Zero-PII Privacy</span>
            </div>
          </div>

          {/* Right Column: Branded Testimonial & Showcase Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-dark via-[#141838] to-indigo text-white p-12 flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Gradient Orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo/40 rounded-full blur-3xl pointer-events-none" />

            {/* Top Showcase Stats */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-semibold text-lavender flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Public Governance</span>
              </span>

              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial Quote in Middle */}
            <div className="relative z-10 my-8 bg-white/[0.04] p-6 rounded-card border border-white/10 backdrop-blur-sm">
              <Quote className="w-8 h-8 text-primary/60 mb-3" />
              <p className="text-sm text-slate-200 leading-relaxed italic mb-6">
                "{testimonialQuote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/30 text-lavender font-heading font-bold flex items-center justify-center shrink-0 border border-white/20">
                  {testimonialAuthor.charAt(0)}
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-white flex items-center gap-1.5">
                    <span>{testimonialAuthor}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </p>
                  <p className="text-[11px] text-slate-400">{testimonialRole}</p>
                </div>
              </div>
            </div>

            {/* Bottom Proof Metrics */}
            <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
              <div>
                <span className="block font-heading font-bold text-white text-base tabular-nums">12,480+</span>
                <span className="text-[11px] text-slate-400">Resolved</span>
              </div>
              <div>
                <span className="block font-heading font-bold text-emerald-400 text-base tabular-nums">100%</span>
                <span className="text-[11px] text-slate-400">Photo Proof</span>
              </div>
              <div>
                <span className="block font-heading font-bold text-white text-base tabular-nums">24-48h</span>
                <span className="text-[11px] text-slate-400">Average SLA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
