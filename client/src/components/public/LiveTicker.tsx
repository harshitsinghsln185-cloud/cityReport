import React, { useState, useEffect } from 'react';
import { CheckCircle2, MapPin, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedItem {
  id: string;
  category: string;
  location: string;
  timeAgo: string;
  status: string;
  amount: string;
}

const LIVE_EVENTS: FeedItem[] = [
  { id: '1', category: 'Road Resurfacing', location: 'Indiranagar, Bengaluru (KA)', timeAgo: '2m ago', status: 'Photo Verified', amount: '₹14,250' },
  { id: '2', category: 'High-Mast Streetlight', location: 'Salt Lake Sector V, Kolkata (WB)', timeAgo: '6m ago', status: 'Closed & Paid', amount: '₹3,400' },
  { id: '3', category: 'Storm Water Drain Unblock', location: 'Andheri East, Mumbai (MH)', timeAgo: '11m ago', status: 'Advance Escrowed', amount: '₹8,900' },
  { id: '4', category: 'Potable Water Pipeline', location: 'Banjara Hills, Hyderabad (TG)', timeAgo: '17m ago', status: 'Inspector Approved', amount: '₹6,150' },
  { id: '5', category: 'Solid Waste Clearance', location: 'Connaught Place, New Delhi (DL)', timeAgo: '24m ago', status: 'Completed', amount: '₹2,800' },
  { id: '6', category: 'Traffic Signal Wiring', location: 'T. Nagar, Chennai (TN)', timeAgo: '31m ago', status: 'Photo Verified', amount: '₹4,500' },
];

export const LiveTicker: React.FC = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const event = LIVE_EVENTS[currentEventIndex];

  return (
    <section className="bg-white border-y border-border py-4 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Live Feed Pill & Ticker */}
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider shrink-0 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Civic Feed</span>
            </div>

            <div className="h-7 overflow-hidden relative flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-xs sm:text-sm text-secondaryText truncate"
                >
                  <span className="font-semibold text-ink truncate">{event.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-muted flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    {event.location}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    {event.status}
                  </span>
                  <span className="text-xs text-muted ml-auto shrink-0 tabular-nums font-mono">{event.timeAgo}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted">Total Resolved:</span>
              <span className="font-heading font-bold text-ink text-sm tabular-nums">12,480+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-muted">Coverage:</span>
              <span className="font-heading font-bold text-ink text-sm tabular-nums">36 States/UTs</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-muted">Verified SLA:</span>
              <span className="font-heading font-bold text-ink text-sm tabular-nums">99.4%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveTicker;
