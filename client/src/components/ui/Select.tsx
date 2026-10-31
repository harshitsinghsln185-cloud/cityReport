import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options = [],
  placeholder,
  children,
  id,
  name,
  required = false,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const selectId = id || name || Math.random().toString(36).substring(7);
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-bold text-slate-900 tracking-tight mb-2 select-none"
        >
          {label} {required && <span className="text-red-600 font-semibold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl">
        <select
          ref={ref}
          id={selectId}
          name={name}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            block w-full rounded-xl text-sm sm:text-base bg-white border transition-all duration-200 h-12 min-h-[48px]
            text-slate-900 font-medium pr-11 pl-4 py-3 cursor-pointer appearance-none
            focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${
              error
                ? 'border-red-500 text-red-900 focus:border-red-600 focus:ring-red-100'
                : 'border-slate-200 hover:border-slate-300'
            }
          `.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-slate-400">
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled} className="text-slate-900">
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
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

Select.displayName = 'Select';

export default Select;
