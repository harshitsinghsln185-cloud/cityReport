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
      className={`bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden ${
        isInteractive ? 'hover:shadow-md hover:border-[#7C3AED]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8F7FC]/80">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#F8F7FC]/80">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
