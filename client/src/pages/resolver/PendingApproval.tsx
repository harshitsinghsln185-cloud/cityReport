import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  MapPin,
  Layers,
  ArrowRight,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import resolverService, { ResolverProfile } from '../../services/resolver.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';

export const PendingApproval: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ResolverProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isJustRegistered = location.state?.newRegistration;
  const registeredEmail = location.state?.email || user?.email;

  const fetchStatus = async () => {
    try {
      setError(null);
      if (user) {
        await refreshUser();
        const data = await resolverService.getMe();
        setProfile(data);
        if (data.status === 'Approved') {
          navigate('/resolver');
        }
      }
    } catch (err: any) {
      // If user isn't logged in yet or session expired
      if (!isJustRegistered) {
        setError('Unable to fetch live approval status. Please check your network or sign in.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStatus();
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const currentStatus = profile?.status || user?.resolverStatus || 'Pending';
  const rejectionReason = profile?.rejectionReason || user?.rejectionReason;

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold">
            CR
          </div>
          <span className="font-heading font-bold text-lg text-[#1E293B]">
            Crowd Report Resolver Portal
          </span>
        </div>

        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            leftIcon={<LogOut className="w-4 h-4 text-[#991B1B]" />}
            className="text-[#991B1B] hover:bg-[#FEE2E2]"
          >
            Sign Out
          </Button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto py-12 px-4 sm:px-6">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#64748B]">Checking verification status...</p>
          </div>
        ) : currentStatus === 'Approved' ? (
          <Card className="text-center p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
                Account Approved!
              </h1>
              <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto">
                Congratulations, your credentials and territory have been verified by municipal operations. You can now accept local repair assignments.
              </p>
            </div>
            <Link to="/resolver">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Resolver Workspace
              </Button>
            </Link>
          </Card>
        ) : currentStatus === 'Rejected' ? (
          <Card className="p-8 space-y-6 border-rose-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-heading font-bold text-[#1E293B]">
                    Application Not Approved
                  </h1>
                  <StatusBadge status="Rejected" size="sm" />
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Your contractor registration was reviewed and could not be approved at this time.
                </p>
              </div>
            </div>

            {/* Rejection Details Box */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm space-y-2">
              <div className="font-semibold text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Administrative Feedback:</span>
              </div>
              <p className="text-rose-800 text-sm pl-6 whitespace-pre-wrap">
                {rejectionReason || 'No specific rejection reason provided. The ID proof may have been unreadable or invalid.'}
              </p>
            </div>

            <div className="text-xs text-[#64748B] space-y-1">
              <p>Common reasons for rejection include:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Blurry, cropped, or expired government identity proof.</li>
                <li>Mismatch between full legal name and uploaded ID.</li>
                <li>Selected service territory outside supported municipal boundaries.</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]">
              <a
                href={`mailto:support@crowdreport.gov?subject=Resolver Application Appeal - ${registeredEmail || ''}`}
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Municipal Support</span>
              </a>

              <Link to="/register-resolver">
                <Button variant="primary">
                  Submit New Application
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Pending State */
          <div className="space-y-6">
            <Card className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl font-heading font-bold text-[#1E293B]">
                      Application Under Review
                    </h1>
                    <StatusBadge status="Pending" size="sm" />
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Your contractor credentials and government ID document have been securely transmitted to the municipal administration team.
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-[#EDE9FE]/50 border border-[#DDD6FE] text-xs text-[#312E81] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-[#1E293B] mb-0.5">
                    What happens next?
                  </div>
                  <p className="text-[#475569]">
                    An administrator will verify your trade skills and inspect your government ID proof via our secure authenticated vault. You will receive an email confirmation at <span className="font-semibold text-[#1E293B]">{registeredEmail || 'your registered email'}</span> once approved.
                  </p>
                </div>
              </div>

              {/* Submitted Details Snapshot */}
              {profile && (
                <div className="border border-[#E2E8F0] rounded-xl p-4 bg-[#F8F7FC] space-y-3 text-xs">
                  <div className="font-semibold text-[#1E293B] uppercase tracking-wider text-[11px]">
                    Application Summary
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#475569]">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-[#1E293B]">Base Address: </span>
                        <span>{profile.serviceAddress}</span>
                        <div className="text-[11px] text-[#64748B]">
                          Radius: {profile.serviceRadiusKm} km coverage
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Layers className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-[#1E293B]">Selected Trades: </span>
                        <span>
                          {profile.skills?.length > 0
                            ? profile.skills.map((s) => s.name).join(', ')
                            : 'Civic Repairs'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  isLoading={isRefreshing}
                  leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                >
                  Check Live Status
                </Button>

                {!user && (
                  <Link to="/login">
                    <Button variant="primary" size="sm">
                      Sign In with Credentials
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#64748B] border-t border-[#E2E8F0] bg-white">
        Crowd Report Municipal Civic Platform &bull; Certified Resolver Program
      </footer>
    </div>
  );
};

export default PendingApproval;
