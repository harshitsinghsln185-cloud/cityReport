import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService, { RegisterPayload } from '../../services/auth.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ShieldCheck, Mail, Lock, User, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

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
      errors.name = 'Full name must be at least 2 characters.';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Must be a 10-digit Indian phone number starting with 6-9.';
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.address.street.trim()) {
      errors['address.street'] = 'Street address is required.';
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
      <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F8F7FC]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">
              Registration Successful!
            </h2>
            <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
              We have dispatched a verification email to{' '}
              <strong className="text-[#1E293B]">{formData.email}</strong>. Please check your inbox and click the verification link to activate your citizen account.
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="primary" className="w-full">
                  Proceed to Sign In
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="w-full">
                  Return to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F8F7FC]">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <ShieldCheck className="w-9 h-9 text-[#7C3AED]" />
          <span className="text-2xl font-heading font-bold text-[#1E293B]">Crowd Report</span>
        </Link>
        <h2 className="text-xl font-heading font-bold text-[#1E293B]">
          Create Citizen Account
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Report neighborhood civic issues, track progress, and review resolution proof
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <Card className="px-6 py-8 sm:px-10">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] flex items-start gap-3 text-sm text-[#991B1B]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-[#64748B] mb-3">
                Personal Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  leftIcon={<User className="w-4 h-4" />}
                  value={formData.name}
                  error={fieldErrors.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                <Input
                  label="Mobile Number"
                  required
                  placeholder="10-digit number"
                  leftIcon={<Phone className="w-4 h-4" />}
                  value={formData.phone}
                  error={fieldErrors.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="name@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={formData.email}
                  error={fieldErrors.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  leftIcon={<Lock className="w-4 h-4" />}
                  value={formData.password}
                  error={fieldErrors.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <h3 className="text-xs uppercase font-bold tracking-wider text-[#64748B] mb-3">
                Residential Address
              </h3>
              <div className="space-y-4">
                <Input
                  label="Street Address / House No."
                  required
                  placeholder="e.g. 12, Subhash Marg, Civil Lines"
                  leftIcon={<MapPin className="w-4 h-4" />}
                  value={formData.address.street}
                  error={fieldErrors['address.street']}
                  onChange={(e) => handleChange('address.street', e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    required
                    placeholder="e.g. Kanpur"
                    value={formData.address.city}
                    error={fieldErrors['address.city']}
                    onChange={(e) => handleChange('address.city', e.target.value)}
                  />
                  <Input
                    label="State"
                    required
                    placeholder="e.g. Uttar Pradesh"
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
              className="w-full pt-3 pb-3"
              isLoading={isLoading}
            >
              Register Citizen Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-sm text-[#64748B] gap-2">
            <span>
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-[#7C3AED] hover:text-[#6D28D9]">
                Sign In
              </Link>
            </span>
            <span>
              Want to solve issues?{' '}
              <Link to="/register-resolver" className="font-semibold text-[#7C3AED] hover:text-[#6D28D9]">
                Register as Resolver
              </Link>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterUser;
