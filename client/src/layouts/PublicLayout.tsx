import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FC] text-[#1E293B]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#1E293B] font-heading font-bold text-xl tracking-tight">
            <ShieldCheck className="w-7 h-7 text-[#7C3AED]" />
            <span>Crowd Report</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475569]">
            <Link to="/services" className="hover:text-[#7C3AED] transition-colors">Services</Link>
            <Link to="/about" className="hover:text-[#7C3AED] transition-colors">About</Link>
            <Link to="/track" className="hover:text-[#7C3AED] transition-colors">Track Status</Link>
            <Link to="/query" className="hover:text-[#7C3AED] transition-colors">Write a Query</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={role === 'Admin' ? '/admin' : role === 'Resolver' ? '/resolver' : '/user'}
                className="text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] px-3 py-1.5 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-[#475569] hover:text-[#7C3AED] px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              to="/user/report-issue"
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shadow-[#7C3AED]/20 transition-all"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Marketing Footer */}
      <footer className="bg-[#171A3B] text-slate-300 py-12 border-t border-[#312E81]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-heading font-bold text-lg mb-3">
              <ShieldCheck className="w-6 h-6 text-[#7C3AED]" />
              <span>Crowd Report Platform</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering citizens to report neighborhood civic issues with transparent quotes, rapid local contractor resolution, and verifiable photo proof.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Public Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/services" className="hover:text-[#EDE9FE] transition-colors">Civic Services</Link></li>
              <li><Link to="/track" className="hover:text-[#EDE9FE] transition-colors">Track by Issue Code</Link></li>
              <li><Link to="/about" className="hover:text-[#EDE9FE] transition-colors">How It Works</Link></li>
              <li><Link to="/query" className="hover:text-[#EDE9FE] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Join Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/register" className="hover:text-[#EDE9FE] transition-colors">Citizen Registration</Link></li>
              <li><Link to="/register-resolver" className="hover:text-[#EDE9FE] transition-colors">Register as Resolver</Link></li>
              <li><Link to="/login" className="hover:text-[#EDE9FE] transition-colors">Platform Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Civic Standards</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All payment transactions operate in integer paise. Invoices provided on demand with legal disclaimers.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#312E81] border border-[#4338CA] text-xs text-[#EDE9FE]">
              <AlertCircle className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Demonstration Platform</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Crowd Report Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Time Zone: Asia/Kolkata (IST) | Currency: INR (₹)</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
