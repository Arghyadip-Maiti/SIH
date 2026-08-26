import axiosClient from './axiosClient';
import { mockProjects } from '../../data/mockProjects';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const projectService = {
  async getProjects(params = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 200));
      let results = [...mockProjects];
      if (params.state) {
        results = results.filter((p) => p.state.toLowerCase() === params.state.toLowerCase());
      }
      if (params.district) {
        results = results.filter((p) => p.district.toLowerCase() === params.district.toLowerCase());
      }
      if (params.status) {
        results = results.filter((p) => p.status === params.status);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.id.toLowerCase().includes(query) ||
            p.mp.toLowerCase().includes(query)
        );
      }
      return { success: true, data: results, count: results.length };
    }
    return axiosClient.get('/projects', { params });
  },

  async getProjectById(id) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const project = mockProjects.find((p) => p.id === id);
      if (!project) throw new Error(`Project with ID ${id} not found`);
      return { success: true, data: project };
    }
    return axiosClient.get(`/projects/${id}`);
  },

  async getProjectsByMP(mpId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const filtered = mockProjects.filter((p) => p.mpId === mpId);
      return { success: true, data: filtered };
    }
    return axiosClient.get(`/projects/mp/${mpId}`);
  },

  async getProjectsByState(state) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const filtered = mockProjects.filter((p) => p.state.toLowerCase() === state.toLowerCase());
      return { success: true, data: filtered };
    }
    return axiosClient.get(`/projects/state/${state}`);
  },

  async getProjectsByDistrict(district) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 150));
      const filtered = mockProjects.filter((p) => p.district.toLowerCase() === district.toLowerCase());
      return { success: true, data: filtered };
    }
    return axiosClient.get(`/projects/district/${district}`);
  },
};
