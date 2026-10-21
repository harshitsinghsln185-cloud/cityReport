import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  header = null,
  footer = null,
  isInteractive = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-[#E5E2DA] rounded-xl shadow-sm overflow-hidden ${
        isInteractive ? 'hover:shadow-md hover:border-slate-300 transition-all cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-[#E5E2DA] bg-slate-50/50">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3 border-t border-[#E5E2DA] bg-slate-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
