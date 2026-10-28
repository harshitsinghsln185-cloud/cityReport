import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickRepliesProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ options = [], onSelect, disabled = false }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 py-2 px-1">
      {options.map((option, index) => {
        const isHighlight =
          option.includes('Submit') ||
          option.includes('Report an Issue') ||
          option.includes('Sign In');

        return (
          <button
            key={`${option}-${index}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
              isHighlight
                ? 'bg-primary text-white hover:bg-primary-hover shadow-sm border border-primary'
                : 'bg-primary-light text-primary hover:bg-primary-light/80 border border-primary/20'
            }`}
          >
            {isHighlight && <Sparkles className="w-3 h-3 text-white/90" />}
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickReplies;
