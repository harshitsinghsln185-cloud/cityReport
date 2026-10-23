import React, { useState } from 'react';
import { Star, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import financeService, { FeedbackItem } from '../services/finance.service';

interface FeedbackFormProps {
  issueId: string;
  onSuccess?: (feedback: FeedbackItem) => void;
  existingFeedback?: FeedbackItem | null;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  issueId,
  onSuccess,
  existingFeedback = null,
}) => {
  const [rating, setRating] = useState<number>(existingFeedback ? existingFeedback.rating : 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comments, setComments] = useState<string>(existingFeedback ? existingFeedback.comments : '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(!!existingFeedback);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const feedback = await financeService.submitFeedback(issueId, {
        rating,
        comments,
      });
      setSubmitted(true);
      if (onSuccess) {
        onSuccess(feedback);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit feedback';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border border-violet-100 bg-gradient-to-br from-violet-50/50 to-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Thank you for your rating!</h4>
            <p className="mt-1 text-sm text-slate-600">
              Your feedback helps municipal supervisors evaluate contractor quality and benchmark local repair performance.
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-700">{rating} of 5 Stars</span>
            </div>
            {comments && (
              <p className="mt-3 rounded-md bg-white/80 p-3 text-sm italic text-slate-700 border border-violet-100">
                "{comments}"
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-violet-100 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Rate Contractor Remediation Quality</h3>
        <p className="text-sm text-slate-600">
          How satisfied are you with the verified resolution of this civic issue?
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Overall Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm font-semibold text-violet-900">
              {hoverRating || rating === 5
                ? '5 - Outstanding Work'
                : (hoverRating || rating) === 4
                ? '4 - Very Satisfied'
                : (hoverRating || rating) === 3
                ? '3 - Satisfactory'
                : (hoverRating || rating) === 2
                ? '2 - Sub-par Repair'
                : '1 - Poor Repair Quality'}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-slate-700 mb-1">
            Comments or Quality Remarks <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="comments"
            rows={3}
            maxLength={1000}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share any feedback about the repair workmanship, timeliness, or cleanup..."
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
          />
          <div className="mt-1 text-right text-xs text-slate-400">
            {comments.length} / 1000 characters
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-violet-600 text-white hover:bg-violet-700 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting Review...
            </>
          ) : (
            'Submit Verified Rating'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default FeedbackForm;
