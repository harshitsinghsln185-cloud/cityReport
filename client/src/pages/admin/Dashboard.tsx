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
  DollarSign,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  Sliders,
  AlertTriangle,
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#A78BFA]/30">
              Operations Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B]">
            Platform Command Center
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Real-time civic operations triage, contractor assignment, and financial tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOverview}
            disabled={loading}
            className="gap-2 text-[#475569] border-[#E2E8F0]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </Button>

          <Link to="/admin/issues">
            <Button size="sm" className="gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
              <AlertOctagon className="w-4 h-4" />
              <span>Master Queue</span>
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchOverview} className="text-xs underline font-semibold">
            Retry
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Needs Assignment */}
        <Card className="relative overflow-hidden border border-[#E2E8F0] hover:border-[#A78BFA] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Needs Assignment</p>
              <h3 className="text-3xl font-heading font-extrabold text-[#1E293B] mt-1.5">
                {metrics.needsAssignment}
              </h3>
              <p className="text-xs text-[#7C3AED] font-medium mt-1 flex items-center gap-1">
                <span>Submitted or reassign required</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <Link to="/admin/issues?status=Submitted" className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1">
              <span>Triage pending</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* KPI 2: Active Issues */}
        <Card className="relative overflow-hidden border border-[#E2E8F0] hover:border-[#A78BFA] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Active Work</p>
              <h3 className="text-3xl font-heading font-extrabold text-[#1E293B] mt-1.5">
                {metrics.activeIssues}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Assigned / In Progress
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#312E81]/10 text-[#312E81] border border-[#312E81]/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Total Lifetime: {metrics.totalIssues}</span>
            <span className="text-xs font-semibold text-emerald-600">{metrics.resolvedIssues} Resolved</span>
          </div>
        </Card>

        {/* KPI 3: Resolvers */}
        <Card className="relative overflow-hidden border border-[#E2E8F0] hover:border-[#A78BFA] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Contractors</p>
              <h3 className="text-3xl font-heading font-extrabold text-[#1E293B] mt-1.5">
                {metrics.approvedResolvers}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Approved & verified
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <UserCheck2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            {metrics.pendingResolvers > 0 ? (
              <Link to="/admin/resolvers" className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{metrics.pendingResolvers} pending approval</span>
              </Link>
            ) : (
              <span className="text-xs text-[#64748B]">All applications vetted</span>
            )}
            <Link to="/admin/resolvers" className="text-xs font-semibold text-[#7C3AED] hover:underline">
              Review
            </Link>
          </div>
        </Card>

        {/* KPI 4: Financial Turnover */}
        <Card className="relative overflow-hidden border border-[#E2E8F0] hover:border-[#A78BFA] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Gross Volume</p>
              <h3 className="text-2xl font-heading font-extrabold text-[#1E293B] mt-1.5">
                {formatRupees(metrics.totalGrossVolumePaise)}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Completed advances & balances
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs text-[#64748B]">{metrics.totalCitizens} registered citizens</span>
            <Link to="/admin/finance" className="text-xs font-semibold text-[#7C3AED] hover:underline">
              Ledger
            </Link>
          </div>
        </Card>
      </div>

      {/* Middle Row: Status Matrix & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="lg:col-span-2 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-[#1E293B]">Issue Status Matrix</h3>
              <p className="text-xs text-[#64748B]">Distribution of issues across all operational lifecycle states</p>
            </div>
            <Link to="/admin/issues" className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1">
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
                  className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#A78BFA] hover:bg-[#F8F7FC] transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <StatusBadge status={st} size="sm" />
                  </div>
                  <span className="text-xl font-heading font-bold text-[#1E293B]">{count}</span>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Quick Operations Actions */}
        <Card className="border border-[#E2E8F0] flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-1">Administrative Utilities</h3>
            <p className="text-xs text-[#64748B] mb-4">Frequently accessed controls and configuration</p>

            <div className="space-y-2.5">
              <Link
                to="/admin/issues"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">Issue Queue & Assignment</h4>
                    <p className="text-[11px] text-[#64748B]">Triage, candidate search, quotes</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                to="/admin/resolvers"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <UserCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">Resolver Verification</h4>
                    <p className="text-[11px] text-[#64748B]">Verify contractor credentials</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">User Directory & Access</h4>
                    <p className="text-[11px] text-[#64748B]">Citizens, accounts & blocks</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">Category Taxonomy</h4>
                    <p className="text-[11px] text-[#64748B]">Manage civic issue classifications</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                to="/admin/fee-settings"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#312E81] flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">Fee Calculation Engine</h4>
                    <p className="text-[11px] text-[#64748B]">Per-km rates & platform cuts</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section: Recent Issues Activity Stream */}
      <Card className="border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#1E293B]">Recent Issue Submissions</h3>
            <p className="text-xs text-[#64748B]">Latest reports logged across the platform</p>
          </div>
          <Link to="/admin/issues" className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1">
            <span>Explore all issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!data?.recentIssues || data.recentIssues.length === 0) ? (
          <div className="py-8 text-center text-xs text-[#64748B]">
            No recent civic reports available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F7FC] text-xs font-semibold text-[#64748B] border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4">Code / Issue</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {data.recentIssues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-[#F8F7FC]/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-xs text-[#7C3AED]">
                        {issue.issueCode}
                      </div>
                      <div className="text-xs font-medium text-[#1E293B] truncate max-w-xs">
                        {issue.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#475569]">
                      {issue.category?.name || 'General'}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-[#1E293B]">{issue.reporter?.name || 'Citizen'}</div>
                      <div className="text-[11px] text-[#64748B]">{issue.reporter?.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          (issue.finalPriority || issue.suggestedPriority) === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : (issue.finalPriority || issue.suggestedPriority) === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {issue.finalPriority || issue.suggestedPriority || 'Medium'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/admin/issues/${issue._id}`}>
                        <Button variant="outline" size="sm" className="text-xs gap-1 border-[#E2E8F0]">
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3 text-[#7C3AED]" />
                        </Button>
                      </Link>
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
