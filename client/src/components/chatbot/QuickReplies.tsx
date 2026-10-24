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
                ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-sm shadow-[#7C3AED]/20 border border-[#7C3AED]'
                : 'bg-[#EDE9FE]/70 text-[#6D28D9] hover:bg-[#DDD6FE] border border-[#DDD6FE]/80 hover:border-[#C4B5FD]'
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
