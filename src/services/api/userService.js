import axiosClient from './axiosClient';
import { getStoredSettings } from './settingsService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const mockUser = {
  id: "USR-GOI-001",
  name: "Rajesh V. Sharma",
  role: "Ministry Administrator",
  department: "Ministry of Statistics & Programme Implementation (MoSPI)",
  email: "rajesh.sharma@gov.in",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
};

export const userService = {
  async getCurrentUser() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const stored = getStoredSettings();
      const user = {
        ...mockUser,
        ...(stored?.profile || {}),
      };
      return { success: true, data: user };
    }
    return axiosClient.get('/user/me');
  },

  async getUserSettings() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      return {
        success: true,
        data: {
          emailNotifications: true,
          criticalAlertsSms: true,
          aiSensitivityLevel: "High",
          autoRefreshIntervalSec: 60,
        },
      };
    }
    return axiosClient.get('/user/settings');
  },

  async updateUserSettings(settings) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      return { success: true, message: 'Settings saved successfully', data: settings };
    }
    return axiosClient.put('/user/settings', settings);
  },
};
