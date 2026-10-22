import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Overview', href: '/user', icon: LayoutDashboard },
    { name: 'Report Issue', href: '/user/report-issue', icon: PlusCircle },
    { name: 'My Issues', href: '/user/issues', icon: ListTodo },
    { name: 'Payments & Invoices', href: '/user/payments', icon: CreditCard },
    { name: 'Notifications', href: '/user/notifications', icon: Bell },
    { name: 'Profile Settings', href: '/user/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E8F0]">
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0] gap-2">
          <ShieldCheck className="w-7 h-7 text-[#7C3AED]" />
          <span className="font-heading font-bold text-lg text-[#1E293B]">Citizen Portal</span>
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

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-[#171A3B]/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#7C3AED]" />
                <span className="font-heading font-bold text-base text-[#1E293B]">Citizen Portal</span>
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="md:hidden text-[#64748B] hover:text-[#1E293B]"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="text-sm text-[#64748B] font-medium hidden sm:block">
            Welcome back, <span className="font-semibold text-[#1E293B]">{user?.name || 'Citizen'}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/user/notifications"
              className="relative p-2 text-[#64748B] hover:text-[#1E293B] rounded-full hover:bg-[#EDE9FE]/50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full ring-2 ring-white" />
            </Link>

            <Link
              to="/user/profile"
              className="flex items-center gap-2 text-sm font-medium text-[#1E293B] hover:opacity-80 transition-opacity"
            >
              {user?.photo?.url ? (
                <img
                  src={user.photo.url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#7C3AED]/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#EDE9FE] border border-[#CBD5E1] flex items-center justify-center text-[#7C3AED] font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
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
