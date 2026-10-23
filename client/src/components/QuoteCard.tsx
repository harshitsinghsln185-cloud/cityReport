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
    <Card className={`overflow-hidden border-[#DDD6FE] shadow-sm ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#EDE9FE] to-[#F5F3FF] p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#1E293B]">
              Standard Municipal Civic Quote
            </h3>
            <p className="text-xs text-[#64748B]">
              Transparent, immutable pricing based on certified trade base and dispatch distance.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-[#7C3AED] border border-[#DDD6FE] shadow-xs">
            {fee.isManualQuote ? 'Municipal Custom Quote' : 'Automated Proximity Quote'}
          </span>
        </div>
      </div>

      {/* Breakdown Body */}
      <div className="p-4 sm:p-6 space-y-4 text-sm">
        {/* Line Items */}
        <div className="space-y-2.5 divide-y divide-[#F1F5F9]">
          {/* Base Fee */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-[#475569]">
              <span>Category Base Rate</span>
            </div>
            <span className="font-semibold text-[#1E293B]">₹{baseFeeRupees.toLocaleString('en-IN')}</span>
          </div>

          {/* Severity Multiplier */}
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center gap-1.5 text-[#475569]">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>Severity Hazard Factor</span>
              {aiAssessment && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#7C3AED] font-medium">
                  {aiAssessment.source === 'ai' ? 'AI Evaluated' : 'Rule Matrix'}
                </span>
              )}
            </div>
            <span className="font-semibold text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded text-xs">
              {fee.severityMultiplier.toFixed(1)}x Multiplier
            </span>
          </div>

          {/* Distance Fee */}
          <div className="flex items-center justify-between pt-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-[#475569]">
                <MapPin className="w-4 h-4 text-[#7C3AED]" />
                <span>Contractor Travel ({fee.distanceKm} km)</span>
              </div>
              <div className="text-[11px] text-[#64748B] pl-5.5">
                First {fee.freeKm} km free &bull; {billableKm > 0 ? `${billableKm.toFixed(1)} km @ ₹${fee.perKmRatePaise / 100}/km` : 'Within base radius'}
              </div>
            </div>
            <span className="font-semibold text-[#1E293B]">
              {distanceFeeRupees > 0 ? `+₹${distanceFeeRupees.toLocaleString('en-IN')}` : '₹0'}
            </span>
          </div>
        </div>

        {/* AI Hazard Summary if available */}
        {aiAssessment?.reason && (
          <div className="p-3 bg-[#F8F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#475569] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1E293B]">Hazard Assessment: </strong>
              <span>{aiAssessment.reason}</span>
            </div>
          </div>
        )}

        {/* Total & 50-50 Split Card */}
        <div className="pt-2">
          <div className="p-4 rounded-xl bg-[#EDE9FE]/40 border border-[#DDD6FE] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-base text-[#1E293B]">
                Total Resolution Fee
              </span>
              <span className="text-2xl font-heading font-black text-[#7C3AED]">
                ₹{totalRupees.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#DDD6FE]/60">
              <div className="p-2.5 rounded-lg bg-white border border-[#DDD6FE]/60">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                  50% Advance (Now)
                </div>
                <div className="text-lg font-heading font-bold text-[#1E293B] mt-0.5">
                  ₹{advanceRupees.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#64748B]">Escrowed until work starts</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#DDD6FE]/60">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                  50% Balance (On Close)
                </div>
                <div className="text-lg font-heading font-bold text-[#1E293B] mt-0.5">
                  ₹{balanceRupees.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#64748B]">Due after verified resolution</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            100% Satisfaction Guarantee: If issue cannot be resolved, advance payment is fully refunded.
          </span>
        </div>

        {/* Optional Pay CTA */}
        {showPayCta && onPayAdvance && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onPayAdvance}
              disabled={isPaying}
              className="w-full py-3 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all text-sm disabled:opacity-60"
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
