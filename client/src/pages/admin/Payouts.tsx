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
            <Link to="/admin/finance" className="text-xs font-semibold text-primary hover:underline font-mono">
              Finance
            </Link>
            <span className="text-xs text-secondaryText">/</span>
            <span className="text-xs text-secondaryText font-mono">Payouts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink mt-1">
            Contractor Payouts & Disbursal
          </h1>
          <p className="text-sm text-secondaryText">
            Review completed repair compensations, platform commission withholdings, and execute disbursement payouts.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchPayouts(pagination.page)}
          className="self-start sm:self-auto border-border text-secondaryText hover:bg-canvas"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <div className="rounded-card bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200 shadow-sm">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-card bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200 flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        {['All', 'Pending', 'Paid'].map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setSearchParams(st === 'All' ? {} : { status: st });
            }}
            className={`rounded-card px-4 py-2 text-xs font-semibold transition-all font-mono ${
              statusFilter === st
                ? 'bg-primary text-white shadow-card'
                : 'bg-card border border-border/80 text-secondaryText hover:text-ink hover:bg-canvas'
            }`}
          >
            {st === 'All' ? 'All Payouts' : st === 'Pending' ? 'Pending Disbursal' : 'Disbursed (Paid)'}
          </button>
        ))}
      </div>

      {/* Payouts Table */}
      <Card className="overflow-hidden border border-border/80 shadow-card rounded-card bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-canvas text-[11px] font-bold uppercase tracking-wider text-secondaryText font-mono">
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
            <tbody className="divide-y divide-border/60 text-sm">
              {loading && payouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondaryText">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
                    Loading contractor payouts...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondaryText">
                    No payouts found matching criteria.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p._id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono text-xs font-bold text-ink">
                        {p.issue?.issueCode || 'N/A'}
                      </div>
                      <div className="text-xs text-secondaryText truncate max-w-xs mt-0.5">
                        {p.issue?.title || 'Repair Task'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-ink">
                      <div className="font-semibold text-ink">
                        {p.resolver?.user?.name || 'Contractor'}
                      </div>
                      <div className="text-secondaryText font-mono">{p.resolver?.user?.phone}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-secondaryText font-mono tabular-nums">
                      {formatINR(p.grossAmountPaise)}
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-secondaryText font-mono tabular-nums">
                      -{formatINR(p.commissionPaise)}
                    </td>
                    <td className="py-4 px-6 font-bold text-ink font-mono tabular-nums">
                      {formatINR(p.netAmountPaise)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono ${
                          p.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status === 'Paid' ? 'Paid / Disbursed' : 'Pending Disbursal'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-secondaryText font-mono">
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
                          className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 ml-auto text-xs py-1 shadow-sm"
                        >
                          {processingId === p._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                          Disburse
                        </Button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1 font-mono">
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
          <div className="flex items-center justify-between border-t border-border/60 px-6 py-3.5 bg-canvas/50">
            <span className="text-xs text-secondaryText font-mono">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchPayouts(pagination.page - 1)}
                className="flex items-center gap-1 border-border"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchPayouts(pagination.page + 1)}
                className="flex items-center gap-1 border-border"
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
