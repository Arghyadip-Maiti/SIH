import axiosClient from './axiosClient';
import { mockProjects } from '../../data/mockProjects';
import { normalizeProject } from './projectService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const riskService = {
  async getRiskProjects(params = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      let highRiskProjects = mockProjects.filter((p) => p.riskScore >= 60).map(normalizeProject);
      if (params.minRiskScore) {
        highRiskProjects = highRiskProjects.filter((p) => p.riskScore >= params.minRiskScore);
      }
      if (params.riskLevel) {
        highRiskProjects = highRiskProjects.filter((p) => p.riskLevel === params.riskLevel);
      }
      return { success: true, data: highRiskProjects, count: highRiskProjects.length };
    }
    return axiosClient.get('/risk/projects', { params });
  },

  async getProjectRisk(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 120));
      const project = mockProjects.find((p) => p.id === projectId || p.projectId === projectId);
      if (project) {
        const norm = normalizeProject(project);
        return {
          success: true,
          data: {
            projectId: norm.id,
            riskScore: norm.riskScore,
            riskLevel: norm.riskLevel,
            riskFactors: {
              costAnomaly: norm.costOverrun ? 35 : 10,
              delay: norm.daysDelayed > 0 ? 30 : 5,
              paymentProgressMismatch: norm.paymentProgressMismatch ? 25 : 5,
              duplicateProbability: norm.duplicateRisk ? 15 : 0,
            },
            predictions: {
              delayProbability: norm.daysDelayed > 0 ? 0.85 : 0.15,
              predictedDelayDays: norm.daysDelayed > 0 ? norm.daysDelayed : 0,
              costOverrunProbability: norm.costOverrun ? 0.75 : 0.10,
            },
            explanations: [
              norm.paymentProgressMismatch ? 'Financial disbursement exceeds physical progress milestone by >20%.' : 'Financial expenditure is aligned with physical progress.',
              norm.daysDelayed > 0 ? `Execution timeline behind target schedule by ${norm.daysDelayed} days.` : 'Project timeline is on schedule.',
              norm.costOverrun ? 'Estimated cost exceeds original sanctioned allocation.' : 'Cost remains within sanctioned budget.',
            ],
          },
        };
      }
      return { success: false, message: `Project ${projectId} not found` };
    }
    return axiosClient.get(`/risk/project/${projectId}`);
  },

  async getRiskExplanation(projectId) {
    const res = await this.getProjectRisk(projectId);
    return {
      success: true,
      data: {
        explanations: res.data?.explanations || ['No critical risk factors flagged by AI system.'],
      },
    };
  },
};
