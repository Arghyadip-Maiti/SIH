import axiosClient from './axiosClient';
import { mockProjects } from '../../data/mockProjects';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Dynamically generate canonical alerts referencing real project records in mockProjects
const generateAlertsFromProjects = () => {
  const alerts = [];
  let alertId = 101;

  mockProjects.forEach((p) => {
    if (p.riskScore >= 81) {
      alerts.push({
        id: `ALT-${alertId++}`,
        projectId: p.id,
        projectName: p.name,
        state: p.state,
        district: p.district,
        constituency: p.constituencyName,
        mpName: p.mpName,
        severity: 'CRITICAL',
        title: `Critical Risk Flagged: ${p.name}`,
        message: `High risk score (${p.riskScore}/100) detected in ${p.district}, ${p.state}. Milestone inspection recommended.`,
        date: p.lastUpdated || '2026-08-27',
        isRead: false,
        type: 'RISK_SCORE_ELEVATED',
      });
    } else if (p.paymentProgressMismatch) {
      alerts.push({
        id: `ALT-${alertId++}`,
        projectId: p.id,
        projectName: p.name,
        state: p.state,
        district: p.district,
        constituency: p.constituencyName,
        mpName: p.mpName,
        severity: 'HIGH',
        title: `Payment-Progress Mismatch: ${p.name}`,
        message: `Financial disbursement (${p.financialProgress}%) exceeds physical progress (${p.progress}%).`,
        date: p.lastUpdated || '2026-08-27',
        isRead: false,
        type: 'PAYMENT_MISMATCH',
      });
    } else if (p.daysDelayed > 60) {
      alerts.push({
        id: `ALT-${alertId++}`,
        projectId: p.id,
        projectName: p.name,
        state: p.state,
        district: p.district,
        constituency: p.constituencyName,
        mpName: p.mpName,
        severity: 'HIGH',
        title: `Severe Schedule Delay: ${p.name}`,
        message: `Project work in ${p.district} is delayed by ${p.daysDelayed} days past target completion date.`,
        date: p.lastUpdated || '2026-08-27',
        isRead: false,
        type: 'SCHEDULE_DELAY',
      });
    }
  });

  return alerts;
};

const canonicalAlerts = generateAlertsFromProjects();

export const alertService = {
  async getAlerts(params = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 120));
      let results = [...canonicalAlerts];
      if (params.severity) {
        results = results.filter((a) => a.severity === params.severity);
      }
      if (params.projectId) {
        results = results.filter((a) => a.projectId === params.projectId);
      }
      return { success: true, data: results, count: results.length };
    }
    return axiosClient.get('/alerts', { params });
  },

  async getAlertById(id) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const alert = canonicalAlerts.find((a) => a.id === id);
      if (!alert) throw new Error(`Alert ${id} not found`);
      return { success: true, data: alert };
    }
    return axiosClient.get(`/alerts/${id}`);
  },

  async markAlertAsRead(id) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 80));
      const alert = canonicalAlerts.find((a) => a.id === id);
      if (alert) alert.isRead = true;
      return { success: true, message: 'Alert marked as read' };
    }
    return axiosClient.patch(`/alerts/${id}/read`);
  },
};
