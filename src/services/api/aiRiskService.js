import axiosClient from './axiosClient';
import { getEnrichedRiskProjects } from '../../data/aiRiskData';
import { calculateMPPerformance } from '../../utils/projectAnalytics';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Flagged projects memory set for UI state simulation
const FLAGGED_PROJECTS_SET = new Set();

/**
 * Filter projects based on active AI Risk Monitor filters
 * (State, District, MP, Project Type, Agency, Risk Level, Anomaly Type - NO FY filter!)
 */
export const filterAIRiskProjects = (projects = [], filters = {}) => {
  const {
    state = 'All States',
    district = 'All Districts',
    mp = 'All MPs',
    projectType = 'All Types',
    agency = 'All Agencies',
    riskLevel = 'All Risk Levels',
    anomalyType = 'All Anomalies',
    search = '',
  } = filters;

  return projects.filter((p) => {
    if (!p) return false;

    // Search query
    if (search) {
      const q = search.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchId = (p.id || '').toLowerCase().includes(q);
      const matchMp = (p.mpName || p.mp || '').toLowerCase().includes(q);
      const matchLoc = (p.district || '').toLowerCase().includes(q) || (p.state || '').toLowerCase().includes(q);
      if (!matchName && !matchId && !matchMp && !matchLoc) return false;
    }

    // State Filter
    if (state && state !== 'All States' && state !== 'All') {
      if (p.state?.toLowerCase() !== state.toLowerCase()) return false;
    }

    // District Filter
    if (district && district !== 'All Districts' && district !== 'All') {
      if (p.district?.toLowerCase() !== district.toLowerCase()) return false;
    }

    // MP Filter
    if (mp && mp !== 'All MPs' && mp !== 'All') {
      const mpName = p.mpName || p.mp || '';
      const mpId = p.mpId || '';
      if (!mpName.toLowerCase().includes(mp.toLowerCase()) && !mpId.toLowerCase().includes(mp.toLowerCase())) {
        return false;
      }
    }

    // Project Type Filter
    if (projectType && projectType !== 'All Types' && projectType !== 'All') {
      if (!p.projectType?.toLowerCase().includes(projectType.toLowerCase())) return false;
    }

    // Implementing Agency Filter
    if (agency && agency !== 'All Agencies' && agency !== 'All') {
      if (!p.implementingAgency?.toLowerCase().includes(agency.toLowerCase())) return false;
    }

    // Risk Level Filter
    if (riskLevel && riskLevel !== 'All Risk Levels' && riskLevel !== 'All') {
      if (p.riskLevel !== riskLevel) return false;
    }

    // Anomaly Type Filter
    if (anomalyType && anomalyType !== 'All Anomalies' && anomalyType !== 'All') {
      if (!p.anomalyTypes?.includes(anomalyType) && p.primaryAnomaly !== anomalyType) {
        return false;
      }
    }

    return true;
  });
};

