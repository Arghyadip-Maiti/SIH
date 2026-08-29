import { useState, useEffect, useCallback, useMemo } from 'react';
import { analyticsService } from '../services/api/analyticsService';
import { DEFAULT_ANALYTICS_FILTERS } from '../utils/analyticsEngine';
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP, MP_LOCATION_MAP } from '../services/api/locationService';

export const useAnalyticsDashboard = () => {
  const [filters, setFilters] = useState(DEFAULT_ANALYTICS_FILTERS);
  const [granularity, setGranularity] = useState('Monthly');
  const [expenditureMetric, setExpenditureMetric] = useState('expenditure');
  const [agencyA, setAgencyA] = useState('');
  const [agencyB, setAgencyB] = useState('');
  const [matrixEntity, setMatrixEntity] = useState('State');
  const [scenarioParams, setScenarioParams] = useState({
    monitoringIncrease: 10,
    expenditureEfficiency: 5,
  });

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const activeParams = {
        ...filters,
        granularity,
        metric: expenditureMetric,
        agencyA,
        agencyB,
        matrixEntity,
        scenarioParams,
      };

      const res = await analyticsService.getFullAnalytics(activeParams);
      if (res.success || res.data) {
        setAnalyticsData(res.data);
        setLastUpdated(new Date());
        
        // Auto initialize agency selection if empty
        if (!agencyA && res.data.agencyPerformance?.length) {
          setAgencyA(res.data.agencyPerformance[0].agency);
          if (res.data.agencyPerformance[1]) {
            setAgencyB(res.data.agencyPerformance[1].agency);
          }
        }
      }
    } catch (err) {
      console.error('[Analytics Load Error]', err);
      setError(err.message || 'Failed to calculate analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, granularity, expenditureMetric, agencyA, agencyB, matrixEntity, scenarioParams]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      // 1. Interdependency when State changes
      if (key === 'state') {
        if (value && value !== 'All States' && value !== 'All') {
          const validDistricts = STATE_DISTRICT_MAP[value] || [];
          if (updated.district !== 'All Districts' && !validDistricts.includes(updated.district)) {
            updated.district = 'All Districts';
          }
          if (updated.mp !== 'All MPs' && MP_LOCATION_MAP[updated.mp]?.state !== value) {
            updated.mp = 'All MPs';
          }
        } else {
          updated.district = 'All Districts';
          updated.mp = 'All MPs';
        }
      }

      // 2. Interdependency when District changes
      if (key === 'district') {
        if (value && value !== 'All Districts' && value !== 'All') {
          const parentState = DISTRICT_STATE_MAP[value];
          if (parentState) {
            updated.state = parentState;
          }
          if (updated.mp !== 'All MPs' && MP_LOCATION_MAP[updated.mp]?.district !== value) {
            updated.mp = 'All MPs';
          }
        }
      }

      // 3. Interdependency when MP changes
      if (key === 'mp') {
        if (value && value !== 'All MPs' && value !== 'All' && MP_LOCATION_MAP[value]) {
          updated.state = MP_LOCATION_MAP[value].state;
          updated.district = MP_LOCATION_MAP[value].district;
        }
      }

      return updated;
    });
  };

  const applyCrossFilter = (key, value) => {
    handleFilterChange(key, value);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_ANALYTICS_FILTERS);
    setGranularity('Monthly');
    setExpenditureMetric('expenditure');
    setMatrixEntity('State');
    setScenarioParams({ monitoringIncrease: 10, expenditureEfficiency: 5 });
  };

  const exportCSV = () => {
    if (!analyticsData?.filteredProjects?.length) return;

    const headers = ['Project ID', 'Project Name', 'State', 'District', 'Constituency', 'MP Name', 'Sector', 'Agency', 'Sanctioned (INR)', 'Expenditure (INR)', 'Status', 'Risk Score', 'Delay (Days)'];
    const rows = analyticsData.filteredProjects.map((p) => [
      `"${p.id}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.state || ''}"`,
      `"${p.district || ''}"`,
      `"${p.constituencyName || ''}"`,
      `"${p.mpName || ''}"`,
      `"${p.projectType || ''}"`,
      `"${p.implementingAgency || ''}"`,
      p.sanctionedAmount || 0,
      p.expenditure || 0,
      `"${p.status || ''}"`,
      p.riskScore || 0,
      p.daysDelayed || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPLADS_Analytics_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    filters,
    granularity,
    expenditureMetric,
    agencyA,
    agencyB,
    matrixEntity,
    scenarioParams,
    analyticsData,
    loading,
    refreshing,
    error,
    lastUpdated,
    setGranularity,
    setExpenditureMetric,
    setAgencyA,
    setAgencyB,
    setMatrixEntity,
    setScenarioParams,
    handleFilterChange,
    applyCrossFilter,
    resetFilters,
    exportCSV,
    refreshData: () => fetchAnalytics(true),
  };
};
