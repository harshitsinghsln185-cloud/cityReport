import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, Clock } from 'lucide-react';
import Logo from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-slate-300 pt-12 sm:pt-16 pb-24 sm:pb-12 border-t border-slate-800">
      {/* 2-Column on Mobile, 2-Column on Tablet, 5-Column on Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-5 gap-x-4 sm:gap-x-8 lg:gap-x-10 gap-y-8 sm:gap-y-10">
        {/* Section 1: Brand Column (Span 2 on lg) */}
        <div className="lg:col-span-2">
          <Link to="/" className="mb-3 sm:mb-4 inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg">
            <Logo variant="horizontal" theme="dark" size="sm" subtitle="Civic Infrastructure" className="sm:hidden" />
            <Logo variant="horizontal" theme="dark" size="md" subtitle="Civic Infrastructure" className="hidden sm:inline-flex" />
          </Link>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mb-4 sm:mb-6">
            India's unified civic infrastructure accountability network. Empowering citizens to report local hazards and hold contractors to rigorous standards.
          </p>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 w-fit max-w-full">
              <Lock className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="truncate hidden sm:inline">50/50 Milestone Split</span>
              <span className="truncate sm:hidden">50/50 Milestones</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 w-fit max-w-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate hidden sm:inline">Geo-Tagged Photo Proof</span>
              <span className="truncate sm:hidden">Geo-Tagged Proof</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 w-fit max-w-full">
              <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="truncate">48h SLA Tracking</span>
            </span>
          </div>
        </div>

        {/* Section 2: Civic Directory */}
        <div>
          <h4 className="text-white font-heading font-semibold text-xs sm:text-sm tracking-wide mb-3 sm:mb-4">
            Civic Directory
          </h4>
          <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-400">
            <li>
              <Link to="/services" className="hover:text-white transition-colors">
                Public Services
              </Link>
            </li>
            <li>
              <Link to="/states" className="text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-1.5">
                <span>States & UTs</span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full bg-gold/20 text-gold font-bold">36</span>
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-white transition-colors">
                <span className="hidden sm:inline">Track by Issue Code</span>
                <span className="sm:hidden">Track Issue</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                <span className="hidden sm:inline">Remediation Workflow</span>
                <span className="sm:hidden">Workflow</span>
              </Link>
            </li>
            <li>
              <Link to="/query" className="hover:text-white transition-colors">
                Civic Query Desk
              </Link>
            </li>
            <li>
              <Link to="/credits" className="hover:text-white transition-colors">
                Image Credits
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Portals & Actions */}
        <div>
          <h4 className="text-white font-heading font-semibold text-xs sm:text-sm tracking-wide mb-3 sm:mb-4">
            Portals
          </h4>
          <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-400">
            <li>
              <Link to="/user/report-issue" className="text-gold hover:text-gold-hover transition-colors font-semibold">
                <span className="hidden sm:inline">Report a Civic Issue</span>
                <span className="sm:hidden">Report Issue</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">
                <span className="hidden sm:inline">Citizen Registration</span>
                <span className="sm:hidden">Citizen Register</span>
              </Link>
            </li>
            <li>
              <Link to="/register-resolver" className="hover:text-white transition-colors">
                <span className="hidden sm:inline">Contractor Onboarding</span>
                <span className="sm:hidden">Contractors</span>
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Account Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 4: Legal & Transparency */}
        <div>
          <h4 className="text-white font-heading font-semibold text-xs sm:text-sm tracking-wide mb-3 sm:mb-4">
            Civic Standards
          </h4>
          <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-400">
            <li>
              <Link to="/about#milestones" className="hover:text-white transition-colors">
                <span className="hidden sm:inline">Milestone Guarantee</span>
                <span className="sm:hidden">Milestones</span>
              </Link>
            </li>
            <li>
              <Link to="/about#slas" className="hover:text-white transition-colors">
                Response SLAs
              </Link>
            </li>
            <li>
              <Link to="/about#proof" className="hover:text-white transition-colors">
                <span className="hidden sm:inline">Verification Guidelines</span>
                <span className="sm:hidden">Verification</span>
              </Link>
            </li>
            <li>
              <Link to="/query" className="hover:text-white transition-colors">
                Grievance Officer
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-3 sm:gap-4 text-center sm:text-left">
        <p>© {new Date().getFullYear()} Crowd Report Platform. Built for transparent Indian civic governance.</p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
          <span>Timezone: Asia/Kolkata (IST)</span>
          <span>Currency: INR (₹ Paise-exact)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
