import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import resolverTaskService, { ResolverDashboardData } from '../../services/resolverTask.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  Inbox,
  Briefcase,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Layers,
  MapPin,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const ResolverDashboard: React.FC = () => {
  const [data, setData] = useState<ResolverDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await resolverTaskService.getDashboardSummary();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load contractor workspace dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const formatRupees = (paise: number = 0) => {
    return '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl border border-[#E2E8F0] animate-pulse p-6" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-xl border border-[#E2E8F0] animate-pulse" />
      </div>
    );
  }

  const metrics = data?.metrics || {
    assignedOffersCount: 0,
    activeTasksCount: 0,
    completedTasksCount: 0,
    totalEarningsPaise: 0,
    pendingPayoutPaise: 0,
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#A78BFA]/30">
              Contractor Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B]">
            Resolver Workspace
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Manage nearby dispatch requests, accept jobs, execute repairs, and submit photographic completion proof
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSummary}
            disabled={loading}
            className="gap-2 text-[#475569] border-[#E2E8F0]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </Button>

          <Link to="/resolver/assignments">
            <Button size="sm" className="gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
              <Inbox className="w-4 h-4" />
              <span>Job Offers ({metrics.assignedOffersCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchSummary} className="text-xs underline font-semibold">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: New Job Offers */}
        <Card className="relative overflow-hidden border border-[#E2E8F0] hover:border-[#A78BFA] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">New Assignments</p>
              <h3 className="text-3xl font-heading font-extrabold text-[#1E293B] mt-1.5">
                {metrics.assignedOffersCount}
              </h3>
              <p className="text-xs text-[#7C3AED] font-medium mt-1">
                Awaiting your acceptance
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center shrink-0">
              <Inbox className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <Link to="/resolver/assignments" className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1">
              <span>Inspect offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* KPI 2: Active Tasks */}
        <Card className="relative overflow-hidden border border-[#E2E8F0] hover:border-[#A78BFA] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Active Jobs</p>
              <h3 className="text-3xl font-heading font-extrabold text-[#1E293B] mt-1.5">
                {metrics.activeTasksCount}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Accepted & in progress
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#312E81]/10 text-[#312E81] border border-[#312E81]/20 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <Link to="/resolver/tasks" className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1">
              <span>View active tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* KPI 3: Completed Repairs */}
        <Card className="relative overflow-hidden border border-[#E2E8F0] hover:border-[#A78BFA] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Completed</p>
              <h3 className="text-3xl font-heading font-extrabold text-[#1E293B] mt-1.5">
                {metrics.completedTasksCount}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Resolved repairs
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <Link to="/resolver/history" className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1">
              <span>View history</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* KPI 4: Pending Payout */}
        <Card className="relative overflow-hidden border border-[#E2E8F0] hover:border-[#A78BFA] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Contractor Balance</p>
              <h3 className="text-2xl font-heading font-extrabold text-[#1E293B] mt-1.5">
                {formatRupees(metrics.pendingPayoutPaise)}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Pending next settlement
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Lifetime: {formatRupees(metrics.totalEarningsPaise)}</span>
            <Link to="/resolver/earnings" className="text-xs font-semibold text-[#7C3AED] hover:underline">
              Ledger
            </Link>
          </div>
        </Card>
      </div>

      {/* Middle Row: Quick Action Hub & Territory Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-[#1E293B]">Recent Assignments & Tasks</h3>
              <p className="text-xs text-[#64748B]">Latest jobs allocated to your territory</p>
            </div>
            <Link to="/resolver/tasks" className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1">
              <span>All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recentTasks || data.recentTasks.length === 0) ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              No assigned tasks currently pending. We will notify you when a new issue arises in your coverage radius!
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#A78BFA] hover:bg-[#F8F7FC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#7C3AED]">{task.issueCode}</span>
                      <StatusBadge status={task.status} size="sm" />
                      <span className="text-xs text-[#64748B] flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#7C3AED]" />
                        {task.category?.name || 'Civic Issue'}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-[#1E293B] line-clamp-1">{task.title}</h4>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{task.address?.city || 'Local area'}</span>
                    </p>
                  </div>

                  <Link to={`/resolver/tasks/${task._id}`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1 border-[#E2E8F0] hover:border-[#7C3AED]">
                      <span>Open Task</span>
                      <ArrowRight className="w-3 h-3 text-[#7C3AED]" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Tools */}
        <Card className="border border-[#E2E8F0] flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-1">Contractor Tools</h3>
            <p className="text-xs text-[#64748B] mb-4">Territory settings and direct queue shortcuts</p>

            <div className="space-y-3">
              <Link
                to="/resolver/assignments"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">Review Job Offers</h4>
                    <p className="text-[11px] text-[#64748B]">{metrics.assignedOffersCount} offers pending review</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                to="/resolver/tasks"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">Active Remediation Jobs</h4>
                    <p className="text-[11px] text-[#64748B]">Start work or submit proof</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                to="/resolver/profile"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">Coverage Territory & Skills</h4>
                    <p className="text-[11px] text-[#64748B]">Adjust service radius and availability</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResolverDashboard;
