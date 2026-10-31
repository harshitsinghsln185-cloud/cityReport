import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import financeService, {
  ResolverEarningsSummary,
  PayoutItem,
} from '../../services/finance.service';
import {
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Receipt,
  AlertTriangle,
} from 'lucide-react';

export const ResolverEarnings: React.FC = () => {
  const [summary, setSummary] = useState<ResolverEarningsSummary | null>(null);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await financeService.getResolverEarnings({ page, limit: 10 });
      setSummary(res.summary);
      setPayouts(res.payouts);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve earnings ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings(1);
  }, []);

  const formatINR = (paise: number = 0) => {
    return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Contractor Finance
            </span>
            <span className="text-xs font-mono text-secondaryText">Direct Bank Settlements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink tracking-tight">
            Earnings & Disbursements Ledger
          </h1>
          <p className="mt-1 text-sm text-secondaryText">
            Audit your net contractor disbursements, payment clearance pipeline, and platform commission.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchEarnings(pagination.page)}
          className="flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800 border border-rose-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={() => fetchEarnings(pagination.page)} className="text-xs text-rose-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <Card className="border border-emerald-200 bg-emerald-50/20 rounded-card shadow-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Total Disbursed Earnings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-heading font-bold text-ink font-mono tabular-nums">
              {summary ? `₹${summary.totalEarningsINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-secondaryText">
            Transferred directly to your verified bank account upon verification
          </p>
        </Card>

        {/* Pending Payouts */}
        <Card className="border border-amber-200 bg-amber-50/20 rounded-card shadow-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Pending Disbursal
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-heading font-bold text-amber-800 font-mono tabular-nums">
              {summary ? `₹${summary.pendingPayoutINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-secondaryText">
            Approved upon citizen balance clearance, awaiting batch transfer
          </p>
        </Card>

        {/* Completed Tasks */}
        <Card className="border border-primary/20 bg-primary/5 rounded-card shadow-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Remediated Tasks
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-heading font-bold text-ink font-mono tabular-nums">
              {summary?.completedTasksCount ?? 0}
            </span>
          </div>
          <p className="mt-2 text-xs text-secondaryText">
            Civic repairs with verified photo proof and settled invoices
          </p>
        </Card>
      </div>

      {/* Payouts Table */}
      <Card className="overflow-hidden border border-border/80 bg-card rounded-card shadow-card">
        <div className="border-b border-border bg-canvas px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold text-ink">Disbursement Ledger</h2>
                <p className="text-xs text-secondaryText">Individual transaction breakdowns and commission deductions</p>
              </div>
            </div>
            <span className="text-xs font-mono text-secondaryText">
              Total {pagination.total} transaction{pagination.total === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-canvas/60 text-xs font-mono uppercase tracking-wider text-secondaryText">
                <th className="py-3.5 px-6">Issue Reference</th>
                <th className="py-3.5 px-6">Gross Service Fee</th>
                <th className="py-3.5 px-6">Commission (10%)</th>
                <th className="py-3.5 px-6">Net Disbursed</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {loading && payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondaryText">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
                    <p className="text-xs">Loading disbursement ledger...</p>
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondaryText text-xs">
                    No payouts recorded yet. Completed and verified repair tasks will show here.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p._id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-ink font-mono text-xs">
                        {p.issue?.issueCode || 'N/A'}
                      </div>
                      <div className="text-xs text-secondaryText truncate max-w-xs mt-0.5">
                        {p.issue?.title || 'Civic Repair Task'}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-secondaryText tabular-nums text-xs">
                      {formatINR(p.grossAmountPaise)}
                    </td>
                    <td className="py-4 px-6 text-rose-600 font-mono tabular-nums text-xs">
                      -{formatINR(p.commissionPaise)}
                    </td>
                    <td className="py-4 px-6 font-bold text-ink font-mono tabular-nums text-xs">
                      {formatINR(p.netAmountPaise)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {p.status === 'Paid' ? 'Disbursed' : 'Pending Clearance'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-secondaryText font-mono">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : new Date(p.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {p.issue?._id && (
                        <Link
                          to={`/resolver/tasks/${p.issue._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primaryHover transition-colors"
                        >
                          <span>View Task</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-canvas/50">
            <span className="text-xs font-mono text-secondaryText">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchEarnings(pagination.page - 1)}
                className="flex items-center gap-1 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchEarnings(pagination.page + 1)}
                className="flex items-center gap-1 text-xs"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResolverEarnings;
