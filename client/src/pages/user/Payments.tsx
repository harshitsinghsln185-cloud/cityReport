import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  FileText,
  RefreshCw,
  AlertCircle,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import paymentService, { PaymentItem } from '../../services/payment.service';
import invoiceService, { InvoiceItem } from '../../services/invoice.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import InvoiceButton from '../../components/InvoiceButton';

export const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments');

  // Payments State
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [paymentMeta, setPaymentMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [paymentStatus, setPaymentStatus] = useState<string>('All');
  const [loadingPayments, setLoadingPayments] = useState<boolean>(true);

  // Invoices State
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [invoiceMeta, setInvoiceMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loadingInvoices, setLoadingInvoices] = useState<boolean>(true);

  // Error State
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (page = 1) => {
    try {
      setLoadingPayments(true);
      setError(null);
      const res = await paymentService.listMyPayments({
        page,
        limit: 10,
        status: paymentStatus !== 'All' ? paymentStatus : undefined,
      });
      setPayments(res.payments);
      setPaymentMeta(res.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load payments history.');
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchInvoices = async (page = 1) => {
    try {
      setLoadingInvoices(true);
      setError(null);
      const res = await invoiceService.listMyInvoices({ page, limit: 10 });
      setInvoices(res.invoices);
      setInvoiceMeta(res.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load invoices.');
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments(1);
    } else {
      fetchInvoices(1);
    }
  }, [activeTab, paymentStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Success</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span>Refunded</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
            Payments & Invoices
          </h1>
          <p className="text-sm text-[#64748B]">
            Review all transaction records, advance deposits, and download official PDF service invoices.
          </p>
        </div>

        <Link to="/user/report-issue">
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Report New Issue
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'payments'
              ? 'bg-[#EDE9FE] text-[#7C3AED]'
              : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F7FC]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Transactions ({paymentMeta.total})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'invoices'
              ? 'bg-[#EDE9FE] text-[#7C3AED]'
              : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F7FC]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Invoices & Receipts ({invoiceMeta.total})</span>
        </button>
      </div>

      {/* Tab 1: Payments View */}
      {activeTab === 'payments' && (
        <Card className="p-6 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#64748B]" />
              <span className="text-xs font-semibold text-[#475569]">Status:</span>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="text-xs border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 bg-white text-[#1E293B] focus:ring-1 focus:ring-[#7C3AED]"
              >
                <option value="All">All Transactions</option>
                <option value="Completed">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPayments(paymentMeta.page)}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loadingPayments ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>

          {/* Table */}
          {loadingPayments ? (
            <div className="py-12 text-center text-sm text-[#64748B]">
              <RefreshCw className="w-6 h-6 text-[#7C3AED] animate-spin mx-auto mb-2" />
              <span>Loading transaction ledger...</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <CreditCard className="w-10 h-10 text-[#64748B] mx-auto opacity-40" />
              <h3 className="font-heading font-bold text-base text-[#1E293B]">
                No Payment Transactions Found
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Payments initiated for advance deposits or final settlements will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 px-4">Issue Code / Title</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Amount</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 pl-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-[#F8F7FC] transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-[#1E293B]">
                        {p.paymentId}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/user/issues/${p.issue?._id}`}
                          className="font-medium text-[#7C3AED] hover:underline flex items-center gap-1"
                        >
                          <span>{p.issue?.issueCode || 'Civic Issue'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <div className="text-[11px] text-[#64748B] line-clamp-1 max-w-xs">
                          {p.issue?.title || 'Report Details'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#475569]">
                        {p.type}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1E293B]">
                        ₹{(p.amountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        {p.status === 'Pending' ? (
                          <Link to={`/user/checkout/${p.issue?._id}`}>
                            <Button variant="primary" size="sm">
                              Pay Now
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/user/issues/${p.issue?._id}`}>
                            <Button variant="ghost" size="sm">
                              View Issue
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab 2: Invoices View */}
      {activeTab === 'invoices' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">
                Official Receipts & Service Invoices
              </h3>
              <p className="text-xs text-[#64748B]">
                Immutable tax-exempt civic receipts generated dynamically via PDFKit.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchInvoices(invoiceMeta.page)}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loadingInvoices ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>

          {loadingInvoices ? (
            <div className="py-12 text-center text-sm text-[#64748B]">
              <RefreshCw className="w-6 h-6 text-[#7C3AED] animate-spin mx-auto mb-2" />
              <span>Loading invoice registry...</span>
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-[#64748B] mx-auto opacity-40" />
              <h3 className="font-heading font-bold text-base text-[#1E293B]">
                No Invoices Generated Yet
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Once you complete advance payment for reported civic issues, your invoices will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Invoice No.</th>
                    <th className="pb-3 px-4">Issue Code / Title</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Amount Paid</th>
                    <th className="pb-3 px-4">Balance Due</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 pl-4 text-right">PDF Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-[#F8F7FC] transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-[#7C3AED]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/user/issues/${inv.issue?._id}`}
                          className="font-medium text-[#1E293B] hover:text-[#7C3AED] flex items-center gap-1"
                        >
                          <span>{inv.issue?.issueCode || 'Civic Issue'}</span>
                          <ExternalLink className="w-3 h-3 text-[#64748B]" />
                        </Link>
                        <div className="text-[11px] text-[#64748B] line-clamp-1 max-w-xs">
                          {inv.issue?.title || 'Report Details'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                          {inv.type === 'Advance' ? 'Advance 50%' : 'Final Settlement'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        ₹{(inv.amountPaidPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        ₹{(inv.balanceDuePaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {new Date(inv.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <InvoiceButton
                          invoiceId={inv._id}
                          invoiceNumber={inv.invoiceNumber}
                          size="sm"
                          variant="outline"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Payments;
