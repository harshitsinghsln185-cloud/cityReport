import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  DollarSign,
  RefreshCw,
  Power,
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
        setCategories(activeCategories);
        setIsAvailable(profileData.isAvailable);
        setServiceRadiusKm(profileData.serviceRadiusKm);
        setSelectedSkills(profileData.skills.map((s) => (typeof s === 'string' ? s : s._id)));
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
      <div className="max-w-4xl mx-auto py-12 text-center">
        <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#64748B]">Loading contractor profile & territory...</p>
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
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
              Contractor Profile & Territory
            </h1>
            <StatusBadge status={profile?.status || 'Approved'} size="sm" />
          </div>
          <p className="text-sm text-[#64748B]">
            Configure your active availability, service radius, and qualified skills.
          </p>
        </div>

        {/* Availability Toggle Quick Pill */}
        <button
          type="button"
          onClick={() => setIsAvailable(!isAvailable)}
          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all shadow-xs ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
          }`}
        >
          <Power className={`w-4 h-4 ${isAvailable ? 'text-emerald-600' : 'text-slate-500'}`} />
          <span>{isAvailable ? 'Available for Tasks' : 'Unavailable (Off Duty)'}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Total Earnings</span>
            <DollarSign className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[#1E293B]">
            ₹{((profile?.totalEarningsPaise || 0) / 100).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Paid out via settlements</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Pending Payout</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-heading font-bold text-amber-700">
            ₹{((profile?.pendingPayoutPaise || 0) / 100).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Ready for settlement batch</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-heading font-bold text-emerald-700">
            {profile?.completedTasksCount || 0}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">100% resolution rate</div>
        </Card>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Coverage Radius & Map Section */}
        <Card className="p-6 space-y-5">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-[#1E293B]">
                Territory & Operating Radius
              </h2>
              <p className="text-xs text-[#64748B]">
                Your base is pinned below. Adjust your radius to accept tasks within your commute limit.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#7C3AED] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
              {serviceRadiusKm} km radius
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#1E293B]">
              <span>Coverage Radius Slider</span>
              <span className="text-[#7C3AED] font-bold">{serviceRadiusKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={serviceRadiusKm}
              onChange={(e) => setServiceRadiusKm(parseInt(e.target.value, 10) || 10)}
              className="w-full accent-[#7C3AED]"
            />
            <div className="flex justify-between text-[11px] text-[#64748B]">
              <span>1 km (Hyperlocal)</span>
              <span>25 km</span>
              <span>50 km (Regional)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-2">
              <MapPin className="w-4 h-4 text-[#7C3AED]" />
              <span className="font-semibold text-[#1E293B]">Registered Base:</span>
              <span>{profile?.serviceAddress}</span>
            </div>

            {/* Map Preview with dynamic circle */}
            <MapPicker
              lat={lat}
              lng={lng}
              radiusKm={serviceRadiusKm}
              height="300px"
              onChange={() => {}} // Base is fixed after registration
            />
          </div>
        </Card>

        {/* Skills & Trade Classifications */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="font-heading font-bold text-base text-[#1E293B]">
              Qualified Trade Skills
            </h2>
            <p className="text-xs text-[#64748B]">
              Select which categories of civic issues you are ready to repair.
            </p>
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
                      ? 'border-[#7C3AED] bg-[#EDE9FE]/50 shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:border-[#A78BFA] hover:bg-[#F8F7FC]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 accent-[#7C3AED] rounded"
                  />
                  <div>
                    <div className="font-semibold text-sm text-[#1E293B]">{cat.name}</div>
                    <div className="text-xs text-[#64748B] line-clamp-1">{cat.description}</div>
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
            className="px-6"
          >
            Save Territory & Trade Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResolverProfilePage;
