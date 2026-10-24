import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import publicService from '../../services/public.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const WriteQuery: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ queryId: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address so we can reply.');
      return;
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      setErrorMessage('Subject must be at least 3 characters.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await publicService.submitQuery({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setSuccessInfo(res);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'Failed to submit inquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-14 bg-[#F8F7FC] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
            Contact Administration
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1E293B] mt-3 mb-2">
            Write a Query
          </h1>
          <p className="text-sm text-[#64748B]">
            Have a question regarding municipal service coverage, resolver certification, or invoice details? Send our administrative team a direct message.
          </p>
        </div>

        {/* Success Card */}
        {successInfo ? (
          <Card className="border-emerald-200 bg-emerald-50/50 p-8 text-center animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-emerald-950 mb-2">
              Inquiry Received Successfully!
            </h3>
            <p className="text-sm text-emerald-800 max-w-md mx-auto mb-4 leading-relaxed">
              Thank you for reaching out. Your query has been logged with reference ID{' '}
              <span className="font-mono font-bold text-emerald-900">{successInfo.queryId}</span>.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/80 text-emerald-900 text-xs font-medium mb-6">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Estimated Response Window: 24 to 48 hours via email</span>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSuccessInfo(null)}
              >
                Send Another Inquiry
              </Button>
            </div>
          </Card>
        ) : (
          /* Inquiry Form */
          <Card className="border-[#E2E8F0] p-6 sm:p-8">
            {errorMessage && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Priya Nair"
                  required
                />

                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <Input
                label="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your question"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Message / Details *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  placeholder="Please provide details regarding your inquiry..."
                  maxLength={2000}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-[#1E293B] placeholder:text-[#94A3B8] transition-all"
                />
                <div className="text-[11px] text-[#94A3B8] text-right mt-1">
                  {formData.message.length} / 2000 characters
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Responses delivered directly to your email</span>
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 shadow-sm shadow-[#7C3AED]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WriteQuery;
