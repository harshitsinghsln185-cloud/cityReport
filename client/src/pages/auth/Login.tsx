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

      <div className="max-w-xl w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo to-primary flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Crowd Report
            </span>
          </Link>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Sign In to Portal
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            Access citizen reports, contractor dispatch, or ward operations
          </p>
        </div>

        {/* Clean Centered Normal Card with Expanded Width & Modern SaaS Controls */}
        <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-200/90 shadow-xl shadow-slate-200/50 p-7 sm:p-10">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-red-200 flex items-start gap-3 text-xs sm:text-sm text-red-900 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Registered Email Address"
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              helperText="Inputs should have clear labels and comfortable touch targets"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-900 tracking-tight">
                  Password <span className="text-red-600 font-semibold">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline transition-colors"
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
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 rounded-xl mt-3 font-bold text-sm sm:text-base shadow-md shadow-accent/25 hover:shadow-lg transition-all"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Account
            </Button>
          </form>

          {/* Pop-up Registration Triggers */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3.5 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New to Crowd Report?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveModal('user')}
                className="w-full h-12 px-4 rounded-xl bg-accent text-navy hover:bg-accent-hover font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-accent/40 shadow-xs hover:shadow"
              >
                <User className="w-4 h-4 shrink-0 text-navy" />
                <span>Register as Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('resolver')}
                className="w-full h-12 px-4 rounded-xl bg-accent/20 hover:bg-accent/30 text-navy font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-accent/40 shadow-xs hover:shadow"
              >
                <Wrench className="w-4 h-4 text-navy shrink-0" />
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
