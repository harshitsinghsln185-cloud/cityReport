import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  History,
  DollarSign,
  UserCheck,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

export const ResolverLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const isApproved = user?.resolverStatus === 'Approved' || user?.role === 'Admin';

  const navigation = [
    { name: 'Dashboard', href: '/resolver', icon: LayoutDashboard },
    { name: 'Job Offers', href: '/resolver/assignments', icon: Inbox },
    { name: 'Active Tasks', href: '/resolver/tasks', icon: Briefcase },
    { name: 'Completed History', href: '/resolver/history', icon: History },
    { name: 'Earnings & Payouts', href: '/resolver/earnings', icon: DollarSign },
    { name: 'Territory & Skills', href: '/resolver/profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-body text-ink">
      {/* Top Banner if not approved */}
      {!isApproved && (
        <div className="bg-amber-900 text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between gap-2 shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300" />
            <span>
              {user?.resolverStatus === 'Rejected'
                ? `Application Rejected: ${user?.rejectionReason || 'Please review administrative feedback.'}`
                : 'Application Under Review: Task acceptance will be enabled once administrator approves your credentials.'}
            </span>
          </div>
          <Link
            to="/resolver/pending"
            className="underline hover:text-amber-200 font-bold shrink-0 text-xs"
          >
            Review Status
          </Link>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0 shadow-xs">
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
            <Link to="/" className="flex items-center group">
              <Logo variant="horizontal" size="sm" subtitle="Contractor Console" />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 mb-2">
              Contractor Queue
            </div>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary shadow-xs font-bold'
                      : 'text-secondaryText hover:bg-canvas hover:text-ink'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
                </Link>
              );
            })}
          </nav>

          {/* Contractor Mini Info & Sign Out Footer */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'R'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-ink truncate">{user?.name || 'Contractor'}</div>
                <div className="text-[11px] text-muted truncate">{user?.email || ''}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-3 py-2 w-full text-xs font-semibold text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-dark/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-modal">
              <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <Link to="/" className="flex items-center group">
                  <Logo variant="horizontal" size="sm" subtitle="Contractor Console" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-secondaryText hover:text-ink"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                        isActive
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-secondaryText hover:bg-canvas hover:text-ink'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2 w-full text-xs font-semibold text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
            <button
              type="button"
              className="md:hidden text-secondaryText hover:text-ink"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {isApproved ? (
              <div className="text-xs font-semibold text-emerald-800 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Available for Assignments</span>
              </div>
            ) : (
              <div className="text-xs font-semibold text-amber-800 flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>{user?.resolverStatus === 'Rejected' ? 'Application Rejected' : 'Verification In Review'}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <NotificationBell />
              <Link
                to="/resolver/profile"
                className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs hover:border-primary transition-colors"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-canvas">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResolverLayout;
