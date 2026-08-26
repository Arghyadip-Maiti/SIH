import axiosClient from './axiosClient';
import { mockAnalytics } from '../../data/mockAnalytics';
import { mockOverview } from '../../data/mockOverview';
import { computeFilteredOverview } from '../../data/overviewFilterEngine';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const analyticsService = {
  async getOverviewAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 120));
      const computedData = computeFilteredOverview(filters);
      return { success: true, data: computedData };
    }
    return axiosClient.get('/analytics/overview', { params: filters });
  },

  async getProjectAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: mockAnalytics.sectorDistribution };
    }
    return axiosClient.get('/analytics/projects', { params: filters });
  },

  async getFinancialAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: mockAnalytics.monthlyExpenditure };
    }
    return axiosClient.get('/analytics/financials', { params: filters });
  },

  async getStateAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: mockAnalytics.riskByState };
    }
    return axiosClient.get('/analytics/states', { params: filters });
  },

  async getDistrictAnalytics(state) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: mockAnalytics.riskByState.find((s) => s.state === state) || [] };
    }
    return axiosClient.get(`/analytics/districts`, { params: { state } });
  },

  async getAgencyAnalytics() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: mockAnalytics.agencyPerformance };
    }
    return axiosClient.get('/analytics/agencies');
  },
};
