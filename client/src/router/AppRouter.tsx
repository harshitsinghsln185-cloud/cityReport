import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import ResolverLayout from '../layouts/ResolverLayout';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/auth/Login';
import RegisterUser from '../pages/auth/RegisterUser';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import CategoriesPage from '../pages/admin/Categories';
import FeeSettingsPage from '../pages/admin/FeeSettings';
import ResolverRequestsPage from '../pages/admin/ResolverRequests';
import ProfilePage from '../pages/user/Profile';
import RegisterResolver from '../pages/auth/RegisterResolver';
import PendingApproval from '../pages/resolver/PendingApproval';
import ResolverProfilePage from '../pages/resolver/Profile';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { ArrowRight, User, Wrench, ShieldAlert } from 'lucide-react';

interface PreviewAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'ghost';
}

interface WelcomePreviewProps {
  role: string;
  title: string;
  description: string;
  actions?: PreviewAction[];
}

// M0 Welcome / Dashboard Preview Component
const WelcomePreview: React.FC<WelcomePreviewProps> = ({ title, description, actions = [] }) => (
  <div className="max-w-4xl mx-auto py-8">
    <Card className="mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#EDE9FE] text-[#7C3AED] border border-[#A78BFA]/30">
              Module M0 Foundation Active (TypeScript)
            </span>
            <StatusBadge status="Resolved" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B] mb-2">
            {title}
          </h1>
          <p className="text-[#64748B] text-sm max-w-xl">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {actions.map((act) => (
            <Link key={act.label} to={act.href}>
              <Button variant={act.variant || 'primary'}>
                {act.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link to="/user">
        <Card isInteractive className="h-full">
          <div className="w-10 h-10 rounded-lg bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center mb-4">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#1E293B] mb-1">Citizen Portal</h3>
          <p className="text-xs text-[#64748B] mb-4">
            Report issues, track progress, manage quotes, and pay mock advance/balance.
          </p>
          <div className="text-xs font-semibold text-[#7C3AED] flex items-center gap-1">
            <span>Explore User Layout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>
      </Link>

      <Link to="/resolver">
        <Card isInteractive className="h-full">
          <div className="w-10 h-10 rounded-lg bg-[#EDE9FE] text-[#312E81] border border-[#DDD6FE] flex items-center justify-center mb-4">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#1E293B] mb-1">Resolver Console</h3>
          <p className="text-xs text-[#64748B] mb-4">
            Accept nearby assigned tasks, submit before/after photo proof, and track payouts.
          </p>
          <div className="text-xs font-semibold text-[#7C3AED] flex items-center gap-1">
            <span>Explore Resolver Layout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>
      </Link>

      <Link to="/admin">
        <Card isInteractive className="h-full">
          <div className="w-10 h-10 rounded-lg bg-[#171A3B] text-[#7C3AED] border border-[#312E81] flex items-center justify-center mb-4">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#1E293B] mb-1">Operations Admin</h3>
          <p className="text-xs text-[#64748B] mb-4">
            Verify resolvers, assign tasks, inspect proof, set fee parameters, and manage payouts.
          </p>
          <div className="text-xs font-semibold text-[#7C3AED] flex items-center gap-1">
            <span>Explore Admin Layout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>
      </Link>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <WelcomePreview
            role="Public"
            title="Crowd Report Platform"
            description="Civic engagement and issue resolution platform connecting citizens with certified local resolvers under municipal administrative governance."
            actions={[
              { label: 'Report an Issue', href: '/user/report-issue' },
              { label: 'Sign In', href: '/login', variant: 'outline' },
            ]}
          />
        ),
      },
      {
        path: 'services',
        element: (
          <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-heading font-bold text-[#1E293B] mb-4">Civic Services Directory</h1>
            <p className="text-[#64748B]">M0 placeholder: Services will be dynamically populated in M2 & M12.</p>
          </div>
        ),
      },
      {
        path: 'about',
        element: (
          <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-heading font-bold text-[#1E293B] mb-4">About Crowd Report</h1>
            <p className="text-[#64748B]">M0 placeholder: Platform background and municipal partnership details.</p>
          </div>
        ),
      },
      {
        path: 'track',
        element: (
          <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-heading font-bold text-[#1E293B] mb-4">Track Status</h1>
            <p className="text-[#64748B]">M0 placeholder: Public tracking by issue code (CR-YYYY-XXXXXX) implemented in M12.</p>
          </div>
        ),
      },
      {
        path: 'query',
        element: (
          <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-heading font-bold text-[#1E293B] mb-4">Write a Query</h1>
            <p className="text-[#64748B]">M0 placeholder: Public inquiry contact form implemented in M12.</p>
          </div>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <RegisterUser />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'register-resolver',
        element: <RegisterResolver />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
      },
    ],
  },
  {
    path: '/resolver/pending',
    element: <PendingApproval />,
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute allowedRoles={['User', 'Admin']}>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <WelcomePreview
            role="Citizen"
            title="Citizen Dashboard Overview"
            description="Track your civic issues, inspect quotes, review resolution proof, and manage payments."
            actions={[
              { label: 'Report Issue', href: '/user/report-issue' },
              { label: 'View My Issues', href: '/user/issues', variant: 'outline' },
            ]}
          />
        ),
      },
      {
        path: 'report-issue',
        element: (
          <div className="max-w-3xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Report a Civic Issue</h2>
              <p className="text-sm text-[#64748B]">Multi-step wizard with Leaflet map pin and quote snapshots implemented in M5.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'issues',
        element: (
          <div className="max-w-5xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">My Reported Issues</h2>
              <p className="text-sm text-[#64748B]">Paginated issue list with status filters implemented in M5.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'payments',
        element: (
          <div className="max-w-5xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Payments & Invoices</h2>
              <p className="text-sm text-[#64748B]">Advance orders, balance payments, and on-demand PDF receipts implemented in M6 & M9.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'notifications',
        element: (
          <div className="max-w-4xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Notifications Feed</h2>
              <p className="text-sm text-[#64748B]">Real-time notification bell and history implemented in M10.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/resolver',
    element: (
      <ProtectedRoute allowedRoles={['Resolver', 'Admin']}>
        <ResolverLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <WelcomePreview
            role="Resolver"
            title="Resolver Workspace"
            description="Manage your territory, accept new assignments, submit photo proof of completed repairs, and track payouts."
            actions={[
              { label: 'View Tasks', href: '/resolver/tasks' },
              { label: 'Check Earnings', href: '/resolver/earnings', variant: 'outline' },
            ]}
          />
        ),
      },
      {
        path: 'assignments',
        element: (
          <div className="max-w-4xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">New Task Offers</h2>
              <p className="text-sm text-[#64748B]">Proximity-based assignments with Accept/Decline triggers implemented in M8.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'tasks',
        element: (
          <div className="max-w-4xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Active Tasks in Progress</h2>
              <p className="text-sm text-[#64748B]">Work execution and before/after photo proof uploader implemented in M8.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'earnings',
        element: (
          <div className="max-w-4xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Contractor Earnings & Payouts</h2>
              <p className="text-sm text-[#64748B]">Commission breakdown and settlement history implemented in M9.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'profile',
        element: <ResolverProfilePage />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['Admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <WelcomePreview
            role="Admin"
            title="Operations Command Center"
            description="System-wide governance, resolver ID verification, candidate assignment, manual fee quoting, and financial settlements."
            actions={[
              { label: 'Manage Issues', href: '/admin/issues' },
              { label: 'Resolver Requests', href: '/admin/resolvers', variant: 'outline' },
            ]}
          />
        ),
      },
      {
        path: 'issues',
        element: (
          <div className="max-w-5xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Master Issue Queue</h2>
              <p className="text-sm text-[#64748B]">Triage, candidate search via $geoNear, and conditional assignment implemented in M7.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'resolvers',
        element: <ResolverRequestsPage />,
      },
      {
        path: 'finance',
        element: (
          <div className="max-w-5xl mx-auto py-6">
            <Card>
              <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Financial Turnover & CSV Export</h2>
              <p className="text-sm text-[#64748B]">GMV, platform commission, and CSV streaming implemented in M9.</p>
            </Card>
          </div>
        ),
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'fee-settings',
        element: <FeeSettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8F7FC]">
        <h1 className="text-5xl font-heading font-bold text-[#1E293B] mb-4">404</h1>
        <p className="text-lg text-[#64748B] mb-6">Page not found</p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    ),
  },
]);

export const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRouter;
