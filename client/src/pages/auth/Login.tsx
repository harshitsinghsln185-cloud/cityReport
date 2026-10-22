import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';

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
      setErrorMessage('Please enter both email and password.');
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
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
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
          Sign in to your account
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Citizens, certified resolvers, and municipal operators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-6 py-8 sm:px-10">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] flex items-start gap-3 text-sm text-[#991B1B]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-[#1E293B]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center text-sm text-[#64748B] space-y-2">
            <div>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
              >
                Register as Citizen
              </Link>
            </div>
            <div className="text-xs">
              Are you a contractor?{' '}
              <Link
                to="/register-resolver"
                className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
              >
                Register as Certified Resolver
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
