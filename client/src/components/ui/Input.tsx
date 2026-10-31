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
          className="block text-sm font-bold text-slate-900 tracking-tight mb-2 select-none"
        >
          {label} {required && <span className="text-red-600 font-semibold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
            block w-full rounded-xl text-sm sm:text-base bg-white border transition-all duration-200 h-12 min-h-[48px]
            placeholder:text-slate-400 text-slate-900 font-medium
            focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${rightIcon || (isPassword && showPasswordToggle) ? 'pr-11' : 'pr-4'}
            py-3
            ${
              error
                ? 'border-red-500 text-red-900 focus:border-red-600 focus:ring-red-100'
                : 'border-slate-200 hover:border-slate-300'
            }
          `.trim()}
          {...props}
        />

        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : rightIcon ? (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            {rightIcon}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-slate-500 font-normal">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
