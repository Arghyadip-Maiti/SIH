import { useState, useEffect, useCallback, useMemo } from 'react';
import { analyticsService } from '../services/api/analyticsService';
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP, MP_LOCATION_MAP } from '../services/api/locationService';
import { useApp } from '../context/AppContext';

export const useOverview = () => {
  const { dashboardPreferences } = useApp();
  const defaultYear = dashboardPreferences?.financialYear || '2026-27';

  const defaultFilters = useMemo(() => ({
    financialYear: defaultYear,
    house: 'All',
    state: '',
    district: '',
    mp: '',
    projectType: '',
    status: '',
    riskLevel: '',
    agency: '',
  }), [defaultYear]);

  const [filters, setFilters] = useState(defaultFilters);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, financialYear: defaultYear }));
    setActiveFilters((prev) => ({ ...prev, financialYear: defaultYear }));
  }, [defaultYear]);
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchOverview = useCallback(async (currentFilters = activeFilters, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await analyticsService.getOverviewAnalytics(currentFilters);
      setOverviewData(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load overview data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchOverview(activeFilters);
  }, [fetchOverview, activeFilters]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };

    // 1. Interdependency when State changes
    if (key === 'state') {
      if (value) {
        // If selected district does not belong to the new state, reset district
        const validDistricts = STATE_DISTRICT_MAP[value] || [];
        if (updated.district && !validDistricts.includes(updated.district)) {
          updated.district = '';
        }
        // If selected MP does not belong to the new state, reset MP
        if (updated.mp && MP_LOCATION_MAP[updated.mp]?.state !== value) {
          updated.mp = '';
        }
      }
    }

    // 2. Interdependency when District changes
    if (key === 'district') {
      if (value) {
        // Automatically sync State to district's parent State
        const parentState = DISTRICT_STATE_MAP[value];
        if (parentState) {
          updated.state = parentState;
        }
        // If selected MP does not belong to the new district, reset MP
        if (updated.mp && MP_LOCATION_MAP[updated.mp]?.district !== value) {
          updated.mp = '';
        }
      }
    }

    // 3. Interdependency when MP changes
    if (key === 'mp') {
      if (value && MP_LOCATION_MAP[value]) {
        updated.state = MP_LOCATION_MAP[value].state;
        updated.district = MP_LOCATION_MAP[value].district;
      }
    }

    setFilters(updated);
    setActiveFilters(updated); // Instant dynamic update across all components
  };

  const applyFilters = () => {
    setActiveFilters({ ...filters });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveFilters(DEFAULT_FILTERS);
  };

  const refreshData = () => {
    fetchOverview(activeFilters, true);
  };

  // Derived memoized calculations
  const kpis = useMemo(() => overviewData?.kpis || {}, [overviewData]);

  const statusDistribution = useMemo(
    () => overviewData?.projectStatusDistribution || overviewData?.statusDistribution || [],
    [overviewData]
  );

  const sectorDistribution = useMemo(
    () => overviewData?.sectorExpenditure || overviewData?.sectorDistribution || [],
    [overviewData]
  );

  const statePerformance = useMemo(
    () => overviewData?.statePerformance || [],
    [overviewData]
  );

  const topDistricts = useMemo(
    () => overviewData?.topDistricts || [],
    [overviewData]
  );

  const constituencyPerformance = useMemo(
    () => overviewData?.constituencyPerformance || [],
    [overviewData]
  );

  const expenditureTrend = useMemo(
    () => overviewData?.expenditureTrend || [],
    [overviewData]
  );

  const worksCompletedTrend = useMemo(
    () => overviewData?.worksCompletedTrend || [],
    [overviewData]
  );

  const houseExpenditure = useMemo(
    () => overviewData?.houseExpenditure || {},
    [overviewData]
  );

  const highLevelAttention = useMemo(
    () => overviewData?.highLevelAttention || [],
    [overviewData]
  );

  const aiInsights = useMemo(
    () => overviewData?.aiInsights || [],
    [overviewData]
  );

  return {
    filters,
    activeFilters,
    overviewData,
    loading,
    refreshing,
    error,
    lastUpdated,
    kpis,
    statusDistribution,
    sectorDistribution,
    statePerformance,
    topDistricts,
    constituencyPerformance,
    expenditureTrend,
    worksCompletedTrend,
    houseExpenditure,
    highLevelAttention,
    aiInsights,
    handleFilterChange,
    applyFilters,
    resetFilters,
    refreshData,
  };
};
