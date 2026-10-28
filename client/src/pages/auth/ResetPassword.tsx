import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthLayout from '../../components/auth/AuthLayout';
import SEO from '../../components/SEO';
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('Reset token is missing from the URL. Please re-check the link in your email.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Choose a secure passphrase to safeguard your civic account"
      badgeText="Credential Renewal"
    >
      <SEO
        title="Reset Password"
        description="Set a new secure password for your Crowd Report account."
        robots="noindex, nofollow"
      />
      {isSuccess ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-bold text-xl text-ink">
            Password Reset Complete
          </h2>
          <p className="text-xs sm:text-sm text-secondaryText leading-relaxed max-w-md mx-auto">
            Your password has been securely updated. You can now sign in with your new credentials.
          </p>
          <div className="pt-2">
            <Button to="/login" variant="primary" className="block w-full">
                Sign In to Account
              </Button>
          </div>
        </div>
      ) : (
        <>
          {(!token || errorMessage) && (
            <div className="mb-6 p-3.5 rounded-card bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">
                {!token
                  ? 'No reset token provided. Please open the link sent to your email.'
                  : errorMessage}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              required
              showPasswordToggle
              placeholder="Min 8 characters"
              leftIcon={<Lock className="w-4 h-4 text-muted" />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              showPasswordToggle
              placeholder="Re-enter new password"
              leftIcon={<Lock className="w-4 h-4 text-muted" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              disabled={!token}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Update Password
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-primary hover:text-primaryDark transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
