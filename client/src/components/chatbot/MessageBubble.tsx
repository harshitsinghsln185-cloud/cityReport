import React from 'react';
import { Bot, User as UserIcon } from 'lucide-react';
import { ChatMessage } from '../../services/chat.service';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const formatTime = (ts?: string) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Simple Markdown renderer for bold, lists, and headings
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-heading font-bold text-sm text-[#1E293B] mt-1 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }

      // Bullet points
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const itemText = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5">
            <span className="text-[#7C3AED] font-bold">•</span>
            <span>{renderInlineStyles(itemText)}</span>
          </div>
        );
      }

      // Standard line
      return (
        <p key={idx} className={idx > 0 && line.trim() ? 'mt-1' : ''}>
          {renderInlineStyles(line)}
        </p>
      );
    });
  };

  const renderInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className={isUser ? 'font-bold text-white' : 'font-bold text-[#1E293B]'}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex items-end gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED] shrink-0 mb-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[82%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all ${
            isUser
              ? 'bg-[#7C3AED] text-white rounded-br-xs shadow-[#7C3AED]/15'
              : 'bg-white text-[#1E293B] border border-[#E2E8F0] rounded-bl-xs'
          }`}
        >
          {renderFormattedText(message.content)}
        </div>

        {message.timestamp && (
          <span className="text-[10px] text-[#94A3B8] mt-1 px-1">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shrink-0 mb-1">
          <UserIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
