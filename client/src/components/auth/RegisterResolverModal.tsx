import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
} from 'lucide-react';
import categoryService, { Category, DEFAULT_CIVIC_CATEGORIES } from '../../services/category.service';
import resolverService from '../../services/resolver.service';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Modal } from '../ui/Modal';

export interface RegisterResolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterResolverModal: React.FC<RegisterResolverModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    selectedSkills: [] as string[],
    serviceAddress: '',
    lat: 28.6139,
    lng: 77.209,
    serviceRadiusKm: 10,
  });

  const [idProofFile, setIdProofFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await categoryService.getActiveCategories();
        const list = Array.isArray(data) && data.length > 0 ? data : DEFAULT_CIVIC_CATEGORIES;
        setCategories(list);
      } catch {
        setCategories(DEFAULT_CIVIC_CATEGORIES);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [isOpen]);

  const resetForm = () => {
    setCurrentStep(1);
    setErrorMessage(null);
    setIsSuccess(false);
    setIdProofFile(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      street: '',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      selectedSkills: [],
      serviceAddress: '',
      lat: 28.6139,
      lng: 77.209,
      serviceRadiusKm: 10,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSkillToggle = (categoryId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedSkills.includes(categoryId);
      if (exists) {
        return {
          ...prev,
          selectedSkills: prev.selectedSkills.filter((id) => id !== categoryId),
        };
      }
      return {
        ...prev,
        selectedSkills: [...prev.selectedSkills, categoryId],
      };
    });
  };

  const validateStep1 = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setErrorMessage('Please fill in all personal details.');
      return false;
    }
    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setErrorMessage('Phone must be a valid 10-digit Indian mobile number.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (formData.selectedSkills.length === 0) {
      setErrorMessage('Please select at least one civic service category skill.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep3 = () => {
    if (!formData.serviceAddress.trim() || formData.serviceAddress.trim().length < 5) {
      setErrorMessage('Please provide your service workshop or headquarters address.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idProofFile) {
      setErrorMessage('Government ID proof document is required for contractor vetting.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('email', formData.email.trim());
      payload.append('phone', formData.phone.trim());
      payload.append('password', formData.password);
      payload.append(
        'address',
        JSON.stringify({
          street: formData.street.trim() || formData.serviceAddress.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        })
      );
      payload.append('skills', JSON.stringify(formData.selectedSkills));
      payload.append('serviceAddress', formData.serviceAddress.trim());
      payload.append('lat', formData.lat.toString());
      payload.append('lng', formData.lng.toString());
      payload.append('serviceRadiusKm', formData.serviceRadiusKm.toString());
      payload.append('idProof', idProofFile);

      await resolverService.register(payload);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const STEPS = [
    { num: 1, label: 'Profile' },
    { num: 2, label: 'Skills & Categories' },
    { num: 3, label: 'Service Territory' },
    { num: 4, label: 'Verification' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Application Received' : 'Apply as Certified Municipal Resolver'}
      description={
        isSuccess
          ? 'Contractor vetting initiated'
          : 'Join the verified ward contractor network with 50% milestone advance protections'
      }
      maxWidth="max-w-2xl"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-ink">
            Application Submitted for Review!
          </h3>
          <p className="text-xs sm:text-sm text-secondaryText leading-relaxed max-w-lg mx-auto">
            Your contractor profile and trade documentation have been submitted to our ward administrative desk. We verify licenses and GST compliance within 24 to 48 business hours.
          </p>
          <div className="p-3.5 rounded-xl bg-canvas border border-border text-xs text-left text-muted space-y-1 max-w-md mx-auto">
            <div>• Registered Email: <strong className="text-ink">{formData.email}</strong></div>
            <div>• Selected Categories: <strong className="text-ink">{formData.selectedSkills.length} Trade Skills</strong></div>
            <div>• Coverage Radius: <strong className="text-ink">{formData.serviceRadiusKm} km</strong></div>
          </div>
          <div className="pt-3">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => {
                handleClose();
                if (onSwitchToLogin) onSwitchToLogin();
              }}
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 pt-1">
          {/* Step Progress Pills */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            {STEPS.map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <div key={s.num} className="flex items-center gap-1.5 text-xs font-semibold">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-secondaryText'
                    }`}
                  >
                    {isPast ? '✓' : s.num}
                  </div>
                  <span className={`hidden sm:inline ${isActive ? 'text-ink' : 'text-muted'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="text-xs font-bold text-muted uppercase tracking-wider">
                Step 1: Contractor / Resolver Credentials
              </div>
              <Input
                label="Full Legal Name (as per Govt ID)"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ramesh Kumar Verma"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Business / Registered Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="ramesh.contractor@example.com"
                  required
                />
                <Input
                  label="10-digit Mobile Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="9876543210"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Account Password"
                  type="password"
                  showPasswordToggle
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  showPasswordToggle
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Skill Categories */}
          {currentStep === 2 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-muted uppercase tracking-wider">
                    Step 2: Skills & Trade Classifications
                  </div>
                  <p className="text-xs text-secondaryText mt-0.5">
                    Select all civic issue types your crew is qualified and equipped to repair:
                  </p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {formData.selectedSkills.length} Selected
                </span>
              </div>

              {categoriesLoading ? (
                <div className="py-12 text-center text-xs text-secondaryText">
                  Loading registered categories...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isSelected = formData.selectedSkills.includes(cat._id);
                    return (
                      <div
                        key={cat._id}
                        onClick={() => handleSkillToggle(cat._id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20'
                            : 'border-border bg-white hover:border-borderHover hover:bg-canvas'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 mt-0.5 accent-primary rounded cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs text-ink truncate">
                            {cat.name}
                          </div>
                          <p className="text-[11px] text-secondaryText mt-0.5 line-clamp-2 leading-tight">
                            {cat.description}
                          </p>
                          <div className="text-[11px] font-bold text-primary mt-1.5 flex items-center gap-1.5">
                            <span>Base: ₹{((cat.baseFeePaise || 30000) / 100).toLocaleString('en-IN')}</span>
                            <span className="text-muted">•</span>
                            <span className="text-muted font-normal flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cat.estimatedResolutionHours || 24}h SLA
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Service Address & Coverage Radius */}
          {currentStep === 3 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="text-xs font-bold text-muted uppercase tracking-wider">
                Step 3: Service Base & Coverage Radius
              </div>

              <Input
                label="Workshop / Operations Base Address"
                value={formData.serviceAddress}
                onChange={(e) => setFormData((p) => ({ ...p, serviceAddress: e.target.value }))}
                placeholder="Plot 14, Phase II, Okhla Industrial Area"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                  required
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                  required
                />
                <Input
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData((p) => ({ ...p, pincode: e.target.value }))}
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-canvas border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink">Max Dispatch Radius</span>
                  <strong className="text-primary font-bold">{formData.serviceRadiusKm} Kilometers</strong>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={formData.serviceRadiusKm}
                  onChange={(e) => setFormData((p) => ({ ...p, serviceRadiusKm: Number(e.target.value) }))}
                  className="w-full accent-primary cursor-pointer"
                />
                <p className="text-[11px] text-muted">
                  Wards falling within {formData.serviceRadiusKm} km of your base address will be routed to your dispatch dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Verification Document Upload */}
          {currentStep === 4 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="text-xs font-bold text-muted uppercase tracking-wider">
                Step 4: Government Verification Document
              </div>

              <div className="p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-canvas text-center space-y-2">
                <Upload className="w-8 h-8 text-primary mx-auto" />
                <div className="text-xs font-semibold text-ink">
                  {idProofFile ? idProofFile.name : 'Upload Government ID / Trade License'}
                </div>
                <p className="text-[11px] text-muted">
                  Aadhaar Card, Voter ID, PAN, Municipal Contractor License or GST Certificate (PDF, PNG, JPG up to 10MB)
                </p>
                <input
                  type="file"
                  id="resolver-id-proof"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setIdProofFile(e.target.files[0]);
                      setErrorMessage(null);
                    }
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('resolver-id-proof')?.click()}
                >
                  {idProofFile ? 'Change File' : 'Browse File'}
                </Button>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Vetting Policy:</strong> All documents are strictly verified for identity integrity. You will receive assignments with 50% advance milestone escrow security upon approval.
              </div>
            </div>
          )}

          {/* Modal Action Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={loading}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-muted hover:text-ink cursor-pointer font-medium"
              >
                Cancel
              </button>
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Step {currentStep + 1}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                isLoading={loading}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Submit Application
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RegisterResolverModal;
