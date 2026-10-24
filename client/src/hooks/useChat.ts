import { useState, useEffect, useCallback } from 'react';
import chatService, { ChatSession, ChatMessage, SubmitResponse } from '../services/chat.service';

const SESSION_STORAGE_KEY = 'crowd_report_chat_session_id';

export const useChat = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<SubmitResponse | null>(null);

  // Initialize or resume session
  const initSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedId = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedId) {
        try {
          const existing = await chatService.getSession(storedId);
          setSession(existing);
          setIsLoading(false);
          return existing;
        } catch {
          // If session expired or invalid, clear and create new
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }

      const newSession = await chatService.createSession();
      localStorage.setItem(SESSION_STORAGE_KEY, newSession._id);
      setSession(newSession);
      setIsLoading(false);
      return newSession;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start chat session');
      setIsLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (isOpen && !session) {
      initSession();
    }
  }, [isOpen, session, initSession]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    let currentSession = session;
    if (!currentSession) {
      currentSession = await initSession();
      if (!currentSession) return;
    }

    // Optimistically add user message to feed
    const tempUserMsg: ChatMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setSession((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, tempUserMsg],
          }
        : null
    );

    try {
      setIsLoading(true);
      setError(null);
      const res = await chatService.sendMessage(currentSession._id, text.trim());

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: res.reply,
        quickReplies: res.quickReplies,
        timestamp: new Date().toISOString(),
      };

      setSession((prev) =>
        prev
          ? {
              ...prev,
              state: res.state,
              draft: res.draft,
              messages: [...prev.messages, assistantMsg],
            }
          : null
      );
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Failed to deliver message. Please retry.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!session || isLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      const updatedSession = await chatService.uploadImage(session._id, file);
      setSession(updatedSession);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Photo upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const submitDraft = async (): Promise<SubmitResponse | null> => {
    if (!session || isSubmitting) return null;
    try {
      setIsSubmitting(true);
      setError(null);
      const res = await chatService.submitDraft(session._id);
      setSubmittedResult(res);

      // Refresh session
      const refreshed = await chatService.getSession(session._id);
      setSession(refreshed);
      return res;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Issue submission failed';
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSession = async () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setSubmittedResult(null);
    setError(null);
    await initSession();
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return {
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
  };
};

export default useChat;
