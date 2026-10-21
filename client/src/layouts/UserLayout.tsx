import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  CreditCard,
  Bell,
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

export const UserLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/user', icon: LayoutDashboard },
    { name: 'Report Issue', href: '/user/report-issue', icon: PlusCircle },
    { name: 'My Issues', href: '/user/issues', icon: ListTodo },
    { name: 'Payments & Invoices', href: '/user/payments', icon: CreditCard },
    { name: 'Notifications', href: '/user/notifications', icon: Bell },
    { name: 'Profile Settings', href: '/user/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E5E2DA]">
        <div className="h-16 flex items-center px-6 border-b border-[#E5E2DA] gap-2">
          <ShieldCheck className="w-7 h-7 text-[#0F9D7A]" />
          <span className="font-heading font-bold text-lg text-[#0B2545]">Citizen Portal</span>
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

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E2DA]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#0F9D7A]" />
                <span className="font-heading font-bold text-base text-[#0B2545]">Citizen Portal</span>
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5E2DA] flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="text-sm text-[#5B6475] font-medium hidden sm:block">
            Welcome back, Citizen
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/user/notifications"
              className="relative p-2 text-slate-500 hover:text-[#0B2545] rounded-full hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0F9D7A] rounded-full" />
            </Link>

            <Link
              to="/user/profile"
              className="flex items-center gap-2 text-sm font-medium text-[#0B2545] hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                U
              </div>
            </Link>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
