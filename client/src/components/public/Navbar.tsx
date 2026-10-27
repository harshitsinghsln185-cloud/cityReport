import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PlusCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'States', href: '/states' },
    { label: 'Track Status', href: '/track' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/query' },
  ];

  const getDashboardLink = () => {
    if (role === 'Admin') return '/admin';
    if (role === 'Resolver') return '/resolver';
    return '/user';
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle ESC key press and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-border shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
        >
          <Logo variant="horizontal" size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? 'text-primary bg-lavender/70 font-semibold shadow-xs'
                    : 'text-secondaryText hover:text-ink hover:bg-canvas'
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
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 shadow-sm shadow-primary/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Link to="/user/report-issue" className="md:hidden">
            <Button variant="primary" size="xs" className="px-3 py-1.5">
              Report
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop and Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-dark/40 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="relative z-40 lg:hidden border-t border-border bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-lavender text-primary font-semibold'
                        : 'text-secondaryText hover:bg-canvas hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-border flex flex-col gap-2 mt-2">
              {isAuthenticated ? (
                <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" isFullWidth>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="md" isFullWidth>
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" size="md" isFullWidth>
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              <Link
                to="/user/report-issue"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-1"
              >
                <Button
                  variant="primary"
                  size="md"
                  isFullWidth
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Report an Issue
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
