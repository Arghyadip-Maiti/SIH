import axiosClient from '../api/axiosClient';
import { mockRiskData } from '../../data/mockRiskData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const aiRiskService = {
  async predictProjectRisk(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 250));
      const risk = mockRiskData.find((r) => r.projectId === projectId);
      return {
        success: true,
        data: risk || {
          projectId,
          riskScore: 24,
          riskLevel: 'LOW',
          riskFactors: { costAnomaly: 5, delay: 5, paymentProgressMismatch: 5, duplicateProbability: 5, other: 4 },
          predictions: { delayProbability: 0.1, predictedDelayDays: 0, costOverrunProbability: 0.05 },
          explanations: ['No ML anomaly detected. Project progress normal.'],
        },
      };
    }
    return axiosClient.post('/ai/risk/predict', { projectId });
  },

  async getRiskBreakdown(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 200));
      const risk = mockRiskData.find((r) => r.projectId === projectId);
      return {
        success: true,
        data: risk?.riskFactors || { costAnomaly: 10, delay: 10, paymentProgressMismatch: 10, duplicateProbability: 5, other: 5 },
      };
    }
    return axiosClient.get(`/ai/risk/breakdown/${projectId}`);
  },
};
