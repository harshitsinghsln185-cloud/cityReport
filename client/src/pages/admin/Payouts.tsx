import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import financeService, { PayoutItem } from '../../services/finance.service';
import {
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
} from 'lucide-react';

export const AdminPayouts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';

  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchPayouts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await financeService.listPayouts({
        page,
        limit: 20,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setPayouts(res.payouts);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load contractor payouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts(1);
  }, [statusFilter]);

  const handleMarkPaid = async (payoutId: string, issueCode: string) => {
    if (!window.confirm(`Disburse contractor payout for issue ${issueCode}? This will transfer funds and notify the contractor.`)) {
      return;
    }

    setProcessingId(payoutId);
    setError(null);
    setSuccessMsg(null);

    try {
      await financeService.markPayoutPaid(payoutId);
      setSuccessMsg(`Contractor payout for ${issueCode} marked as Paid successfully.`);
      // Refresh list
      fetchPayouts(pagination.page);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to mark payout as Paid');
    } finally {
      setProcessingId(null);
    }
  };

  const formatINR = (paise: number = 0) => {
    return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/finance" className="text-xs font-semibold text-violet-600 hover:underline">
              Finance
            </Link>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs text-slate-600">Payouts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A3B] mt-1">
            Contractor Payouts & Disbursal
          </h1>
          <p className="text-sm text-slate-500">
            Review completed repair compensations, platform commission withholdings, and execute disbursement payouts.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchPayouts(pagination.page)}
          className="self-start sm:self-auto border-slate-200 text-slate-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['All', 'Pending', 'Paid'].map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setSearchParams(st === 'All' ? {} : { status: st });
            }}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              statusFilter === st
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st === 'All' ? 'All Payouts' : st === 'Pending' ? 'Pending Disbursal' : 'Disbursed (Paid)'}
          </button>
        ))}
      </div>

      {/* Payouts Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Issue Code</th>
                <th className="py-3.5 px-6">Contractor</th>
                <th className="py-3.5 px-6">Gross Fee</th>
                <th className="py-3.5 px-6">Commission (10%)</th>
                <th className="py-3.5 px-6">Net Disbursable</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Disbursed Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading && payouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-violet-500 mb-2" />
                    Loading contractor payouts...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No payouts found matching criteria.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {p.issue?.issueCode || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">
                        {p.issue?.title || 'Repair Task'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-700">
                      <div className="font-semibold text-slate-900">
                        {p.resolver?.user?.name || 'Contractor'}
                      </div>
                      <div className="text-slate-400">{p.resolver?.user?.phone}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {formatINR(p.grossAmountPaise)}
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-slate-500">
                      -{formatINR(p.commissionPaise)}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900">
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
                        {p.status === 'Paid' ? 'Paid / Disbursed' : 'Pending Disbursal'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {p.status === 'Pending' ? (
                        <Button
                          size="sm"
                          disabled={processingId === p._id}
                          onClick={() => handleMarkPaid(p._id, p.issue?.issueCode || 'Issue')}
                          className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 ml-auto text-xs py-1"
                        >
                          {processingId === p._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                          Disburse
                        </Button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Settled
                        </span>
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
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchPayouts(pagination.page - 1)}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchPayouts(pagination.page + 1)}
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

export default AdminPayouts;
