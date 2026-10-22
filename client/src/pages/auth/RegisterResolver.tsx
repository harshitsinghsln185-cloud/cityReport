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
} from 'lucide-react';
import categoryService, { Category } from '../../services/category.service';
import resolverService from '../../services/resolver.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import MapPicker from '../../components/MapPicker';
import ImageUploader from '../../components/ImageUploader';

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
        setCategories(data);
      } catch (err: any) {
        setErrorMessage('Failed to load civic categories. Please refresh.');
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
    { number: 2, title: 'Skills & Trade', icon: Layers },
    { number: 3, title: 'Territory Pin', icon: MapPin },
    { number: 4, title: 'ID Verification', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EDE9FE] text-[#7C3AED] mb-3 shadow-sm border border-[#DDD6FE]">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading font-black text-[#1E293B]">
            Certified Resolver Onboarding
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-md mx-auto">
            Join the municipal contractor network to receive and resolve civic tasks in your neighborhood.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep > st.number;
            const isCurrent = currentStep === st.number;
            return (
              <div
                key={st.number}
                className={`flex flex-col sm:flex-row items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'border-[#7C3AED] bg-white text-[#7C3AED] shadow-sm'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-700'
                    : 'border-[#E2E8F0] bg-white/60 text-[#64748B]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-[#7C3AED] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#EDE9FE] text-[#7C3AED]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="hidden sm:inline">{st.title}</span>
              </div>
            );
          })}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Credentials */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-[#E2E8F0] pb-3 mb-4">
                  <h2 className="font-heading font-bold text-lg text-[#1E293B]">
                    Step 1: Contractor Credentials
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Enter your contact details and secure login password.
                  </p>
                </div>

                <Input
                  label="Full Legal Name"
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
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Min 8 characters"
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
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
                <div className="border-b border-[#E2E8F0] pb-3 mb-4">
                  <h2 className="font-heading font-bold text-lg text-[#1E293B]">
                    Step 2: Skills & Trade Classifications
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Select all civic issue types you are qualified and equipped to repair.
                  </p>
                </div>

                {categoriesLoading ? (
                  <div className="py-8 text-center text-sm text-[#64748B]">
                    Loading active categories...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const isSelected = formData.selectedSkills.includes(cat._id);
                      return (
                        <div
                          key={cat._id}
                          onClick={() => handleSkillToggle(cat._id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isSelected
                              ? 'border-[#7C3AED] bg-[#EDE9FE]/50 shadow-sm'
                              : 'border-[#E2E8F0] bg-white hover:border-[#A78BFA] hover:bg-[#F8F7FC]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by div click
                            className="w-4 h-4 mt-0.5 accent-[#7C3AED] rounded"
                          />
                          <div>
                            <div className="font-semibold text-sm text-[#1E293B]">
                              {cat.name}
                            </div>
                            <div className="text-xs text-[#64748B] mt-0.5 line-clamp-2">
                              {cat.description}
                            </div>
                            <div className="text-[11px] font-medium text-[#7C3AED] mt-1.5">
                              Base fee: ₹{cat.baseFeePaise / 100}
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
                <div className="border-b border-[#E2E8F0] pb-3 mb-4">
                  <h2 className="font-heading font-bold text-lg text-[#1E293B]">
                    Step 3: Service Territory & Coverage Radius
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Drop a pin at your operational headquarters and set your maximum travel radius.
                  </p>
                </div>

                <Input
                  label="Headquarters / Base Address"
                  value={formData.serviceAddress}
                  onChange={(e) => setFormData((p) => ({ ...p, serviceAddress: e.target.value }))}
                  placeholder="e.g. Workshop 4, Main Road, Okhla Industrial Area"
                  required
                />

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#1E293B]">
                    <span>Coverage Radius</span>
                    <span className="text-[#7C3AED] font-bold">
                      {formData.serviceRadiusKm} km coverage
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
                    className="w-full accent-[#7C3AED]"
                  />
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>1 km (Hyperlocal)</span>
                    <span>25 km</span>
                    <span>50 km (Regional)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Interactive Headquarters Pin (2dsphere)
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
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Coordinates: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: ID Verification */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="border-b border-[#E2E8F0] pb-3 mb-4">
                  <h2 className="font-heading font-bold text-lg text-[#1E293B]">
                    Step 4: Government ID Proof
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Upload an authentic government identification document (Aadhaar, Voter ID, Trade License). Stored securely with authenticated access.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Privacy Guarantee:</strong> Government ID proofs are stored in authenticated Cloudinary vaults and are only accessible by platform administrators through encrypted, 10-minute signed URLs.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
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
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Profile Avatar Photo (Optional)
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
            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <Link to="/login" className="text-xs font-semibold text-[#7C3AED] hover:underline">
                  Already registered? Sign in
                </Link>
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
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
                  className="px-6 shadow-sm"
                >
                  Submit Application for Review
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterResolver;
