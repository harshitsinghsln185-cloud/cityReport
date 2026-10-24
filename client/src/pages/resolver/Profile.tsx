import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  RefreshCw,
  Power,
  ShieldCheck,
  TrendingUp,
  Clock,
  Wrench,
} from 'lucide-react';
import resolverService, { ResolverProfile } from '../../services/resolver.service';
import categoryService, { Category } from '../../services/category.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import MapPicker from '../../components/MapPicker';

export const ResolverProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ResolverProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [serviceRadiusKm, setServiceRadiusKm] = useState<number>(10);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [profileData, activeCategories] = await Promise.all([
          resolverService.getMe(),
          categoryService.getActiveCategories(),
        ]);

        setProfile(profileData);
        setCategories(Array.isArray(activeCategories) ? activeCategories : []);
        if (profileData) {
          setIsAvailable(profileData.isAvailable);
          setServiceRadiusKm(profileData.serviceRadiusKm);
          setSelectedSkills(
            Array.isArray(profileData.skills)
              ? profileData.skills.map((s) => (typeof s === 'string' ? s : s._id))
              : []
          );
        }
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message || 'Failed to load resolver profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSkillToggle = (categoryId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      setErrorMessage('You must select at least one civic service trade skill.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const updated = await resolverService.updateSettings({
        isAvailable,
        serviceRadiusKm,
        skills: selectedSkills,
      });

      setProfile(updated);
      setSuccessMessage('Contractor settings updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
        <p className="text-sm text-secondaryText">Loading contractor profile & operating territory...</p>
      </div>
    );
  }

  const coordinates = profile?.serviceLocation?.coordinates || [77.209, 28.6139];
  const lng = coordinates[0];
  const lat = coordinates[1];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
              Contractor Profile & Territory
            </h1>
            <StatusBadge status={profile?.status || 'Approved'} size="sm" />
          </div>
          <p className="text-sm text-secondaryText">
            Configure your active on-duty availability, dispatch radius, and authorized trade skills.
          </p>
        </div>

        {/* Availability Toggle Quick Pill */}
        <button
          type="button"
          onClick={() => setIsAvailable(!isAvailable)}
          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all shadow-xs cursor-pointer select-none ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-canvas text-secondaryText border-border hover:bg-slate-100'
          }`}
        >
          <Power className={`w-4 h-4 ${isAvailable ? 'text-emerald-600' : 'text-secondaryText'}`} />
          <span>{isAvailable ? 'Available for Jobs (On-Duty)' : 'Unavailable (Off-Duty)'}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-sm flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-sm flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Financial & Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/80 bg-card rounded-card shadow-card p-5">
          <div className="flex items-center justify-between text-xs text-secondaryText mb-1.5">
            <span className="font-medium uppercase tracking-wider text-[11px]">Total Earnings</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-ink font-mono tabular-nums">
            ₹{((profile?.totalEarningsPaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-secondaryText mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Disbursed via Escrow</span>
          </div>
        </Card>

        <Card className="border border-border/80 bg-card rounded-card shadow-card p-5">
          <div className="flex items-center justify-between text-xs text-secondaryText mb-1.5">
            <span className="font-medium uppercase tracking-wider text-[11px]">Pending Payout</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-amber-800 font-mono tabular-nums">
            ₹{((profile?.pendingPayoutPaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-secondaryText mt-1">Pending citizen balance settlement</div>
        </Card>

        <Card className="border border-border/80 bg-card rounded-card shadow-card p-5">
          <div className="flex items-center justify-between text-xs text-secondaryText mb-1.5">
            <span className="font-medium uppercase tracking-wider text-[11px]">Tasks Completed</span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-ink font-mono tabular-nums">
            {profile?.completedTasksCount || 0}
          </div>
          <div className="text-[11px] text-secondaryText mt-1">100% photographic proof rate</div>
        </Card>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Coverage Radius & Map Section */}
        <Card className="border border-border/80 bg-card rounded-card shadow-card p-6 space-y-5">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-base text-ink">
                Territory & Operating Radius
              </h2>
              <p className="text-xs text-secondaryText">
                Your workshop base is pinned below. Adjust your radius to accept tasks within your commute limit.
              </p>
            </div>
            <div className="text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              {serviceRadiusKm} km radius
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-semibold text-ink">
              <span>Coverage Radius Slider</span>
              <span className="text-primary font-mono font-bold">{serviceRadiusKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={serviceRadiusKm}
              onChange={(e) => setServiceRadiusKm(parseInt(e.target.value, 10) || 10)}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-secondaryText">
              <span>1 km (Hyperlocal)</span>
              <span>25 km (Urban Sector)</span>
              <span>50 km (Metropolitan)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-secondaryText">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold text-ink">Registered Base:</span>
              <span className="font-mono text-ink">{profile?.serviceAddress}</span>
            </div>

            {/* Map Preview with dynamic circle */}
            <div className="rounded-xl overflow-hidden border border-border">
              <MapPicker
                lat={lat}
                lng={lng}
                radiusKm={serviceRadiusKm}
                height="300px"
                onChange={() => {}} // Base is fixed after registration
              />
            </div>
          </div>
        </Card>

        {/* Skills & Trade Classifications */}
        <Card className="border border-border/80 bg-card rounded-card shadow-card p-6 space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-base text-ink">
                Qualified Trade Skills
              </h2>
              <p className="text-xs text-secondaryText">
                Select which civic hazard categories you are certified and equipped to remediate.
              </p>
            </div>
            <div className="text-xs font-mono text-secondaryText">
              {selectedSkills.length} selected
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedSkills.includes(cat._id);
              return (
                <div
                  key={cat._id}
                  onClick={() => handleSkillToggle(cat._id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-canvas'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 accent-primary rounded cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-primary" />
                      <div className="font-semibold text-sm text-ink">{cat.name}</div>
                    </div>
                    <div className="text-xs text-secondaryText line-clamp-1 mt-0.5">{cat.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="px-6 text-xs font-semibold shadow-sm"
          >
            Save Territory & Trade Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResolverProfilePage;
