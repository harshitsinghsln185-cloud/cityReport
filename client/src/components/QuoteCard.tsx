import React from 'react';
import {
  Calculator,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { FeeSnapshot, IssueAiAssessment } from '../services/issue.service';
import Card from './ui/Card';

export interface QuoteCardProps {
  fee: FeeSnapshot;
  aiAssessment?: IssueAiAssessment | null;
  className?: string;
  showPayCta?: boolean;
  onPayAdvance?: () => void;
  isPaying?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  fee,
  aiAssessment,
  className = '',
  showPayCta = false,
  onPayAdvance,
  isPaying = false,
}) => {
  const baseFeeRupees = fee.categoryBaseFeePaise / 100;
  const distanceFeeRupees = fee.distanceFeePaise / 100;
  const totalRupees = fee.totalPaise / 100;
  const advanceRupees = fee.advancePaise / 100;
  const balanceRupees = fee.balancePaise / 100;

  const billableKm = Math.max(0, fee.distanceKm - fee.freeKm);

  return (
    <Card className={`overflow-hidden border-border shadow-card ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-canvas to-primary/5 p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-ink">
              Official Repair Fee Breakdown
            </h3>
            <p className="text-xs text-secondaryText">
              Transparent upfront pricing with 50% advance and balance on completion.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-primary border border-primary/20 shadow-xs">
            {fee.isManualQuote ? 'Municipal Custom Quote' : 'Automated Proximity Quote'}
          </span>
        </div>
      </div>

      {/* Breakdown Body */}
      <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
        {/* Line Items */}
        <div className="space-y-3 divide-y divide-border">
          {/* Base Fee */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-secondaryText">
              <span>Category Standard Base Tariff</span>
            </div>
            <span className="font-bold text-ink tabular-nums">₹{baseFeeRupees.toLocaleString('en-IN')}</span>
          </div>

          {/* Severity Multiplier */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-1.5 text-secondaryText">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Severity Hazard Factor</span>
              {aiAssessment && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  {aiAssessment.source === 'ai' ? 'AI Evaluated' : 'Rule Matrix'}
                </span>
              )}
            </div>
            <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-xs tabular-nums">
              {fee.severityMultiplier.toFixed(1)}x Multiplier
            </span>
          </div>

          {/* Distance Fee */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="flex items-center gap-1.5 text-secondaryText">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Contractor Travel Proximity ({fee.distanceKm} km)</span>
              </div>
              <div className="text-[11px] text-muted pl-5.5">
                First {fee.freeKm} km free &bull; {billableKm > 0 ? `${billableKm.toFixed(1)} km @ ₹${fee.perKmRatePaise / 100}/km` : 'Within standard base radius'}
              </div>
            </div>
            <span className="font-bold text-ink tabular-nums">
              {distanceFeeRupees > 0 ? `+₹${distanceFeeRupees.toLocaleString('en-IN')}` : '₹0 (Free)'}
            </span>
          </div>
        </div>

        {/* AI Hazard Summary if available */}
        {aiAssessment?.reason && (
          <div className="p-3 bg-canvas border border-border rounded-lg text-xs text-secondaryText flex items-start gap-2">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink">Hazard Matrix Assessment: </strong>
              <span>{aiAssessment.reason}</span>
            </div>
          </div>
        )}

        {/* Total & 50-50 Split Card */}
        <div className="pt-2">
          <div className="p-4 rounded-card bg-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm sm:text-base text-ink">
                Total Certified Repair Cost
              </span>
              <span className="text-2xl font-heading font-black text-primary tabular-nums">
                ₹{totalRupees.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary/15">
              <div className="p-3 rounded-lg bg-white border border-border shadow-xs">
                <div className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">
                  50% Advance (Deposit)
                </div>
                <div className="text-lg font-heading font-black text-ink mt-0.5 tabular-nums">
                  ₹{advanceRupees.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-muted mt-0.5">To dispatch resolver</div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-border shadow-xs">
                <div className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">
                  50% Balance (On Close)
                </div>
                <div className="text-lg font-heading font-black text-ink mt-0.5 tabular-nums">
                  ₹{balanceRupees.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-muted mt-0.5">After photo inspection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="text-[11px] text-secondaryText flex items-center gap-1.5 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Milestone Protection: Balance is payable only after photo inspection passes verification.
          </span>
        </div>

        {/* Optional Pay CTA */}
        {showPayCta && onPayAdvance && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onPayAdvance}
              disabled={isPaying}
              className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primaryDark text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-xs sm:text-sm disabled:opacity-60"
            >
              <span>{isPaying ? 'Processing...' : `Pay 50% Advance (₹${advanceRupees.toLocaleString('en-IN')})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuoteCard;
