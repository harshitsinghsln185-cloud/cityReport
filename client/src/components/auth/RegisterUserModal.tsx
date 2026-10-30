import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import authService, { RegisterPayload } from '../../services/auth.service';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Modal } from '../ui/Modal';

export interface RegisterUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterUserModal: React.FC<RegisterUserModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
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

  const resetForm = () => {
    setFormData({
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
    setErrorMessage(null);
    setFieldErrors({});
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Account Created' : 'Register as Citizen'}
      description={
        isSuccess
          ? 'Verification link dispatched'
          : 'Create your account to file civic hazard reports and track verified repairs'
      }
      maxWidth="max-w-xl"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-ink">
            Citizen Profile Created!
          </h3>
          <p className="text-xs sm:text-sm text-secondaryText leading-relaxed max-w-md mx-auto">
            We have sent an authentication link to{' '}
            <strong className="text-ink font-semibold">{formData.email}</strong>. Please check your inbox and confirm your address to start reporting civic issues.
          </p>
          <div className="pt-3 space-y-2">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => {
                handleClose();
                if (onSwitchToLogin) onSwitchToLogin();
              }}
            >
              Proceed to Sign In
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-muted"
              onClick={handleClose}
            >
              Close Dialog
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              1. Personal Credentials
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Legal Name"
                name="name"
                required
                placeholder="Ramesh Sharma"
                leftIcon={<User className="w-4 h-4 text-muted" />}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={fieldErrors.name}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                required
                placeholder="ramesh@example.com"
                leftIcon={<Mail className="w-4 h-4 text-muted" />}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={fieldErrors.email}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Mobile Number"
              type="tel"
              name="phone"
              required
              placeholder="9876543210"
              leftIcon={<Phone className="w-4 h-4 text-muted" />}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={fieldErrors.phone}
            />

            <Input
              label="Password (min. 8 characters)"
              type="password"
              name="password"
              required
              showPasswordToggle
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-muted" />}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={fieldErrors.password}
            />
          </div>

          <div className="pt-2">
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              2. Ward & Residential Address
            </div>
            <div className="space-y-3">
              <Input
                label="Street / House No. / Landmark"
                name="address.street"
                required
                placeholder="Flat 4B, Shanti Enclave, Sector 14"
                leftIcon={<MapPin className="w-4 h-4 text-muted" />}
                value={formData.address.street}
                onChange={(e) => handleChange('address.street', e.target.value)}
                error={fieldErrors['address.street']}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="City"
                  name="address.city"
                  required
                  placeholder="New Delhi"
                  value={formData.address.city}
                  onChange={(e) => handleChange('address.city', e.target.value)}
                  error={fieldErrors['address.city']}
                />

                <Input
                  label="State"
                  name="address.state"
                  required
                  placeholder="Delhi"
                  value={formData.address.state}
                  onChange={(e) => handleChange('address.state', e.target.value)}
                  error={fieldErrors['address.state']}
                />

                <Input
                  label="Pincode"
                  name="address.pincode"
                  required
                  placeholder="110001"
                  value={formData.address.pincode}
                  onChange={(e) => handleChange('address.pincode', e.target.value)}
                  error={fieldErrors['address.pincode']}
                />
              </div>
            </div>
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full shadow-md shadow-primary/20 font-semibold"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Citizen Registration
            </Button>
          </div>

          <div className="pt-2 text-center text-xs text-secondaryText">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                handleClose();
                if (onSwitchToLogin) onSwitchToLogin();
              }}
              className="font-bold text-primary hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default RegisterUserModal;
