import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import resolverTaskService, { ResolverDashboardData } from '../../services/resolverTask.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
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
  ShieldCheck,
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

  const metrics = data?.metrics || {
    assignedOffersCount: 0,
    activeTasksCount: 0,
    completedTasksCount: 0,
    totalEarningsPaise: 0,
    pendingPayoutPaise: 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-cardLg bg-gradient-to-r from-dark via-[#141838] to-indigo text-white p-6 sm:p-8 lg:p-10 shadow-modal">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm" className="bg-white/10 text-lavender border-white/15">
                Contractor Dispatch Console
              </Badge>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Municipal Network</span>
              </span>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Contractor Operations Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Review nearby civic dispatch requests, accept jobs within your coverage radius, execute on-site remediation, and submit photographic completion proof for verified milestone payout.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={fetchSummary}
              disabled={loading}
              className="border-white/20 text-white hover:bg-white/10"
              leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh Feed
            </Button>

            <Link to="/resolver/assignments">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Inbox className="w-4 h-4" />}
                className="shadow-lg shadow-primary/30"
              >
                Review Offers ({metrics.assignedOffersCount})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-card bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchSummary} className="text-xs underline font-bold text-red-700">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: New Job Offers */}
        <Card className="p-5 border-border hover:border-primary/40 transition-colors shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondaryText">New Job Offers</p>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-ink mt-1.5 tabular-nums">
                {metrics.assignedOffersCount}
              </h3>
              <p className="text-xs text-primary font-semibold mt-1">
                Awaiting your acceptance
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
            <Link to="/resolver/assignments" className="font-semibold text-primary hover:text-primaryDark flex items-center gap-1 transition-colors">
              <span>Inspect offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* KPI 2: Active Tasks */}
        <Card className="p-5 border-border hover:border-indigo/40 transition-colors shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondaryText">Active Jobs</p>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-ink mt-1.5 tabular-nums">
                {metrics.activeTasksCount}
              </h3>
              <p className="text-xs text-secondaryText font-medium mt-1">
                Accepted & in progress
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo border border-indigo/20 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
            <Link to="/resolver/tasks" className="font-semibold text-primary hover:text-primaryDark flex items-center gap-1 transition-colors">
              <span>View active queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* KPI 3: Completed Repairs */}
        <Card className="p-5 border-border hover:border-emerald-400/40 transition-colors shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondaryText">Completed Repairs</p>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-emerald-700 mt-1.5 tabular-nums">
                {metrics.completedTasksCount}
              </h3>
              <p className="text-xs text-secondaryText font-medium mt-1">
                Verified with photo proof
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
            <Link to="/resolver/history" className="font-semibold text-primary hover:text-primaryDark flex items-center gap-1 transition-colors">
              <span>View history archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* KPI 4: Pending Payout */}
        <Card className="p-5 border-border hover:border-purple-400/40 transition-colors shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondaryText">Pending Payout</p>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-ink mt-1.5 tabular-nums">
                {formatRupees(metrics.pendingPayoutPaise)}
              </h3>
              <p className="text-xs text-secondaryText font-medium mt-1">
                Next scheduled payout
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted tabular-nums">Life: {formatRupees(metrics.totalEarningsPaise)}</span>
            <Link to="/resolver/earnings" className="font-semibold text-primary hover:text-primaryDark transition-colors">
              Ledger
            </Link>
          </div>
        </Card>
      </div>

      {/* Middle Row: Recent Assignments & Contractor Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-ink">Recent Allocated Tasks</h3>
              <p className="text-xs text-secondaryText">Latest civic jobs dispatched to your coverage radius</p>
            </div>
            <Link to="/resolver/tasks" className="text-xs font-semibold text-primary hover:text-primaryDark flex items-center gap-1 transition-colors">
              <span>All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recentTasks || data.recentTasks.length === 0) ? (
            <div className="py-12 text-center text-xs text-secondaryText">
              No assigned tasks currently pending. You will receive real-time notifications when new incidents occur in your coverage radius!
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 rounded-card border border-border hover:border-primary/40 hover:bg-canvas transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {task.issueCode}
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                      <span className="text-xs text-secondaryText flex items-center gap-1">
                        <Layers className="w-3 h-3 text-primary" />
                        {task.category?.name || 'Civic Defect'}
                      </span>
                    </div>
                    <h4 className="font-heading font-semibold text-sm text-ink truncate">{task.title}</h4>
                    <p className="text-xs text-secondaryText flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{task.address?.city || 'Local area'}</span>
                    </p>
                  </div>

                  <Link to={`/resolver/tasks/${task._id}`} className="shrink-0">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 w-full sm:w-auto">
                      <span>Open Task</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Tools */}
        <Card className="shadow-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-ink mb-1">Contractor Tools</h3>
            <p className="text-xs text-secondaryText mb-4">Direct shortcuts to dispatch filters and territory settings</p>

            <div className="space-y-3">
              <Link
                to="/resolver/assignments"
                className="flex items-center justify-between p-3.5 rounded-card border border-border hover:bg-primary/5 hover:border-primary/30 transition-all shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">Review Job Offers</h4>
                    <p className="text-[11px] text-muted">{metrics.assignedOffersCount} offers pending review</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/resolver/tasks"
                className="flex items-center justify-between p-3.5 rounded-card border border-border hover:bg-primary/5 hover:border-primary/30 transition-all shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo/10 text-indigo flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">Active Remediation Jobs</h4>
                    <p className="text-[11px] text-muted">Start work or upload photo proof</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/resolver/profile"
                className="flex items-center justify-between p-3.5 rounded-card border border-border hover:bg-primary/5 hover:border-primary/30 transition-all shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">Coverage Territory & Radius</h4>
                    <p className="text-[11px] text-muted">Adjust travel radius & on-duty status</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResolverDashboard;
