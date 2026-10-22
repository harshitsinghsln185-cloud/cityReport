import React from 'react';
import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from './ui/Card';
import Button from './ui/Button';
import { ShieldAlert, Loader2 } from 'lucide-react';

export interface ProtectedRouteProps {
  allowedRoles?: Array<'User' | 'Resolver' | 'Admin'>;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED] mb-3" />
        <p className="text-sm font-medium text-[#64748B]">Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <Card className="text-center p-8">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">
            403 - Access Denied
          </h2>
          <p className="text-sm text-[#64748B] mb-6">
            Your account role (<span className="font-semibold text-[#1E293B]">{role}</span>) does not have authorization to view this section.
          </p>
          <div className="flex justify-center gap-3">
            <Link to={role === 'Admin' ? '/admin' : role === 'Resolver' ? '/resolver' : '/user'}>
              <Button variant="primary">Go to My Dashboard</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
