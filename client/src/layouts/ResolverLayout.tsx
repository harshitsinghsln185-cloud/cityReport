import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Wrench,
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
} from 'lucide-react';

export const ResolverLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  // Mock status placeholder for M0 (in M4 this comes from useAuth)
  const isApproved = true;

  const navigation = [
    { name: 'Overview', href: '/resolver', icon: LayoutDashboard },
    { name: 'New Assignments', href: '/resolver/assignments', icon: Inbox },
    { name: 'Active Tasks', href: '/resolver/tasks', icon: Briefcase },
    { name: 'Completed History', href: '/resolver/history', icon: History },
    { name: 'Earnings & Payouts', href: '/resolver/earnings', icon: DollarSign },
    { name: 'Availability & Radius', href: '/resolver/profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      {/* Top Banner if not approved */}
      {!isApproved && (
        <div className="bg-amber-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Application Under Review: Task acceptance will be enabled once administrator approves your ID.</span>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E5E2DA]">
          <div className="h-16 flex items-center px-6 border-b border-[#E5E2DA] gap-2">
            <Wrench className="w-7 h-7 text-[#0F9D7A]" />
            <span className="font-heading font-bold text-lg text-[#0B2545]">Resolver Console</span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0B2545] text-white shadow-sm'
                      : 'text-[#5B6475] hover:bg-slate-100 hover:text-[#0B2545]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E5E2DA]">
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E2DA]">
                <div className="flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-[#0F9D7A]" />
                  <span className="font-heading font-bold text-base text-[#0B2545]">Resolver Console</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-500 hover:text-slate-700"
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
                          ? 'bg-[#0B2545] text-white'
                          : 'text-[#5B6475] hover:bg-slate-100 hover:text-[#0B2545]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-[#E5E2DA] flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="md:hidden text-slate-600 hover:text-slate-900"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="text-sm font-medium text-[#0F9D7A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F9D7A] animate-pulse" />
              <span>Available for Assignments</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0F9D7A] flex items-center justify-center font-bold text-xs">
                R
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResolverLayout;
