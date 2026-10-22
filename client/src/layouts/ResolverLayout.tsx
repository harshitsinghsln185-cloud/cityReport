import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const isApproved = user?.resolverStatus === 'Approved' || user?.role === 'Admin';

  const navigation = [
    { name: 'Overview', href: '/resolver', icon: LayoutDashboard },
    { name: 'New Assignments', href: '/resolver/assignments', icon: Inbox },
    { name: 'Active Tasks', href: '/resolver/tasks', icon: Briefcase },
    { name: 'Completed History', href: '/resolver/history', icon: History },
    { name: 'Earnings & Payouts', href: '/resolver/earnings', icon: DollarSign },
    { name: 'Availability & Radius', href: '/resolver/profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col">
      {/* Top Banner if not approved */}
      {!isApproved && (
        <div className="bg-[#92400E] text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-200" />
            <span>
              {user?.resolverStatus === 'Rejected'
                ? `Application Rejected: ${user?.rejectionReason || 'Please review administrative feedback.'}`
                : 'Application Under Review: Task acceptance will be enabled once administrator approves your ID.'}
            </span>
          </div>
          <Link
            to="/resolver/pending"
            className="underline hover:text-amber-100 font-semibold shrink-0 text-xs"
          >
            View Review Details
          </Link>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E8F0]">
          <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0] gap-2">
            <Wrench className="w-7 h-7 text-[#7C3AED]" />
            <span className="font-heading font-bold text-lg text-[#1E293B]">Resolver Console</span>
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
                      ? 'bg-[#EDE9FE] text-[#7C3AED] font-semibold shadow-xs'
                      : 'text-[#64748B] hover:bg-[#EDE9FE]/40 hover:text-[#1E293B]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-[#171A3B]/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-[#7C3AED]" />
                  <span className="font-heading font-bold text-base text-[#1E293B]">Resolver Console</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#64748B] hover:text-[#1E293B]"
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
                          ? 'bg-[#EDE9FE] text-[#7C3AED] font-semibold'
                          : 'text-[#64748B] hover:bg-[#EDE9FE]/40 hover:text-[#1E293B]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="md:hidden text-[#64748B] hover:text-[#1E293B]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {isApproved ? (
              <div className="text-xs font-semibold text-[#166534] flex items-center gap-2 bg-[#DCFCE7] px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
                <span>Available for Assignments</span>
              </div>
            ) : (
              <div className="text-xs font-semibold text-[#92400E] flex items-center gap-2 bg-[#FEF3C7] px-3 py-1 rounded-full border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-[#92400E]" />
                <span>{user?.resolverStatus === 'Rejected' ? 'Application Rejected' : 'Pending Verification'}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#CBD5E1] flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
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
