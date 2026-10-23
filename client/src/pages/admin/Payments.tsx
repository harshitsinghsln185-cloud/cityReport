import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import financeService from '../../services/finance.service';
import {
  Search,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await financeService.listPayments({
        page,
        limit: 20,
        type: typeFilter !== 'All' ? typeFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setPayments(res.payments);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load payments ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [typeFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments(1);
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
            <span className="text-xs text-slate-600">Payments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A3B] mt-1">
            Municipal Payments Ledger
          </h1>
          <p className="text-sm text-slate-500">
            Audit all citizen payments, advance deposits, and balance settlements.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchPayments(pagination.page)}
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

      {/* Filter and Search Bar */}
      <Card className="p-4 border border-slate-200 shadow-sm bg-slate-50/50">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Payment ID..."
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-700 focus:border-violet-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-violet-600 focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="Advance">Advance</option>
                <option value="Balance">Balance</option>
                <option value="Refund">Refund</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-violet-600 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <Button type="submit" size="sm" className="bg-violet-600 text-white hover:bg-violet-700">
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Payment Reference</th>
                <th className="py-3.5 px-6">Issue Reference</th>
                <th className="py-3.5 px-6">Citizen</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading && payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-violet-500 mb-2" />
                    Loading municipal payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No payment records found matching criteria.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {p.paymentId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {p.issue ? (
                        <Link
                          to={`/admin/issues/${p.issue._id}`}
                          className="font-mono text-xs font-semibold text-violet-600 hover:underline flex items-center gap-1"
                        >
                          {p.issue.issueCode}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-700">
                      <div className="font-medium text-slate-900">{p.user?.name || 'Citizen'}</div>
                      <div className="text-slate-400 truncate max-w-xs">{p.user?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                          p.type === 'Advance'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : p.type === 'Balance'
                            ? 'bg-violet-50 text-violet-700 border border-violet-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatINR(p.amountPaise)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.status === 'Success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
                onClick={() => fetchPayments(pagination.page - 1)}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchPayments(pagination.page + 1)}
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

export default AdminPayments;
