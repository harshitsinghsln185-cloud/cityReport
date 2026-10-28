import React, { useState } from 'react';
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
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

export const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Issues Triage', href: '/admin/issues', icon: AlertOctagon },
    { name: 'Resolver KYC', href: '/admin/resolvers', icon: UserCheck2 },
    { name: 'User Directory', href: '/admin/users', icon: Users },
    { name: 'Finance Overview', href: '/admin/finance', icon: DollarSign },
    { name: 'Payments Ledger', href: '/admin/payments', icon: Receipt },
    { name: 'Payout Queue', href: '/admin/payouts', icon: DollarSign },
    { name: 'Categories & Tariff', href: '/admin/categories', icon: Layers },
    { name: 'Fee Schedule (SOR)', href: '/admin/fee-settings', icon: Sliders },
    { name: 'Public Queries Desk', href: '/admin/queries', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0F1123] text-slate-300 border-r border-[#1E2342] shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[#1E2342]">
          <Link to="/" className="flex items-center group">
            <Logo variant="horizontal" theme="dark" size="sm" subtitle="Municipal Secretariat" />
          </Link>
        </div>

        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-[#1A1F3D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E2342]">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-[#0F1123]/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0F1123] shadow-2xl text-slate-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#1E2342]">
              <Link to="/" className="flex items-center group">
                <Logo variant="horizontal" theme="dark" size="sm" subtitle="Operations Desk" />
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                      isActive
                        ? 'bg-primary text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A1F3D] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#1E2342]">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2 w-full text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
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
        <header className="h-16 bg-card border-b border-border/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <button
            type="button"
            className="md:hidden text-secondaryText hover:text-ink"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
            <input
              type="text"
              placeholder="Search issues, tracking codes, users, or resolvers..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-canvas border border-border rounded-xl text-ink placeholder:text-secondaryText focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-ink">{user?.name || 'Operations Officer'}</div>
              <div className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                Secretariat Admin
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs font-serif">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
