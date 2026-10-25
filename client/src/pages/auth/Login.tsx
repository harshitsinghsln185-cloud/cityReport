import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthLayout from '../../components/auth/AuthLayout';
import SEO from '../../components/SEO';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

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
    <AuthLayout
      title="Sign In to Portal"
      subtitle="Access citizen reports, contractor dispatch console, or municipal operations"
      badgeText="Secure Identity Gateway"
      testimonialQuote="The transparent 50% escrow and GPS-tagged photo verification eliminated 6 months of traditional municipal delays. Our Indiranagar street defect was repaired in 28 hours."
      testimonialAuthor="Dr. Radhika Sen"
      testimonialRole="RWA President, Ward 82 Bengaluru"
    >
      <SEO
        title="Sign In"
        description="Sign in to Crowd Report to file civic reports, monitor active municipal repair tasks, or manage local territory dispatch."
        robots="noindex, follow"
      />
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
          className="w-full mt-2"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In to Account
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-border space-y-3 text-xs text-secondaryText text-center">
        <div>
          First time reporting in your ward?{' '}
          <Link
            to="/register"
            className="font-bold text-primary hover:text-primaryDark transition-colors"
          >
            Register as Citizen
          </Link>
        </div>
        <div>
          Certified municipal contractor or technician?{' '}
          <Link
            to="/register-resolver"
            className="font-bold text-primary hover:text-primaryDark transition-colors"
          >
            Apply as Certified Resolver
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
