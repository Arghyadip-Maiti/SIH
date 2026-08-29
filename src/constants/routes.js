export const ROUTES = {
  HOME: '/',
  OVERVIEW: '/overview',
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:projectId',
  MP_DETAILS: '/mp/:mpId',
  AI_RISK: '/ai-risk',
  AI_RISK_DETAILS: '/ai-risk/:projectId',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
};

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', path: ROUTES.OVERVIEW, iconName: 'Home' },
  { id: 'projects', label: 'Projects', path: ROUTES.PROJECTS, iconName: 'FolderKanban' },
  { id: 'ai-risk', label: 'AI Risk Monitor', path: ROUTES.AI_RISK, iconName: 'ShieldCheck' },
  { id: 'analytics', label: 'Analytics & Trends', path: ROUTES.ANALYTICS, iconName: 'BarChart3' },
  { id: 'settings', label: 'Settings', path: ROUTES.SETTINGS, iconName: 'Settings' },
];
