import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  CreditCard,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import ChatWidget from '../components/chatbot/ChatWidget';

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
    { name: 'Dashboard', href: '/user', icon: LayoutDashboard },
    { name: 'Report Defect', href: '/user/report-issue', icon: PlusCircle },
    { name: 'My Issues', href: '/user/issues', icon: ListTodo },
    { name: 'Payments & Receipts', href: '/user/payments', icon: CreditCard },
    { name: 'Notifications', href: '/user/notifications', icon: Bell },
    { name: 'Account Settings', href: '/user/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-canvas flex font-body text-ink">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0 shadow-xs">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
          <Link to="/" className="flex items-center group">
            <Logo variant="horizontal" size="sm" subtitle="Citizen Portal" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 mb-2">
            Citizen Workspace
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

        {/* User Mini Info & Sign Out Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-ink truncate">{user?.name || 'Citizen'}</div>
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

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-dark/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-modal">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <Logo variant="horizontal" size="sm" subtitle="Citizen Portal" />
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <button
            type="button"
            className="md:hidden text-secondaryText hover:text-ink"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="text-xs sm:text-sm text-secondaryText font-medium hidden sm:block">
            Logged in as <span className="font-bold text-ink">{user?.name || 'Citizen'}</span> &bull; {user?.address?.city || 'India'}
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <Link
              to="/user/profile"
              className="flex items-center gap-2 text-xs font-semibold text-ink hover:text-primary transition-colors"
            >
              {user?.photo?.url ? (
                <img
                  src={user.photo.url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-primary/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-canvas">
          <Outlet />
        </main>
      </div>

      {/* Floating Civic AI Assistant Widget */}
      <ChatWidget />
    </div>
  );
};

export default UserLayout;
