/**
 * Centralized Single Source of Truth Default Settings Data Architecture.
 * Serves as baseline defaults for profile, notifications, dashboard preferences,
 * security, data display, and appearance settings.
 */

export const DEFAULT_SETTINGS = {
  profile: {
    name: 'Rajesh V. Sharma',
    role: 'Ministry Administrator',
    department: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    email: 'rajesh.sharma@gov.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  notifications: {
    projectAlerts: true,
    aiRiskAlerts: true,
    financialAnomalies: true,
    projectDelayAlerts: true,
    systemNotifications: true,
    severities: {
      critical: true,
      high: true,
      medium: true,
      low: false,
    },
    channels: {
      inDashboard: true,
      email: true,
    },
  },
  dashboardPreferences: {
    financialYear: '2026-27',
    landingPage: '/overview',
    projectView: 'All Projects',
    mapMetric: 'utilization',
    tableDensity: 'compact',
  },
  security: {
    passwordLastChanged: 'Recently (14 days ago)',
    activeSessions: [
      { id: 'sess-1', device: 'Mac / Chrome', isCurrent: true, status: 'Active now' },
    ],
  },
  dataPreferences: {
    currency: 'INR',
    numberFormat: 'Indian (Lakhs / Crores)',
    dateFormat: 'DD/MM/YYYY',
    recordsPerPage: 25,
    autoRefresh: true,
    refreshIntervalMinutes: 15,
  },
  appearance: {
    theme: 'light',
    language: 'en',
  },
};
