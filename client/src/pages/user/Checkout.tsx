import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import issueService, { Issue } from '../../services/issue.service';
import paymentService from '../../services/payment.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import MockCheckout from '../../components/MockCheckout';
import InvoiceButton from '../../components/InvoiceButton';

export const Checkout: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [amountPaise, setAmountPaise] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Success state after confirmation
  const [completedData, setCompletedData] = useState<{
    paymentId: string;
    invoiceId: string;
    invoiceNumber: string;
    status: string;
  } | null>(null);

  // Failure simulation state
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeCheckout = async () => {
      if (!issueId) return;
      try {
        setLoading(true);
        setError(null);

        // Fetch issue details
        const issueRes = await issueService.getById(issueId);
        const fetchedIssue = issueRes.issue;
        setIssue(fetchedIssue);

        if (fetchedIssue.status !== 'AwaitingAdvance' && fetchedIssue.status !== 'BalanceDue') {
          // If already paid or not awaiting payment
          if (fetchedIssue.status === 'Closed') {
            setError('This civic issue is already Closed with all invoices settled.');
          } else if (fetchedIssue.status === 'Submitted') {
            setError('Advance payment has already been confirmed for this issue.');
          } else {
            setError(`This issue is currently in status "${fetchedIssue.status}" and is not awaiting payment.`);
          }
          setLoading(false);
          return;
        }

        // Create or retrieve pending payment order (Advance or Balance)
        const orderRes =
          fetchedIssue.status === 'BalanceDue'
            ? await paymentService.createBalanceOrder(fetchedIssue._id)
            : await paymentService.createAdvanceOrder(fetchedIssue._id);
        setPaymentId(orderRes.paymentId);
        setAmountPaise(orderRes.amountPaise);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to initialize checkout.');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [issueId]);

  const handleSuccess = (data: {
    paymentId: string;
    invoiceId: string;
    invoiceNumber: string;
    status: string;
  }) => {
    setCompletedData(data);
    setFailureMessage(null);
  };

  const handleFailure = (reason: string) => {
    setFailureMessage(reason);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted">Preparing payment order and fee snapshot...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-heading font-bold text-ink">Checkout Error</h2>
        <p className="text-sm text-muted max-w-md mx-auto">{error}</p>
        <div className="pt-2 flex justify-center gap-3">
          <Button to="/user/issues" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to My Issues
            </Button>
          {issue && (
            <Button to={`/user/issues/${issue._id}`} variant="primary">View Issue Details</Button>
          )}
        </div>
      </div>
    );
  }

  const isBalance = issue.status === 'BalanceDue' || completedData?.status === 'Closed';

  // If payment successfully completed
  if (completedData) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6">
        <Card className="p-8 text-center space-y-5 border-emerald-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-heading font-bold text-ink">
              {isBalance ? 'Balance Settlement Successful!' : 'Advance Payment Successful!'}
            </h1>
            <p className="text-sm text-muted">
              Your civic issue report has officially transitioned to{' '}
              <span className="font-semibold text-emerald-700">
                {isBalance ? 'Closed' : 'Submitted'}
              </span>
              .
            </p>
          </div>

          <div className="p-4 bg-canvas rounded-xl border border-border text-xs text-left space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-muted">Issue Code:</span>
              <span className="font-mono font-bold text-ink">{issue.issueCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Order Ref:</span>
              <span className="font-mono text-muted">{completedData.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Invoice Generated:</span>
              <span className="font-mono font-bold text-primary">{completedData.invoiceNumber}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-muted">Amount Settled:</span>
              <span className="font-bold text-emerald-700">
                ₹{(amountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {isBalance ? (
              <div className="flex justify-between">
                <span className="text-muted">Remaining Balance:</span>
                <span className="font-bold text-slate-800">₹0.00 (Fully Settled)</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-muted">Remaining Balance (Upon Closure):</span>
                <span className="font-medium text-secondaryText">
                  ₹{((issue.fee?.balancePaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <InvoiceButton
              invoiceId={completedData.invoiceId}
              invoiceNumber={completedData.invoiceNumber}
              variant="primary"
              size="md"
              label={isBalance ? 'Download Final Invoice (PDF)' : 'Download Invoice 1 (PDF)'}
            />
            <Button to={`/user/issues/${issue._id}`} variant="outline" size="md">
                {isBalance ? 'View Closed Report & Rate Contractor' : 'Track Issue Details'}
              </Button>
          </div>
        </Card>
      </div>
    );
  }

  const totalPaise = issue.fee?.totalPaise || 0;
  const balancePaise = issue.fee?.balancePaise || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to={`/user/issues/${issue._id}`}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issue Details</span>
        </Link>
      </div>

      {/* Failure message banner if simulated failure was triggered */}
      {failureMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-2 font-semibold text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Simulated Payment Failure</span>
          </div>
          <p>
            {failureMessage}. The issue remains in{' '}
            <span className="font-mono font-bold">AwaitingAdvance</span>. You can retry with a simulated successful payment below.
          </p>
        </div>
      )}

      {/* Grid: Order Summary Left, Simulator Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded border border-primary/20">
                  {issue.issueCode}
                </span>
                <StatusBadge status={issue.status} size="sm" />
              </div>
              <h2 className="text-lg font-heading font-bold text-ink">
                {issue.title}
              </h2>
            </div>

            <div className="text-xs text-muted space-y-2 border-y border-border py-3">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Category: {issue.category?.name || 'General Civic'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>
                  {issue.address?.street}, {issue.address?.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted" />
                <span>Reported on {new Date(issue.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* Financial Ledger Itemization */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-secondaryText">
                <span>Total Quoted Service Fee:</span>
                <span className="font-semibold text-ink">
                  ₹{(totalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-primary font-bold bg-primary-light/40 p-2.5 rounded-lg border border-primary/20">
                <span>Advance Payable Now (50%):</span>
                <span>
                  ₹{(amountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-muted pt-1">
                <span>Balance Due Upon Resolution:</span>
                <span>
                  ₹{(balancePaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-muted pt-2 border-t border-border">
              Upon advance payment confirmation, an immutable <strong>Invoice 1</strong> PDF receipt will be automatically generated and made available for instant download.
            </div>
          </Card>
        </div>

        {/* Right Column: Mock Payment Simulator */}
        <div className="lg:col-span-7">
          {paymentId && (
            <MockCheckout
              paymentId={paymentId}
              amountPaise={amountPaise}
              issueTitle={issue.title}
              issueCode={issue.issueCode}
              onSuccess={handleSuccess}
              onFailure={handleFailure}
              onCancel={() => navigate(`/user/issues/${issue._id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
