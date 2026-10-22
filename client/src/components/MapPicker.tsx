import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export interface MapPickerProps {
  lat: number;
  lng: number;
  onChange?: (lat: number, lng: number) => void;
  radiusKm?: number;
  height?: string;
  isReadOnly?: boolean;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  lat,
  lng,
  onChange,
  radiusKm = 10,
  height = '350px',
  isReadOnly = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  // Custom stylish pin icon matching Royal Indigo theme
  const createPinIcon = () => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #7C3AED;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 10px rgba(124, 58, 237, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 10px; height: 10px; background: #FFFFFF; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map instance
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 12,
      zoomControl: true,
    });
    mapRef.current = map;

    // OpenStreetMap standard tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Coverage Radius Circle
    const circle = L.circle([lat, lng], {
      radius: radiusKm * 1000,
      color: '#7C3AED',
      weight: 2,
      fillColor: '#EDE9FE',
      fillOpacity: 0.35,
    }).addTo(map);
    circleRef.current = circle;

    // Center Headquarters Pin
    const marker = L.marker([lat, lng], {
      icon: createPinIcon(),
      draggable: !isReadOnly,
    }).addTo(map);
    markerRef.current = marker;

    if (!isReadOnly && onChange) {
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onChange(position.lat, position.lng);
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      });
    }

    // Leaflet container resize adjustment
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Synchronize pin, circle, and view when coordinates or radius change
  useEffect(() => {
    if (mapRef.current && markerRef.current && circleRef.current) {
      const currentLatLng = markerRef.current.getLatLng();
      if (currentLatLng.lat !== lat || currentLatLng.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        circleRef.current.setLatLng([lat, lng]);
        mapRef.current.panTo([lat, lng]);
      }
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [lat, lng, radiusKm]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      {!isReadOnly && (
        <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[11px] font-medium text-[#475569] shadow-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
          <span>Click anywhere on the map or drag the purple pin to set headquarters</span>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
