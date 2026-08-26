import axiosClient from './axiosClient';
import { mockRiskData } from '../../data/mockRiskData';
import { mockProjects } from '../../data/mockProjects';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const riskService = {
  async getRiskProjects(params = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 220));
      let highRiskProjects = mockProjects.filter((p) => p.riskScore >= 60);
      if (params.minRiskScore) {
        highRiskProjects = highRiskProjects.filter((p) => p.riskScore >= params.minRiskScore);
      }
      return { success: true, data: highRiskProjects, count: highRiskProjects.length };
    }
    return axiosClient.get('/risk/projects', { params });
  },

  async getProjectRisk(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 180));
      const risk = mockRiskData.find((r) => r.projectId === projectId);
      const project = mockProjects.find((p) => p.id === projectId);
      if (!risk && project) {
        return {
          success: true,
          data: {
            projectId: project.id,
            riskScore: project.riskScore,
            riskLevel: project.riskScore > 80 ? 'CRITICAL' : project.riskScore > 60 ? 'HIGH' : 'LOW',
            riskFactors: { costAnomaly: 20, delay: 20, paymentProgressMismatch: 10, duplicateProbability: 5, other: 5 },
            predictions: { delayProbability: 0.25, predictedDelayDays: 15, costOverrunProbability: 0.20 },
            explanations: ['Standard monitoring metrics apply.'],
          },
        };
      }
      return { success: true, data: risk || null };
    }
    return axiosClient.get(`/risk/project/${projectId}`);
  },

  async getRiskExplanation(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const risk = mockRiskData.find((r) => r.projectId === projectId);
      return {
        success: true,
        data: {
          explanations: risk ? risk.explanations : ['No critical risk factors flagged by AI system.'],
        },
      };
    }
    return axiosClient.get(`/risk/explanation/${projectId}`);
  },
};
