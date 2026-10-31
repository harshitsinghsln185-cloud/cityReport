import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import authService from '../../services/auth.service';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/auth/AuthLayout';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing from the link.');
      return;
    }

    let isMounted = true;

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        if (isMounted) setStatus('success');
      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message || 'Verification token is invalid or has expired.');
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Validating citizen credentials on the National Civic Registry"
      badgeText="Identity Verification"
    >
      <div className="text-center py-6">
        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <h3 className="font-heading font-semibold text-base text-ink">
              Verifying your email address...
            </h3>
            <p className="text-xs text-secondaryText">
              Please wait a moment while we validate your cryptographic token.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-extrabold tracking-tight text-xl text-ink">
              Email Successfully Authenticated!
            </h3>
            <p className="text-xs sm:text-sm text-secondaryText leading-relaxed max-w-md mx-auto">
              Your citizen account has been verified. You can now submit neighborhood reports, review certified contractor quotes, and track repair milestones.
            </p>
            <div className="pt-2">
              <Button to="/login" variant="primary" className="block w-full h-12 rounded-xl text-base font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Sign In to Account
                </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center mx-auto shadow-xs">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-extrabold tracking-tight text-xl text-ink">
              Verification Link Invalid
            </h3>
            <p className="text-xs sm:text-sm text-secondaryText leading-relaxed max-w-md mx-auto">
              {errorMessage || 'The verification link is invalid, malformed, or has expired after 24 hours.'}
            </p>
            <div className="pt-2 space-y-2.5">
              <Button to="/login" variant="primary" className="block w-full h-12 rounded-xl text-base font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all">
                  Proceed to Sign In
                </Button>
              <Button to="/" variant="ghost" className="block w-full h-10 rounded-xl text-sm font-semibold">
                  Return to Home
                </Button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
