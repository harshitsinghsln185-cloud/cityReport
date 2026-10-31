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
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
            Municipal Finance & Operations Overview
          </h1>
          <p className="mt-1 text-sm text-secondaryText">
            Real-time financial analytics, platform commission revenue, gross payments, and contractor disbursement liabilities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={csvDownloadUrl}
            download="finance-overview.csv"
            className="inline-flex items-center gap-2 rounded-card bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV Stream
          </a>
          <Button
            variant="outline"
            onClick={fetchOverview}
            className="border-border text-secondaryText hover:bg-canvas"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-card bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200 shadow-sm">
          {error}
        </div>
      )}

      {/* Date Filter Bar */}
      <Card className="border border-border/80 p-4 shadow-card bg-card rounded-card">
        <form onSubmit={handleApplyFilter} className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-secondaryText" />
            <span className="text-xs font-bold uppercase tracking-wider text-secondaryText font-mono">
              Filter By Period:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-secondaryText">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-card border border-border/80 px-3 py-1.5 text-xs text-ink bg-card focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-secondaryText">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-card border border-border/80 px-3 py-1.5 text-xs text-ink bg-card focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
            />
          </div>
          <Button type="submit" size="sm">
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
        <Card className="border border-border/80 bg-card p-6 shadow-card rounded-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Gross Revenue (GMV)
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-heading font-bold text-ink font-mono tabular-nums">
              {metrics ? `₹${metrics.gmvINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-secondaryText">
            Total successful advance & balance payments
          </p>
        </Card>

        {/* Commission */}
        <Card className="border border-border/80 bg-card p-6 shadow-card rounded-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
              Platform Commission (10%)
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-heading font-bold text-emerald-700 font-mono tabular-nums">
              {metrics ? `₹${metrics.commissionEarnedINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-secondaryText">
            Net municipal platform revenue earned
          </p>
        </Card>

        {/* Pending Payouts */}
        <Card className="border border-border/80 bg-card p-6 shadow-card rounded-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
              Pending Contractor Payouts
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-heading font-bold text-amber-700 font-mono tabular-nums">
              {metrics ? `₹${metrics.pendingPayoutsINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-secondaryText">
            {metrics?.payoutCounts.pending ?? 0} contractor batch payout(s) awaiting disbursal
          </p>
        </Card>

        {/* Disbursed Payouts */}
        <Card className="border border-border/80 bg-card p-6 shadow-card rounded-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Disbursed Payouts
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-heading font-bold text-ink font-mono tabular-nums">
              {metrics ? `₹${metrics.paidPayoutsINR}` : '₹0.00'}
            </span>
          </div>
          <p className="mt-2 text-xs text-secondaryText">
            {metrics?.payoutCounts.paid ?? 0} completed contractor transfer(s)
          </p>
        </Card>
      </div>

      {/* Secondary Metrics: Advance vs Balance Breakout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-border/80 bg-card shadow-card rounded-card">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-bold text-ink">Payment Collection Breakdown</h3>
            </div>
            <Link
              to="/admin/finance/payments"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View Payments Ledger
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-secondaryText">Advance Payments Collected:</span>
                <span className="text-ink font-bold font-mono tabular-nums">
                  {metrics ? `₹${metrics.advanceCollectedINR}` : '₹0.00'}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-canvas overflow-hidden border border-border/40">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
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
                <span className="text-secondaryText">Balance Settlements Collected:</span>
                <span className="text-ink font-bold font-mono tabular-nums">
                  {metrics ? `₹${metrics.balanceCollectedINR}` : '₹0.00'}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-canvas overflow-hidden border border-border/40">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
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

        <Card className="p-6 border border-border/80 bg-card shadow-card rounded-card">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-bold text-ink">Contractor Payout Status</h3>
            </div>
            <Link
              to="/admin/finance/payouts"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Manage Payouts
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-card bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-xs font-semibold text-amber-900">Pending Liabilities</div>
                  <div className="text-lg font-bold text-amber-900 font-mono tabular-nums">
                    {metrics ? `₹${metrics.pendingPayoutsINR}` : '₹0.00'}
                  </div>
                </div>
              </div>
              <Link
                to="/admin/finance/payouts?status=Pending"
                className="rounded-card bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm"
              >
                Disburse Now
              </Link>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-card bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-semibold text-emerald-900">Disbursed Funds</div>
                  <div className="text-lg font-bold text-emerald-900 font-mono tabular-nums">
                    {metrics ? `₹${metrics.paidPayoutsINR}` : '₹0.00'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 font-mono">
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
