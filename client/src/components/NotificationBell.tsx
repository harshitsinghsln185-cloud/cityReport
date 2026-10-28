import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  CreditCard,
  Wrench,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Info,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import notificationService, { NotificationItem } from '../services/notification.service';
import { useAuth } from '../context/AuthContext';

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'PAYMENT':
      return <CreditCard className="w-4 h-4 text-primary" />;
    case 'PAYOUT':
      return <DollarSign className="w-4 h-4 text-emerald-600" />;
    case 'ASSIGNMENT':
      return <Wrench className="w-4 h-4 text-primary" />;
    case 'REWORK':
      return <RotateCcw className="w-4 h-4 text-amber-600" />;
    case 'VERIFICATION':
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    case 'ISSUE':
      return <AlertCircle className="w-4 h-4 text-blue-600" />;
    default:
      return <Info className="w-4 h-4 text-slate-500" />;
  }
};

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [markingAll, setMarkingAll] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Poll for unread count
  const fetchUnread = async () => {
    if (!user) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Background poll failure is silent
    }
  };

  const fetchRecent = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await notificationService.list({ page: 1, limit: 6 });
      setRecentNotifications(res.notifications);
    } catch {
      // Silent on popover load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // 30s poll
    return () => clearInterval(interval);
  }, [user]);

  // Click outside listener to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen) {
      fetchRecent();
      fetchUnread();
    }
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setRecentNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
      } catch {
        // Continue navigation
      }
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setMarkingAll(true);
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setRecentNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Mark all read failed
    } finally {
      setMarkingAll(false);
    }
  };

  // Determine destination URL for full notifications page based on user role
  const viewAllUrl =
    user?.role === 'Resolver'
      ? '/resolver/notifications'
      : user?.role === 'Admin'
      ? '/admin/notifications'
      : '/user/notifications';

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="View notifications"
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-sm text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-light text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 hover:underline disabled:opacity-50"
              >
                {markingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )}
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-xs">Loading alerts...</p>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 px-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No notifications</p>
                <p className="text-xs text-slate-500 mt-1">You're all caught up with recent updates.</p>
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors relative ${
                    !notif.isRead ? 'bg-primary-light/40' : ''
                  }`}
                >
                  {/* Category icon */}
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs truncate ${
                          !notif.isRead
                            ? 'font-bold text-slate-900'
                            : 'font-semibold text-slate-700'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread indicator dot */}
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link
              to={viewAllUrl}
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1 hover:underline"
            >
              <span>View all notifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
