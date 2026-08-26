import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/api/analyticsService';

export const useAnalytics = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [sectorData, setSectorData] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [agencyData, setAgencyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, sectorRes, financialRes, stateRes, agencyRes] = await Promise.all([
        analyticsService.getOverviewAnalytics(),
        analyticsService.getProjectAnalytics(),
        analyticsService.getFinancialAnalytics(),
        analyticsService.getStateAnalytics(),
        analyticsService.getAgencyAnalytics(),
      ]);

      setOverviewData(overviewRes.data);
      setSectorData(sectorRes.data);
      setFinancialData(financialRes.data);
      setStateData(stateRes.data);
      setAgencyData(agencyRes.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  return {
    overviewData,
    sectorData,
    financialData,
    stateData,
    agencyData,
    loading,
    error,
    refetch: fetchAllAnalytics,
  };
};
