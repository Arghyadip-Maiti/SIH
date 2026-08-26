import { useState, useEffect, useCallback } from 'react';
import { riskService } from '../services/api/riskService';
import { aiRiskService } from '../services/ai/riskService';

export const useRisk = (projectId = null) => {
  const [highRiskProjects, setHighRiskProjects] = useState([]);
  const [projectRisk, setProjectRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHighRiskProjects = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await riskService.getRiskProjects(params);
      setHighRiskProjects(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load risk projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectRisk = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await aiRiskService.predictProjectRisk(id);
      setProjectRisk(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to analyze project risk');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchProjectRisk(projectId);
    } else {
      fetchHighRiskProjects();
    }
  }, [projectId, fetchHighRiskProjects, fetchProjectRisk]);

  return {
    highRiskProjects,
    projectRisk,
    loading,
    error,
    refetchRiskProjects: fetchHighRiskProjects,
    fetchProjectRisk,
  };
};
