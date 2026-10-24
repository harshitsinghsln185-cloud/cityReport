import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Track Status', href: '/track' },
    { label: 'About', href: '/about' },
    { label: 'Write a Query', href: '/query' },
  ];

  const getDashboardLink = () => {
    if (role === 'Admin') return '/admin';
    if (role === 'Resolver') return '/resolver';
    return '/user';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-[#1E293B] font-heading font-bold text-xl tracking-tight group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-[#7C3AED]/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-[#171A3B] to-[#312E81] bg-clip-text text-transparent">
            Crowd Report
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#7C3AED] bg-[#EDE9FE]/70 font-semibold'
                    : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F8F7FC]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to={getDashboardLink()}>
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          <Link to="/user/report-issue">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 shadow-sm shadow-[#7C3AED]/25">
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/user/report-issue">
            <Button variant="primary" size="sm" className="px-3 py-1.5 text-xs">
              Report
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
            className="p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F7FC] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-1 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-[#EDE9FE] text-[#7C3AED] font-semibold' : 'text-[#475569] hover:bg-[#F8F7FC]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            {isAuthenticated ? (
              <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
