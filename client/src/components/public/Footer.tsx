import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, Clock } from 'lucide-react';
import Logo from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column (Span 2 on lg) */}
        <div className="lg:col-span-2">
          <Link to="/" className="mb-4 inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg">
            <Logo variant="horizontal" theme="dark" size="md" subtitle="Civic Infrastructure" />
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
            India's unified civic infrastructure accountability network. Empowering citizens to report local hazards, track verified repairs in real time, and hold municipal contractors to rigorous standards.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-gold" />
              <span>50/50 Milestone Split</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Geo-Tagged Photo Proof</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>48h SLA Tracking</span>
            </span>
          </div>
        </div>

        {/* Civic Directory */}
        <div>
          <h4 className="text-white font-heading font-semibold text-sm tracking-wide mb-4">
            Civic Directory
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link to="/services" className="hover:text-white transition-colors">
                Public Services
              </Link>
            </li>
            <li>
              <Link to="/states" className="text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-1.5">
                <span>States & UTs</span>
                <span className="text-xs px-1.5 py-0.2 rounded-full bg-gold/20 text-gold font-bold">36</span>
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-white transition-colors">
                Track by Issue Code
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Remediation Workflow
              </Link>
            </li>
            <li>
              <Link to="/query" className="hover:text-white transition-colors">
                Civic Query Desk
              </Link>
            </li>
          </ul>
        </div>

        {/* Portals & Actions */}
        <div>
          <h4 className="text-white font-heading font-semibold text-sm tracking-wide mb-4">
            Portals
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link to="/user/report-issue" className="text-gold hover:text-gold-hover transition-colors font-semibold">
                Report a Civic Issue
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">
                Citizen Registration
              </Link>
            </li>
            <li>
              <Link to="/register-resolver" className="hover:text-white transition-colors">
                Contractor Onboarding
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Account Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Transparency */}
        <div>
          <h4 className="text-white font-heading font-semibold text-sm tracking-wide mb-4">
            Civic Standards
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link to="/about#milestones" className="hover:text-white transition-colors">
                Milestone Guarantee
              </Link>
            </li>
            <li>
              <Link to="/about#slas" className="hover:text-white transition-colors">
                Response SLAs
              </Link>
            </li>
            <li>
              <Link to="/about#proof" className="hover:text-white transition-colors">
                Verification Guidelines
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} Crowd Report Platform. Built for transparent Indian civic governance.</p>
        <div className="flex items-center gap-6">
          <span>Timezone: Asia/Kolkata (IST)</span>
          <span>Currency: INR (₹ Paise-exact)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
