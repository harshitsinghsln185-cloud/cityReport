import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while retrieving this information. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  icon = null,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-card bg-red-50/50 border border-red-200/80 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 mb-4 shrink-0 shadow-xs">
        {icon || <AlertCircle className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="bg-white hover:bg-slate-50"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
