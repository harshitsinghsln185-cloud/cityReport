import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Logo from '../ui/Logo';

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
}) => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl sm:rounded-[24px] overflow-hidden border border-slate-200/90 shadow-xl shadow-slate-200/50 bg-white">
          {/* Left Column: Auth Form */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <Link to="/" className="inline-flex items-center mb-8 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
                <Logo variant="horizontal" size="md" />
              </Link>

              {/* Title & Subtitle */}
              <div className="mb-8">
                <Badge variant="primary" size="sm" className="mb-3 font-bold uppercase tracking-wider">
                  {badgeText}
                </Badge>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {subtitle}
                </p>
              </div>

              {/* Form Content */}
              {children}
            </div>

            {/* Micro Trust Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Encrypted Session</span>
              <span>•</span>
              <span>50% Advance & Milestone Protection</span>
              <span>•</span>
              <span>Zero-PII Privacy</span>
            </div>
          </div>

          {/* Right Column: Branded Showcase Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-dark via-[#141838] to-indigo text-white p-12 flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Gradient Orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo/40 rounded-full blur-3xl pointer-events-none" />

            {/* Top Showcase Header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-semibold text-lavender flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Civic Infrastructure Platform</span>
              </span>

              <span className="text-xs text-slate-300 font-medium">Pan-India Network</span>
            </div>

            {/* Platform Safeguards Showcase */}
            <div className="relative z-10 my-8 bg-white/[0.04] p-6 rounded-card border border-white/10 backdrop-blur-sm space-y-4">
              <h3 className="font-heading font-semibold text-base text-white">
                How Crowd Report Protects Every Issue
              </h3>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Photo & Location Verification:</strong> Geo-tagged evidence required for every reported street hazard.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>50% Milestone Payments:</strong> 50% advance to start work; balance payable only upon inspected completion.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Admin Review:</strong> Independent inspection of Before and After photographic proofs before ticket closure.</span>
                </li>
              </ul>
            </div>

            {/* Bottom Proof Metrics */}
            <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
              <div>
                <span className="block font-heading font-bold text-white text-base tabular-nums">36</span>
                <span className="text-xs text-slate-400">States & UTs</span>
              </div>
              <div>
                <span className="block font-heading font-bold text-emerald-400 text-base tabular-nums">100%</span>
                <span className="text-xs text-slate-400">Photo Proof</span>
              </div>
              <div>
                <span className="block font-heading font-bold text-white text-base tabular-nums">50 / 50</span>
                <span className="text-xs text-slate-400">Milestone Split</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
