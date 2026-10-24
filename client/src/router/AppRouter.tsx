import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Button from '../components/ui/Button';
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
import AdminDashboard from '../pages/admin/Dashboard';
import AdminIssuesPage from '../pages/admin/Issues';
import AdminIssueDetailsPage from '../pages/admin/IssueDetails';
import AdminUsersPage from '../pages/admin/Users';
import FinanceOverview from '../pages/admin/FinanceOverview';
import AdminPayments from '../pages/admin/Payments';
import AdminPayouts from '../pages/admin/Payouts';
import AdminQueries from '../pages/admin/Queries';
import Home from '../pages/public/Home';
import Services from '../pages/public/Services';
import StatesDirectory from '../pages/public/StatesDirectory';
import StateDetail from '../pages/public/StateDetail';
import About from '../pages/public/About';
import TrackStatus from '../pages/public/TrackStatus';
import WriteQuery from '../pages/public/WriteQuery';
import ResolverEarnings from '../pages/resolver/Earnings';
import ProfilePage from '../pages/user/Profile';
import UserDashboard from '../pages/user/UserDashboard';
import ReportIssue from '../pages/user/ReportIssue';
import MyIssues from '../pages/user/MyIssues';
import IssueDetails from '../pages/user/IssueDetails';
import Checkout from '../pages/user/Checkout';
import Payments from '../pages/user/Payments';
import RegisterResolver from '../pages/auth/RegisterResolver';
import PendingApproval from '../pages/resolver/PendingApproval';
import ResolverProfilePage from '../pages/resolver/Profile';
import ResolverDashboard from '../pages/resolver/Dashboard';
import ResolverAssignmentsPage from '../pages/resolver/Assignments';
import ResolverTasksPage from '../pages/resolver/Tasks';
import ResolverTaskDetailsPage from '../pages/resolver/TaskDetails';
import ResolverCompletedHistoryPage from '../pages/resolver/CompletedHistory';
import NotificationsPage from '../pages/shared/Notifications';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'states',
        element: <StatesDirectory />,
      },
      {
        path: 'states/:slug',
        element: <StateDetail />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'track',
        element: <TrackStatus />,
      },
      {
        path: 'query',
        element: <WriteQuery />,
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
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: 'report-issue',
        element: <ReportIssue />,
      },
      {
        path: 'issues',
        element: <MyIssues />,
      },
      {
        path: 'issues/:id',
        element: <IssueDetails />,
      },
      {
        path: 'checkout/:issueId',
        element: <Checkout />,
      },
      {
        path: 'payments',
        element: <Payments />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
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
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <ResolverDashboard />,
      },
      {
        path: 'assignments',
        element: <ResolverAssignmentsPage />,
      },
      {
        path: 'tasks',
        element: <ResolverTasksPage />,
      },
      {
        path: 'tasks/:id',
        element: <ResolverTaskDetailsPage />,
      },
      {
        path: 'history',
        element: <ResolverCompletedHistoryPage />,
      },
      {
        path: 'earnings',
        element: <ResolverEarnings />,
      },
      {
        path: 'profile',
        element: <ResolverProfilePage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
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
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'issues',
        element: <AdminIssuesPage />,
      },
      {
        path: 'issues/:id',
        element: <AdminIssueDetailsPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'resolvers',
        element: <ResolverRequestsPage />,
      },
      {
        path: 'finance',
        element: <FinanceOverview />,
      },
      {
        path: 'finance/payments',
        element: <AdminPayments />,
      },
      {
        path: 'payments',
        element: <AdminPayments />,
      },
      {
        path: 'finance/payouts',
        element: <AdminPayouts />,
      },
      {
        path: 'payouts',
        element: <AdminPayouts />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'fee-settings',
        element: <FeeSettingsPage />,
      },
      {
        path: 'queries',
        element: <AdminQueries />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
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
