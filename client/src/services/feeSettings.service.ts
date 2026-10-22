import api from './api';

export interface Multipliers {
  minor: number;
  moderate: number;
  high: number;
  critical: number;
}

export interface FeeSettings {
  _id: string;
  freeKm: number;
  perKmRatePaise: number;
  minFeePaise: number;
  maxFeePaise: number;
  commissionPercent: number;
  multipliers: Multipliers;
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  updatedAt?: string;
}

export interface UpdateFeeSettingsPayload {
  freeKm: number;
  perKmRatePaise: number;
  minFeePaise: number;
  maxFeePaise: number;
  commissionPercent: number;
  multipliers: Multipliers;
}

export const feeSettingsService = {
  // Fetch singleton fee settings
  async getFeeSettings(): Promise<FeeSettings> {
    const response = await api.get<{ success: boolean; data: FeeSettings }>('/admin/fee-settings');
    return response.data.data;
  },

  // Update global fee parameters
  async updateFeeSettings(payload: UpdateFeeSettingsPayload): Promise<FeeSettings> {
    const response = await api.put<{ success: boolean; message: string; data: FeeSettings }>(
      '/admin/fee-settings',
      payload
    );
    return response.data.data;
  },
};

export default feeSettingsService;
