import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  id,
  name,
  type = 'text',
  leftIcon = null,
  rightIcon = null,
  showPasswordToggle = false,
  required = false,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || Math.random().toString(36).substring(7);
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const isPassword = type === 'password';
  const effectiveType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-ink mb-1.5"
        >
          {label} {required && <span className="text-red-700">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-xs">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={effectiveType}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            block w-full rounded-lg text-xs sm:text-sm bg-white border transition-all duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:bg-canvas disabled:text-muted disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightIcon || (isPassword && showPasswordToggle) ? 'pr-10' : 'pr-3.5'}
            py-2.5
            ${
              error
                ? 'border-red-600 text-red-900 focus:border-red-600 focus-visible:ring-red-200'
                : 'border-border text-ink focus:border-primary focus-visible:ring-primary/20'
            }
          `.trim()}
          {...props}
        />

        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-ink focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : rightIcon ? (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted">
            {rightIcon}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-700 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1 text-xs text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
