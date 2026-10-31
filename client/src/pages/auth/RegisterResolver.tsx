import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  User,
  MapPin,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Layers,
  Clock,
} from 'lucide-react';
import categoryService, { Category, DEFAULT_CIVIC_CATEGORIES } from '../../services/category.service';
import resolverService from '../../services/resolver.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import MapPicker from '../../components/MapPicker';
import ImageUploader from '../../components/ImageUploader';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import PageHero from '../../components/ui/PageHero';

export const RegisterResolver: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
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
  }, []);

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
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
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
    if (!formData.serviceAddress || formData.serviceAddress.trim().length < 5) {
      setErrorMessage('Please provide your service headquarters address.');
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
      setErrorMessage('Government ID proof image is required for contractor verification.');
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

      if (photoFile) {
        payload.append('photo', photoFile);
      }

      await resolverService.register(payload);
      navigate('/resolver/pending', {
        state: { newRegistration: true, email: formData.email },
      });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Trade Skills', icon: Layers },
    { number: 3, title: 'Territory Pin', icon: MapPin },
    { number: 4, title: 'ID Verification', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <SEO
        title="Municipal Contractor & Resolver Onboarding"
        description="Join India's certified municipal contractor network. Receive proximity-dispatched civic work orders, guaranteed 50% advance milestone payouts, and verified credentials."
        keywords={[
          'municipal contractor onboarding',
          'civic resolver registration',
          'road contractor jobs',
          'government civic contractor',
        ]}
        canonical={`${SITE_URL}/register-resolver`}
      />

      {/* Institutional Split Page Hero */}
      <PageHero
        variant="split"
        theme="navy"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contractor Accreditation' }]}
        eyebrow="Municipal Contractor Accreditation"
        eyebrowIcon={<Wrench className="w-3.5 h-3.5" />}
        title="Join the Certified Municipal Resolver Network"
        description="Receive proximity-dispatched municipal work orders, guaranteed 50% advance milestone payouts, and verifiable public reputation in your local district."
        visual={
          <div className="w-full max-w-sm rounded-[20px] bg-white/5 border border-white/15 p-6 backdrop-blur-md shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-gold">Contractor Benefits</span>
              <Badge variant="gold" size="sm">KYC Required</Badge>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                <span><strong className="text-white">50% Advance Lock:</strong> Zero risk of customer non-payment prior to material purchase.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span><strong className="text-white">Territory Dispatch:</strong> Receive alerts strictly within your selected service radius.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <span><strong className="text-white">Direct Bank Payout:</strong> Automated disbursements upon photo-verified sign-off.</span>
              </div>
            </div>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Step Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep > st.number;
            const isCurrent = currentStep === st.number;
            return (
              <div
                key={st.number}
                className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary text-white shadow-sm shadow-primary/25'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-white text-primary'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="truncate">{st.title}</span>
              </div>
            );
          })}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 bg-red-50/90 border border-red-200 text-red-900 rounded-xl text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Credentials */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                    Step 1: Contractor Credentials
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your contact details and secure login password.
                  </p>
                </div>

                <Input
                  label="Full Legal Name (as per Govt ID)"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Ramesh Kumar Verma"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="ramesh@example.com"
                    required
                  />

                  <Input
                    label="Mobile Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                    Step 2: Skills & Trade Classifications
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select all civic issue types you and your crew are equipped to repair.
                  </p>
                </div>

                {categoriesLoading ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Loading registered categories...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const isSelected = formData.selectedSkills.includes(cat._id);
                      return (
                        <div
                          key={cat._id}
                          onClick={() => handleSkillToggle(cat._id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 mt-0.5 accent-primary rounded cursor-pointer shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-slate-900 truncate">
                              {cat.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </div>
                            <div className="text-xs font-bold text-slate-700 mt-2.5 flex items-center gap-2">
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                                Base tariff: ₹{(cat.baseFeePaise / 100).toLocaleString('en-IN')}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {cat.estimatedResolutionHours || 48}h SLA
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

            {/* Step 3: Map Pin & Coverage Area */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                    Step 3: Service Territory & Coverage Radius
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Drop a pin at your operational headquarters and calibrate your maximum dispatch radius.
                  </p>
                </div>

                <Input
                  label="Headquarters / Workshop Base Address"
                  value={formData.serviceAddress}
                  onChange={(e) => setFormData((p) => ({ ...p, serviceAddress: e.target.value }))}
                  placeholder="e.g. Plot 14, Phase II, Okhla Industrial Area"
                  required
                />

                <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-900">
                    <span>Coverage Radius</span>
                    <span className="text-primary font-black text-sm sm:text-base bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {formData.serviceRadiusKm} km radius
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={formData.serviceRadiusKm}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        serviceRadiusKm: parseInt(e.target.value, 10) || 10,
                      }))
                    }
                    className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>1 km (Hyperlocal)</span>
                    <span>25 km (Ward)</span>
                    <span>50 km (Metropolitan)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-bold text-slate-900 tracking-tight mb-2 select-none">
                    Interactive Headquarters Pin (Geospatial 2dsphere)
                  </label>
                  <MapPicker
                    lat={formData.lat}
                    lng={formData.lng}
                    radiusKm={formData.serviceRadiusKm}
                    onChange={(newLat, newLng) =>
                      setFormData((p) => ({ ...p, lat: newLat, lng: newLng }))
                    }
                    height="320px"
                  />
                  <p className="text-xs text-slate-500 mt-1.5 tabular-nums">
                    Lat/Lng: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: ID Verification */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                    Step 4: Government ID Proof & Credential Verification
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload an authentic government identification document (Aadhaar, Voter ID, or Trade License).
                  </p>
                </div>

                <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Data Privacy & Storage Security:</strong> Government ID proofs are stored in authenticated Cloudinary vaults and are only accessible by platform administrators through time-limited cryptographic signed URLs.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 tracking-tight mb-2 select-none">
                    Government ID Document (Required, Max 5MB)
                  </label>
                  <ImageUploader
                    onUpload={(file) => setIdProofFile(file)}
                    onRemove={() => setIdProofFile(null)}
                    maxSizeMB={5}
                  />
                  {idProofFile && (
                    <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ready for submission: {idProofFile.name}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-bold text-slate-900 tracking-tight mb-2 select-none">
                    Contractor Profile Photo / Company Logo (Optional)
                  </label>
                  <ImageUploader
                    onUpload={(file) => setPhotoFile(file)}
                    onRemove={() => setPhotoFile(null)}
                    maxSizeMB={5}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-5 rounded-xl font-bold text-slate-700 border-slate-200 hover:bg-slate-50"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <Link to="/login" className="text-xs sm:text-sm font-bold text-primary hover:underline transition-colors">
                  Already registered? Sign In
                </Link>
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  className="h-12 px-6 rounded-xl font-bold text-sm sm:text-base shadow-md shadow-accent/25 hover:shadow-lg transition-all"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  disabled={!idProofFile}
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                  className="h-12 px-6 rounded-xl font-bold text-sm sm:text-base shadow-md shadow-accent/25 hover:shadow-lg transition-all"
                >
                  Submit Application for Review
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterResolver;
