import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';

// Sample representative civic pins across zones for the public live map showcase
const PUBLIC_MAP_PINS = [
  { id: 'pin-1', code: 'DEL-2026-0814', lat: 28.6139, lng: 77.209, title: 'Storm Drain Desilting', zone: 'North', zoneColor: '#1D4ED8', state: 'Delhi', status: 'In Progress' },
  { id: 'pin-2', code: 'KA-2026-1042', lat: 12.9716, lng: 77.5946, title: 'Asphalt Pothole Restoration', zone: 'South', zoneColor: '#0E6E4C', state: 'Karnataka', status: 'Verified' },
  { id: 'pin-3', code: 'MH-2026-3091', lat: 19.076, lng: 72.8777, title: 'Streetlight Cable Rewiring', zone: 'West', zoneColor: '#0E7490', state: 'Maharashtra', status: 'In Progress' },
  { id: 'pin-4', code: 'WB-2026-4412', lat: 22.5726, lng: 88.3639, title: 'Culvert Reinforcement', zone: 'East', zoneColor: '#B54708', state: 'West Bengal', status: 'In Progress' },
  { id: 'pin-5', code: 'MP-2026-5201', lat: 23.2599, lng: 77.4126, title: 'Water Main Valve Repair', zone: 'Central', zoneColor: '#78350F', state: 'Madhya Pradesh', status: 'Verified' },
  { id: 'pin-6', code: 'AS-2026-6188', lat: 26.1445, lng: 91.7362, title: 'Floodgate Hydraulic Check', zone: 'Northeast', zoneColor: '#9F1239', state: 'Assam', status: 'In Progress' },
  { id: 'pin-7', code: 'TN-2026-7203', lat: 13.0827, lng: 80.2707, title: 'Pedestrian Crossing Repair', zone: 'South', zoneColor: '#0E6E4C', state: 'Tamil Nadu', status: 'Verified' },
  { id: 'pin-8', code: 'GJ-2026-8840', lat: 23.0225, lng: 72.5714, title: 'Sanitation Waste Clearance', zone: 'West', zoneColor: '#0E7490', state: 'Gujarat', status: 'In Progress' },
];

export const LiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [activePin, setActivePin] = useState<typeof PUBLIC_MAP_PINS[0] | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map centered over India
    const map = L.map(mapContainerRef.current, {
      center: [22.5, 79.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
    });
    mapRef.current = map;

    // Add Dark Mode Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom controls at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Render Markers with custom glowing pins
    const markerGroup = L.layerGroup().addTo(map);

    const updateMarkers = () => {
      markerGroup.clearLayers();

      const filtered =
        selectedZone === 'All'
          ? PUBLIC_MAP_PINS
          : PUBLIC_MAP_PINS.filter((p) => p.zone === selectedZone);

      filtered.forEach((pin) => {
        const icon = L.divIcon({
          className: 'custom-live-pin',
          html: `
            <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <span style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: ${pin.zoneColor}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <span style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: ${pin.zoneColor}; border: 2.5px solid #FFFFFF; box-shadow: 0 0 10px ${pin.zoneColor};"></span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([pin.lat, pin.lng], { icon });

        marker.on('click', () => {
          setActivePin(pin);
          map.panTo([pin.lat, pin.lng]);
        });

        markerGroup.addLayer(marker);
      });
    };

    updateMarkers();

    // Adjust map on resize
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
  }, [selectedZone]);

  const zones = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast'];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#071329] shadow-2xl">
      {/* Map Header Toolbar */}
      <div className="relative z-10 p-4 sm:p-5 border-b border-white/10 bg-[#0A1F44]/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-heading font-bold text-base sm:text-lg text-white">
              Live Pan-India Civic Resolution Map
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Viewing all 36 States &amp; UTs • Click any marker to view verified repair provenance
          </p>
        </div>

        {/* Zonal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {zones.map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedZone === zone
                  ? 'bg-accent text-navy shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="relative h-[480px] sm:h-[540px] w-full">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Floating Active Pin Card Overlay */}
        {activePin && (
          <div className="absolute top-4 left-4 z-[1000] max-w-xs sm:max-w-sm w-full bg-[#0A1F44]/95 border border-white/20 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-left animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: activePin.zoneColor }}
              >
                {activePin.zone} Zone
              </span>
              <button
                type="button"
                aria-label="Close pin details"
                onClick={() => setActivePin(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                &times;
              </button>
            </div>

            <h4 className="font-heading font-bold text-sm text-white mb-1">
              {activePin.title}
            </h4>
            <div className="flex items-center gap-1 text-xs text-slate-300 mb-2">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>{activePin.state}</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-slate-400">{activePin.code}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {activePin.status}
              </span>
              <Button
                to={`/track?code=${activePin.code}`}
                variant="accent"
                size="xs"
                rightIcon={<ExternalLink className="w-3 h-3" />}
              >
                Track Ticket
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[990] bg-[#0A1F44]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs text-slate-300 hidden sm:flex items-center gap-4 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
            <span>North</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E6E4C]" />
            <span>South</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B54708]" />
            <span>East</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E7490]" />
            <span>West</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#78350F]" />
            <span>Central</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9F1239]" />
            <span>Northeast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
