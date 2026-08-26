import axiosClient from '../api/axiosClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const aiAnomalyService = {
  async detectFinancialAnomalies() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 300));
      return {
        success: true,
        data: [
          {
            projectId: "MP-BR-205-412",
            anomalyType: "EXPEDITION_VELOCITY",
            score: 0.89,
            details: "Fund utilization speed 1.9x faster than ground physical progress verification.",
          },
          {
            projectId: "MP-WB-601-883",
            anomalyType: "UNIT_COST_OUTLIER",
            score: 0.94,
            details: "Per-unit construction cost deviates by +3.2 standard deviations from district mean.",
          },
        ],
      };
    }
    return axiosClient.get('/ai/anomalies/financial');
  },

  async detectPhotoAnomalies(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 250));
      return {
        success: true,
        data: {
          projectId,
          verifiedStage: "Foundation Level (20% Physical)",
          claimedStage: "Roof Slab Level (60% Physical)",
          mismatchConfidence: 0.91,
          explanation: "Computer Vision model detected foundation stage columns; claimed roof slab photos mismatch location metadata.",
        },
      };
    }
    return axiosClient.get(`/ai/anomalies/photo/${projectId}`);
  },
};
