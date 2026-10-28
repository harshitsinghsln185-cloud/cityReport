import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from './Button';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred while loading this page. Please try again.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page Not Found';
      message = 'The page you are looking for does not exist or has been relocated.';
    } else {
      title = `${error.status} ${error.statusText || 'Error'}`;
      message = error.data?.message || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-card-border shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full border border-primary/20">
          Application Notice
        </span>

        <h1 className="text-2xl font-heading font-extrabold text-ink mt-4 mb-2">
          {title}
        </h1>

        <p className="text-sm text-muted mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Page</span>
          </Button>

          <Button to="/" variant="outline"
              className="w-full sm:w-auto w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              <span>Back Home</span>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
