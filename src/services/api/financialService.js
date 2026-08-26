import axiosClient from './axiosClient';
import { mockOverview } from '../../data/mockOverview';
import { mockProjects } from '../../data/mockProjects';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const financialService = {
  async getFinancialSummary() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 180));
      return {
        success: true,
        data: {
          sanctioned: mockOverview.kpis.totalSanctionedAmount,
          expenditure: mockOverview.kpis.totalExpenditure,
          utilization: mockOverview.kpis.financialUtilization,
        },
      };
    }
    return axiosClient.get('/financials/summary');
  },

  async getFinancialsByProject(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const project = mockProjects.find((p) => p.id === projectId);
      if (!project) throw new Error('Project not found');
      return {
        success: true,
        data: {
          sanctionedAmount: project.sanctionedAmount,
          expenditure: project.expenditure,
          remaining: project.sanctionedAmount - project.expenditure,
          utilizationPercentage: ((project.expenditure / project.sanctionedAmount) * 100).toFixed(1),
        },
      };
    }
    return axiosClient.get(`/financials/project/${projectId}`);
  },
};
