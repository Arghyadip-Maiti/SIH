import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/api/userService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(3);
  const [isMockMode] = useState(import.meta.env.VITE_USE_MOCK_DATA === 'true');
  const [loadingUser, setLoadingUser] = useState(true);

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

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleSidebarCollapse = () => setSidebarCollapsed((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        currentUser,
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
