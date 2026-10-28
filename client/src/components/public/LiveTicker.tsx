import React, { useState, useEffect } from 'react';
import { MapPin, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

interface FeedItem {
  id: string;
  category: string;
  location: string;
  timeAgo: string;
  status: string;
}

export const LiveTicker: React.FC = () => {
  const [events, setEvents] = useState<FeedItem[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicEvents = async () => {
      try {
        // Attempt to fetch real public events if endpoint is available
        const res: any = await api.get('/issues/public', { params: { limit: 6 } });
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (isMounted && list.length > 0) {
          const mapped: FeedItem[] = list.map((item: any, idx: number) => ({
            id: item._id || item.issueCode || String(idx),
            category: item.category?.name || item.title || 'Civic Repair',
            location: item.address?.city ? `${item.address.city}` : 'Reported Location',
            timeAgo: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
            status: item.status || 'Active',
          }));
          setEvents(mapped);
        }
      } catch {
        // When no unauthenticated public events endpoint exists, hide ticker cleanly
        if (isMounted) setEvents([]);
      }
    };

    fetchPublicEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  // If no real public events exist or endpoint failed, hide ticker completely
  if (events.length === 0) {
    return null;
  }

  const event = events[currentEventIndex];

  return (
    <section className="bg-surface border-y border-border py-4 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                  <span className="hidden sm:inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-xs">
                    {event.status}
                  </span>
                  <span className="text-xs text-muted ml-auto shrink-0 tabular-nums">{event.timeAgo}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveTicker;
