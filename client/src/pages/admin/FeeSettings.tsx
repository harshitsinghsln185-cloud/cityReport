import React, { useState, useEffect, useMemo } from 'react';
import {
  Sliders,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Calculator,
  Save,
} from 'lucide-react';
import feeSettingsService from '../../services/feeSettings.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export const FeeSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State (values represented in human units for editing)
  const [formData, setFormData] = useState({
    freeKm: 3,
    perKmRateRupees: 15,
    minFeeRupees: 100,
    maxFeeRupees: 5000,
    commissionPercent: 10,
    multipliers: {
      minor: 1.0,
      moderate: 1.3,
      high: 1.6,
      critical: 2.0,
    },
  });

  // Simulator State
  const [simBaseFeeRupees, setSimBaseFeeRupees] = useState<number>(500);
  const [simDistanceKm, setSimDistanceKm] = useState<number>(7.0);
  const [simSeverity, setSimSeverity] = useState<'minor' | 'moderate' | 'high' | 'critical'>('high');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feeSettingsService.getFeeSettings();
      if (data && data.multipliers) {
        setFormData({
          freeKm: data.freeKm ?? 5,
          perKmRateRupees: (data.perKmRatePaise ?? 2000) / 100,
          minFeeRupees: (data.minFeePaise ?? 30000) / 100,
          maxFeeRupees: (data.maxFeePaise ?? 1000000) / 100,
          commissionPercent: data.commissionPercent ?? 15,
          multipliers: {
            minor: data.multipliers?.minor ?? 1.0,
            moderate: data.multipliers?.moderate ?? 1.25,
            high: data.multipliers?.high ?? 1.5,
            critical: data.multipliers?.critical ?? 2.0,
          },
        });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load global fee settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (formData.minFeeRupees > formData.maxFeeRupees) {
      setError('Minimum fee cannot exceed maximum fee.');
      return;
    }

    try {
      setSaving(true);
      await feeSettingsService.updateFeeSettings({
        freeKm: Math.round(formData.freeKm),
        perKmRatePaise: Math.round(formData.perKmRateRupees * 100),
        minFeePaise: Math.round(formData.minFeeRupees * 100),
        maxFeePaise: Math.round(formData.maxFeeRupees * 100),
        commissionPercent: Number(formData.commissionPercent),
        multipliers: {
          minor: Number(formData.multipliers.minor),
          moderate: Number(formData.multipliers.moderate),
          high: Number(formData.multipliers.high),
          critical: Number(formData.multipliers.critical),
        },
      });
      setSuccessMessage('Global pricing and fee configuration updated successfully.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update fee settings');
    } finally {
      setSaving(false);
    }
  };

  // Live Simulation Calculation
  const simulation = useMemo(() => {
    const baseFeePaise = Math.round(simBaseFeeRupees * 100);
    const perKmRatePaise = Math.round(formData.perKmRateRupees * 100);
    const minFeePaise = Math.round(formData.minFeeRupees * 100);
    const maxFeePaise = Math.round(formData.maxFeeRupees * 100);
    const multiplier = formData.multipliers[simSeverity] || 1.0;

    // 1. Distance Calculation
    const billableKm = Math.max(0, simDistanceKm - formData.freeKm);
    const distanceFeePaise = Math.round(billableKm * perKmRatePaise);

    // 2. Base + Severity
    const baseSeverityPaise = Math.round(baseFeePaise * multiplier);

    // 3. Subtotal
    const subtotalPaise = baseSeverityPaise + distanceFeePaise;

    // 4. Round to nearest ₹10 (1000 paise)
    const roundedPaise = Math.round(subtotalPaise / 1000) * 1000;

    // 5. Clamp
    const clampedPaise = Math.min(Math.max(roundedPaise, minFeePaise), maxFeePaise);

    // 6. Split 50% advance / 50% balance
    const advancePaise = Math.floor(clampedPaise / 2);
    const balancePaise = clampedPaise - advancePaise;

    // 7. Commission & Payout
    const commissionPaise = Math.round((clampedPaise * formData.commissionPercent) / 100);
    const resolverPayoutPaise = clampedPaise - commissionPaise;

    return {
      billableKm,
      distanceFeeRupees: distanceFeePaise / 100,
      baseSeverityRupees: baseSeverityPaise / 100,
      subtotalRupees: subtotalPaise / 100,
      roundedRupees: roundedPaise / 100,
      totalRupees: clampedPaise / 100,
      advanceRupees: advancePaise / 100,
      balanceRupees: balancePaise / 100,
      commissionRupees: commissionPaise / 100,
      resolverPayoutRupees: resolverPayoutPaise / 100,
      isClamped: roundedPaise !== clampedPaise,
    };
  }, [formData, simBaseFeeRupees, simDistanceKm, simSeverity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-primary">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="font-medium">Loading pricing parameters...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink flex items-center gap-2.5">
          <Sliders className="w-7 h-7 text-primary" />
          Pricing & Schedule of Rates (SOR)
        </h1>
        <p className="text-sm text-secondaryText mt-1">
          Configure baseline distance allowances, clamp thresholds, severity multipliers, and platform commission.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-card text-sm flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-card text-sm flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Distance Parameters */}
            <Card className="p-6 border-border/80 bg-card shadow-card rounded-card">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/60 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    Distance Parameters
                  </h3>
                  <p className="text-xs text-secondaryText">
                    Define travel allowances and additional distance charges for resolvers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Free Distance Allowance (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.freeKm}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, freeKm: parseInt(e.target.value, 10) || 0 }))
                    }
                    className="w-full px-3 py-2 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                    required
                  />
                  <p className="text-[11px] text-secondaryText mt-1">
                    First {formData.freeKm} km travel incurs no distance fee.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Rate per Billable km (₹ / km)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondaryText">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.perKmRateRupees}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          perKmRateRupees: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full pl-7 pr-3 py-2 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-secondaryText mt-1 font-mono">
                    Stored as {Math.round(formData.perKmRateRupees * 100)} paise / km.
                  </p>
                </div>
              </div>
            </Card>

            {/* 2. Clamp Thresholds */}
            <Card className="p-6 border-border/80 bg-card shadow-card rounded-card">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/60 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    Clamp Thresholds (Min & Max Bounds)
                  </h3>
                  <p className="text-xs text-secondaryText">
                    Ensure the calculated quote stays within consumer-friendly safety bounds.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Minimum Fee Floor (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondaryText">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="10"
                      step="1"
                      value={formData.minFeeRupees}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, minFeeRupees: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full pl-7 pr-3 py-2 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-secondaryText mt-1 font-mono">
                    No issue quote will be less than ₹{formData.minFeeRupees}.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Maximum Fee Ceiling (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondaryText">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={formData.minFeeRupees}
                      step="10"
                      value={formData.maxFeeRupees}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, maxFeeRupees: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full pl-7 pr-3 py-2 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-secondaryText mt-1 font-mono">
                    No issue quote will exceed ₹{formData.maxFeeRupees}.
                  </p>
                </div>
              </div>
            </Card>

            {/* 3. Severity Multipliers */}
            <Card className="p-6 border-border/80 bg-card shadow-card rounded-card">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/60 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    AI Severity Multipliers
                  </h3>
                  <p className="text-xs text-secondaryText">
                    Multipliers applied against the category baseline fee depending on issue criticality.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">
                    Minor
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="5.0"
                    value={formData.multipliers.minor}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        multipliers: { ...p.multipliers, minor: parseFloat(e.target.value) || 1.0 },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-700 mb-1">
                    Moderate
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="5.0"
                    value={formData.multipliers.moderate}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        multipliers: {
                          ...p.multipliers,
                          moderate: parseFloat(e.target.value) || 1.0,
                        },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-orange-700 mb-1">
                    High
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="5.0"
                    value={formData.multipliers.high}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        multipliers: { ...p.multipliers, high: parseFloat(e.target.value) || 1.0 },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-700 mb-1">
                    Critical
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="5.0"
                    value={formData.multipliers.critical}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        multipliers: {
                          ...p.multipliers,
                          critical: parseFloat(e.target.value) || 1.0,
                        },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* 4. Platform Commission */}
            <Card className="p-6 border-border/80 bg-card shadow-card rounded-card">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/60 mb-4">
                <Percent className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    Platform Commission
                  </h3>
                  <p className="text-xs text-secondaryText">
                    Percentage deducted from the final settled issue fee for platform operations.
                  </p>
                </div>
              </div>

              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-ink mb-1">
                  Commission Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={formData.commissionPercent}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        commissionPercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pr-8 pl-3 py-2 border border-border/80 rounded-card bg-card text-sm text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-secondaryText">
                    %
                  </span>
                </div>
                <p className="text-[11px] text-secondaryText mt-1 font-mono">
                  Resolvers will receive {100 - formData.commissionPercent}% of the resolved amount.
                </p>
              </div>
            </Card>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={saving}
                leftIcon={<Save className="w-4 h-4" />}
                className="px-6 shadow-sm"
              >
                Save Pricing Parameters
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Simulation Preview Widget (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 border-2 border-primary/20 bg-card shadow-card rounded-card">
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/60 mb-4">
              <Calculator className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-serif font-bold text-ink text-base">
                  Live Fee Simulation
                </h3>
                <p className="text-xs text-secondaryText">
                  Test real-time calculation breakdown against active parameters.
                </p>
              </div>
            </div>

            {/* Simulator Inputs */}
            <div className="space-y-3.5 mb-5 pb-5 border-b border-border/60">
              <div>
                <label className="block text-xs font-semibold text-secondaryText mb-1">
                  Sample Category Base Fee (₹)
                </label>
                <input
                  type="number"
                  step="50"
                  min="0"
                  value={simBaseFeeRupees}
                  onChange={(e) => setSimBaseFeeRupees(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-border/80 rounded-card text-sm bg-card text-ink focus:ring-2 focus:ring-primary/30 focus:outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-secondaryText mb-1">
                  <span>Resolver Distance</span>
                  <span className="text-primary font-mono">{simDistanceKm.toFixed(1)} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={simDistanceKm}
                  onChange={(e) => setSimDistanceKm(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondaryText mb-1">
                  AI Assessed Severity
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['minor', 'moderate', 'high', 'critical'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSimSeverity(sev)}
                      className={`py-1 text-xs font-medium capitalize rounded-card border transition-all ${
                        simSeverity === sev
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-card text-secondaryText border-border/80 hover:bg-canvas'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step-by-Step Breakdown */}
            <div className="space-y-2.5 text-xs text-secondaryText">
              <div className="flex justify-between">
                <span>Base × Severity Multiplier:</span>
                <span className="font-semibold text-ink font-mono tabular-nums">
                  ₹{simBaseFeeRupees} × {formData.multipliers[simSeverity]} = ₹
                  {simulation.baseSeverityRupees.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Distance Fee ({simulation.billableKm.toFixed(1)} billable km):</span>
                <span className="font-semibold text-ink font-mono tabular-nums">
                  +{simulation.distanceFeeRupees.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-border/60">
                <span>Unrounded Subtotal:</span>
                <span className="font-semibold text-ink font-mono tabular-nums">
                  ₹{simulation.subtotalRupees.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Rounded to nearest ₹10:</span>
                <span className="font-semibold text-ink font-mono tabular-nums">
                  ₹{simulation.roundedRupees.toFixed(2)}
                </span>
              </div>

              {simulation.isClamped && (
                <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[11px]">
                  Clamp applied: clamped within [₹{formData.minFeeRupees}, ₹{formData.maxFeeRupees}]
                </div>
              )}

              {/* Total Final Quote Box */}
              <div className="p-4 bg-primary/5 rounded-card border border-primary/20 mt-3">
                <div className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Final Calculated Quote
                </div>
                <div className="text-2xl font-serif font-bold text-ink mt-0.5 font-mono tabular-nums">
                  ₹{simulation.totalRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/60">
                  <div>
                    <div className="text-[11px] text-secondaryText">50% Advance (Now)</div>
                    <div className="text-sm font-bold text-ink font-mono tabular-nums">
                      ₹{simulation.advanceRupees.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-secondaryText">50% Balance (Close)</div>
                    <div className="text-sm font-bold text-ink font-mono tabular-nums">
                      ₹{simulation.balanceRupees.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-border/60 text-[11px]">
                  <div>
                    <span className="text-secondaryText">Resolver Payout:</span>{' '}
                    <strong className="text-emerald-700 font-mono tabular-nums">
                      ₹{simulation.resolverPayoutRupees.toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-secondaryText">Platform ({formData.commissionPercent}%):</span>{' '}
                    <strong className="text-primary font-mono tabular-nums">
                      ₹{simulation.commissionRupees.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeeSettingsPage;
