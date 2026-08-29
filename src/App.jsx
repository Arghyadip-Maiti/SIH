import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ROUTES } from './constants/routes';

// Page Placeholders
import OverviewPage from './pages/Overview/OverviewPage';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProjectDetailsPage from './pages/Projects/ProjectDetailsPage';
import MPDetailsPage from './pages/Projects/MPDetailsPage';
import AIRiskPage from './pages/AIRisk/AIRiskPage';
import AIRiskDetailsPage from './pages/AIRisk/AIRiskDetailsPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import SettingsPage from './pages/Settings/SettingsPage';

import { useApp } from './context/AppContext';

function RootRedirect() {
  const { dashboardPreferences } = useApp();
  const target = dashboardPreferences?.landingPage || ROUTES.OVERVIEW;
  return <Navigate to={target} replace />;
}

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<RootRedirect />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="mp/:mpId" element={<MPDetailsPage />} />
            <Route path="ai-risk" element={<AIRiskPage />} />
            <Route path="ai-risk/:projectId" element={<AIRiskDetailsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to={ROUTES.OVERVIEW} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
