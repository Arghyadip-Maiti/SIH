import axiosClient from './axiosClient';
import { mockProjects } from '../../data/mockProjects';
import { overviewService } from './overviewService';
import { calculateProjectTypeDistribution, calculateStatePerformance } from '../../utils/projectAnalytics';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const analyticsService = {
  async getOverviewAnalytics(filters = {}) {
    return overviewService.getOverviewAnalytics(filters);
  },

  async getProjectAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const sectors = calculateProjectTypeDistribution(mockProjects);
      return { success: true, data: sectors };
    }
    return axiosClient.get('/analytics/projects', { params: filters });
  },

  async getFinancialAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const totalExp = mockProjects.reduce((sum, p) => sum + (p.expenditure || 0), 0);
      const monthly = [
        { month: 'Apr', expenditureCr: Number(((totalExp / 10000000) * 0.08).toFixed(2)) },
        { month: 'May', expenditureCr: Number(((totalExp / 10000000) * 0.12).toFixed(2)) },
        { month: 'Jun', expenditureCr: Number(((totalExp / 10000000) * 0.15).toFixed(2)) },
        { month: 'Jul', expenditureCr: Number(((totalExp / 10000000) * 0.18).toFixed(2)) },
        { month: 'Aug', expenditureCr: Number(((totalExp / 10000000) * 0.22).toFixed(2)) },
        { month: 'Sep', expenditureCr: Number(((totalExp / 10000000) * 0.25).toFixed(2)) },
      ];
      return { success: true, data: monthly };
    }
    return axiosClient.get('/analytics/financials', { params: filters });
  },

  async getStateAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const statePerf = calculateStatePerformance(mockProjects);
      return { success: true, data: statePerf };
    }
    return axiosClient.get('/analytics/states', { params: filters });
  },

  async getDistrictAnalytics(state) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      let distProjects = mockProjects;
      if (state) distProjects = distProjects.filter((p) => p.state.toLowerCase() === state.toLowerCase());
      const distMap = {};
      distProjects.forEach((p) => {
        if (!distMap[p.district]) distMap[p.district] = { district: p.district, count: 0, expenditure: 0 };
        distMap[p.district].count += 1;
        distMap[p.district].expenditure += p.expenditure || 0;
      });
      return { success: true, data: Object.values(distMap) };
    }
    return axiosClient.get(`/analytics/districts`, { params: { state } });
  },

  async getAgencyAnalytics() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const agencyMap = {};
      mockProjects.forEach((p) => {
        const a = p.implementingAgency || 'PWD';
        if (!agencyMap[a]) agencyMap[a] = { agency: a, totalWorks: 0, totalExpenditure: 0 };
        agencyMap[a].totalWorks += 1;
        agencyMap[a].totalExpenditure += p.expenditure || 0;
      });
      return { success: true, data: Object.values(agencyMap) };
    }
    return axiosClient.get('/analytics/agencies');
  },
};
