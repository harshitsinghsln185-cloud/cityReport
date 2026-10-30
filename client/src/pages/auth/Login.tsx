import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SEO from '../../components/SEO';
import { RegisterUserModal } from '../../components/auth/RegisterUserModal';
import { RegisterResolverModal } from '../../components/auth/RegisterResolverModal';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, User, Wrench } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State for pop-up registration forms
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState<'user' | 'resolver' | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  // Auto-open modal if URL specifies ?register=user or ?register=resolver
  useEffect(() => {
    const regType = searchParams.get('register') || searchParams.get('modal');
    if (regType === 'user' || regType === 'citizen') {
      setActiveModal('user');
    } else if (regType === 'resolver' || regType === 'contractor') {
      setActiveModal('resolver');
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setActiveModal(null);
    if (searchParams.get('register') || searchParams.get('modal')) {
      searchParams.delete('register');
      searchParams.delete('modal');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login({ email, password });

      // Determine redirect destination
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'Admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'Resolver') {
        navigate('/resolver', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Sign In"
        description="Sign in to Crowd Report to file civic reports, monitor active municipal repair tasks, or manage local territory dispatch."
        robots="noindex, follow"
      />

      <div className="max-w-md w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo to-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-2xl text-ink tracking-tight">
              Crowd Report
            </span>
          </Link>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink tracking-tight">
            Sign In to Portal
          </h1>
          <p className="text-xs sm:text-sm text-secondaryText mt-1.5">
            Access citizen reports, contractor dispatch, or ward operations
          </p>
        </div>

        {/* Clean Centered Normal Card */}
        <div className="bg-white rounded-cardLg border border-border shadow-modal p-6 sm:p-8">
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
              name="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4 text-muted" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-ink">
                  Password <span className="text-red-700">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:text-primaryDark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                showPasswordToggle
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-muted" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 font-semibold shadow-md shadow-primary/20"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Account
            </Button>
          </form>

          {/* Pop-up Registration Triggers */}
          <div className="mt-8 pt-6 border-t border-border space-y-3.5 text-xs text-center">
            <p className="text-secondaryText font-medium">New to Crowd Report?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveModal('user')}
                className="w-full px-3 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-primary/20"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Register as Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('resolver')}
                className="w-full px-3 py-2.5 rounded-xl bg-canvas hover:bg-slate-200 text-ink font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-border"
              >
                <Wrench className="w-4 h-4 text-indigo shrink-0" />
                <span>Apply as Resolver</span>
              </button>
            </div>
          </div>
        </div>

        {/* Micro Trust Safeguards */}
        <div className="mt-6 text-center text-xs text-muted flex items-center justify-center gap-3">
          <span>🔒 Encrypted Portal</span>
          <span>•</span>
          <span>50% Milestone Safeguards</span>
          <span>•</span>
          <span>Zero-PII Privacy</span>
        </div>
      </div>

      {/* Citizen Registration Pop-up Modal */}
      <RegisterUserModal
        isOpen={activeModal === 'user'}
        onClose={handleCloseModal}
        onSwitchToLogin={handleCloseModal}
      />

      {/* Resolver Registration Pop-up Modal */}
      <RegisterResolverModal
        isOpen={activeModal === 'resolver'}
        onClose={handleCloseModal}
        onSwitchToLogin={handleCloseModal}
      />
    </div>
  );
};

export default Login;
