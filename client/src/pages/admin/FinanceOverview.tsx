import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import financeService, { FinanceMetrics } from '../../services/finance.service';
import {
  TrendingUp,
  Download,
  CreditCard,
  Receipt,
  Clock,
  CheckCircle2,
  Calendar,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const FinanceOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<FinanceMetrics | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await financeService.getFinanceOverview({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setMetrics(res.metrics);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve municipal financial overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOverview();
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setTimeout(() => {
      fetchOverview();
    }, 0);
  };

  const csvDownloadUrl = financeService.exportFinanceCsvUrl({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A3B]">
            Municipal Finance & Operations Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time financial analytics, platform commission revenue, gross payments, and contractor disbursement liabilities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={csvDownloadUrl}
            download="finance-overview.csv"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV Stream
          </a>
          <Button
            variant="outline"
            onClick={fetchOverview}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Date Filter Bar */}
      <Card className="border border-slate-200 p-4 shadow-sm bg-slate-50/50">
        <form onSubmit={handleApplyFilter} className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Filter By Period:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:border-violet-600 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:border-violet-600 focus:outline-none"
            />
          </div>
          <Button type="submit" size="sm" className="bg-violet-600 text-white hover:bg-violet-700">
            Apply Filter
          </Button>
          {(startDate || endDate) && (
            <Button type="button" variant="outline" size="sm" onClick={handleResetFilter}>
              Clear
            </Button>
          )}
        </form>
      </Card>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GMV */}
        <Card className="border border-violet-100 bg-gradient-to-br from-violet-50/50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-800">
              Gross Revenue (GMV)
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">
              {metrics ? `₹${metrics.gmvINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Total successful advance & balance payments
          </p>
        </Card>

        {/* Commission */}
        <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Platform Commission (10%)
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-emerald-700">
              {metrics ? `₹${metrics.commissionEarnedINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Net municipal platform revenue earned
          </p>
        </Card>

        {/* Pending Payouts */}
        <Card className="border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Pending Contractor Payouts
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-700">
              {metrics ? `₹${metrics.pendingPayoutsINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {metrics?.payoutCounts.pending ?? 0} contractor batch payout(s) awaiting disbursal
          </p>
        </Card>

        {/* Disbursed Payouts */}
        <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Disbursed Payouts
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-blue-900">
              {metrics ? `₹${metrics.paidPayoutsINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {metrics?.payoutCounts.paid ?? 0} completed contractor transfer(s)
          </p>
        </Card>
      </div>

      {/* Secondary Metrics: Advance vs Balance Breakout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-violet-600" />
              <h3 className="font-bold text-slate-900">Payment Collection Breakdown</h3>
            </div>
            <Link
              to="/admin/finance/payments"
              className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1"
            >
              View Payments Ledger
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-slate-600">Advance Payments Collected:</span>
                <span className="text-slate-900 font-bold">
                  {metrics ? `₹${metrics.advanceCollectedINR}` : '₹0.00'}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: metrics?.gmvPaise
                      ? `${(metrics.advanceCollectedPaise / metrics.gmvPaise) * 100}%`
                      : '50%',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-slate-600">Balance Settlements Collected:</span>
                <span className="text-slate-900 font-bold">
                  {metrics ? `₹${metrics.balanceCollectedINR}` : '₹0.00'}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: metrics?.gmvPaise
                      ? `${(metrics.balanceCollectedPaise / metrics.gmvPaise) * 100}%`
                      : '50%',
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-violet-600" />
              <h3 className="font-bold text-slate-900">Contractor Payout Status</h3>
            </div>
            <Link
              to="/admin/finance/payouts"
              className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1"
            >
              Manage Payouts
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-xs font-semibold text-amber-900">Pending Liabilities</div>
                  <div className="text-lg font-bold text-amber-900">
                    {metrics ? `₹${metrics.pendingPayoutsINR}` : '₹0.00'}
                  </div>
                </div>
              </div>
              <Link
                to="/admin/finance/payouts?status=Pending"
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Disburse Now
              </Link>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-semibold text-emerald-900">Disbursed Funds</div>
                  <div className="text-lg font-bold text-emerald-900">
                    {metrics ? `₹${metrics.paidPayoutsINR}` : '₹0.00'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">
                {metrics?.payoutCounts.paid ?? 0} transferred
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinanceOverview;
