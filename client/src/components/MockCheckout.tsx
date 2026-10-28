import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import paymentService from '../services/payment.service';
import Button from './ui/Button';

interface MockCheckoutProps {
  paymentId: string;
  amountPaise: number;
  issueTitle?: string;
  issueCode?: string;
  onSuccess: (data: {
    paymentId: string;
    invoiceId: string;
    invoiceNumber: string;
    status: string;
  }) => void;
  onFailure: (reason: string) => void;
  onCancel?: () => void;
}

export const MockCheckout: React.FC<MockCheckoutProps> = ({
  paymentId,
  amountPaise,
  issueTitle,
  issueCode,
  onSuccess,
  onFailure,
  onCancel,
}) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<'success' | 'failure' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formattedAmount = (amountPaise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSimulateSuccess = async () => {
    try {
      setProcessing(true);
      setCurrentAction('success');
      setError(null);

      // Generate UUIDv4 for Idempotency-Key
      const idempotencyKey =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      // Simulate network / gateway processing time of 1.5 seconds per spec
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await paymentService.confirmPayment(paymentId, idempotencyKey);
      onSuccess(res);
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.message || 'Payment confirmation failed.');
    } finally {
      setProcessing(false);
      setCurrentAction(null);
    }
  };

  const handleSimulateFailure = async () => {
    try {
      setProcessing(true);
      setCurrentAction('failure');
      setError(null);

      // Simulate gateway delay of 1.5 seconds per spec
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reason = 'Mock simulated gateway card decline (Insufficient funds / Test mode)';
      await paymentService.failPayment(paymentId, reason);
      onFailure(reason);
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.message || 'Simulation error.');
    } finally {
      setProcessing(false);
      setCurrentAction(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header Badge & Title */}
      <div className="bg-primary px-6 py-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent text-primary flex items-center justify-center shadow-xs">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              Secure Mock Checkout
            </h3>
            <p className="text-xs text-primary-light">
              Civic Advance Payment (50%)
            </p>
          </div>
        </div>

        {/* Visual Badge per spec */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-accent-text text-xs font-semibold border border-accent-border">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Mock Payment Environment</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-6">
        {/* Issue & Amount Header */}
        <div className="p-4 rounded-xl bg-canvas border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-bold text-primary">
              {issueCode || 'Civic Issue'}
            </span>
            <div className="text-sm font-semibold text-ink line-clamp-1">
              {issueTitle || 'Advance Service Fee'}
            </div>
            <div className="text-xs text-muted">Order Ref: {paymentId}</div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-muted">Total Amount Payable</div>
            <div className="text-2xl font-heading font-bold text-ink">
              ₹{formattedAmount}
            </div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mock Payment Method Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider">
            Simulated Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border-2 border-primary bg-primary-light/30 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs font-bold text-ink">Demo Test Card</div>
                <div className="text-xs text-muted">•••• •••• •••• 4242 (Auto-Authorized)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-slate-50/60 opacity-60 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-muted" />
              <div>
                <div className="text-xs font-medium text-ink">Simulated UPI / NetBanking</div>
                <div className="text-xs text-muted">Instant Virtual Mandate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice of Simulation */}
        <div className="text-xs text-muted bg-amber-50/80 border border-amber-200/80 p-3 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Sandbox Notice:</strong> No real currency will be charged. This sandbox simulator verifies atomic database state transitions, PDFKit invoice generation, and idempotency guarantees.
          </span>
        </div>

        {/* Actions: Success & Failure Simulation */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Success Action */}
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center font-bold"
              onClick={handleSimulateSuccess}
              disabled={processing}
              leftIcon={
                processing && currentAction === 'success' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )
              }
            >
              {processing && currentAction === 'success'
                ? 'Processing Payment (1.5s)...'
                : 'Simulate Successful Payment'}
            </Button>

            {/* Secondary Failure Simulation Action */}
            <Button
              variant="danger"
              size="lg"
              className="w-full justify-center font-bold"
              onClick={handleSimulateFailure}
              disabled={processing}
              leftIcon={
                processing && currentAction === 'failure' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )
              }
            >
              {processing && currentAction === 'failure'
                ? 'Simulating Decline...'
                : 'Simulate Gateway Failure'}
            </Button>
          </div>

          {onCancel && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={processing}
                className="text-xs font-semibold text-muted hover:text-ink transition-colors"
              >
                Cancel and return to Issue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockCheckout;
