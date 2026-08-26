import axiosClient from './axiosClient';
import { mockMPs } from '../../data/mockMPs';
import { mockProjects } from '../../data/mockProjects';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const mpService = {
  async getMPs(params = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: mockMPs, count: mockMPs.length };
    }
    return axiosClient.get('/mps', { params });
  },

  async getMPById(id) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const mp = mockMPs.find((m) => m.id === id);
      if (!mp) throw new Error(`MP with ID ${id} not found`);
      return { success: true, data: mp };
    }
    return axiosClient.get(`/mps/${id}`);
  },

  async getMPProjects(mpId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const projects = mockProjects.filter((p) => p.mpId === mpId);
      return { success: true, data: projects };
    }
    return axiosClient.get(`/mps/${mpId}/projects`);
  },
};
