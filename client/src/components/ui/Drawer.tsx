import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    right: {
      sm: 'max-w-xs',
      md: 'max-w-md',
      lg: 'max-w-xl',
      full: 'max-w-full',
    },
    left: {
      sm: 'max-w-xs',
      md: 'max-w-md',
      lg: 'max-w-xl',
      full: 'max-w-full',
    },
    bottom: {
      sm: 'max-h-[30vh]',
      md: 'max-h-[50vh]',
      lg: 'max-h-[80vh]',
      full: 'max-h-full',
    },
  }[side][size];

  const sideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      position: 'right-0 top-0 bottom-0 h-full w-full border-l',
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      position: 'left-0 top-0 bottom-0 h-full w-full border-r',
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      position: 'left-0 right-0 bottom-0 w-full border-t rounded-t-2xl',
    },
  }[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={sideVariants.initial}
            animate={sideVariants.animate}
            exit={sideVariants.exit}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`
              fixed ${sideVariants.position} ${sizeClasses}
              bg-white border-border shadow-modal z-10 flex flex-col
              ${className}
            `.trim()}
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between px-6 py-4 border-b border-border">
                <div>
                  {title && (
                    <h3 className="font-heading font-semibold text-lg text-ink">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="mt-0.5 text-xs text-muted">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-muted hover:text-ink hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-3.5 bg-canvas/80 border-t border-border flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
