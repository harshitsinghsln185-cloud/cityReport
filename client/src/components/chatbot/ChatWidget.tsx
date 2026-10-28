import React from 'react';
import { MessageSquareText, Sparkles, X } from 'lucide-react';
import useChat from '../../hooks/useChat';
import ChatWindow from './ChatWindow';

export const ChatWidget: React.FC = () => {
  const {
    isOpen,
    session,
    isLoading,
    isSubmitting,
    error,
    submittedResult,
    toggleOpen,
    setIsOpen,
    sendMessage,
    uploadPhoto,
    submitDraft,
    resetSession,
  } = useChat();

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={toggleOpen}
          aria-label={isOpen ? 'Close Civic AI Assistant' : 'Open Civic AI Assistant'}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 transform active:scale-90 ${
            isOpen
              ? 'bg-ink hover:bg-slate-800 shadow-slate-900/20 rotate-90'
              : 'bg-gradient-to-tr from-primary to-primary-hover shadow-primary/30 hover:shadow-primary/45 hover:scale-105'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <>
              <MessageSquareText className="w-6 h-6 transition-transform group-hover:scale-110" />
              {/* Subtle pulsing AI indicator */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-white items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-navy" />
                </span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Slide-Up Dialog Window */}
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        session={session}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        error={error}
        submittedResult={submittedResult}
        onSendMessage={sendMessage}
        onUploadPhoto={uploadPhoto}
        onSubmitDraft={submitDraft}
        onReset={resetSession}
      />
    </>
  );
};

export default ChatWidget;
