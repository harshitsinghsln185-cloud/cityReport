import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import financeService from '../services/finance.service';

interface ReopenModalProps {
  issueId: string;
  issueCode: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedIssue: any) => void;
}

export const ReopenModal: React.FC<ReopenModalProps> = ({
  issueId,
  issueCode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 5) {
      setError('Please provide a specific reason of at least 5 characters explaining why this issue should be reopened.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const issue = await financeService.reopenIssue(issueId, reason.trim());
      onSuccess(issue);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to reopen issue';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Reopen Civic Issue</h3>
              <p className="text-xs text-slate-500 font-mono">{issueCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-amber-50 p-3.5 border border-amber-200">
          <p className="text-xs leading-relaxed text-amber-800">
            <strong>Important Policy Note:</strong> An issue may only be reopened if the physical repair has failed or deteriorated, and municipal disbursement to the contractor has not yet completed. Once the contractor payout has been disbursed, claims cannot be reopened directly.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="reopenReason" className="block text-sm font-medium text-slate-700 mb-1">
              Reason for Reopening <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reopenReason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detail what is wrong with the repair (e.g. pothole sinkhole recurring, street drain still blocked, uneven curb)..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 text-white hover:bg-amber-700 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm & Reopen Issue'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReopenModal;
