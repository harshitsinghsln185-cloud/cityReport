import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  id,
  name,
  required = false,
  className = '',
  disabled = false,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || name || Math.random().toString(36).substring(7);
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-bold text-slate-900 tracking-tight mb-2 select-none"
        >
          {label} {required && <span className="text-red-600 font-semibold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl">
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          disabled={disabled}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            block w-full rounded-xl text-sm sm:text-base bg-white border transition-all duration-200
            placeholder:text-slate-400 text-slate-900 font-medium p-4
            focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${
              error
                ? 'border-red-500 text-red-900 focus:border-red-600 focus:ring-red-100'
                : 'border-slate-200 hover:border-slate-300'
            }
          `.trim()}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export default Textarea;

