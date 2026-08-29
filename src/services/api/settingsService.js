import axiosClient from './axiosClient';
import { DEFAULT_SETTINGS } from '../../data/mock/defaultSettings';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
const SETTINGS_STORAGE_KEY = 'mplads_user_settings_v1';

// Helper to retrieve saved settings from localStorage or fallback to defaults
export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile || {}) },
        notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications || {}) },
        dashboardPreferences: { ...DEFAULT_SETTINGS.dashboardPreferences, ...(parsed.dashboardPreferences || {}) },
        security: { ...DEFAULT_SETTINGS.security, ...(parsed.security || {}) },
        dataPreferences: { ...DEFAULT_SETTINGS.dataPreferences, ...(parsed.dataPreferences || {}) },
        appearance: { ...DEFAULT_SETTINGS.appearance, ...(parsed.appearance || {}) },
      };
    }
  } catch (e) {
    console.error('Failed to parse stored settings', e);
  }
  return DEFAULT_SETTINGS;
};

// Helper to save settings to localStorage
const persistSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
};

export const settingsService = {
  async getSettings() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 80));
      return { success: true, data: getStoredSettings() };
    }
    const res = await axiosClient.get('/settings');
    return res.data;
  },

  async updateSettings(partialSettings) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 120));
      const current = getStoredSettings();
      const updated = {
        ...current,
        ...partialSettings,
      };
      persistSettings(updated);
      return { success: true, message: 'Settings saved successfully', data: updated };
    }
    const res = await axiosClient.put('/settings', partialSettings);
    return res.data;
  },

  async updateProfile(profileData) {
    if (USE_MOCK) {
      const current = getStoredSettings();
      const updated = {
        ...current,
        profile: { ...current.profile, ...profileData },
      };
      persistSettings(updated);
      return { success: true, message: 'Profile updated successfully', data: updated };
    }
    const res = await axiosClient.put('/settings/profile', profileData);
    return res.data;
  },

  async updateNotifications(notificationsData) {
    if (USE_MOCK) {
      const current = getStoredSettings();
      const updated = {
        ...current,
        notifications: { ...current.notifications, ...notificationsData },
      };
      persistSettings(updated);
      return { success: true, message: 'Notification preferences saved', data: updated };
    }
    const res = await axiosClient.put('/settings/notifications', notificationsData);
    return res.data;
  },

  async updateDashboardPreferences(prefData) {
    if (USE_MOCK) {
      const current = getStoredSettings();
      const updated = {
        ...current,
        dashboardPreferences: { ...current.dashboardPreferences, ...prefData },
      };
      persistSettings(updated);
      return { success: true, message: 'Dashboard preferences saved', data: updated };
    }
    const res = await axiosClient.put('/settings/preferences', prefData);
    return res.data;
  },

  async updateDataPreferences(dataPrefData) {
    if (USE_MOCK) {
      const current = getStoredSettings();
      const updated = {
        ...current,
        dataPreferences: { ...current.dataPreferences, ...dataPrefData },
      };
      persistSettings(updated);
      return { success: true, message: 'Data preferences saved', data: updated };
    }
    const res = await axiosClient.put('/settings/data', dataPrefData);
    return res.data;
  },

  async updateAppearance(appearanceData) {
    if (USE_MOCK) {
      const current = getStoredSettings();
      const updated = {
        ...current,
        appearance: { ...current.appearance, ...appearanceData },
      };
      persistSettings(updated);
      return { success: true, message: 'Appearance settings saved', data: updated };
    }
    const res = await axiosClient.put('/settings/appearance', appearanceData);
    return res.data;
  },

  async resetPreferences() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const current = getStoredSettings();
      const resetState = {
        ...current,
        dashboardPreferences: { ...DEFAULT_SETTINGS.dashboardPreferences },
        dataPreferences: { ...DEFAULT_SETTINGS.dataPreferences },
        appearance: { ...DEFAULT_SETTINGS.appearance },
        notifications: { ...DEFAULT_SETTINGS.notifications },
      };
      persistSettings(resetState);
      return { success: true, message: 'Dashboard preferences reset to defaults', data: resetState };
    }
    const res = await axiosClient.post('/settings/reset');
    return res.data;
  },
};
