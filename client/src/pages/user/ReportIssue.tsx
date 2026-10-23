import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  MapPin,
  Camera,
  Calculator,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Plus,
  Trash2,
  Send,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import categoryService, { Category } from '../../services/category.service';
import issueService, { EstimateQuoteResponse } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import MapPicker from '../../components/MapPicker';
import QuoteCard from '../../components/QuoteCard';

export const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    suggestedPriority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    lat: 28.6139,
    lng: 77.209,
    street: user?.address?.street || '',
    city: user?.address?.city || 'New Delhi',
    pincode: user?.address?.pincode || '110001',
    contactNumber: user?.phone || '',
  });

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Quote State
  const [quoteEstimate, setQuoteEstimate] = useState<EstimateQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setCategoriesLoading(true);
        const list = await categoryService.getActiveCategories();
        setCategories(list);
        if (list.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: list[0]._id }));
        }
      } catch (err: any) {
        setErrorMessage('Failed to load civic categories. Please refresh.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCats();
  }, []);

  // Handle Photo Staging
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    if (selectedPhotos.length + newFiles.length > 5) {
      setErrorMessage('You can upload a maximum of 5 issue photos.');
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} exceeds 5MB.`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedPhotos((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    setErrorMessage(null);
  };

  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    if (!formData.category) {
      setErrorMessage('Please select a civic service category.');
      return false;
    }
    if (!formData.title || formData.title.trim().length < 5) {
      setErrorMessage('Title must be at least 5 characters long.');
      return false;
    }
    if (!formData.description || formData.description.trim().length < 10) {
      setErrorMessage('Description must be at least 10 characters long.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.street || formData.street.trim().length < 2) {
      setErrorMessage('Please enter the street / landmark address.');
      return false;
    }
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
      setErrorMessage('Pincode must be a 6-digit Indian postal code.');
      return false;
    }
    if (!formData.contactNumber || !/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      setErrorMessage('Contact number must be a valid 10-digit mobile number.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const fetchLiveQuote = async () => {
    try {
      setQuoteLoading(true);
      setErrorMessage(null);
      const res = await issueService.estimateQuote({
        category: formData.category,
        lat: formData.lat,
        lng: formData.lng,
        suggestedPriority: formData.suggestedPriority,
        description: formData.description,
      });
      setQuoteEstimate(res);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to calculate quote estimate.');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (currentStep === 3) {
      await fetchLiveQuote();
    }

    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description.trim());
      payload.append('category', formData.category);
      payload.append('suggestedPriority', formData.suggestedPriority);
      payload.append('contactNumber', formData.contactNumber.trim());
      payload.append('lat', formData.lat.toString());
      payload.append('lng', formData.lng.toString());
      payload.append(
        'address',
        JSON.stringify({
          street: formData.street.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        })
      );
      payload.append('source', 'form');

      for (const file of selectedPhotos) {
        payload.append('images', file);
      }

      const res = await issueService.create(payload);
      navigate(`/user/issues/${res.issue._id}`);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to submit civic issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Details', icon: FileText },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Photos', icon: Camera },
    { number: 4, title: 'Quote Review', icon: Calculator },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B]">
          Report a Civic Issue
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Submit local infrastructure concerns for rapid municipal dispatch and certified contractor repair.
        </p>
      </div>

      {/* Steps Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {steps.map((st) => {
          const Icon = st.icon;
          const isCompleted = currentStep > st.number;
          const isCurrent = currentStep === st.number;
          return (
            <div
              key={st.number}
              className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                isCurrent
                  ? 'border-[#7C3AED] bg-white text-[#7C3AED] shadow-xs'
                  : isCompleted
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-[#E2E8F0] bg-white text-[#64748B]'
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
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline">{st.title}</span>
            </div>
          );
        })}
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Wizard Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Issue Classification & Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-[#E2E8F0] pb-3 mb-4">
                <h2 className="font-heading font-bold text-lg text-[#1E293B]">
                  Step 1: Civic Classification & Details
                </h2>
                <p className="text-xs text-[#64748B]">
                  Specify the category and nature of the civic issue.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Service Category <span className="text-rose-500">*</span>
                </label>
                {categoriesLoading ? (
                  <div className="text-xs text-[#64748B]">Loading categories...</div>
                ) : (
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] focus:ring-2 focus:ring-[#A78BFA] focus:outline-none"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} &bull; Base: ₹{c.baseFeePaise / 100}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <Input
                label="Issue Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Hazardous deep pothole near Metro Pillar 42"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the exact location, visual appearance, and any traffic or pedestrian disruption caused..."
                  className="w-full text-xs p-3 rounded-xl border border-[#E2E8F0] text-[#1E293B] focus:ring-2 focus:ring-[#A78BFA] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Suggested Priority
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Low', 'Medium', 'High', 'Critical'] as const).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, suggestedPriority: pr }))}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        formData.suggestedPriority === pr
                          ? 'border-[#7C3AED] bg-[#EDE9FE] text-[#7C3AED]'
                          : 'border-[#E2E8F0] hover:bg-[#F8F7FC] text-[#64748B]'
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location Pin & Address */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-[#E2E8F0] pb-3 mb-4">
                <h2 className="font-heading font-bold text-lg text-[#1E293B]">
                  Step 2: Issue Location Pin & Contact
                </h2>
                <p className="text-xs text-[#64748B]">
                  Drop a pin at the exact physical spot of the defect so resolvers can navigate directly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Interactive Map Pin (Click or Drag Marker)
                </label>
                <MapPicker
                  lat={formData.lat}
                  lng={formData.lng}
                  height="280px"
                  onChange={(newLat, newLng) =>
                    setFormData((p) => ({ ...p, lat: newLat, lng: newLng }))
                  }
                />
                <div className="text-[11px] text-[#64748B] mt-1">
                  Coordinates: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
                </div>
              </div>

              <Input
                label="Street Address / Landmark"
                value={formData.street}
                onChange={(e) => setFormData((p) => ({ ...p, street: e.target.value }))}
                placeholder="e.g. Opposite Sector 4 Community Center, Main Ring Road"
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
                  label="Pincode (6 digits)"
                  value={formData.pincode}
                  onChange={(e) => setFormData((p) => ({ ...p, pincode: e.target.value }))}
                  placeholder="110001"
                  required
                />

                <Input
                  label="Contact Mobile"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, contactNumber: e.target.value }))}
                  placeholder="10-digit mobile"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Photos Staging */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-[#E2E8F0] pb-3 mb-4">
                <h2 className="font-heading font-bold text-lg text-[#1E293B]">
                  Step 3: Upload Evidence Photos (Optional)
                </h2>
                <p className="text-xs text-[#64748B]">
                  Upload up to 5 clear on-site photos to help contractors evaluate required tools and materials.
                </p>
              </div>

              {/* Photos Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-[#E2E8F0] h-32 bg-slate-100"
                  >
                    <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white shadow-xs hover:bg-rose-700 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {selectedPhotos.length < 5 && (
                  <label className="border-2 border-dashed border-[#DDD6FE] rounded-xl h-32 flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-[#EDE9FE]/20 transition-all text-center">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <div className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-1">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#7C3AED]">Add Photo</span>
                    <span className="text-[10px] text-[#64748B]">
                      {5 - selectedPhotos.length} remaining
                    </span>
                  </label>
                )}
              </div>

              <p className="text-[11px] text-[#64748B]">
                Supported formats: JPEG, PNG, WebP &bull; Maximum file size: 5MB per photo.
              </p>
            </div>
          )}

          {/* Step 4: Live Quote Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border-b border-[#E2E8F0] pb-3 mb-4">
                <h2 className="font-heading font-bold text-lg text-[#1E293B]">
                  Step 4: Fee Quote & Resolution Overview
                </h2>
                <p className="text-xs text-[#64748B]">
                  Review the transparent municipal fee breakdown and confirm your report.
                </p>
              </div>

              {quoteLoading ? (
                <div className="py-12 text-center text-xs text-[#64748B]">
                  Calculating proximity distance and severity multiplier...
                </div>
              ) : quoteEstimate?.hasEligibleResolver && quoteEstimate.fee ? (
                <QuoteCard
                  fee={quoteEstimate.fee}
                  aiAssessment={quoteEstimate.aiAssessment}
                />
              ) : (
                <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-heading font-bold text-base">
                    <Info className="w-5 h-5 text-amber-600" />
                    <span>Special Handling: Custom Municipal Quote</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    No certified contractor is currently available within the standard automated travel radius. Your issue will be dispatched to municipal operations for triage, candidate assignment, and a manual fee quote.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Buttons Navigation */}
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
              <div />
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
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
                className="px-6"
              >
                Confirm & Submit Civic Issue
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportIssue;
