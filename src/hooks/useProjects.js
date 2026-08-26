import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/api/projectService';

export const useProjects = (initialParams = {}) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchProjects = useCallback(async (searchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectService.getProjects(searchParams);
      setProjects(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const fetchProjectById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectService.getProjectById(id);
      setSelectedProject(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to load project details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(params);
  }, [fetchProjects, params]);

  return {
    projects,
    selectedProject,
    loading,
    error,
    params,
    setParams,
    refetch: fetchProjects,
    fetchProjectById,
  };
};
