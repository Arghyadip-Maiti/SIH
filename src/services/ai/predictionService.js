import axiosClient from '../api/axiosClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const aiPredictionService = {
  async predictProjectCompletion(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 250));
      return {
        success: true,
        data: {
          projectId,
          originalDeadline: "2026-06-30",
          predictedCompletionDate: "2026-08-30",
          delayDays: 61,
          confidence: 0.88,
          keyDrivers: ["Supply chain bottlenecks", "Monsoon season delay", "Agency backlog"],
        },
      };
    }
    return axiosClient.post('/ai/predictions/completion', { projectId });
  },

  async predictCostOverrun(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 250));
      return {
        success: true,
        data: {
          projectId,
          sanctionedAmount: 3800000,
          predictedFinalCost: 4250000,
          overrunPercentage: 11.8,
          overrunRiskProbability: 0.81,
        },
      };
    }
    return axiosClient.post('/ai/predictions/cost', { projectId });
  },
};
