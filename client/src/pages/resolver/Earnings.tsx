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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A3B]">
            Earnings & Payouts Ledger
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your net contractor disbursements, pending liabilities, and municipal platform commission.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchEarnings(pagination.page)}
          className="flex items-center gap-2 self-start sm:self-auto border-violet-200 text-violet-700 hover:bg-violet-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Ledger
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Total Disbursed Earnings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">
              {summary ? `₹${summary.totalEarningsINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Transferred directly to your verified bank account
          </p>
        </Card>

        {/* Pending Payouts */}
        <Card className="border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Pending Disbursal
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-700">
              {summary ? `₹${summary.pendingPayoutINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Approved upon citizen balance clearance, awaiting batch transfer
          </p>
        </Card>

        {/* Completed Tasks */}
        <Card className="border border-violet-100 bg-gradient-to-br from-violet-50/50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-800">
              Remediated Tasks
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">
              {summary?.completedTasksCount ?? 0}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Civic repairs with verified proof and settled invoices
          </p>
        </Card>
      </div>

      {/* Payouts Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-violet-600" />
              <h2 className="text-base font-bold text-slate-900">Disbursement Ledger</h2>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Total {pagination.total} transaction{pagination.total === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Issue Reference</th>
                <th className="py-3.5 px-6">Gross Service Fee</th>
                <th className="py-3.5 px-6">Commission (10%)</th>
                <th className="py-3.5 px-6">Net Disbursed</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading && payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-violet-500 mb-2" />
                    Loading payout ledger...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No payouts recorded yet. Completed and verified repair tasks will show here.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 font-mono text-xs">
                        {p.issue?.issueCode || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">
                        {p.issue?.title || 'Civic Repair Task'}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {formatINR(p.grossAmountPaise)}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      -{formatINR(p.commissionPaise)}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatINR(p.netAmountPaise)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status === 'Paid' ? 'Disbursed' : 'Pending Clearance'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
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
                          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800"
                        >
                          View Task
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
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3.5 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchEarnings(pagination.page - 1)}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchEarnings(pagination.page + 1)}
                className="flex items-center gap-1"
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
