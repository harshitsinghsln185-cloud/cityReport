import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService, { AdminOverviewData } from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  AlertOctagon,
  Users,
  UserCheck2,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  Sliders,
  AlertTriangle,
  Building2,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getOverview();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load executive dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const formatRupees = (paise: number = 0) => {
    return '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-card rounded-card border border-border p-6" />
          ))}
        </div>
        <div className="h-96 bg-card rounded-card border border-border" />
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalIssues: 0,
    activeIssues: 0,
    resolvedIssues: 0,
    needsAssignment: 0,
    pendingResolvers: 0,
    approvedResolvers: 0,
    totalCitizens: 0,
    totalGrossVolumePaise: 0,
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Municipal Operations Control</span>
            </span>
            <span className="text-xs font-mono text-secondaryText">Live Civic Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-sm text-secondaryText mt-0.5">
            Real-time civic operations triage, contractor assignment dispatch, and payment milestone governance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOverview}
            disabled={loading}
            className="gap-2 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </Button>

          <Button to="/admin/issues" size="sm" className="gap-2 shadow-xs">
              <AlertOctagon className="w-4 h-4" />
              <span>Master Queue</span>
            </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={fetchOverview} className="text-xs underline font-semibold text-rose-700 hover:text-rose-900">
            Retry
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Needs Assignment */}
        <Card className="relative overflow-hidden border border-border/80 bg-card rounded-card shadow-card hover:border-primary/40 transition-all p-6 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondaryText">Needs Assignment</p>
              <h3 className="text-3xl font-heading font-bold text-ink mt-1.5 font-mono tabular-nums">
                {metrics.needsAssignment}
              </h3>
              <p className="text-xs text-primary font-medium mt-1">
                Triage / Dispatch required
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <Link to="/admin/issues?status=Submitted" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>Triage pending jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* KPI 2: Active Issues */}
        <Card className="relative overflow-hidden border border-border/80 bg-card rounded-card shadow-card hover:border-primary/40 transition-all p-6 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondaryText">Active Work</p>
              <h3 className="text-3xl font-heading font-bold text-ink mt-1.5 font-mono tabular-nums">
                {metrics.activeIssues}
              </h3>
              <p className="text-xs text-secondaryText font-medium mt-1">
                Assigned / On-Site Repairs
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
            <span className="text-secondaryText">Lifetime: {metrics.totalIssues}</span>
            <span className="font-semibold text-emerald-700">{metrics.resolvedIssues} Resolved</span>
          </div>
        </Card>

        {/* KPI 3: Resolvers */}
        <Card className="relative overflow-hidden border border-border/80 bg-card rounded-card shadow-card hover:border-primary/40 transition-all p-6 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondaryText">Contractors</p>
              <h3 className="text-3xl font-heading font-bold text-ink mt-1.5 font-mono tabular-nums">
                {metrics.approvedResolvers}
              </h3>
              <p className="text-xs text-secondaryText font-medium mt-1">
                Approved & verified
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <UserCheck2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            {metrics.pendingResolvers > 0 ? (
              <Link to="/admin/resolvers" className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{metrics.pendingResolvers} pending KYC</span>
              </Link>
            ) : (
              <span className="text-xs text-secondaryText">All vetted</span>
            )}
            <Link to="/admin/resolvers" className="text-xs font-semibold text-primary hover:underline">
              Review
            </Link>
          </div>
        </Card>

        {/* KPI 4: Financial Turnover */}
        <Card className="relative overflow-hidden border border-border/80 bg-card rounded-card shadow-card hover:border-primary/40 transition-all p-6 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondaryText">Gross Volume</p>
              <h3 className="text-2xl font-heading font-bold text-ink mt-1.5 font-mono tabular-nums">
                {formatRupees(metrics.totalGrossVolumePaise)}
              </h3>
              <p className="text-xs text-secondaryText font-medium mt-1">
                Completed advances & balances
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-secondaryText font-mono">{metrics.totalCitizens} citizens</span>
            <Link to="/admin/finance" className="text-xs font-semibold text-primary hover:underline">
              Ledger
            </Link>
          </div>
        </Card>
      </div>

      {/* Middle Row: Status Matrix & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="lg:col-span-2 border border-border/80 bg-card rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-ink">Lifecycle Status Matrix</h3>
              <p className="text-xs text-secondaryText">Real-time issue counts across municipal triage and repair states</p>
            </div>
            <Link to="/admin/issues" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              'AwaitingAdvance',
              'AwaitingQuote',
              'Submitted',
              'UnderReview',
              'Assigned',
              'Accepted',
              'InProgress',
              'Resolved',
              'BalanceDue',
              'Closed',
              'ReassignNeeded',
              'Rejected',
            ].map((st) => {
              const count = data?.statusBreakdown?.[st] || 0;
              return (
                <Link
                  key={st}
                  to={`/admin/issues?status=${st}`}
                  className="p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-canvas transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <StatusBadge status={st} size="sm" />
                  </div>
                  <span className="text-xl font-heading font-bold text-ink font-mono tabular-nums group-hover:text-primary transition-colors">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Quick Operations Actions */}
        <Card className="border border-border/80 bg-card rounded-card shadow-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-ink mb-1">Administrative Utilities</h3>
            <p className="text-xs text-secondaryText mb-4">Frequently accessed controls and tariff configuration</p>

            <div className="space-y-2.5">
              <Link
                to="/admin/issues"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">Issue Queue & Triage</h4>
                    <p className="text-xs text-secondaryText">Dispatch, candidate matching, quote approval</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/admin/resolvers"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <UserCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">Resolver KYC Accreditation</h4>
                    <p className="text-xs text-secondaryText">Inspect credentials & government IDs</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">User Directory & Roles</h4>
                    <p className="text-xs text-secondaryText">Citizens, account status & activity</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">Category Taxonomy & SLA</h4>
                    <p className="text-xs text-secondaryText">Tariffs, resolution targets, icons</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/admin/fee-settings"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">Fee Calculation Engine</h4>
                    <p className="text-xs text-secondaryText">Per-km rates, severity multipliers, milestones</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section: Recent Issues Activity Stream */}
      <Card className="border border-border/80 bg-card rounded-card shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-ink">Recent Issue Submissions</h3>
            <p className="text-xs text-secondaryText">Latest civic reports logged across the platform</p>
          </div>
          <Link to="/admin/issues" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>Explore all issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!data?.recentIssues || data.recentIssues.length === 0) ? (
          <div className="py-8 text-center text-xs text-secondaryText">
            No recent civic reports available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas text-xs font-mono uppercase tracking-wider text-secondaryText border-b border-border">
                <tr>
                  <th className="py-3 px-4">Code / Issue</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.recentIssues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-xs text-primary">
                        {issue.issueCode}
                      </div>
                      <div className="text-xs font-medium text-ink truncate max-w-xs mt-0.5">
                        {issue.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-secondaryText">
                      {issue.category?.name || 'General'}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-ink">{issue.reporter?.name || 'Citizen'}</div>
                      <div className="text-xs font-mono text-secondaryText">{issue.reporter?.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          (issue.finalPriority || issue.suggestedPriority) === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : (issue.finalPriority || issue.suggestedPriority) === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-canvas text-secondaryText border border-border'
                        }`}
                      >
                        {issue.finalPriority || issue.suggestedPriority || 'Medium'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button to={`/admin/issues/${issue._id}`} variant="outline" size="sm" className="text-xs gap-1.5 shadow-xs">
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
