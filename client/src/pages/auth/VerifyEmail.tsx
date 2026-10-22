import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../../services/auth.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ShieldCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F8F7FC]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <ShieldCheck className="w-9 h-9 text-[#7C3AED]" />
          <span className="text-2xl font-heading font-bold text-[#1E293B]">Crowd Report</span>
        </Link>
        <h2 className="text-xl font-heading font-bold text-[#1E293B]">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-8 text-center">
          {status === 'verifying' && (
            <div className="py-6">
              <Loader2 className="w-12 h-12 animate-spin text-[#7C3AED] mx-auto mb-4" />
              <h3 className="text-base font-heading font-semibold text-[#1E293B] mb-1">
                Verifying your email address...
              </h3>
              <p className="text-xs text-[#64748B]">
                Please wait a moment while we validate your token.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-4">
              <div className="w-14 h-14 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[#1E293B] mb-2">
                Email Successfully Verified!
              </h3>
              <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                Your email has been authenticated. You now have full access to submit neighborhood reports, track contractor work, and review civic repairs.
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full">
                  Sign In to Your Account
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-4">
              <div className="w-14 h-14 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[#1E293B] mb-2">
                Verification Failed
              </h3>
              <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                {errorMessage || 'The verification link is invalid, malformed, or has expired after 24 hours.'}
              </p>
              <div className="space-y-3">
                <Link to="/login">
                  <Button variant="primary" className="w-full">
                    Proceed to Sign In
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
