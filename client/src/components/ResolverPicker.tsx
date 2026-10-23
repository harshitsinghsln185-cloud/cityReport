import React, { useState } from 'react';
import { CandidateResolver } from '../services/admin.service';
import Card from './ui/Card';
import Button from './ui/Button';
import {
  UserCheck,
  MapPin,
  Briefcase,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface ResolverPickerProps {
  candidates: CandidateResolver[];
  isLoading: boolean;
  onAssign: (resolverId: string) => Promise<void>;
  currentlyAssignedId?: string | null;
}

export const ResolverPicker: React.FC<ResolverPickerProps> = ({
  candidates,
  isLoading,
  onAssign,
  currentlyAssignedId,
}) => {
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const handleAssignClick = async (resolverId: string) => {
    setAssigningId(resolverId);
    try {
      await onAssign(resolverId);
    } finally {
      setAssigningId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin mb-3" />
        <p className="text-sm font-medium text-[#1E293B]">Searching certified candidates...</p>
        <p className="text-xs text-[#64748B] mt-1">Executing geospatial proximity query within coverage boundaries</p>
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="p-8 text-center bg-[#F8F7FC] border border-dashed border-[#E2E8F0] rounded-xl">
        <div className="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-[#1E293B] mb-1">No Matching Candidates Found</h4>
        <p className="text-xs text-[#64748B] max-w-md mx-auto mb-4">
          There are currently no approved and available resolvers with category qualification located within their defined service radius of this issue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-heading font-bold text-[#1E293B]">Eligible Candidate Resolvers</h3>
          <p className="text-xs text-[#64748B]">
            Found {candidates.length} contractor{candidates.length > 1 ? 's' : ''} qualified for this category within service territory
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((cand) => {
          const resolver = cand.resolver;
          const user = resolver.user || {};
          const isAssigned = currentlyAssignedId === resolver._id;
          const isPendingAssignment = assigningId === resolver._id;

          return (
            <Card
              key={resolver._id}
              className={`relative transition-all duration-200 border ${
                isAssigned
                  ? 'border-[#7C3AED] bg-[#EDE9FE]/20 shadow-sm'
                  : 'border-[#E2E8F0] hover:border-[#A78BFA] hover:shadow-sm'
              }`}
            >
              {isAssigned && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Currently Assigned
                </div>
              )}

              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div className="relative">
                  {user.photo?.url ? (
                    <img
                      src={user.photo.url}
                      alt={user.name || 'Resolver'}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#312E81] text-white flex items-center justify-center font-heading font-bold text-base shadow-sm">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'RC'}
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      resolver.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                    title={resolver.isAvailable ? 'Available' : 'Busy'}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-bold text-sm text-[#1E293B] truncate">
                      {user.name || 'Unnamed Contractor'}
                    </h4>
                    <ShieldCheck className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                  </div>
                  <p className="text-xs text-[#64748B] truncate">{user.email || 'No email'}</p>
                  <p className="text-xs text-[#475569] mt-0.5">{user.phone || 'No phone'}</p>

                  {/* Badges / Metrics */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#1E293B] font-medium border border-[#E2E8F0]">
                      <MapPin className="w-3 h-3 text-[#7C3AED]" />
                      {cand.distanceKm} km away
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border ${
                        cand.activeTasksCount === 0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : cand.activeTasksCount < 3
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <Briefcase className="w-3 h-3" />
                      {cand.activeTasksCount} active task{cand.activeTasksCount === 1 ? '' : 's'}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED] font-medium border border-[#DDD6FE]">
                      Radius: {resolver.serviceRadiusKm} km
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div className="text-xs text-[#64748B] truncate max-w-[180px]">
                      {resolver.serviceAddress || 'Local coverage'}
                    </div>

                    <Button
                      variant={isAssigned ? 'outline' : 'primary'}
                      size="sm"
                      disabled={isAssigned || isPendingAssignment}
                      onClick={() => handleAssignClick(resolver._id)}
                      className="gap-1.5 text-xs font-semibold"
                    >
                      {isPendingAssignment ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Assigning...
                        </>
                      ) : isAssigned ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                          Assigned
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          Assign Task
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResolverPicker;
