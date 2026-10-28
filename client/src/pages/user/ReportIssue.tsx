import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import categoryService, { Category } from '../../services/category.service';
import issueService, { EstimateQuoteResponse } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import MapPicker from '../../components/MapPicker';
import QuoteCard from '../../components/QuoteCard';

export const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillState = searchParams.get('state');
  const prefillCategory = searchParams.get('category');
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
    city: prefillState || user?.address?.city || 'New Delhi',
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
        const data = await categoryService.getActiveCategories();
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        if (prefillCategory) {
          const matched = list.find(
            (c) => c._id === prefillCategory || c.name.toLowerCase().includes(prefillCategory.toLowerCase())
          );
          if (matched) {
            setFormData((prev) => ({ ...prev, category: matched._id }));
          } else if (list.length > 0 && !formData.category) {
            setFormData((prev) => ({ ...prev, category: list[0]._id }));
          }
        } else if (list.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: list[0]._id }));
        }
      } catch {
        setErrorMessage('Failed to load civic categories. Please refresh.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCats();
  }, [prefillCategory]);

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
        setErrorMessage(`File ${file.name} exceeds 5MB limit.`);
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
    { number: 1, title: 'Classification', icon: FileText },
    { number: 2, title: 'Map Location', icon: MapPin },
    { number: 3, title: 'Photo Proof', icon: Camera },
    { number: 4, title: 'Quote Review', icon: Calculator },
  ];

  const selectedCategoryObj = categories.find((c) => c._id === formData.category);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="space-y-1">
        <Badge variant="primary" size="sm" className="font-semibold uppercase tracking-wider">
          Certified Civic Repair Flow
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink tracking-tight">
          Report a Neighborhood Civic Defect
        </h1>
        <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
          Submit potholes, streetlight failures, garbage overflows, or drainage issues for rapid municipal dispatch and contractor repair.
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
              className={`flex flex-col sm:flex-row items-center gap-2 p-3 rounded-card border text-xs font-semibold transition-all ${
                isCurrent
                  ? 'border-primary bg-white text-primary shadow-xs ring-1 ring-primary/20'
                  : isCompleted
                  ? 'border-emerald-300 bg-emerald-50/70 text-emerald-700'
                  : 'border-border bg-white/70 text-secondaryText'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-primary text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline">{st.title}</span>
            </div>
          );
        })}
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-card text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Wizard Form */}
      <Card className="p-6 sm:p-10 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Issue Classification & Details */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3 mb-4">
                <h2 className="font-heading font-bold text-base sm:text-lg text-ink">
                  Step 1: Civic Classification & Details
                </h2>
                <p className="text-xs text-secondaryText">
                  Select the defect category and describe the observed physical conditions.
                </p>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Service Category <span className="text-red-700">*</span>
                </label>
                {categoriesLoading ? (
                  <div className="text-xs text-secondaryText py-2">Loading active municipal categories...</div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      className="w-full text-xs sm:text-sm p-3 rounded-lg border border-border bg-white text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                      required
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} &bull; Base: ₹{(c.baseFeePaise / 100).toLocaleString('en-IN')}
                        </option>
                      ))}
                    </select>

                    {selectedCategoryObj && (
                      <div className="p-3 bg-canvas rounded-lg border border-border text-xs text-secondaryText flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-ink">{selectedCategoryObj.name}: </span>
                          <span>{selectedCategoryObj.description}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-primary shrink-0 ml-4">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{selectedCategoryObj.estimatedResolutionHours || 48}h Target SLA</span>
                        </div>
                      </div>
                    )}
                  </div>
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
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Detailed Description <span className="text-red-700">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the exact location, visual dimensions, and any traffic or pedestrian disruption caused..."
                  className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-border text-ink bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Suggested Priority
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { key: 'Low', label: 'Low', color: 'border-slate-300 text-slate-700' },
                      { key: 'Medium', label: 'Medium', color: 'border-blue-300 text-blue-700' },
                      { key: 'High', label: 'High', color: 'border-amber-300 text-amber-800' },
                      { key: 'Critical', label: 'Critical', color: 'border-red-300 text-red-800' },
                    ] as const
                  ).map((pr) => {
                    const isSelected = formData.suggestedPriority === pr.key;
                    return (
                      <button
                        key={pr.key}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, suggestedPriority: pr.key }))}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-xs'
                            : 'border-border bg-white hover:bg-canvas text-secondaryText'
                        }`}
                      >
                        {pr.label} Priority
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location Pin & Address */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3 mb-4">
                <h2 className="font-heading font-bold text-base sm:text-lg text-ink">
                  Step 2: Issue Location Pin & Landmark
                </h2>
                <p className="text-xs text-secondaryText">
                  Drop a pin at the exact physical spot of the defect so certified contractors can navigate directly without calling for directions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Interactive Map Pin (Click or Drag Marker)
                </label>
                <MapPicker
                  lat={formData.lat}
                  lng={formData.lng}
                  height="300px"
                  onChange={(newLat, newLng) =>
                    setFormData((p) => ({ ...p, lat: newLat, lng: newLng }))
                  }
                />
                <div className="text-xs text-muted mt-1 tabular-nums flex items-center justify-between">
                  <span>Coordinates: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}</span>
                  <span className="text-primary font-medium">Pin placed on OpenStreetMap</span>
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
                  label="City / Town"
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
            <div className="space-y-5">
              <div className="border-b border-border pb-3 mb-4">
                <h2 className="font-heading font-bold text-base sm:text-lg text-ink">
                  Step 3: Upload Evidence Photos (Optional)
                </h2>
                <p className="text-xs text-secondaryText">
                  Upload up to 5 clear on-site photos. Photos help certified resolvers inspect required materials and arrive equipped.
                </p>
              </div>

              {/* Photos Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-card overflow-hidden border border-border h-36 bg-canvas shadow-xs"
                  >
                    <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white shadow-xs hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {selectedPhotos.length < 5 && (
                  <label className="border-2 border-dashed border-primary/30 rounded-card h-36 flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-primary/5 transition-all text-center group">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-primary">Upload Photo</span>
                    <span className="text-xs text-muted">
                      {5 - selectedPhotos.length} remaining (JPEG, PNG, WebP)
                    </span>
                  </label>
                )}
              </div>

              <div className="p-4 bg-canvas rounded-card border border-border text-xs text-secondaryText flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-PII Privacy: Photos are scanned to blur bystander faces and private number plates before public dispatch.</span>
              </div>
            </div>
          )}

          {/* Step 4: Live Quote Review */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3 mb-4">
                <h2 className="font-heading font-bold text-base sm:text-lg text-ink">
                  Step 4: Transparent Fee Breakdown & Confirmation
                </h2>
                <p className="text-xs text-secondaryText">
                  Inspect the proximity quote computed from the SOR schedule and confirm your dispatch request.
                </p>
              </div>

              {quoteLoading ? (
                <div className="py-12 text-center text-xs text-secondaryText">
                  Computing contractor proximity distance and municipal fee multiplier...
                </div>
              ) : quoteEstimate?.hasEligibleResolver && quoteEstimate.fee ? (
                <QuoteCard
                  fee={quoteEstimate.fee}
                  aiAssessment={quoteEstimate.aiAssessment}
                />
              ) : (
                <div className="p-6 rounded-card bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
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

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
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
                className="px-6 shadow-xs"
              >
                Confirm & Submit Civic Defect
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportIssue;
