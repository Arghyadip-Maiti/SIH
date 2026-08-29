import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/api/userService';
import { getStoredSettings } from '../services/api/settingsService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(3);
  const [isMockMode] = useState(import.meta.env.VITE_USE_MOCK_DATA === 'true');
  const [loadingUser, setLoadingUser] = useState(true);

  const [dashboardPreferences, setDashboardPreferencesState] = useState(() => {
    return getStoredSettings().dashboardPreferences || {};
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await userService.getCurrentUser();
        setCurrentUser(res.data);
      } catch (e) {
        console.error('Failed to load user info', e);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const toggleSidebarCollapse = useCallback(() => setSidebarCollapsed((prev) => !prev), []);

  const updateCurrentUser = useCallback((newFields) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...newFields } : newFields));
  }, []);

  const updateDashboardPreferences = useCallback((newPrefs) => {
    setDashboardPreferencesState((prev) => {
      const updated = { ...prev, ...newPrefs };
      if (typeof document !== 'undefined' && updated.tableDensity) {
        document.documentElement.setAttribute('data-density', updated.tableDensity);
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && dashboardPreferences?.tableDensity) {
      document.documentElement.setAttribute('data-density', dashboardPreferences.tableDensity);
    }
  }, [dashboardPreferences?.tableDensity]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateCurrentUser,
        dashboardPreferences,
        updateDashboardPreferences,
        loadingUser,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        sidebarCollapsed,
        toggleSidebarCollapse,
        unreadAlertsCount,
        setUnreadAlertsCount,
        isMockMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
