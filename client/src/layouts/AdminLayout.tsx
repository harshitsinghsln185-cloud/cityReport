import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import {
  BarChart3,
  AlertOctagon,
  UserCheck2,
  Users,
  DollarSign,
  Receipt,
  Layers,
  Sliders,
  Mail,
  Menu,
  X,
  LogOut,
  Search,
  ChevronRight,
  Clock,
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/admin/issues?search=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch('');
    }
  };

  const navSections: NavSection[] = [
    {
      title: 'Operations Command',
      items: [
        { name: 'Dashboard', href: '/admin', icon: BarChart3 },
        { name: 'Issues Triage', href: '/admin/issues', icon: AlertOctagon },
        { name: 'Resolver KYC', href: '/admin/resolvers', icon: UserCheck2 },
        { name: 'User Directory', href: '/admin/users', icon: Users },
      ],
    },
    {
      title: 'Financial Governance',
      items: [
        { name: 'Finance Overview', href: '/admin/finance', icon: DollarSign },
        { name: 'Payments Ledger', href: '/admin/payments', icon: Receipt },
        { name: 'Payout Queue', href: '/admin/payouts', icon: DollarSign },
      ],
    },
    {
      title: 'System & Policies',
      items: [
        { name: 'Categories & Tariff', href: '/admin/categories', icon: Layers },
        { name: 'Fee Schedule (SOR)', href: '/admin/fee-settings', icon: Sliders },
        { name: 'Public Queries Desk', href: '/admin/queries', icon: Mail },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-canvas flex font-sans">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy focus:text-accent focus:rounded-md focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent font-semibold text-xs"
      >
        Skip to main content
      </a>

      {/* Desktop Admin Sidebar (Deep Municipal Navy & Gold Highlights) */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-[#06132B] via-[#0A1F44] to-[#06132B] text-slate-200 border-r border-white/10 shrink-0 shadow-2xl">
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Link to="/" className="flex items-center group">
            <Logo variant="horizontal" theme="dark" size="sm" subtitle="Operations HQ" />
          </Link>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/20 text-accent border border-accent/30">
            PRO
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto no-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400/80">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-white/15 text-white font-semibold border-l-4 border-accent shadow-sm pl-2.5'
                        : 'text-slate-300 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-accent/20 text-accent'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Sign Out */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent border border-accent/40 flex items-center justify-center font-heading font-extrabold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] font-mono text-slate-400 truncate">Secretariat Desk</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 px-3 py-2 w-full text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/60 rounded-xl transition-all border border-rose-900/40 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Control Desk</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          <div className="fixed inset-0 bg-[#06132B]/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#06132B] shadow-2xl text-slate-200 border-r border-white/10">
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
              <Link to="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo variant="horizontal" theme="dark" size="sm" subtitle="Operations HQ" />
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                          isActive
                            ? 'bg-white/15 text-white font-semibold border-l-4 border-accent pl-2.5'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-accent" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 px-3 py-2 w-full text-xs font-semibold text-rose-300 hover:bg-rose-950/60 rounded-xl transition-colors border border-rose-900/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Admin Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Executive Top Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-border/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden text-secondaryText hover:text-ink p-1.5 rounded-lg hover:bg-slate-100"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Live Operations Pulse Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold hidden sm:inline">Network Online</span>
              <span className="text-emerald-700/70 hidden lg:inline">&bull; 16 Civic Sectors Monitored</span>
            </div>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search code (CR-...), user, or keyword..."
              className="w-full pl-8 pr-12 py-1.5 text-xs bg-canvas/70 border border-border rounded-xl text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-muted bg-white border border-border shadow-2xs pointer-events-none">
              ↵
            </kbd>
          </form>

          {/* Right Status Controls */}
          <div className="flex items-center gap-3">
            {/* Live Clock Ticker */}
            {currentTime && (
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas text-secondaryText text-xs font-mono font-medium border border-border">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{currentTime}</span>
              </div>
            )}

            <NotificationBell />

            {/* Profile Avatar Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="text-right hidden sm:block leading-tight">
                <div className="text-xs font-bold text-ink">{user?.name || 'Operations Officer'}</div>
                <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                  Secretariat Admin
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-navy text-accent border border-accent/30 flex items-center justify-center font-heading font-extrabold text-xs shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
