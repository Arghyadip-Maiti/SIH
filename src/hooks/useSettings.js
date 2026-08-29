import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/api/settingsService';
import { DEFAULT_SETTINGS } from '../data/mock/defaultSettings';

export const useSettings = () => {
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
      }
    } catch (err) {
      console.error('[Settings Fetch Error]', err);
      setError('Unable to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Show Toast Feedback Notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  // Save Settings Section Handler
  const saveSectionSettings = async (sectionKey, updatedSectionData, successText = 'Settings saved successfully') => {
    setSaving(true);
    try {
      const updatedFull = {
        ...settings,
        [sectionKey]: {
          ...settings[sectionKey],
          ...updatedSectionData,
        },
      };
      const res = await settingsService.updateSettings(updatedFull);
      if (res.success) {
        setSettings(res.data);
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
  };

  // Reset Preferences Handler
  const confirmResetPreferences = async () => {
    setSaving(true);
    try {
      const res = await settingsService.resetPreferences();
      if (res.success) {
        setSettings(res.data);
        setIsResetModalOpen(false);
        triggerToast('✓ Dashboard preferences reset to defaults');
      }
    } catch (err) {
      console.error('[Reset Error]', err);
      triggerToast('Unable to reset preferences.');
    } finally {
      setSaving(false);
    }
  };

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
