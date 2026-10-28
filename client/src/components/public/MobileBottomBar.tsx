import React, { useState, useEffect } from 'react';
import { PlusCircle, Wrench } from 'lucide-react';
import Button from '../ui/Button';

export const MobileBottomBar: React.FC = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Detect virtual keyboard on mobile devices using window.visualViewport
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const viewport = window.visualViewport;
    const initialHeight = window.innerHeight;

    const handleResize = () => {
      // If visualViewport height drops significantly (> 150px), keyboard is open
      const diff = initialHeight - viewport.height;
      setIsKeyboardOpen(diff > 150);
    };

    viewport.addEventListener('resize', handleResize);
    viewport.addEventListener('scroll', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
      viewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  if (isKeyboardOpen) return null;

  return (
    <aside
      aria-label="Mobile quick actions"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-card-border shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200"
    >
      <Button
        to="/user/report-issue"
        variant="accent"
        size="sm"
        isFullWidth
        className="font-bold flex items-center justify-center gap-1.5 shadow-sm"
      >
        <PlusCircle className="w-4 h-4 text-navy" />
        <span>Report an issue</span>
      </Button>

      <Button
        to="/register-resolver"
        variant="outline"
        size="sm"
        className="shrink-0 text-xs font-semibold px-3 flex items-center gap-1"
      >
        <Wrench className="w-3.5 h-3.5 text-primary" />
        <span>Become a resolver</span>
      </Button>
    </aside>
  );
};

export default MobileBottomBar;