export const aiRiskService = {
  async getActiveProjects(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 50));
      const enriched = getEnrichedRiskProjects();
      const filtered = filterAIRiskProjects(enriched, filters);

      // Attach flagged state
      const processed = filtered.map((p) => ({
        ...p,
        isFlagged: FLAGGED_PROJECTS_SET.has(p.id),
      }));

      return {
        success: true,
        data: processed,
        totalActiveCount: enriched.length,
        filteredCount: processed.length,
      };
    }

    const response = await axiosClient.get('/ai-risk/projects', { params: filters });
    return response.data;
  },

  async getRiskSummaryKPIs(filteredProjects = []) {
    const totalActive = filteredProjects.length;
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

    const highRiskCount = filteredProjects.filter((p) => p.riskLevel === 'HIGH').length;
    const criticalRiskCount = filteredProjects.filter((p) => p.riskLevel === 'CRITICAL').length;
    const riskSum = filteredProjects.reduce((sum, p) => sum + (p.riskScore || 0), 0);
    const avgRiskScore = Number((riskSum / totalActive).toFixed(1));

    const financialFlagsCount = filteredProjects.filter((p) => p.anomalyTypes?.includes('Financial')).length;
    const photoFlagsCount = filteredProjects.filter(
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
  },

  async getProjectRiskDetail(projectId) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 50));
      const enriched = getEnrichedRiskProjects();
      const found = enriched.find((p) => p.id === projectId || p.projectId === projectId) || enriched[0];

      return {
        success: true,
        data: {
          ...found,
          isFlagged: FLAGGED_PROJECTS_SET.has(found.id),
        },
      };
    }

    const response = await axiosClient.get(`/ai-risk/project/${projectId}`);
    return response.data;
  },

  async getStateRiskOverview(filteredProjects = []) {
    const stateMap = {};
    filteredProjects.forEach((p) => {
      if (!p.state) return;
      const st = p.state;
      if (!stateMap[st]) {
        stateMap[st] = { state: st, totalWorks: 0, highRiskCount: 0, riskScoreSum: 0 };
      }
      stateMap[st].totalWorks += 1;
      if (p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL') {
        stateMap[st].highRiskCount += 1;
      }
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
  },

  async getAgencyRiskOverview(filteredProjects = []) {
    const agencyMap = {};
    filteredProjects.forEach((p) => {
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

    const nationalAvgDelay = 31; // days baseline

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
          nationalAvgDelay,
          highRiskCount: ag.highRiskCount,
          avgRiskScore: avgRisk,
          riskTier,
          badgeStyle,
        };
      })
      .sort((a, b) => b.avgRiskScore - a.avgRiskScore);
  },

  async getMPRiskOverview(filteredProjects = []) {
    const mpPerfList = calculateMPPerformance(filteredProjects);
    return mpPerfList
      .map((m) => {
        const totalWorks = m.totalProjects || 1;
        const avgScore = m.averageRiskScore || Math.round((m.riskScoreSum || 0) / totalWorks) || 45;
        const criticalCount = m.delayedProjects > 0 ? Math.min(m.delayedProjects, 2) : (avgScore >= 70 ? 1 : 0);
        const highCount = avgScore >= 55 ? 2 : (m.ongoingProjects > 0 ? 1 : 0);

        return {
          mpId: m.mpId,
          mpName: m.mpName,
          totalWorks: totalWorks,
          highRiskCount: highCount,
          criticalRiskCount: criticalCount,
          avgRiskScore: avgScore,
        };
      })
      .sort((a, b) => b.criticalRiskCount - a.criticalRiskCount || b.highRiskCount - a.highRiskCount || b.avgRiskScore - a.avgRiskScore);
  },

  async getEarlyWarningCounts(filteredProjects = []) {
    const delayLikelyCount = filteredProjects.filter((p) => p.prediction?.delayProbability >= 60 || p.daysDelayed > 0).length;
    const costExceedLikelyCount = filteredProjects.filter((p) => p.prediction?.costOverrunProbability >= 60 || p.costOverrun).length;
    const photoIrregularityCount = filteredProjects.filter((p) => p.anomalyTypes?.includes('Photo') || p.anomalyTypes?.includes('Duplicate Photo') || p.anomalyTypes?.includes('Location')).length;
    const paymentMismatchCount = filteredProjects.filter((p) => p.anomalyTypes?.includes('Payment-Progress Mismatch') || p.paymentProgressMismatch).length;

    return {
      delayLikelyCount,
      costExceedLikelyCount,
      photoIrregularityCount,
      paymentMismatchCount,
    };
  },

  async flagProjectForInvestigation(projectId, notes = '') {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      FLAGGED_PROJECTS_SET.add(projectId);
      return { success: true, message: `Project ${projectId} flagged for manual investigation.` };
    }
    const response = await axiosClient.post(`/ai-risk/project/${projectId}/flag`, { notes });
    return response.data;
  },
};
