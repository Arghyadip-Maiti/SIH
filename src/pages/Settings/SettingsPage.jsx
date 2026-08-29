import { useSettings } from '../../hooks/useSettings';
import { SettingsNav } from '../../components/settings/SettingsNav';
import { ProfileSettings } from '../../components/settings/ProfileSettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { DashboardPreferences } from '../../components/settings/DashboardPreferences';
import { SecuritySettings } from '../../components/settings/SecuritySettings';
import { DataPreferences } from '../../components/settings/DataPreferences';
import { AppearanceSettings } from '../../components/settings/AppearanceSettings';
import { AboutSettings } from '../../components/settings/AboutSettings';
import { ToastNotification } from '../../components/ui/ToastNotification';
import { Modal } from '../../components/ui/Modal';
import { Settings as SettingsIcon, AlertCircle, RefreshCw } from 'lucide-react';

export const SettingsPage = () => {
  const {
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
    openResetModal,
    closeResetModal,
    confirmResetPreferences,
    refetch,
  } = useSettings();

  if (error) {
    return (
      <div className="p-8 text-center bg-white border border-rose-200 rounded-3xl my-8">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-black text-slate-900">Unable to load settings</h3>
        <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto mt-1 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100 inline-flex items-center gap-1.5">
              <SettingsIcon className="w-3.5 h-3.5" />
              Administrative Control Panel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Settings
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage your account, dashboard preferences, notifications and system preferences.
          </p>
        </div>
      </div>

      {/* SKELETON LOADING STATE */}
      {loading ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 h-64 bg-slate-200/60 rounded-3xl animate-pulse" />
          <div className="flex-1 h-96 bg-slate-200/60 rounded-3xl animate-pulse" />
        </div>
      ) : (
        /* TWO-COLUMN LAYOUT */
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Settings Left Navigation */}
          <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Selected Settings Content Panel */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'profile' && (
              <ProfileSettings
                profileData={settings.profile}
                onSave={(data, text) => saveSectionSettings('profile', data, text)}
                saving={saving}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings
                notificationData={settings.notifications}
                onSave={(data, text) => saveSectionSettings('notifications', data, text)}
                saving={saving}
              />
            )}

            {activeTab === 'preferences' && (
              <DashboardPreferences
                preferencesData={settings.dashboardPreferences}
                onSave={(data, text) => saveSectionSettings('dashboardPreferences', data, text)}
                saving={saving}
                onOpenResetModal={openResetModal}
              />
            )}

            {activeTab === 'security' && (
              <SecuritySettings
                securityData={settings.security}
                onSave={(data, text) => saveSectionSettings('security', data, text)}
                triggerToast={triggerToast}
              />
            )}

            {activeTab === 'data' && (
              <DataPreferences
                dataPreferences={settings.dataPreferences}
                onSave={(data, text) => saveSectionSettings('dataPreferences', data, text)}
                saving={saving}
              />
            )}

            {activeTab === 'appearance' && (
              <AppearanceSettings
                appearanceData={settings.appearance}
                onSave={(data, text) => saveSectionSettings('appearance', data, text)}
                saving={saving}
              />
            )}

            {activeTab === 'about' && <AboutSettings />}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <ToastNotification message={toastMessage} onClose={closeToast} />

      {/* RESET PREFERENCES CONFIRMATION MODAL */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        title="Reset preferences?"
      >
        <div className="space-y-3 text-xs text-slate-700">
          <p className="font-semibold leading-relaxed">
            This will restore your dashboard preferences to the default settings.
          </p>
          <p className="text-slate-500 italic">
            Your profile details and security credentials will not be affected.
          </p>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={closeResetModal}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmResetPreferences}
              disabled={saving}
              className="px-4 py-2 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              {saving ? 'Resetting...' : 'Reset'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
