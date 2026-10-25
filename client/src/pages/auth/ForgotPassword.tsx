import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthLayout from '../../components/auth/AuthLayout';
import SEO from '../../components/SEO';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your registered email address to receive secure recovery instructions"
      badgeText="Account Recovery"
      testimonialQuote="Crowd Report's role-based security guarantees zero unauthorized modifications to municipal reports. Security and citizen trust are built right into the platform."
      testimonialAuthor="Suresh Nayak"
      testimonialRole="Security Auditor, National Civic Standards"
    >
      <SEO
        title="Forgot Password"
        description="Reset your Crowd Report citizen or contractor account password securely."
        robots="noindex, follow"
      />
      {isSubmitted ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-bold text-xl text-ink">
            Check Your Inbox
          </h2>
          <p className="text-xs sm:text-sm text-secondaryText leading-relaxed max-w-md mx-auto">
            If an account exists with <strong className="text-ink font-semibold">{email}</strong>, we have dispatched a secure password recovery link valid for 1 hour.
          </p>
          <div className="pt-2">
            <Link to="/login" className="block">
              <Button variant="primary" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-card bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              required
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4 text-muted" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primaryDark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
