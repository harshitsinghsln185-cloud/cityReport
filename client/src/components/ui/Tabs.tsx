import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  count?: number | string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pill' | 'underline' | 'segmented';
  className?: string;
  ariaLabel?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = '',
  ariaLabel = 'Navigation tabs',
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.id === tabs[index].id);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = enabledTabs[(currentIndex + 1) % enabledTabs.length];
      if (nextTab) onChange(nextTab.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = enabledTabs[(currentIndex - 1 + enabledTabs.length) % enabledTabs.length];
      if (prevTab) onChange(prevTab.id);
    }
  };

  if (variant === 'segmented') {
    return (
      <div
        ref={tabListRef}
        role="tablist"
        aria-label={ariaLabel}
        className={`inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 ${className}`}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`
                relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors select-none
                flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isActive ? 'text-ink font-semibold' : 'text-muted hover:text-ink'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="segmented-tab-active"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums font-semibold ${
                      isActive ? 'bg-lavender text-primary' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div
        ref={tabListRef}
        role="tablist"
        aria-label={ariaLabel}
        className={`flex items-center gap-6 border-b border-border ${className}`}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`
                relative pb-3 text-sm font-medium transition-colors select-none
                flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t
                ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isActive ? 'text-primary font-semibold' : 'text-muted hover:text-ink'}
              `}
            >
              <span className="flex items-center gap-1.5">
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums font-semibold ${
                      isActive ? 'bg-lavender text-primary' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <motion.div
                  layoutId="underline-tab-active"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'pill' variant
  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`
              relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all select-none
              flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0
              ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-border text-secondaryText hover:text-ink hover:bg-canvas'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
