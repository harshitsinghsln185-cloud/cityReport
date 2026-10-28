import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import notificationService, {
  NotificationItem,
  PaginationMeta,
} from '../../services/notification.service';
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
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

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
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'PAYMENT':
      return <CreditCard className="w-5 h-5 text-primary" />;
    case 'PAYOUT':
      return <DollarSign className="w-5 h-5 text-emerald-600" />;
    case 'ASSIGNMENT':
      return <Wrench className="w-5 h-5 text-primary" />;
    case 'REWORK':
      return <RotateCcw className="w-5 h-5 text-amber-600" />;
    case 'VERIFICATION':
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    case 'ISSUE':
      return <AlertCircle className="w-5 h-5 text-blue-600" />;
    default:
      return <Info className="w-5 h-5 text-slate-500" />;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'PAYMENT':
      return 'bg-primary-light text-primary border-primary/20';
    case 'PAYOUT':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'ASSIGNMENT':
      return 'bg-primary-light text-primary border-primary/20';
    case 'REWORK':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'VERIFICATION':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'ISSUE':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [unreadFilter, setUnreadFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [markingAll, setMarkingAll] = useState<boolean>(false);

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: pagination.limit,
      };
      if (unreadFilter === 'unread') {
        params.isRead = false;
      }
      if (typeFilter !== 'ALL') {
        params.type = typeFilter;
      }

      const res = await notificationService.list(params);
      setNotifications(res.notifications);
      setPagination(res.meta);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [unreadFilter, typeFilter]);

  const handleMarkRead = async (notifId: string) => {
    try {
      await notificationService.markAsRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
    } catch {
      // Error
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Error
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-primary-light text-primary">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-heading font-bold text-ink">
              Notification Center
            </h1>
          </div>
          <p className="text-sm text-muted">
            All updates regarding your civic reports, quote evaluations, and settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNotifications(pagination.page)}
            disabled={loading}
            leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markingAll || notifications.every((n) => n.isRead)}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            {markingAll ? 'Marking...' : 'Mark All as Read'}
          </Button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Read Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setUnreadFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                unreadFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Alerts
            </button>
            <button
              type="button"
              onClick={() => setUnreadFilter('unread')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                unreadFilter === 'unread'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </button>
          </div>

          {/* Type Filter Select */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs font-medium rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Categories</option>
              <option value="ISSUE">Civic Issues</option>
              <option value="PAYMENT">Payments & Orders</option>
              <option value="ASSIGNMENT">Task Assignments</option>
              <option value="VERIFICATION">Verifications</option>
              <option value="REWORK">Rework Requests</option>
              <option value="PAYOUT">Payouts</option>
              <option value="SYSTEM">System Alerts</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notification List */}
      <Card className="divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-7 h-7 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
              No notifications found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {unreadFilter === 'unread'
                ? 'You have read all your alerts. Switch to "All Alerts" to view history.'
                : 'No alerts match your selected filters.'}
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                !notif.isRead ? 'bg-primary-light/40 hover:bg-primary-light/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Type icon box */}
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getTypeBadge(
                        notif.type
                      )}`}
                    >
                      {notif.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                    {!notif.isRead && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent text-navy">
                        NEW
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm ${
                      !notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                    }`}
                  >
                    {notif.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex items-center gap-2 shrink-0 sm:self-center pl-13 sm:pl-0">
                {!notif.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(notif._id)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-white transition-colors"
                  >
                    Mark Read
                  </button>
                )}

                {notif.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!notif.isRead) handleMarkRead(notif._id);
                      navigate(notif.link!);
                    }}
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-slate-50/60 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Showing page <strong>{pagination.page}</strong> of{' '}
              <strong>{pagination.totalPages}</strong> ({pagination.total} total notifications)
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNotifications(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNotifications(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;
