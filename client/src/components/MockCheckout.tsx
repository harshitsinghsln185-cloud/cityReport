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
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      {/* Header Badge & Title */}
      <div className="bg-[#171A3B] px-6 py-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white shadow-xs">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              Secure Mock Checkout
            </h3>
            <p className="text-xs text-[#EDE9FE]/80">
              Civic Advance Payment (50%)
            </p>
          </div>
        </div>

        {/* Visual Badge per spec */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-semibold border border-[#A78BFA]/40">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
          <span>Mock Payment Environment</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-6">
        {/* Issue & Amount Header */}
        <div className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-bold text-[#7C3AED]">
              {issueCode || 'Civic Issue'}
            </span>
            <div className="text-sm font-semibold text-[#1E293B] line-clamp-1">
              {issueTitle || 'Advance Service Fee'}
            </div>
            <div className="text-xs text-[#64748B]">Order Ref: {paymentId}</div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-[#64748B]">Total Amount Payable</div>
            <div className="text-2xl font-heading font-black text-[#1E293B]">
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
          <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">
            Simulated Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border-2 border-[#7C3AED] bg-[#EDE9FE]/20 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#7C3AED]" />
              <div>
                <div className="text-xs font-bold text-[#1E293B]">Demo Test Card</div>
                <div className="text-[11px] text-[#64748B]">•••• •••• •••• 4242 (Auto-Authorized)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-slate-50/60 opacity-60 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#64748B]" />
              <div>
                <div className="text-xs font-medium text-[#1E293B]">Simulated UPI / NetBanking</div>
                <div className="text-[11px] text-[#64748B]">Instant Virtual Mandate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice of Simulation */}
        <div className="text-[11px] text-[#64748B] bg-amber-50/80 border border-amber-200/80 p-3 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Sandbox Notice:</strong> No real currency will be charged. This sandbox simulator verifies atomic database state transitions, PDFKit invoice generation, and idempotency guarantees.
          </span>
        </div>

        {/* Actions: Success & Failure Simulation */}
        <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
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
                className="text-xs font-semibold text-[#64748B] hover:text-[#1E293B] transition-colors"
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
