import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService, { RegisterPayload } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthLayout from '../../components/auth/AuthLayout';
import SEO from '../../components/SEO';
import { Mail, Lock, User, Phone, MapPin, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterUser: React.FC = () => {
  const [formData, setFormData] = useState<RegisterPayload>({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressKey = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full legal name must be at least 2 characters.';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.address.street.trim()) {
      errors['address.street'] = 'Street or landmark is required.';
    }

    if (!formData.address.city.trim()) {
      errors['address.city'] = 'City is required.';
    }

    if (!formData.address.state.trim()) {
      errors['address.state'] = 'State is required.';
    }

    if (!formData.address.pincode.trim() || !/^\d{6}$/.test(formData.address.pincode)) {
      errors['address.pincode'] = 'Pincode must be 6 digits.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      await authService.register(formData);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="Verification link dispatched for account activation"
        badgeText="Verification Pending"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-bold text-xl text-ink">
            Citizen Profile Created!
          </h2>
          <p className="text-xs sm:text-sm text-secondaryText leading-relaxed max-w-md mx-auto">
            We have sent an authentication link to{' '}
            <strong className="text-ink font-semibold">{formData.email}</strong>. Please check your inbox and confirm your address to start reporting civic issues.
          </p>
          <div className="pt-2 space-y-2.5">
            <Button to="/login" variant="primary" className="block w-full">
                Proceed to Sign In
              </Button>
            <Button to="/" variant="ghost" className="block w-full">
                Return to Public Portal
              </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create Citizen Account"
      subtitle="Report civic defects, inspect transparent contractor quotes, and track photo proof"
      badgeText="Citizen Registration"
    >
      <SEO
        title="Citizen Registration"
        description="Create your citizen account to report municipal defects, track real-time resolution with before/after photos, and verify contractor repairs."
        robots="noindex, follow"
      />
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-red-200 flex items-start gap-3 text-xs sm:text-sm text-red-900 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>1. Personal Credentials</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Legal Name"
              required
              placeholder="e.g. Ramesh Kumar"
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              value={formData.name}
              error={fieldErrors.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input
              label="Mobile Number"
              required
              placeholder="10-digit number"
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              value={formData.phone}
              error={fieldErrors.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              value={formData.email}
              error={fieldErrors.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <Input
              label="Account Password"
              type="password"
              required
              showPasswordToggle
              placeholder="Min 8 characters"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              value={formData.password}
              error={fieldErrors.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>2. Residential Ward Address</span>
          </div>
          <div className="space-y-4">
            <Input
              label="Street Address / House No. / Landmark"
              required
              placeholder="e.g. 42, 4th Cross, 8th Main Road, Indiranagar"
              leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
              value={formData.address.street}
              error={fieldErrors['address.street']}
              onChange={(e) => handleChange('address.street', e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City / Town"
                required
                placeholder="e.g. Bengaluru"
                value={formData.address.city}
                error={fieldErrors['address.city']}
                onChange={(e) => handleChange('address.city', e.target.value)}
              />
              <Input
                label="State / UT"
                required
                placeholder="e.g. Karnataka"
                value={formData.address.state}
                error={fieldErrors['address.state']}
                onChange={(e) => handleChange('address.state', e.target.value)}
              />
              <Input
                label="Pincode"
                required
                placeholder="6 digits"
                value={formData.address.pincode}
                error={fieldErrors['address.pincode']}
                onChange={(e) => handleChange('address.pincode', e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 rounded-xl text-base font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all mt-4"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Create Citizen Account
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 gap-2 text-center sm:text-left">
        <div>
          Already registered?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline transition-colors">
            Sign In
          </Link>
        </div>
        <div>
          Licensed contractor?{' '}
          <Link to="/register-resolver" className="font-bold text-primary hover:underline transition-colors">
            Register as Resolver
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterUser;
