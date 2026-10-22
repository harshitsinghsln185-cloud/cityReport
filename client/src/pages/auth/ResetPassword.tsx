import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../../services/auth.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F8F7FC]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <ShieldCheck className="w-9 h-9 text-[#7C3AED]" />
          <span className="text-2xl font-heading font-bold text-[#1E293B]">Crowd Report</span>
        </Link>
        <h2 className="text-xl font-heading font-bold text-[#1E293B]">
          Set New Password
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Choose a secure password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-6 py-8 sm:px-10">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[#1E293B] mb-2">
                Password Reset Complete
              </h3>
              <p className="text-sm text-[#64748B] mb-6">
                Your password has been securely updated. You can now sign in with your new credentials.
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {(!token || errorMessage) && (
                <div className="mb-6 p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] flex items-start gap-3 text-sm text-[#991B1B]">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>
                    {!token
                      ? 'No reset token provided. Please open the link sent to your email.'
                      : errorMessage}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="New Password"
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  leftIcon={<Lock className="w-4 h-4" />}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={!token}
                >
                  Update Password
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                >
                  Return to Sign In
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
