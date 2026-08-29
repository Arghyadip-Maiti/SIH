import { useState, useEffect, useCallback, useMemo } from 'react';
import { aiRiskService } from '../services/api/aiRiskService';
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP } from '../services/api/locationService';

export const DEFAULT_RISK_FILTERS = {
  state: 'All States',
  district: 'All Districts',
  projectType: 'All Types',
  agency: 'All Agencies',
  anomalyType: 'All Anomalies',
  search: '',
};

export const useAiRiskData = (projectIdParam = null) => {
  const [filters, setFilters] = useState(DEFAULT_RISK_FILTERS);
  const [projectsData, setProjectsData] = useState([]);
  const [activeProjectDetail, setActiveProjectDetail] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState('Today, 10:42 AM');

  // Fetch active risk projects dataset
  const loadRiskData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiRiskService.getActiveProjects(filters);
      if (res.success || res.data) {
        setProjectsData(res.data || []);
      }
    } catch (err) {
      console.error('[AI Risk Data Load Error]', err);
      setError(err.message || 'Failed to load AI Risk Monitor data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRiskData();
  }, [loadRiskData]);

  // Load single project investigation detail when projectIdParam changes
  const loadProjectDetail = useCallback(async (id) => {
    if (!id) return;
    setDetailLoading(true);
    try {
      const res = await aiRiskService.getProjectRiskDetail(id);
      if (res.success || res.data) {
        setActiveProjectDetail(res.data);
      }
    } catch (err) {
      console.error('[AI Risk Detail Load Error]', err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectIdParam) {
      loadProjectDetail(projectIdParam);
    }
  }, [projectIdParam, loadProjectDetail]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      // State interdependency
      if (key === 'state') {
        if (value && value !== 'All States' && value !== 'All') {
          const validDistricts = STATE_DISTRICT_MAP[value] || [];
          if (updated.district !== 'All Districts' && !validDistricts.includes(updated.district)) {
            updated.district = 'All Districts';
          }
        } else {
          updated.district = 'All Districts';
        }
      }

      // District interdependency
      if (key === 'district') {
        if (value && value !== 'All Districts' && value !== 'All') {
          const parentState = DISTRICT_STATE_MAP[value];
          if (parentState) {
            updated.state = parentState;
          }
        }
      }

      return updated;
    });
  };

  const applyCrossFilter = (key, value) => {
    handleFilterChange(key, value);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_RISK_FILTERS);
  };

  // Flag project action
  const flagProject = async (id) => {
    try {
      await aiRiskService.flagProjectForInvestigation(id);
      if (activeProjectDetail?.id === id) {
        setActiveProjectDetail((prev) => prev ? { ...prev, isFlagged: true } : null);
      }
      setProjectsData((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFlagged: true } : p))
      );
    } catch (err) {
      console.error('[Flag Project Error]', err);
    }
  };

  // 100% Single Source of Truth Derivations from projectsData
  const kpis = useMemo(() => {
    const totalActive = projectsData.length;
    if (totalActive === 0) {
      return {
        totalActiveProjects: 0,
        highRiskCount: 0,
        criticalRiskCount: 0,
        avgRiskScore: 0,
        financialFlagsCount: 0,
        photoFlagsCount: 0,
      };
    }

    const highRiskCount = projectsData.filter((p) => p.riskLevel === 'HIGH').length;
    const criticalRiskCount = projectsData.filter((p) => p.riskLevel === 'CRITICAL').length;
    const riskSum = projectsData.reduce((sum, p) => sum + (p.riskScore || 0), 0);
    const avgRiskScore = Number((riskSum / totalActive).toFixed(1));

    const financialFlagsCount = projectsData.filter((p) => p.anomalyTypes?.includes('Financial')).length;
    const photoFlagsCount = projectsData.filter(
      (p) => p.anomalyTypes?.includes('Photo') || p.anomalyTypes?.includes('Duplicate Photo') || p.anomalyTypes?.includes('Location')
    ).length;

    return {
      totalActiveProjects: totalActive,
      highRiskCount,
      criticalRiskCount,
      avgRiskScore,
      financialFlagsCount,
      photoFlagsCount,
    };
  }, [projectsData]);

  const riskDistribution = useMemo(() => {
    const total = projectsData.length || 1;
    const low = projectsData.filter((p) => p.riskLevel === 'LOW').length;
    const med = projectsData.filter((p) => p.riskLevel === 'MEDIUM').length;
    const high = projectsData.filter((p) => p.riskLevel === 'HIGH').length;
    const crit = projectsData.filter((p) => p.riskLevel === 'CRITICAL').length;

    return [
      { name: 'Low Risk', key: 'LOW', count: low, percentage: Number(((low / total) * 100).toFixed(1)), color: '#10B981' },
      { name: 'Medium Risk', key: 'MEDIUM', count: med, percentage: Number(((med / total) * 100).toFixed(1)), color: '#F59E0B' },
      { name: 'High Risk', key: 'HIGH', count: high, percentage: Number(((high / total) * 100).toFixed(1)), color: '#F97316' },
      { name: 'Critical Risk', key: 'CRITICAL', count: crit, percentage: Number(((crit / total) * 100).toFixed(1)), color: '#EF4444' },
    ];
  }, [projectsData]);

  const anomalyDistribution = useMemo(() => {
    const anomalyMap = {
      'Financial': 0,
      'Photo': 0,
      'Location': 0,
      'Duplicate Photo': 0,
      'Timeline / Delay': 0,
      'Payment-Progress Mismatch': 0,
    };

    projectsData.forEach((p) => {
      (p.anomalyTypes || []).forEach((t) => {
        if (anomalyMap[t] !== undefined) {
          anomalyMap[t] += 1;
        }
      });
    });

    const colors = {
      'Financial': '#475569',
      'Photo': '#8B5CF6',
      'Location': '#F97316',
      'Duplicate Photo': '#EF4444',
      'Timeline / Delay': '#F59E0B',
      'Payment-Progress Mismatch': '#0284C7',
    };

    return Object.entries(anomalyMap).map(([name, count]) => ({
      name,
      key: name,
      count,
      color: colors[name] || '#64748B',
    })).sort((a, b) => b.count - a.count);
  }, [projectsData]);

  const stateRiskOverview = useMemo(() => {
    const stateMap = {};
    projectsData.forEach((p) => {
      if (!p.state) return;
      const st = p.state;
      if (!stateMap[st]) stateMap[st] = { state: st, totalWorks: 0, highRiskCount: 0, riskScoreSum: 0 };
      stateMap[st].totalWorks += 1;
      if (p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL') stateMap[st].highRiskCount += 1;
      stateMap[st].riskScoreSum += p.riskScore || 0;
    });

    return Object.values(stateMap)
      .map((s) => ({
        state: s.state,
        totalWorks: s.totalWorks,
        highRiskCount: s.highRiskCount,
        avgRiskScore: s.totalWorks > 0 ? Math.round(s.riskScoreSum / s.totalWorks) : 0,
      }))
      .sort((a, b) => b.highRiskCount - a.highRiskCount || b.avgRiskScore - a.avgRiskScore);
  }, [projectsData]);

  const agencyRiskOverview = useMemo(() => {
    const agencyMap = {};
    projectsData.forEach((p) => {
      const ag = p.implementingAgency || 'PWD';
      if (!agencyMap[ag]) {
        agencyMap[ag] = { agency: ag, totalWorks: 0, delayDaysSum: 0, delayedWorksCount: 0, highRiskCount: 0, riskScoreSum: 0 };
      }
      agencyMap[ag].totalWorks += 1;
      if (p.delayAnalysis?.delayDays > 0) {
        agencyMap[ag].delayDaysSum += p.delayAnalysis.delayDays;
        agencyMap[ag].delayedWorksCount += 1;
      }
      if (p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL') {
        agencyMap[ag].highRiskCount += 1;
      }
      agencyMap[ag].riskScoreSum += p.riskScore || 0;
    });

    return Object.values(agencyMap)
      .map((ag) => {
        const avgDelay = ag.delayedWorksCount > 0 ? Math.round(ag.delayDaysSum / ag.delayedWorksCount) : 0;
        const avgRisk = ag.totalWorks > 0 ? Math.round(ag.riskScoreSum / ag.totalWorks) : 0;
        
        let riskTier = 'LOW';
        let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (avgRisk >= 60 || avgDelay >= 60) {
          riskTier = 'HIGH';
          badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
        } else if (avgRisk >= 35 || avgDelay >= 35) {
          riskTier = 'MEDIUM';
          badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
        }

        return {
          agency: ag.agency,
          totalWorks: ag.totalWorks,
          avgDelayDays: avgDelay,
          nationalAvgDelay: 31,
          highRiskCount: ag.highRiskCount,
          avgRiskScore: avgRisk,
          riskTier,
          badgeStyle,
        };
      })
      .sort((a, b) => b.avgRiskScore - a.avgRiskScore);
  }, [projectsData]);

  const mpRiskOverview = useMemo(() => {
    const mpMap = {};
    projectsData.forEach((p) => {
      const mpName = p.mpName || p.mp || 'Member of Parliament';
      const key = p.mpId || mpName;
      if (!mpMap[key]) {
        mpMap[key] = {
          mpId: key,
          mpName: mpName,
          constituency: p.constituency || p.district || 'Constituency',
          state: p.state || 'State',
          totalWorks: 0,
          highRiskCount: 0,
          criticalRiskCount: 0,
          riskScoreSum: 0,
        };
      }
      const m = mpMap[key];
      m.totalWorks += 1;
      if (p.riskLevel === 'HIGH') m.highRiskCount += 1;
      if (p.riskLevel === 'CRITICAL') m.criticalRiskCount += 1;
      m.riskScoreSum += p.riskScore || 0;
    });

    return Object.values(mpMap)
      .map((m) => ({
        ...m,
        avgRiskScore: m.totalWorks > 0 ? Math.round(m.riskScoreSum / m.totalWorks) : 0,
      }))
      .sort((a, b) => (b.avgRiskScore || 0) - (a.avgRiskScore || 0) || (b.criticalRiskCount || 0) - (a.criticalRiskCount || 0));
  }, [projectsData]);

  const earlyWarnings = useMemo(() => {
    const delayLikelyCount = projectsData.filter((p) => p.prediction?.delayProbability >= 60 || p.daysDelayed > 0).length;
    const costExceedLikelyCount = projectsData.filter((p) => p.prediction?.costOverrunProbability >= 60 || p.costOverrun).length;
    const photoIrregularityCount = projectsData.filter((p) => p.anomalyTypes?.includes('Photo') || p.anomalyTypes?.includes('Duplicate Photo') || p.anomalyTypes?.includes('Location')).length;
    const paymentMismatchCount = projectsData.filter((p) => p.anomalyTypes?.includes('Payment-Progress Mismatch') || p.paymentProgressMismatch).length;

    return {
      delayLikelyCount,
      costExceedLikelyCount,
      photoIrregularityCount,
      paymentMismatchCount,
    };
  }, [projectsData]);

  return {
    filters,
    projectsData,
    activeProjectDetail,
    loading,
    detailLoading,
    error,
    lastAnalysisTime,
    kpis,
    riskDistribution,
    anomalyDistribution,
    stateRiskOverview,
    agencyRiskOverview,
    mpRiskOverview,
    earlyWarnings,
    handleFilterChange,
    applyCrossFilter,
    resetFilters,
    flagProject,
    refetchData: loadRiskData,
  };
};
