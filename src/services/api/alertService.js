import axiosClient from './axiosClient';
import { mockAlerts } from '../../data/mockAlerts';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const alertService = {
  async getAlerts(params = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 200));
      let results = [...mockAlerts];
      if (params.severity) {
        results = results.filter((a) => a.severity === params.severity);
      }
      return { success: true, data: results, count: results.length };
    }
    return axiosClient.get('/alerts', { params });
  },

  async getAlertById(id) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const alert = mockAlerts.find((a) => a.id === id);
      if (!alert) throw new Error('Alert not found');
      return { success: true, data: alert };
    }
    return axiosClient.get(`/alerts/${id}`);
  },

  async markAlertAsRead(id) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const alert = mockAlerts.find((a) => a.id === id);
      if (alert) alert.isRead = true;
      return { success: true, message: 'Alert marked as read' };
    }
    return axiosClient.patch(`/alerts/${id}/read`);
  },
};
