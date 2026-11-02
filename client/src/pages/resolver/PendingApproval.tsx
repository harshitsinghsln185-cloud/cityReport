import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from '../../components/ui/Logo';
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
  Building2,
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
    <div className="min-h-screen bg-canvas flex flex-col justify-between">
      {/* Top Bar */}
      <header className="h-16 bg-card border-b border-border/80 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
          <Logo variant="horizontal" size="sm" subtitle="Resolver Verification Portal" />
        </Link>

        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            leftIcon={<LogOut className="w-4 h-4 text-rose-700" />}
            className="text-rose-700 hover:bg-rose-50 text-xs"
          >
            Sign Out
          </Button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto py-12 px-4 sm:px-6">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-sm flex items-center gap-2.5 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-secondaryText">Checking contractor credential status...</p>
          </div>
        ) : currentStatus === 'Approved' ? (
          <Card className="text-center p-8 space-y-6 border border-emerald-300 bg-card rounded-card shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
                Contractor Credentials Approved!
              </h1>
              <p className="text-sm text-secondaryText mt-2 max-w-md mx-auto leading-relaxed">
                Congratulations, your credentials, trade qualifications, and service territory have been verified by municipal operations. You can now accept local repair assignments.
              </p>
            </div>
            <Button to="/resolver" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-sm">
                Enter Resolver Workspace
              </Button>
          </Card>
        ) : currentStatus === 'Rejected' ? (
          <Card className="p-8 space-y-6 border-rose-300 bg-card rounded-card shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink">
                    Application Not Approved
                  </h1>
                  <StatusBadge status="Rejected" size="sm" />
                </div>
                <p className="text-xs text-secondaryText mt-1">
                  Your contractor registration was reviewed and could not be approved at this time.
                </p>
              </div>
            </div>

            {/* Rejection Details Box */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm space-y-2">
              <div className="font-semibold text-rose-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Administrative Feedback:</span>
              </div>
              <p className="text-rose-900 text-xs pl-6 whitespace-pre-wrap leading-relaxed font-mono">
                {rejectionReason || 'No specific rejection reason provided. The government ID document or trade credentials may have been unreadable or invalid.'}
              </p>
            </div>

            <div className="text-xs text-secondaryText space-y-1.5 leading-relaxed bg-canvas p-4 rounded-xl border border-border">
              <p className="font-semibold text-ink">Common reasons for registration rejection:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Blurry, cropped, or expired government identity proof.</li>
                <li>Mismatch between full legal name and uploaded ID documentation.</li>
                <li>Selected operating territory outside currently supported cities or service zones.</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <a
                href={`mailto:support@crowdreport.gov?subject=Resolver Application Appeal - ${registeredEmail || ''}`}
                className="text-xs font-semibold text-primary hover:text-primaryHover transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Municipal Operations Support</span>
              </a>

              <Button to="/register-resolver" variant="primary" size="sm" className="shadow-xs">
                  Submit Corrected Application
                </Button>
            </div>
          </Card>
        ) : (
          /* Pending State */
          <div className="space-y-6">
            <Card className="p-8 space-y-6 border border-border/80 bg-card rounded-card shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink">
                      Contractor Credentials Under Review
                    </h1>
                    <StatusBadge status="Pending" size="sm" />
                  </div>
                  <p className="text-xs text-secondaryText mt-1 leading-relaxed">
                    Your credentials, operating base, and government ID document have been securely transmitted to the municipal administration review queue.
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-ink flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-ink mb-0.5">
                    What happens during review?
                  </div>
                  <p className="text-secondaryText leading-relaxed">
                    A municipal administrator will verify your trade classifications and inspect your identity proof. You will receive an email confirmation at <span className="font-semibold font-mono text-ink">{registeredEmail || 'your registered email'}</span> once verification is signed off.
                  </p>
                </div>
              </div>

              {/* Submitted Details Snapshot */}
              {profile && (
                <div className="border border-border rounded-xl p-4 bg-canvas space-y-3 text-xs">
                  <div className="font-semibold text-ink uppercase tracking-wider text-xs font-mono">
                    Application Summary
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-secondaryText">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-ink">Registered Base: </span>
                        <span>{profile.serviceAddress}</span>
                        <div className="text-xs text-secondaryText font-mono mt-0.5">
                          Radius: {profile.serviceRadiusKm} km coverage
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Layers className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-ink">Selected Trade Skills: </span>
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
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  isLoading={isRefreshing}
                  leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                  className="text-xs"
                >
                  Check Live Approval Status
                </Button>

                {!user && (
                  <Button to="/login" variant="primary" size="sm" className="shadow-xs text-xs">
                      Sign In with Credentials
                    </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-secondaryText border-t border-border/80 bg-card">
        <div className="flex items-center justify-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span>Crowd Report Municipal Civic Platform &bull; Certified Resolver Program</span>
        </div>
      </footer>
    </div>
  );
};

export default PendingApproval;
