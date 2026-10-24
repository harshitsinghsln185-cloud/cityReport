import React, { useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import MapPicker from '../MapPicker';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ChatLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (coords: [number, number], address: { street: string; city: string; pincode: string }) => void;
  initialCoords?: [number, number];
}

export const ChatLocationPicker: React.FC<ChatLocationPickerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialCoords = [77.209, 28.6139],
}) => {
  const [lng, setLng] = useState<number>(initialCoords[0]);
  const [lat, setLat] = useState<number>(initialCoords[1]);
  const [street, setStreet] = useState<string>('Main Site Road');
  const [city, setCity] = useState<string>('New Delhi');
  const [pincode, setPincode] = useState<string>('110001');

  if (!isOpen) return null;

  const handleMapChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleSave = () => {
    onConfirm([lng, lat], {
      street: street.trim() || 'Site Road',
      city: city.trim() || 'Municipal Area',
      pincode: pincode.trim() || '110001',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F7FC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">Pin Issue Location</h3>
              <p className="text-xs text-[#64748B]">Click map or drag the purple pin to set location</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0]/70 hover:text-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <MapPicker lat={lat} lng={lng} onChange={handleMapChange} height="220px" radiusKm={3} />

          <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B] bg-[#F8F7FC] p-2.5 rounded-lg border border-[#E2E8F0]">
            <div>
              <span className="font-medium text-[#475569]">Latitude:</span> {lat.toFixed(5)}
            </div>
            <div>
              <span className="font-medium text-[#475569]">Longitude:</span> {lng.toFixed(5)}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              label="Street / Landmark"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Near Metro Gate 3"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City / Ward"
              />
              <Input
                label="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2 bg-[#F8F7FC]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} className="flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Confirm Location</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatLocationPicker;
