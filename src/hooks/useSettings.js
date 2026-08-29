import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/api/settingsService';
import { DEFAULT_SETTINGS } from '../data/mock/defaultSettings';
import { useApp } from '../context/AppContext';
import { applyTheme } from '../utils/themeUtils';

export const useSettings = () => {
  const { updateCurrentUser, updateDashboardPreferences } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal Dialog States
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Fetch Settings on Mount
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await settingsService.getSettings();
      if (res.success || res.data) {
        setSettings(res.data);
        if (res.data?.appearance?.theme) {
          applyTheme(res.data.appearance.theme);
        }
        if (res.data?.dashboardPreferences && updateDashboardPreferences) {
          updateDashboardPreferences(res.data.dashboardPreferences);
        }
      }
    } catch (err) {
      console.error('[Settings Fetch Error]', err);
      setError('Unable to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [updateDashboardPreferences]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Show Toast Feedback Notification
  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  const closeToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Save Settings Section Handler
  const saveSectionSettings = useCallback(async (sectionKey, updatedSectionData, successText = 'Settings saved successfully') => {
    setSaving(true);
    try {
      const current = settings || {};
      const updatedFull = {
        ...current,
        [sectionKey]: {
          ...(current[sectionKey] || {}),
          ...updatedSectionData,
        },
      };
      const res = await settingsService.updateSettings(updatedFull);
      if (res.success) {
        setSettings(res.data);
        if (sectionKey === 'profile' && updateCurrentUser) {
          updateCurrentUser(updatedSectionData);
        }
        if (sectionKey === 'appearance' && updatedSectionData.theme) {
          applyTheme(updatedSectionData.theme);
        }
        if (sectionKey === 'dashboardPreferences' && updateDashboardPreferences) {
          updateDashboardPreferences(updatedSectionData);
        }
        triggerToast(`✓ ${successText}`);
        return true;
      }
    } catch (err) {
      console.error('[Settings Save Error]', err);
      triggerToast('Unable to save changes. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [settings, updateCurrentUser, updateDashboardPreferences, triggerToast]);

  // Reset Preferences Handler
  const confirmResetPreferences = useCallback(async () => {
    setSaving(true);
    try {
      const res = await settingsService.resetPreferences();
      if (res.success) {
        setSettings(res.data);
        if (res.data?.dashboardPreferences && updateDashboardPreferences) {
          updateDashboardPreferences(res.data.dashboardPreferences);
        }
        setIsResetModalOpen(false);
        triggerToast('✓ Dashboard preferences reset to defaults');
      }
    } catch (err) {
      console.error('[Reset Error]', err);
      triggerToast('Unable to reset preferences.');
    } finally {
      setSaving(false);
    }
  }, [triggerToast]);

  return {
    activeTab,
    setActiveTab,
    settings,
    loading,
    saving,
    error,
    toastMessage,
    closeToast,
    triggerToast,
    saveSectionSettings,
    isResetModalOpen,
    openResetModal: () => setIsResetModalOpen(true),
    closeResetModal: () => setIsResetModalOpen(false),
    confirmResetPreferences,
    isPasswordModalOpen,
    openPasswordModal: () => setIsPasswordModalOpen(true),
    closePasswordModal: () => setIsPasswordModalOpen(false),
    refetch: fetchSettings,
  };
};
