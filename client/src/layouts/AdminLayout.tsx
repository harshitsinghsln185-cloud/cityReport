import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  BarChart3,
  AlertOctagon,
  UserCheck2,
  Users,
  DollarSign,
  Receipt,
  Layers,
  Sliders,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Search,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Issues Manager', href: '/admin/issues', icon: AlertOctagon },
    { name: 'Resolver Verifications', href: '/admin/resolvers', icon: UserCheck2 },
    { name: 'User Directory', href: '/admin/users', icon: Users },
    { name: 'Finance Overview', href: '/admin/finance', icon: DollarSign },
    { name: 'Payments Ledger', href: '/admin/payments', icon: Receipt },
    { name: 'Payout Queue', href: '/admin/payouts', icon: DollarSign },
    { name: 'Categories Manager', href: '/admin/categories', icon: Layers },
    { name: 'Fee Settings', href: '/admin/fee-settings', icon: Sliders },
    { name: 'Public Queries', href: '/admin/queries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B2545] text-slate-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2">
          <ShieldAlert className="w-7 h-7 text-[#0F9D7A]" />
          <span className="font-heading font-bold text-lg text-white">Operations</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0F9D7A] text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0B2545] shadow-xl text-slate-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-7 h-7 text-[#0F9D7A]" />
                <span className="font-heading font-bold text-base text-white">Operations</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-[#0F9D7A] text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-[#E5E2DA] flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search issues, codes, users..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-[#E5E2DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-[#0B2545]">System Admin</div>
              <div className="text-[11px] text-[#5B6475]">Full Control</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs">
              A
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
