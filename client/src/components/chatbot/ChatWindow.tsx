import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  X,
  RotateCcw,
  Send,
  Paperclip,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickReplies from './QuickReplies';
import ChatLocationPicker from './ChatLocationPicker';
import { ChatSession, SubmitResponse } from '../../services/chat.service';
import Button from '../ui/Button';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  session: ChatSession | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submittedResult: SubmitResponse | null;
  onSendMessage: (text: string) => Promise<void>;
  onUploadPhoto: (file: File) => Promise<void>;
  onSubmitDraft: () => Promise<SubmitResponse | null>;
  onReset: () => Promise<void>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  session,
  isLoading,
  isSubmitting,
  error,
  submittedResult,
  onSendMessage,
  onUploadPhoto,
  onSubmitDraft,
  onReset,
}) => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState<string>('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, isLoading]);

  // Focus input on open & Esc key handler
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isLocationModalOpen) {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isLocationModalOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const handleQuickReplySelect = async (option: string) => {
    if (option === 'Drop Pin on Map' || option === 'Change Location') {
      setIsLocationModalOpen(true);
      return;
    }

    if (option === 'Attach Photo' || option === 'Upload Photo') {
      fileInputRef.current?.click();
      return;
    }

    if (option === 'Submit Issue') {
      const res = await onSubmitDraft();
      if (res?.issue) {
        // Handled in submitted view
      }
      return;
    }

    if (option === 'Sign In') {
      onClose();
      navigate('/login');
      return;
    }

    if (option === 'View My Issues') {
      onClose();
      navigate('/user/issues');
      return;
    }

    if (option === 'Start Over' || option === 'Reset') {
      await onReset();
      return;
    }

    await onSendMessage(option);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadPhoto(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLocationConfirm = async (
    coords: [number, number],
    address: { street: string; city: string; pincode: string }
  ) => {
    const locText = `${address.street}, ${address.city} [${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}]`;
    await onSendMessage(`Location set to: ${locText}`);
  };

  const latestQuickReplies =
    session?.messages && session.messages.length > 0
      ? session.messages[session.messages.length - 1].quickReplies || []
      : [];

  return (
    <>
      <div
        role="dialog"
        aria-label="Civic AI Assistant"
        className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] h-[560px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#171A3B] via-[#312E81] to-[#7C3AED] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#171A3B]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-bold text-sm leading-tight text-white">Civic Assistant</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/15 text-white/90 font-medium">
                  AI Powered
                </span>
              </div>
              <p className="text-[11px] text-white/70">Municipal Issue Reporting</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onReset}
              title="Reset Conversation"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close Assistant"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div
          aria-live="polite"
          className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-[#F8F7FC] scroll-smooth"
        >
          {session?.messages?.map((msg, i) => (
            <MessageBubble key={msg._id || i} message={msg} />
          ))}

          {/* Submitted Issue Action Banner */}
          {(submittedResult || session?.state === 'SUBMITTED') && (
            <div className="my-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs">
              <div className="flex items-start gap-2 text-emerald-800 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-900">
                    Report Filed Successfully
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Track resolution or complete advance payment in your citizen portal.
                  </p>
                </div>
              </div>

              {submittedResult?.issue?._id && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/user/checkout/${submittedResult.issue._id}`);
                  }}
                  className="w-full mt-2 py-2 px-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Proceed to Advance Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#64748B] py-2 px-2">
              <div className="w-6 h-6 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="my-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Bar */}
        {latestQuickReplies.length > 0 && !isLoading && (
          <div className="border-t border-[#E2E8F0]/80 bg-white/95 px-3 py-1">
            <QuickReplies
              options={latestQuickReplies}
              onSelect={handleQuickReplySelect}
              disabled={isLoading || isSubmitting}
            />
          </div>
        )}

        {/* Footer Input */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Photo"
            disabled={isLoading || isSubmitting || session?.state === 'SUBMITTED'}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#7C3AED] hover:bg-[#EDE9FE] transition-colors disabled:opacity-40"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            title="Pin Location on Map"
            disabled={isLoading || isSubmitting || session?.state === 'SUBMITTED'}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#7C3AED] hover:bg-[#EDE9FE] transition-colors disabled:opacity-40"
          >
            <MapPin className="w-4 h-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              session?.state === 'SUBMITTED' ? 'Issue submitted' : 'Type your message or query...'
            }
            disabled={isLoading || isSubmitting || session?.state === 'SUBMITTED'}
            maxLength={500}
            className="flex-1 px-3 py-2 text-xs bg-[#F8F7FC] rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#1E293B] disabled:opacity-60"
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputText.trim() || isLoading || isSubmitting || session?.state === 'SUBMITTED'}
            className="p-2 rounded-xl"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>

      {/* Map Pin Picker Modal */}
      <ChatLocationPicker
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
        initialCoords={session?.draft?.coordinates || [77.209, 28.6139]}
      />
    </>
  );
};

export default ChatWindow;
