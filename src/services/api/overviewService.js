import axiosClient from './axiosClient';
import { computeFilteredOverview } from '../../data/overviewFilterEngine';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const overviewService = {
  async getOverviewAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 120));
      const computedData = computeFilteredOverview(filters);
      return { success: true, data: computedData };
    }
    return axiosClient.get('/analytics/overview', { params: filters });
  },
};
