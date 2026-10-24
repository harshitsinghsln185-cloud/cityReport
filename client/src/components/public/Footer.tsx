import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#171A3B] text-slate-300 py-14 border-t border-[#312E81]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>Crowd Report</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering citizens to report neighborhood hazards with transparent quotes, rapid certified contractor dispatch, and verifiable Before/After photo proof.
          </p>
        </div>

        {/* Public Links */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            Public Directory
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link to="/services" className="hover:text-white transition-colors">
                Civic Services Directory
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-white transition-colors">
                Track by Issue Code
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                How It Works & About Us
              </Link>
            </li>
            <li>
              <Link to="/query" className="hover:text-white transition-colors">
                Write a Query to Administration
              </Link>
            </li>
          </ul>
        </div>

        {/* Join Platform */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            Platform Portals
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link to="/register" className="hover:text-white transition-colors">
                Citizen Account Registration
              </Link>
            </li>
            <li>
              <Link to="/register-resolver" className="hover:text-white transition-colors">
                Apply as Certified Resolver
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Sign In to Dashboard
              </Link>
            </li>
            <li>
              <Link to="/user/report-issue" className="text-[#C4B5FD] hover:text-white transition-colors font-medium">
                Report a Civic Issue Now
              </Link>
            </li>
          </ul>
        </div>

        {/* Civic Escrow Standards */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            Civic Transparency
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            All remediation fees are computed in exact integer paise with 50% advance held in escrow until verified completion. Invoices provided on demand.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#312E81] border border-[#4338CA] text-xs text-[#EDE9FE]">
            <AlertCircle className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Certified Civic Partner</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Crowd Report Platform. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Time Zone: Asia/Kolkata (IST) | Currency: INR (₹)</p>
      </div>
    </footer>
  );
};

export default Footer;
