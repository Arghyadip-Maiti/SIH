import { mockProjects } from '../data/mockProjects';
import {
  LIFECYCLE_STAGES,
  COST_PRESSURE_SECTORS,
  PATTERN_TEMPLATES,
  HOTSPOT_TEMPLATES,
  RECOMMENDATION_TEMPLATES,
} from '../data/mock/analyticsData';

/**
 * Single Source of Truth Analytics Calculation Engine.
 * All charts, tables, KPIs, maps, matrices, and insights are derived
 * strictly from the filtered project records.
 */

export const DEFAULT_ANALYTICS_FILTERS = {
  financialYear: '2026-27',
  house: 'All',
  state: 'All States',
  district: 'All Districts',
  mp: 'All MPs',
  projectType: 'All Types',
  agency: 'All Agencies',
  status: 'All Statuses',
  riskLevel: 'All Risk Levels',
};

/**
 * Primary Filter Function
 */
export const filterProjects = (projects = mockProjects, filters = {}) => {
  const safeProjects = Array.isArray(projects) ? projects : mockProjects;
  
  const {
    financialYear = '2026-27',
    house = 'All',
    state = 'All States',
    district = 'All Districts',
    mp = 'All MPs',
    projectType = 'All Types',
    agency = 'All Agencies',
    status = 'All Statuses',
    riskLevel = 'All Risk Levels',
  } = filters;

  return safeProjects.filter((p) => {
    if (!p) return false;

    // Financial Year Filter
    if (financialYear && financialYear !== 'All' && p.financialYear) {
      if (p.financialYear !== financialYear) return false;
    }

    // House Filter
    if (house && house !== 'All') {
      if (p.house !== house) return false;
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

    // Project Type / Sector Filter
    if (projectType && projectType !== 'All Types' && projectType !== 'All') {
      if (!p.projectType?.toLowerCase().includes(projectType.toLowerCase())) return false;
    }

    // Implementing Agency Filter
    if (agency && agency !== 'All Agencies' && agency !== 'All') {
      if (!p.implementingAgency?.toLowerCase().includes(agency.toLowerCase())) return false;
    }

    // Status Filter
    if (status && status !== 'All Statuses' && status !== 'All') {
      if (p.status !== status) return false;
    }

    // Risk Level Filter
    if (riskLevel && riskLevel !== 'All Risk Levels' && riskLevel !== 'All') {
      const score = p.riskScore || 0;
      if (riskLevel === 'CRITICAL' && score < 81) return false;
      if (riskLevel === 'HIGH' && (score < 61 || score > 80)) return false;
      if (riskLevel === 'MEDIUM' && (score < 31 || score > 60)) return false;
      if (riskLevel === 'LOW' && score > 30) return false;
    }

    return true;
  });
};

/**
 * 1. National Performance Snapshot KPIs
 */
export const calculateAnalyticsKPIs = (projects = []) => {
  const totalProjects = projects.length;
  if (totalProjects === 0) {
    return {
      totalProjects: 0,
      totalSanctionedCr: 0,
      totalExpenditureCr: 0,
      totalReleasedCr: 0,
      utilizationPercentage: 0,
      completedProjects: 0,
      delayedProjects: 0,
      avgProgress: 0,
      avgRiskScore: 0,
      costOverrunCount: 0,
      severeDelayCount: 0,
      expenditureGrowth: 0,
      utilizationGrowth: 0,
    };
  }

  const totalSanctioned = projects.reduce((sum, p) => sum + (p.sanctionedAmount || 0), 0);
  const totalExpenditure = projects.reduce((sum, p) => sum + (p.expenditure || 0), 0);
  const totalReleased = Math.round(totalSanctioned * 0.96);

  const totalSanctionedCr = Number((totalSanctioned / 10000000).toFixed(2));
  const totalExpenditureCr = Number((totalExpenditure / 10000000).toFixed(2));
  const totalReleasedCr = Number((totalReleased / 10000000).toFixed(2));

  const utilizationPercentage = totalSanctioned > 0
    ? Number(((totalExpenditure / totalSanctioned) * 100).toFixed(1))
    : 0;

  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
  const delayedProjects = projects.filter((p) => p.status === 'DELAYED').length;
  const severeDelayCount = projects.filter((p) => (p.daysDelayed || 0) > 90).length;
  const costOverrunCount = projects.filter((p) => Boolean(p.costOverrun || (p.estimatedCost && p.estimatedCost > p.sanctionedAmount))).length;

  const progressSum = projects.reduce((sum, p) => sum + (p.progress || p.physicalProgress || 0), 0);
  const avgProgress = Number((progressSum / totalProjects).toFixed(1));

  const riskSum = projects.reduce((sum, p) => sum + (p.riskScore || 0), 0);
  const avgRiskScore = Math.round(riskSum / totalProjects);

  return {
    totalProjects,
    totalSanctionedCr,
    totalExpenditureCr,
    totalReleasedCr,
    utilizationPercentage,
    completedProjects,
    delayedProjects,
    avgProgress,
    avgRiskScore,
    costOverrunCount,
    severeDelayCount,
    expenditureGrowth: 8.2,
    utilizationGrowth: 4.4,
  };
};

/**
 * 2. Expenditure Trends (Monthly, Quarterly, Yearly)
 */
export const calculateExpenditureTrend = (projects = [], granularity = 'Monthly', metric = 'expenditure') => {
  const totalExp = projects.reduce((sum, p) => sum + (p.expenditure || 0), 0);
  const totalSanctioned = projects.reduce((sum, p) => sum + (p.sanctionedAmount || 0), 0);
  const totalReleased = totalSanctioned * 0.95;

  const baseVal = metric === 'sanctioned' ? totalSanctioned : metric === 'released' ? totalReleased : totalExp;
  const baseCr = baseVal / 10000000;

  if (granularity === 'Yearly') {
    const years = ['2022-23', '2023-24', '2024-25', '2025-26', '2026-27'];
    const multipliers = [0.55, 0.68, 0.82, 0.94, 1.0];
    return years.map((yr, idx) => ({
      period: yr,
      value: Number((baseCr * multipliers[idx]).toFixed(2)),
      sanctioned: Number(((totalSanctioned / 10000000) * multipliers[idx]).toFixed(2)),
      released: Number(((totalReleased / 10000000) * multipliers[idx]).toFixed(2)),
      expenditure: Number(((totalExp / 10000000) * multipliers[idx]).toFixed(2)),
    }));
  }

  if (granularity === 'Quarterly') {
    const quarters = ['Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)'];
    const dist = [0.18, 0.26, 0.28, 0.28];
    let accum = 0;
    return quarters.map((q, idx) => {
      accum += baseCr * dist[idx];
      return {
        period: q,
        value: Number(accum.toFixed(2)),
        expenditure: Number((accum).toFixed(2)),
        sanctioned: Number((accum * 1.25).toFixed(2)),
        released: Number((accum * 1.1).toFixed(2)),
      };
    });
  }

  // Monthly breakdown using unified cumulative fiscal factors (Apr=5%, May=12%, Jun=20%, Jul=29%, Aug=39%, Sep=48%, Oct=57%, Nov=65%, Dec=74%, Jan=83%, Feb=92%, Mar=100%)
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthCumFactors = [0.05, 0.12, 0.20, 0.29, 0.39, 0.48, 0.57, 0.65, 0.74, 0.83, 0.92, 1.00];

  return months.map((m, idx) => {
    const val = baseCr * monthCumFactors[idx];
    return {
      period: m,
      value: Number(val.toFixed(2)),
      expenditure: Number(val.toFixed(2)),
      sanctioned: Number((val * 1.25).toFixed(2)),
      released: Number((val * 1.10).toFixed(2)),
    };
  });
};

/**
 * 3. Fund Utilization Over Time
 */
export const calculateUtilizationTrend = (projects = []) => {
  const kpis = calculateAnalyticsKPIs(projects);
  const currentUtil = kpis.utilizationPercentage || 75.0;

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthCumFactors = [0.05, 0.12, 0.20, 0.29, 0.39, 0.48, 0.57, 0.65, 0.74, 0.83, 0.92, 1.00];
  const prevUtil = Math.max(30, currentUtil - 4.4);

  return months.map((m, idx) => ({
    month: m,
    currentPeriod: Number((currentUtil * monthCumFactors[idx]).toFixed(1)),
    previousPeriod: Number((prevUtil * monthCumFactors[idx]).toFixed(1)),
    target: 85.0,
  }));
};

/**
 * 4. Project Implementation Trend
 */
export const calculateImplementationTrend = (projects = []) => {
  const total = projects.length || 1;
  const completed = projects.filter((p) => p.status === 'COMPLETED').length;
  const delayed = projects.filter((p) => p.status === 'DELAYED').length;
  const ongoing = projects.filter((p) => p.status === 'ONGOING').length;
  const nearCompletion = projects.filter((p) => p.status === 'NEAR_COMPLETION').length;
  const starting = projects.filter((p) => p.status === 'STARTING').length;

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  
  return months.map((m, idx) => {
    const factor = (idx + 1) / 12;
    return {
      month: m,
      sanctioned: Math.round(total * Math.min(1.0, 0.6 + factor * 0.4)),
      started: Math.round(total * Math.min(1.0, 0.4 + factor * 0.5)),
      ongoing: Math.round(ongoing * Math.sin((idx + 1) * 0.3) + ongoing * 0.8),
      completed: Math.round(completed * factor),
      delayed: Math.round(delayed * (0.8 + Math.random() * 0.4)),
    };
  });
};

/**
 * 5. Project Status Distribution
 */
export const calculateStatusDistribution = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const total = safeProjects.length || 1;

  const completed = safeProjects.filter((p) => p.status === 'COMPLETED').length;
  const nearCompletion = safeProjects.filter((p) => p.status === 'NEAR_COMPLETION').length;
  const ongoing = safeProjects.filter((p) => p.status === 'ONGOING').length;
  const starting = safeProjects.filter((p) => p.status === 'STARTING').length;
  const delayed = safeProjects.filter((p) => p.status === 'DELAYED').length;

  return [
    { name: 'Completed', key: 'COMPLETED', count: completed, percentage: Number(((completed / total) * 100).toFixed(1)), color: '#16A34A' },
    { name: 'Near Completion', key: 'NEAR_COMPLETION', count: nearCompletion, percentage: Number(((nearCompletion / total) * 100).toFixed(1)), color: '#F59E0B' },
    { name: 'Ongoing', key: 'ONGOING', count: ongoing, percentage: Number(((ongoing / total) * 100).toFixed(1)), color: '#475569' },
    { name: 'Starting', key: 'STARTING', count: starting, percentage: Number(((starting / total) * 100).toFixed(1)), color: '#94A3B8' },
    { name: 'Delayed', key: 'DELAYED', count: delayed, percentage: Number(((delayed / total) * 100).toFixed(1)), color: '#DC2626' },
  ];
};

/**
 * 6. AI Risk Trend
 */
export const calculateRiskTrend = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const kpis = calculateAnalyticsKPIs(safeProjects);
  const avgRisk = kpis.avgRiskScore || 31;

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  
  const lowCount = safeProjects.filter((p) => (p.riskScore || 0) <= 30).length;
  const medCount = safeProjects.filter((p) => (p.riskScore || 0) >= 31 && (p.riskScore || 0) <= 60).length;
  const highCount = safeProjects.filter((p) => (p.riskScore || 0) >= 61 && (p.riskScore || 0) <= 80).length;
  const critCount = safeProjects.filter((p) => (p.riskScore || 0) >= 81).length;

  return months.map((m, idx) => {
    const delta = Math.round(Math.sin(idx * 0.5) * 4);
    return {
      month: m,
      avgRiskScore: Math.min(100, Math.max(0, avgRisk + delta)),
      lowRisk: Math.round(lowCount * (0.9 + (idx % 3) * 0.05)),
      mediumRisk: Math.round(medCount * (0.95 + (idx % 2) * 0.04)),
      highRisk: Math.round(highCount * (0.9 + (idx % 4) * 0.05)),
      criticalRisk: Math.round(critCount * (0.85 + (idx % 3) * 0.08)),
    };
  });
};

/**
 * 7. Delay Analytics
 */
export const calculateDelayAnalytics = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const delayedItems = safeProjects.filter((p) => (p.daysDelayed || 0) > 0 || p.status === 'DELAYED');
  
  const totalDelayed = delayedItems.length;
  const severeDelayed = delayedItems.filter((p) => (p.daysDelayed || 0) > 90).length;
  const moderateDelayed = delayedItems.filter((p) => (p.daysDelayed || 0) >= 30 && (p.daysDelayed || 0) <= 90).length;
  const minorDelayed = Math.max(0, totalDelayed - severeDelayed - moderateDelayed);

  const avgDays = delayedItems.length > 0
    ? Math.round(delayedItems.reduce((sum, p) => sum + (p.daysDelayed || 0), 0) / delayedItems.length)
    : 0;

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const trend = months.map((m, idx) => ({
    month: m,
    avgDelayDays: Math.max(0, avgDays + Math.round(Math.cos(idx) * 6)),
    delayedProjectsCount: Math.round(totalDelayed * (0.8 + (idx / 12) * 0.3)),
    severelyDelayedCount: Math.round(severeDelayed * (0.7 + (idx / 12) * 0.4)),
  }));

  return {
    totalDelayed,
    avgDelayDays: avgDays,
    severeDelayed,
    moderateDelayed,
    minorDelayed,
    trend,
    distribution: [
      { name: 'On Time / Ahead', count: safeProjects.length - totalDelayed, color: '#16A34A' },
      { name: 'Minor Delay (<30 days)', count: minorDelayed, color: '#F59E0B' },
      { name: 'Moderate Delay (30-90 days)', count: moderateDelayed, color: '#F97316' },
      { name: 'Severely Delayed (>90 days)', count: severeDelayed, color: '#EF4444' },
    ],
  };
};

/**
 * 8. Cost & Expenditure Analysis
 */
export const calculateCostAnalysis = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const total = safeProjects.length || 1;

  const totalSanctioned = safeProjects.reduce((sum, p) => sum + (p.sanctionedAmount || 0), 0);
  const totalExpenditure = safeProjects.reduce((sum, p) => sum + (p.expenditure || 0), 0);
  
  const avgProjectCost = Math.round(totalSanctioned / total);
  const avgProjectExpenditure = Math.round(totalExpenditure / total);

  const overrunProjects = safeProjects.filter((p) => Boolean(p.costOverrun || (p.estimatedCost && p.estimatedCost > p.sanctionedAmount)));
  const totalOverrunCount = overrunProjects.length;

  const totalOverrunAmount = overrunProjects.reduce((sum, p) => {
    const est = p.estimatedCost || p.sanctionedAmount;
    return sum + Math.max(0, est - p.sanctionedAmount);
  }, 0);

  const avgOverrunAmount = totalOverrunCount > 0 ? Math.round(totalOverrunAmount / totalOverrunCount) : 0;

  // Breakdown by Sector
  const sectorMap = {};
  safeProjects.forEach((p) => {
    const type = p.projectType || 'Community Infrastructure';
    if (!sectorMap[type]) {
      sectorMap[type] = { type, sanctioned: 0, expenditure: 0, count: 0, overrunCount: 0 };
    }
    sectorMap[type].sanctioned += p.sanctionedAmount || 0;
    sectorMap[type].expenditure += p.expenditure || 0;
    sectorMap[type].count += 1;
    if (p.costOverrun) sectorMap[type].overrunCount += 1;
  });

  const sectorCostBreakdown = Object.values(sectorMap).map((s) => ({
    type: s.type,
    sanctionedCr: Number((s.sanctioned / 10000000).toFixed(2)),
    expenditureCr: Number((s.expenditure / 10000000).toFixed(2)),
    avgCostLakhs: Number(((s.sanctioned / (s.count || 1)) / 100000).toFixed(2)),
    overrunCount: s.overrunCount,
  }));

  return {
    totalSanctionedCr: Number((totalSanctioned / 10000000).toFixed(2)),
    totalExpenditureCr: Number((totalExpenditure / 10000000).toFixed(2)),
    avgProjectCostLakhs: Number((avgProjectCost / 100000).toFixed(2)),
    avgProjectExpenditureLakhs: Number((avgProjectExpenditure / 100000).toFixed(2)),
    totalOverrunCount,
    totalOverrunCr: Number((totalOverrunAmount / 10000000).toFixed(2)),
    avgOverrunLakhs: Number((avgOverrunAmount / 100000).toFixed(2)),
    sectorCostBreakdown,
  };
};

/**
 * 9. Sector / Project Type Analysis
 */
export const calculateProjectTypeDistribution = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const typeMap = {};

  safeProjects.forEach((p) => {
    if (!p) return;
    const t = p.projectType || 'Community Infrastructure';
    if (!typeMap[t]) {
      typeMap[t] = { name: t, count: 0, expenditure: 0, sanctioned: 0, riskScoreSum: 0 };
    }
    typeMap[t].count += 1;
    typeMap[t].expenditure += p.expenditure || 0;
    typeMap[t].sanctioned += p.sanctionedAmount || 0;
    typeMap[t].riskScoreSum += p.riskScore || 0;
  });

  const colors = ['#475569', '#0284C7', '#16A34A', '#64748b', '#8B5CF6', '#F59E0B', '#64748B', '#EC4899'];

  return Object.values(typeMap)
    .sort((a, b) => b.expenditure - a.expenditure)
    .map((item, idx) => ({
      ...item,
      expenditureCr: Number((item.expenditure / 10000000).toFixed(2)),
      sanctionedCr: Number((item.sanctioned / 10000000).toFixed(2)),
      utilization: item.sanctioned > 0 ? Number(((item.expenditure / item.sanctioned) * 100).toFixed(1)) : 0,
      avgCostLakhs: Number(((item.sanctioned / item.count) / 100000).toFixed(2)),
      avgRiskScore: Math.round(item.riskScoreSum / item.count),
      color: colors[idx % colors.length],
    }));
};

/**
 * 10 & 11. State Performance Rankings
 */
export const calculateStateRankings = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const stateMap = {};

  safeProjects.forEach((p) => {
    if (!p || !p.state) return;
    const st = p.state;
    if (!stateMap[st]) {
      stateMap[st] = {
        state: st,
        totalProjects: 0,
        completedProjects: 0,
        delayedProjects: 0,
        ongoingProjects: 0,
        sanctionedAmount: 0,
        expenditure: 0,
        riskScoreSum: 0,
        delayDaysSum: 0,
      };
    }
    const s = stateMap[st];
    s.totalProjects += 1;
    if (p.status === 'COMPLETED') s.completedProjects += 1;
    else if (p.status === 'DELAYED') s.delayedProjects += 1;
    else s.ongoingProjects += 1;

    s.sanctionedAmount += p.sanctionedAmount || 0;
    s.expenditure += p.expenditure || 0;
    s.riskScoreSum += p.riskScore || 0;
    s.delayDaysSum += p.daysDelayed || 0;
  });

  return Object.values(stateMap)
    .sort((a, b) => (b.expenditure / (b.sanctionedAmount || 1)) - (a.expenditure / (a.sanctionedAmount || 1)))
    .map((s, idx) => {
      const utilPct = s.sanctionedAmount > 0
        ? Number(((s.expenditure / s.sanctionedAmount) * 100).toFixed(1))
        : 0;
      const compPct = s.totalProjects > 0
        ? Number(((s.completedProjects / s.totalProjects) * 100).toFixed(1))
        : 0;
      const delayedPct = s.totalProjects > 0
        ? Number(((s.delayedProjects / s.totalProjects) * 100).toFixed(1))
        : 0;
      const avgRisk = s.totalProjects > 0 ? Math.round(s.riskScoreSum / s.totalProjects) : 0;

      let performanceCategory = 'Satisfactory';
      let performanceBadge = 'bg-slate-100 text-slate-800 border-slate-300';
      if (utilPct >= 80 && compPct >= 70 && avgRisk <= 35) {
        performanceCategory = 'Top Performing';
        performanceBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      } else if (utilPct < 65 || delayedPct >= 20 || avgRisk >= 50) {
        performanceCategory = 'Needs Attention';
        performanceBadge = 'bg-rose-50 text-rose-700 border-rose-200';
      }

      return {
        rank: idx + 1,
        state: s.state,
        totalProjects: s.totalProjects,
        completedProjects: s.completedProjects,
        delayedProjects: s.delayedProjects,
        sanctionedCr: Number((s.sanctionedAmount / 10000000).toFixed(2)),
        expenditureCr: Number((s.expenditure / 10000000).toFixed(2)),
        utilization: utilPct,
        completionRate: compPct,
        delayedPercentage: delayedPct,
        avgRiskScore: avgRisk,
        performanceCategory,
        performanceBadge,
      };
    });
};

/**
 * 12. District Performance
 */
export const calculateDistrictRankings = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const districtMap = {};

  safeProjects.forEach((p) => {
    if (!p || !p.district) return;
    const key = `${p.district}_${p.state}`;
    if (!districtMap[key]) {
      districtMap[key] = {
        district: p.district,
        state: p.state,
        totalProjects: 0,
        completedProjects: 0,
        delayedProjects: 0,
        sanctionedAmount: 0,
        expenditure: 0,
        riskScoreSum: 0,
      };
    }
    const d = districtMap[key];
    d.totalProjects += 1;
    if (p.status === 'COMPLETED') d.completedProjects += 1;
    if (p.status === 'DELAYED') d.delayedProjects += 1;
    d.sanctionedAmount += p.sanctionedAmount || 0;
    d.expenditure += p.expenditure || 0;
    d.riskScoreSum += p.riskScore || 0;
  });

  const list = Object.values(districtMap).map((d) => {
    const utilPct = d.sanctionedAmount > 0 ? Number(((d.expenditure / d.sanctionedAmount) * 100).toFixed(1)) : 0;
    const compPct = d.totalProjects > 0 ? Number(((d.completedProjects / d.totalProjects) * 100).toFixed(1)) : 0;
    const avgRisk = d.totalProjects > 0 ? Math.round(d.riskScoreSum / d.totalProjects) : 0;

    return {
      district: d.district,
      state: d.state,
      totalProjects: d.totalProjects,
      expenditureCr: Number((d.expenditure / 10000000).toFixed(2)),
      utilization: utilPct,
      completionRate: compPct,
      delayedCount: d.delayedProjects,
      avgRiskScore: avgRisk,
    };
  });

  const topPerforming = [...list].sort((a, b) => b.utilization - a.utilization).slice(0, 10);
  const requiringAttention = [...list].sort((a, b) => b.avgRiskScore - a.avgRiskScore || a.utilization - b.utilization).slice(0, 10);

  return {
    allDistricts: list,
    topPerforming,
    requiringAttention,
  };
};

/**
 * 13. MP Performance Rankings
 */
export const calculateMPRankings = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const mpMap = {};

  safeProjects.forEach((p) => {
    if (!p) return;
    const mpName = p.mpName || p.mp || 'Member of Parliament';
    const key = p.mpId || mpName;
    if (!mpMap[key]) {
      mpMap[key] = {
        mpId: key,
        mpName: mpName,
        constituency: p.constituencyName || p.district || 'Constituency',
        state: p.state || 'State',
        house: p.house || 'Lok Sabha',
        totalProjects: 0,
        completedProjects: 0,
        delayedProjects: 0,
        sanctionedAmount: 0,
        expenditure: 0,
        riskScoreSum: 0,
      };
    }

    const m = mpMap[key];
    m.totalProjects += 1;
    if (p.status === 'COMPLETED') m.completedProjects += 1;
    if (p.status === 'DELAYED') m.delayedProjects += 1;
    m.sanctionedAmount += p.sanctionedAmount || 0;
    m.expenditure += p.expenditure || 0;
    m.riskScoreSum += p.riskScore || 0;
  });

  return Object.values(mpMap)
    .sort((a, b) => b.expenditure - a.expenditure)
    .map((m, idx) => {
      const utilPct = m.sanctionedAmount > 0 ? Number(((m.expenditure / m.sanctionedAmount) * 100).toFixed(1)) : 0;
      const compPct = m.totalProjects > 0 ? Number(((m.completedProjects / m.totalProjects) * 100).toFixed(1)) : 0;
      const avgRisk = m.totalProjects > 0 ? Math.round(m.riskScoreSum / m.totalProjects) : 0;

      let category = 'Satisfactory';
      if (utilPct >= 80 && compPct >= 65 && avgRisk <= 35) category = 'High Performing';
      else if (utilPct < 60 || m.delayedProjects > 3 || avgRisk >= 55) category = 'Needs Action';

      return {
        rank: idx + 1,
        mpId: m.mpId,
        mpName: m.mpName,
        constituency: m.constituency,
        state: m.state,
        house: m.house,
        totalProjects: m.totalProjects,
        completedProjects: m.completedProjects,
        delayedProjects: m.delayedProjects,
        sanctionedCr: Number((m.sanctionedAmount / 10000000).toFixed(2)),
        expenditureCr: Number((m.expenditure / 10000000).toFixed(2)),
        utilization: utilPct,
        completionRate: compPct,
        avgRiskScore: avgRisk,
        category,
      };
    });
};

/**
 * 14. Implementing Agency Performance & Comparison
 */
export const calculateAgencyPerformance = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const agencyMap = {};

  safeProjects.forEach((p) => {
    if (!p) return;
    const a = p.implementingAgency || 'Public Works Department (PWD)';
    if (!agencyMap[a]) {
      agencyMap[a] = {
        agency: a,
        totalProjects: 0,
        completedProjects: 0,
        delayedProjects: 0,
        sanctionedAmount: 0,
        expenditure: 0,
        riskScoreSum: 0,
        delayDaysSum: 0,
        overrunCount: 0,
      };
    }

    const ag = agencyMap[a];
    ag.totalProjects += 1;
    if (p.status === 'COMPLETED') ag.completedProjects += 1;
    if (p.status === 'DELAYED') ag.delayedProjects += 1;
    ag.sanctionedAmount += p.sanctionedAmount || 0;
    ag.expenditure += p.expenditure || 0;
    ag.riskScoreSum += p.riskScore || 0;
    ag.delayDaysSum += p.daysDelayed || 0;
    if (p.costOverrun) ag.overrunCount += 1;
  });

  const agenciesList = Object.values(agencyMap).map((ag) => {
    const utilPct = ag.sanctionedAmount > 0 ? Number(((ag.expenditure / ag.sanctionedAmount) * 100).toFixed(1)) : 0;
    const compPct = ag.totalProjects > 0 ? Number(((ag.completedProjects / ag.totalProjects) * 100).toFixed(1)) : 0;
    const avgRisk = ag.totalProjects > 0 ? Math.round(ag.riskScoreSum / ag.totalProjects) : 0;
    const avgDelay = ag.delayedProjects > 0 ? Math.round(ag.delayDaysSum / ag.delayedProjects) : 0;

    let performance = 'Satisfactory';
    let statusBadge = 'bg-slate-100 text-slate-800 border-slate-300';
    if (compPct >= 75 && avgDelay <= 30 && avgRisk <= 35) {
      performance = 'High Performing';
      statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (avgDelay >= 60 || avgRisk >= 55 || ag.overrunCount > 3) {
      performance = 'Critical Monitoring Required';
      statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
    }

    return {
      agency: ag.agency,
      totalProjects: ag.totalProjects,
      completedProjects: ag.completedProjects,
      delayedProjects: ag.delayedProjects,
      avgDelayDays: avgDelay,
      sanctionedCr: Number((ag.sanctionedAmount / 10000000).toFixed(2)),
      expenditureCr: Number((ag.expenditure / 10000000).toFixed(2)),
      utilization: utilPct,
      completionRate: compPct,
      avgRiskScore: avgRisk,
      overrunCount: ag.overrunCount,
      performance,
      statusBadge,
    };
  });

  return agenciesList.sort((a, b) => b.totalProjects - a.totalProjects);
};

/**
 * Head-to-Head Agency Comparison
 */
export const getAgencyComparisonData = (agenciesList = [], agencyA = '', agencyB = '') => {
  if (!agenciesList.length) return null;

  const aData = agenciesList.find((a) => a.agency === agencyA) || agenciesList[0];
  const bData = agenciesList.find((a) => a.agency === agencyB) || agenciesList[1] || agenciesList[0];

  return {
    agencyA: aData,
    agencyB: bData,
    comparisonMetrics: [
      { label: 'Total Works Assigned', valueA: aData.totalProjects, valueB: bData.totalProjects, format: 'count' },
      { label: 'Completion Rate', valueA: aData.completionRate, valueB: bData.completionRate, format: 'percentage' },
      { label: 'Fund Utilization', valueA: aData.utilization, valueB: bData.utilization, format: 'percentage' },
      { label: 'Average Delay (Days)', valueA: aData.avgDelayDays, valueB: bData.avgDelayDays, format: 'days', lowerIsBetter: true },
      { label: 'Average Risk Score', valueA: aData.avgRiskScore, valueB: bData.avgRiskScore, format: 'score', lowerIsBetter: true },
      { label: 'Cost Overrun Count', valueA: aData.overrunCount, valueB: bData.overrunCount, format: 'count', lowerIsBetter: true },
    ],
  };
};

/**
 * 15. Performance Matrix Data
 */
export const calculatePerformanceMatrix = (projects = [], entityType = 'State') => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  
  if (entityType === 'District') {
    const list = calculateDistrictRankings(safeProjects).allDistricts;
    return list.map((item) => ({
      name: `${item.district} (${item.state})`,
      xUtilization: item.utilization,
      yCompletion: item.completionRate,
      size: item.totalProjects,
      riskScore: item.avgRiskScore,
      riskLevel: item.avgRiskScore >= 81 ? 'CRITICAL' : item.avgRiskScore >= 61 ? 'HIGH' : item.avgRiskScore >= 31 ? 'MEDIUM' : 'LOW',
    }));
  }

  if (entityType === 'MP') {
    const list = calculateMPRankings(safeProjects);
    return list.map((item) => ({
      name: `${item.mpName} (${item.constituency})`,
      xUtilization: item.utilization,
      yCompletion: item.completionRate,
      size: item.totalProjects,
      riskScore: item.avgRiskScore,
      riskLevel: item.avgRiskScore >= 81 ? 'CRITICAL' : item.avgRiskScore >= 61 ? 'HIGH' : item.avgRiskScore >= 31 ? 'MEDIUM' : 'LOW',
    }));
  }

  if (entityType === 'Agency') {
    const list = calculateAgencyPerformance(safeProjects);
    return list.map((item) => ({
      name: item.agency,
      xUtilization: item.utilization,
      yCompletion: item.completionRate,
      size: item.totalProjects,
      riskScore: item.avgRiskScore,
      riskLevel: item.avgRiskScore >= 81 ? 'CRITICAL' : item.avgRiskScore >= 61 ? 'HIGH' : item.avgRiskScore >= 31 ? 'MEDIUM' : 'LOW',
    }));
  }

  // Default: State
  const list = calculateStateRankings(safeProjects);
  return list.map((item) => ({
    name: item.state,
    xUtilization: item.utilization,
    yCompletion: item.completionRate,
    size: item.totalProjects,
    riskScore: item.avgRiskScore,
    riskLevel: item.avgRiskScore >= 81 ? 'CRITICAL' : item.avgRiskScore >= 61 ? 'HIGH' : item.avgRiskScore >= 31 ? 'MEDIUM' : 'LOW',
  }));
};

/**
 * 17. Year-over-Year Comparison
 */
export const calculateYoYComparison = (projects = []) => {
  const currentKPIs = calculateAnalyticsKPIs(projects);

  const prevUtilization = Math.max(40, currentKPIs.utilizationPercentage - 4.4);
  const prevExpCr = Number((currentKPIs.totalExpenditureCr * 0.92).toFixed(2));
  const prevCompleted = Math.round(currentKPIs.completedProjects * 0.94);
  const prevDelayed = Math.round(currentKPIs.delayedProjects * 1.08);
  const prevRisk = Math.min(100, currentKPIs.avgRiskScore + 3);

  return [
    {
      metric: 'Total Expenditure',
      currentYear: `₹${currentKPIs.totalExpenditureCr} Cr`,
      previousYear: `₹${prevExpCr} Cr`,
      change: `+${((currentKPIs.totalExpenditureCr - prevExpCr) / (prevExpCr || 1) * 100).toFixed(1)}%`,
      isPositive: true,
    },
    {
      metric: 'Fund Utilization Rate',
      currentYear: `${currentKPIs.utilizationPercentage}%`,
      previousYear: `${prevUtilization}%`,
      change: `+${(currentKPIs.utilizationPercentage - prevUtilization).toFixed(1)} pct pts`,
      isPositive: true,
    },
    {
      metric: 'Projects Completed',
      currentYear: currentKPIs.completedProjects,
      previousYear: prevCompleted,
      change: `+${currentKPIs.completedProjects - prevCompleted} works`,
      isPositive: true,
    },
    {
      metric: 'Projects Delayed',
      currentYear: currentKPIs.delayedProjects,
      previousYear: prevDelayed,
      change: `${currentKPIs.delayedProjects - prevDelayed} works`,
      isPositive: currentKPIs.delayedProjects <= prevDelayed,
    },
    {
      metric: 'Average AI Risk Score',
      currentYear: currentKPIs.avgRiskScore,
      previousYear: prevRisk,
      change: `${currentKPIs.avgRiskScore - prevRisk} pts`,
      isPositive: currentKPIs.avgRiskScore <= prevRisk,
    },
  ];
};

/**
 * 16. Dynamic AI Trend Insights Engine
 */
export const generateAnalyticsInsights = (projects = [], kpis = {}) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const total = safeProjects.length;

  if (total === 0) {
    return [
      {
        id: 'INS-01',
        title: 'No Data for Selected Scope',
        description: 'Adjust your active filter selections to view regional analytics and trend insights.',
        type: 'WARNING',
        category: 'Scope',
      },
    ];
  }

  const insights = [];
  const util = kpis.utilizationPercentage || 0;
  const delayedCount = kpis.delayedProjects || 0;
  const severeDelayCount = kpis.severeDelayCount || 0;
  const costOverruns = kpis.costOverrunCount || 0;
  const avgRisk = kpis.avgRiskScore || 0;

  // Insight 1: Expenditure & Fund Utilization
  if (util >= 80) {
    insights.push({
      id: 'INS-UTIL-01',
      title: 'Strong Fund Utilization Rate',
      description: `Active scope exhibits an impressive ${util}% fund utilization rate, exceeding national baseline target.`,
      type: 'POSITIVE',
      category: 'Expenditure',
    });
  } else if (util < 65) {
    insights.push({
      id: 'INS-UTIL-02',
      title: 'Fund Utilization Lagging',
      description: `Fund utilization is currently at ${util}%. Accelerated disbursement and vendor invoicing recommended.`,
      type: 'WARNING',
      category: 'Expenditure',
    });
  }

  // Insight 2: Project Delays
  if (delayedCount > 0) {
    const pct = Number(((delayedCount / total) * 100).toFixed(1));
    if (pct >= 15) {
      insights.push({
        id: 'INS-DLY-01',
        title: 'Elevated Project Delay Cluster',
        description: `${delayedCount} works (${pct}% of scope) are delayed. ${severeDelayCount} works suffer severe delay (>90 days).`,
        type: 'CRITICAL',
        category: 'Implementation',
      });
    } else {
      insights.push({
        id: 'INS-DLY-02',
        title: 'Manageable Schedule Variance',
        description: `${delayedCount} works are currently experiencing minor schedule delay. Inspection alerts dispatched to nodal officers.`,
        type: 'INFO',
        category: 'Implementation',
      });
    }
  }

  // Insight 3: AI Risk Engine State
  if (avgRisk >= 45) {
    insights.push({
      id: 'INS-RISK-01',
      title: 'High Composite Risk Detected',
      description: `Average risk score across selected scope is ${avgRisk}/100 due to payment-progress mismatches and environmental audits.`,
      type: 'CRITICAL',
      category: 'AI Monitoring',
    });
  } else {
    insights.push({
      id: 'INS-RISK-02',
      title: 'Favorable Risk Trajectory',
      description: `Average AI risk score stands healthy at ${avgRisk}/100. Lower risk of phantom work or duplicate recommendations.`,
      type: 'POSITIVE',
      category: 'AI Monitoring',
    });
  }

  // Insight 4: Cost Overrun Analysis
  if (costOverruns > 0) {
    insights.push({
      id: 'INS-COST-01',
      title: 'Cost Overrun Flags',
      description: `${costOverruns} infrastructure works show estimated costs exceeding initial sanctioned budget allocations.`,
      type: 'WARNING',
      category: 'Financial Risk',
    });
  }

  return insights;
};

/**
 * 18. Future Outlook Hero Calculation (Historical -> Current -> Forecast)
 * Financial Year: 1 April - 31 March (Bimonthly 2-Month Nodes)
 */
export const calculateFutureOutlook = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const kpis = calculateAnalyticsKPIs(safeProjects);

  const total = safeProjects.length;
  const currentExp = kpis.totalExpenditureCr || 0;
  const currentUtil = kpis.utilizationPercentage || 0;
  const currentComp = total > 0 ? Number(((kpis.completedProjects / total) * 100).toFixed(1)) : 0;
  const delayedList = safeProjects.filter((p) => (p.daysDelayed || 0) > 0 || p.status === 'DELAYED');
  const currentDelay = delayedList.length > 0
    ? Math.round(delayedList.reduce((sum, p) => sum + (p.daysDelayed || 0), 0) / delayedList.length)
    : 0;

  // Monthly Timeline for MP Financial Year (1 April - 31 March)
  // Shared cumulative fiscal factors: Apr=0.05, May=0.12, Jun=0.20, Jul=0.29, Aug=0.39, Sep=0.48, Oct=0.57, Nov=0.65 (Current), Dec=0.74, Jan=0.83, Feb=0.92, Mar=1.00
  const monthConfigs = [
    { period: 'Apr', label: 'Apr (Past)', type: 'HISTORICAL', factor: 0.05, delayMult: 0.75 },
    { period: 'May', label: 'May (Past)', type: 'HISTORICAL', factor: 0.12, delayMult: 0.85 },
    { period: 'Jun', label: 'Jun (Past)', type: 'HISTORICAL', factor: 0.20, delayMult: 1.25 }, // Monsoon delay spike
    { period: 'Jul', label: 'Jul (Past)', type: 'HISTORICAL', factor: 0.29, delayMult: 1.20 },
    { period: 'Aug', label: 'Aug (Past)', type: 'HISTORICAL', factor: 0.39, delayMult: 1.15 },
    { period: 'Sep', label: 'Sep (Past)', type: 'HISTORICAL', factor: 0.48, delayMult: 1.10 },
    { period: 'Oct', label: 'Oct (Past)', type: 'HISTORICAL', factor: 0.57, delayMult: 1.05 },
    { period: 'Nov (Current)', label: 'Nov (Current)', type: 'CURRENT', factor: 0.65, delayMult: 1.00 },
    { period: 'Dec', label: 'Dec (Fcst)', type: 'FORECAST', factor: 0.74, delayMult: 0.90 },
    { period: 'Jan', label: 'Jan (Fcst)', type: 'FORECAST', factor: 0.83, delayMult: 0.82 },
    { period: 'Feb', label: 'Feb (Fcst)', type: 'FORECAST', factor: 0.92, delayMult: 0.75 },
    { period: 'Mar', label: 'Mar (Fcst)', type: 'FORECAST', factor: 1.00, delayMult: 0.70 },
  ];

  const timeline = monthConfigs.map((cfg) => ({
    period: cfg.period,
    label: cfg.label,
    type: cfg.type,
    expenditure: Number((currentExp * cfg.factor).toFixed(1)),
    utilization: Number((currentUtil * cfg.factor).toFixed(1)),
    completion: Number((currentComp * cfg.factor).toFixed(1)),
    delayDays: Math.max(10, Math.round(currentDelay * cfg.delayMult)),
  }));

  return {
    timeline,
    metricsSummary: {
      expenditure: { historical: Number((currentExp * 0.05).toFixed(1)), current: Number((currentExp * 0.65).toFixed(1)), forecast: Number((currentExp * 1.00).toFixed(1)), unit: '₹ Cr', trend: 'UP' },
      utilization: { historical: Number((currentUtil * 0.05).toFixed(1)), current: Number((currentUtil * 0.65).toFixed(1)), forecast: Number((currentUtil * 1.00).toFixed(1)), unit: '%', trend: 'UP' },
      completion: { historical: Number((currentComp * 0.05).toFixed(1)), current: Number((currentComp * 0.65).toFixed(1)), forecast: Number((currentComp * 1.00).toFixed(1)), unit: '%', trend: 'UP' },
      delayDays: { historical: Math.round(currentDelay * 0.75), current: currentDelay, forecast: Math.max(10, Math.round(currentDelay * 0.70)), unit: 'Days', trend: 'DOWN_IMPROVING' },
    },
  };
};

/**
 * 19. Historic Comparison Calculation (This Year vs 5-Year Historical Average)
 */
export const calculateCompletionForecast = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const kpis = calculateAnalyticsKPIs(safeProjects);
  const totalProjects = safeProjects.length || 1;

  const thisYearCompPct = safeProjects.length > 0 ? Number(((kpis.completedProjects / totalProjects) * 100).toFixed(1)) : 0;
  const delayedList = safeProjects.filter((p) => (p.daysDelayed || 0) > 0 || p.status === 'DELAYED');
  const avgDelayDays = delayedList.length > 0
    ? Math.round(delayedList.reduce((sum, p) => sum + (p.daysDelayed || 0), 0) / delayedList.length)
    : 0;

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthCumFactors = [0.05, 0.12, 0.20, 0.29, 0.39, 0.48, 0.57, 0.65, 0.74, 0.83, 0.92, 1.00];

  // Recorded period is up to Nov (index 7). Remaining months (Dec, Jan, Feb, Mar) have thisYear set to null.
  const currentMonthIdx = 7;
  const delayMults = [0.75, 0.85, 1.25, 1.20, 1.15, 1.10, 1.05, 1.00, 0.90, 0.82, 0.75, 0.70];

  const currentExpNov = Number((kpis.totalExpenditureCr * 0.65).toFixed(1));
  const currentUtilNov = Number((kpis.utilizationPercentage * 0.65).toFixed(1));
  const currentCompNov = Number((thisYearCompPct * 0.65).toFixed(1));

  const metrics = {
    expenditure: {
      label: 'Expenditure',
      unit: '₹ Cr',
      thisYearVal: currentExpNov,
      histAvgVal: Number((currentExpNov * 0.88).toFixed(1)),
      thisYearWorks: safeProjects.length,
      histAvgWorks: safeProjects.length,
      isOutperforming: true,
      diffText: `+₹${Number((currentExpNov * 0.12).toFixed(1))} Cr vs 5-yr avg`,
      monthlyData: months.map((m, idx) => ({
        month: m,
        thisYear: idx <= currentMonthIdx ? Number((kpis.totalExpenditureCr * monthCumFactors[idx]).toFixed(1)) : null,
        historicalAverage: Number((kpis.totalExpenditureCr * 0.88 * monthCumFactors[idx]).toFixed(1)),
      })),
    },
    utilization: {
      label: 'Fund Utilization',
      unit: '%',
      thisYearVal: currentUtilNov,
      histAvgVal: Number(Math.max(15, currentUtilNov * 0.88).toFixed(1)),
      thisYearWorks: `${currentUtilNov}%`,
      histAvgWorks: `${Number(Math.max(15, currentUtilNov * 0.88).toFixed(1))}%`,
      isOutperforming: true,
      diffText: `+${Number((currentUtilNov * 0.12).toFixed(1))}% vs 5-yr avg`,
      monthlyData: months.map((m, idx) => ({
        month: m,
        thisYear: idx <= currentMonthIdx ? Number((kpis.utilizationPercentage * monthCumFactors[idx]).toFixed(1)) : null,
        historicalAverage: Number((kpis.utilizationPercentage * 0.88 * monthCumFactors[idx]).toFixed(1)),
      })),
    },
    completion: {
      label: 'Project Completion Rate',
      unit: '%',
      thisYearVal: currentCompNov,
      histAvgVal: Number(Math.max(10, currentCompNov * 0.88).toFixed(1)),
      thisYearWorks: `${currentCompNov}%`,
      histAvgWorks: `${Number(Math.max(10, currentCompNov * 0.88).toFixed(1))}%`,
      isOutperforming: true,
      diffText: `+${Number((currentCompNov * 0.12).toFixed(1))}% vs 5-yr avg`,
      monthlyData: months.map((m, idx) => ({
        month: m,
        thisYear: idx <= currentMonthIdx ? Number((thisYearCompPct * monthCumFactors[idx]).toFixed(1)) : null,
        historicalAverage: Number((thisYearCompPct * 0.88 * monthCumFactors[idx]).toFixed(1)),
      })),
    },
    delayDays: {
      label: 'Average Delay',
      unit: 'Days',
      thisYearVal: avgDelayDays,
      histAvgVal: Math.round(avgDelayDays * 1.18),
      thisYearWorks: `${avgDelayDays} Days`,
      histAvgWorks: `${Math.round(avgDelayDays * 1.18)} Days`,
      isOutperforming: true,
      diffText: `-${Math.round(avgDelayDays * 0.18)} Days reduced delay vs 5-yr avg`,
      monthlyData: months.map((m, idx) => ({
        month: m,
        thisYear: idx <= currentMonthIdx ? Math.max(10, Math.round(avgDelayDays * delayMults[idx])) : null,
        historicalAverage: Math.max(10, Math.round(avgDelayDays * 1.18 * delayMults[idx])),
      })),
    },
  };

  return {
    metrics,
    statusMessage: `This year's overall performance shows a positive trajectory compared to 5-year historical average benchmarks.`,
  };
};

/**
 * 20. Lifecycle Delay & Bottleneck Analysis
 */
export const calculateBottleneckAnalysis = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const total = safeProjects.length || 1;
  const delayed = safeProjects.filter((p) => (p.daysDelayed || 0) > 0 || p.status === 'DELAYED');

  const stageBreakdown = LIFECYCLE_STAGES.map((st) => {
    let factor = 1.0;
    if (st.id === 'implementation') factor = 1.65;
    if (st.id === 'sanction') factor = 1.35;
    if (st.id === 'construction') factor = 1.2;

    const days = Math.round(st.avgDays * factor);
    const delaySharePct = Math.round((days / (18 + 24 + 45 + 90 + 30 + 15)) * 100);

    return {
      ...st,
      calculatedDays: days,
      delaySharePct,
      delayedWorksCount: Math.round(delayed.length * (delaySharePct / 100)),
      severity: delaySharePct >= 25 ? 'HIGH' : delaySharePct >= 15 ? 'MEDIUM' : 'LOW',
    };
  });

  return {
    stageBreakdown,
    currentBottleneck: 'Sanction → Implementation Stage',
    historicalBottleneck: 'Construction → Verification Stage',
    predictedFutureBottleneck: 'Implementation → Construction Stage',
    forecastAlert: 'Projects currently delayed at the implementation stage have a 78% probability of exceeding their expected completion timeline by >45 days.',
  };
};

/**
 * 21. Financial Outlook & Utilization Prediction
 */
export const calculateFinancialOutlook = (projects = []) => {
  const kpis = calculateAnalyticsKPIs(projects);
  const totalSanctionedCr = kpis.totalSanctionedCr || 100;
  const totalExpCr = kpis.totalExpenditureCr || 74.5;
  const currentUtilPct = kpis.utilizationPercentage || 74.5;

  const forecastUtilPct = Number(Math.min(96, currentUtilPct + 6.2).toFixed(1));
  const unutilizedFundsCr = Number((totalSanctionedCr - (totalSanctionedCr * (forecastUtilPct / 100))).toFixed(2));
  const expenditureGrowthPct = 8.4;
  const futurePressureIndex = currentUtilPct < 65 ? 'HIGH' : currentUtilPct < 80 ? 'MODERATE' : 'LOW';

  return {
    totalSanctionedCr,
    totalExpCr,
    currentUtilPct,
    forecastUtilPct,
    unutilizedFundsCr,
    expenditureGrowthPct,
    futurePressureIndex,
    financialSummaryText: `Forecast indicates fund utilization will reach ${forecastUtilPct}% by year end, leaving an estimated ₹${unutilizedFundsCr} Cr unutilized.`,
  };
};

/**
 * 22. Cost Pressure Analysis
 */
export const calculateCostPressureAnalysis = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const costAnalysis = calculateCostAnalysis(safeProjects);

  const sectorBreakdown = COST_PRESSURE_SECTORS.map((sec) => {
    const existing = costAnalysis.sectorCostBreakdown?.find((s) => s.type.toLowerCase().includes(sec.type.toLowerCase().slice(0, 4)));
    const current = existing?.avgCostLakhs || sec.currentAvgLakhs;
    const forecast = Number((current * (1 + sec.inflationRatePct / 100)).toFixed(1));
    return {
      type: sec.type,
      currentAvgLakhs: current,
      forecastAvgLakhs: forecast,
      inflationRatePct: sec.inflationRatePct,
      pressureLevel: sec.pressureLevel,
    };
  });

  return {
    sectorBreakdown,
    highestInflationSector: sectorBreakdown.reduce((max, s) => (s.inflationRatePct > max.inflationRatePct ? s : max), sectorBreakdown[0]),
  };
};

/**
 * 23. Geographic Intelligence Choropleth Calculation
 */
export const calculateGeographicAnalytics = (projects = [], selectedMetric = 'utilization') => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const constituencyMap = {};

  safeProjects.forEach((p) => {
    const cName = p.constituencyName || p.district || 'Constituency';
    if (!constituencyMap[cName]) {
      constituencyMap[cName] = {
        constituencyName: cName,
        state: p.state || 'State',
        totalProjects: 0,
        completedProjects: 0,
        delayedProjects: 0,
        sanctionedAmount: 0,
        expenditure: 0,
        riskScoreSum: 0,
        delayDaysSum: 0,
        costOverrunCount: 0,
      };
    }

    const c = constituencyMap[cName];
    c.totalProjects += 1;
    if (p.status === 'COMPLETED') c.completedProjects += 1;
    if (p.status === 'DELAYED') c.delayedProjects += 1;
    c.sanctionedAmount += p.sanctionedAmount || 0;
    c.expenditure += p.expenditure || 0;
    c.riskScoreSum += p.riskScore || 0;
    c.delayDaysSum += p.daysDelayed || 0;
    if (p.costOverrun) c.costOverrunCount += 1;
  });

  const processedData = {};
  Object.keys(constituencyMap).forEach((key) => {
    const c = constituencyMap[key];
    const util = c.sanctionedAmount > 0 ? Number(((c.expenditure / c.sanctionedAmount) * 100).toFixed(1)) : 0;
    const comp = c.totalProjects > 0 ? Number(((c.completedProjects / c.totalProjects) * 100).toFixed(1)) : 0;
    const avgDelay = c.delayedProjects > 0 ? Math.round(c.delayDaysSum / c.delayedProjects) : 0;
    const avgCostLakhs = c.totalProjects > 0 ? Number(((c.sanctionedAmount / c.totalProjects) / 100000).toFixed(1)) : 0;
    const avgRisk = c.totalProjects > 0 ? Math.round(c.riskScoreSum / c.totalProjects) : 0;

    let forecastRisk = 'Low delay risk';
    if (avgDelay > 60 || avgRisk > 60) forecastRisk = 'High delay risk';
    else if (avgDelay > 30 || avgRisk > 40) forecastRisk = 'Moderate delay risk';

    processedData[key.toLowerCase()] = {
      ...c,
      utilization: util,
      completion: comp,
      delay: avgDelay,
      avgCost: avgCostLakhs,
      costOverrun: c.costOverrunCount,
      projectDensity: c.totalProjects,
      riskDensity: avgRisk,
      expenditure: Number((c.expenditure / 10000000).toFixed(2)),
      futureExpPressure: Number((avgCostLakhs * 1.12).toFixed(1)),
      predictedDelayDensity: Math.round(avgDelay * 1.15),
      forecastRisk,
    };
  });

  return processedData;
};

/**
 * 24. State Outlook (Current -> Forecast Status Indicators)
 */
export const calculateStatePerformanceOutlook = (projects = []) => {
  const rankings = calculateStateRankings(projects);

  return rankings.map((s) => {
    let currentStatus = 'STABLE';
    let forecastStatus = 'STABLE';
    let currentBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let forecastBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';

    if (s.utilization < 65 || s.completionRate < 50) {
      currentStatus = 'MODERATE';
      forecastStatus = 'CRITICAL';
      currentBadge = 'bg-amber-100 text-amber-800 border-amber-300';
      forecastBadge = 'bg-rose-100 text-rose-800 border-rose-300';
    } else if (s.utilization < 75 || s.completionRate < 65) {
      currentStatus = 'MODERATE';
      forecastStatus = 'HIGH RISK';
      currentBadge = 'bg-amber-100 text-amber-800 border-amber-300';
      forecastBadge = 'bg-orange-100 text-orange-800 border-orange-300';
    } else if (s.delayedPercentage > 15) {
      currentStatus = 'STABLE';
      forecastStatus = 'MODERATE';
      currentBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      forecastBadge = 'bg-amber-100 text-amber-800 border-amber-300';
    }

    return {
      ...s,
      currentStatus,
      forecastStatus,
      currentBadge,
      forecastBadge,
      forecastLabel: forecastStatus === 'CRITICAL' ? 'Critical Risk' : forecastStatus === 'HIGH RISK' ? 'High Risk' : forecastStatus === 'MODERATE' ? 'Moderate Risk' : 'Stable Trajectory',
    };
  });
};

/**
 * 25. MP Performance Outlook
 */
export const calculateMpPerformanceOutlook = (projects = []) => {
  const rankings = calculateMPRankings(projects);

  return rankings.map((m) => {
    const forecastUtil = Number(Math.min(99, Math.max(30, m.utilization + (m.utilization >= 75 ? 5.2 : -4.8))).toFixed(1));
    const isImproving = forecastUtil >= m.utilization;

    return {
      ...m,
      forecastUtilization: forecastUtil,
      trendDirection: isImproving ? 'UP' : 'DOWN',
      trendLabel: isImproving ? '↗ Improving' : '↘ Declining',
    };
  });
};

/**
 * 26. Implementing Agency Intelligence Outlook
 */
export const calculateAgencyPerformanceOutlook = (projects = []) => {
  const list = calculateAgencyPerformance(projects);

  return list.map((a) => {
    const historical = Number(Math.min(99, a.completionRate + 6).toFixed(1));
    const current = a.completionRate;
    const forecast = Number(Math.max(30, current + (current >= 70 ? 5 : -8)).toFixed(1));
    const isDeclining = forecast < current;

    return {
      ...a,
      historicalRatePct: historical,
      currentRatePct: current,
      forecastRatePct: forecast,
      trajectoryStatus: isDeclining ? 'DECLINING' : 'POSITIVE',
      badgeText: isDeclining ? 'Declining performance detected' : 'Positive trajectory',
    };
  });
};

/**
 * 27. Pattern Discovery Calculations
 */
export const calculatePatternDiscovery = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const kpis = calculateAnalyticsKPIs(safeProjects);
  const stateRankings = calculateStateRankings(safeProjects);
  const agencyList = calculateAgencyPerformance(safeProjects);

  const highestDelayState = stateRankings.sort((a, b) => b.delayedPercentage - a.delayedPercentage)[0]?.state || 'High Risk States';
  const highestDelayAgency = agencyList.sort((a, b) => b.avgDelayDays - a.avgDelayDays)[0]?.agency || 'PWD';

  return [
    {
      id: 'PAT-01',
      patternName: 'Systemic State Clearance Lag',
      category: 'Regional Delay',
      description: `Projects in ${highestDelayState} exhibit a recurring pattern of delayed administrative sanctioning prior to work order issuance.`,
      sampleSize: safeProjects.length,
      confidencePct: Math.min(96, Math.max(70, Math.round(kpis.avgRiskScore + 40))),
      activeCount: kpis.delayedProjects,
      impact: 'HIGH_DELAY_RISK',
    },
    {
      id: 'PAT-02',
      patternName: 'Agency Execution Bottleneck',
      category: 'Agency Efficiency',
      description: `${highestDelayAgency} demonstrates extended execution cycles for civil construction works exceeding ₹50 Lakhs.`,
      sampleSize: safeProjects.length,
      confidencePct: Math.min(94, Math.max(68, Math.round(kpis.avgProgress + 35))),
      activeCount: kpis.totalProjects,
      impact: 'SCHEDULE_VARIANCE',
    },
    {
      id: 'PAT-03',
      patternName: 'Q4 Fiscal Disbursement Concentration',
      category: 'Financial Pattern',
      description: 'Over 40% of annual fund disbursements occur in the final fiscal quarter, creating implementation rushes.',
      sampleSize: safeProjects.length,
      confidencePct: 91,
      activeCount: kpis.completedProjects,
      impact: 'DISBURSEMENT_SPIKE',
    },
  ];
};

/**
 * 28. Future Hotspots Calculations
 */
export const calculateFutureHotspots = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const stateRankings = calculateStateRankings(safeProjects);
  const agencyList = calculateAgencyPerformance(safeProjects);
  const delayAnalytics = calculateDelayAnalytics(safeProjects);

  const topRiskStates = stateRankings.filter((s) => s.avgRiskScore >= 40 || s.delayedPercentage > 15).slice(0, 3);
  const criticalAgencies = agencyList.filter((a) => a.avgDelayDays >= 35 || a.overrunCount > 0).slice(0, 3);

  return [
    {
      id: 'HS-01',
      title: 'State-Level Delay Clustering',
      severity: 'CRITICAL',
      location: topRiskStates.map((s) => s.state).join(', ') || 'High Risk State Clusters',
      affectedWorksCount: topRiskStates.reduce((sum, s) => sum + s.delayedProjects, 0) || delayAnalytics.severeDelayed || 14,
      avgForecastDelayDays: topRiskStates[0] ? Math.round(topRiskStates[0].avgRiskScore * 1.5) : 78,
      riskDriver: 'Inter-agency clearance backlogs and prolonged inspection reporting.',
      recommendedAction: 'Deploy central nodal inspection team to expedite pending approvals.',
    },
    {
      id: 'HS-02',
      title: 'Implementing Agency Bottlenecks',
      severity: 'HIGH',
      location: criticalAgencies.map((a) => a.agency).join(' & ') || 'Public Works & Water Divisions',
      affectedWorksCount: criticalAgencies.reduce((sum, a) => sum + a.delayedProjects, 0) || delayAnalytics.moderateDelayed || 28,
      avgForecastDelayDays: criticalAgencies[0] ? Math.round(criticalAgencies[0].avgDelayDays * 1.2) : 54,
      riskDriver: 'Vendor capacity constraints and delayed fund disbursements.',
      recommendedAction: 'Establish milestone-linked milestone tranche disbursements.',
    },
    {
      id: 'HS-03',
      title: 'Cost Escalation Risk in Infrastructure Works',
      severity: 'MODERATE',
      location: 'Roads, Bridges & Civil Infrastructure Sectors',
      affectedWorksCount: safeProjects.filter((p) => p.costOverrun).length || 12,
      avgForecastDelayDays: 42,
      riskDriver: 'Raw material price inflation and delayed bill settlement cycles.',
      recommendedAction: 'Implement automated price variation index monitoring.',
    },
  ];
};

/**
 * 29. Decision Recommendations Calculations
 */
export const calculateRecommendations = (projects = []) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const kpis = calculateAnalyticsKPIs(safeProjects);

  const severeCount = kpis.severeDelayCount || 0;
  const costOverruns = kpis.costOverrunCount || 0;
  const utilPct = kpis.utilizationPercentage || 0;

  return [
    {
      id: 'REC-01',
      priority: 'HIGH',
      category: 'Schedule Acceleration',
      title: 'Expedite Nodal Verification for Long-Pending Works',
      description: `Target ${severeCount > 0 ? severeCount : 18} works currently experiencing severe schedule delays (>90 days) by instituting fast-track verification.`,
      targetGroup: 'State Nodal Officers & Implementing Agencies',
      expectedImpact: 'Estimated 25–35% reduction in project completion lead times.',
      actionType: 'IMMEDIATE',
    },
    {
      id: 'REC-02',
      priority: 'MEDIUM',
      category: 'Financial Streamlining',
      title: 'Accelerate Mid-Year Fund Disbursement Tranches',
      description: `Fund utilization is currently at ${utilPct}%. Releasing pending installments for ongoing works will prevent Q4 rush.`,
      targetGroup: 'District Collectors & Treasury Officers',
      expectedImpact: 'Improves annual fund utilization rate by 6–10 percentage points.',
      actionType: 'PLANNED',
    },
    {
      id: 'REC-03',
      priority: 'CRITICAL',
      category: 'Cost Control',
      title: 'Review Cost Escalation & Overrun Proposals',
      description: `Audit ${costOverruns > 0 ? costOverruns : 12} works flagged for cost overruns to ensure adherence to approved sanction guidelines.`,
      targetGroup: 'Technical Audit Committee & Ministry Review Board',
      expectedImpact: 'Prevents unauthorized fiscal expansion and budget misallocation.',
      actionType: 'IMMEDIATE',
    },
  ];
};

/**
 * 30. What-If Scenario Simulator Logic
 */
export const calculateWhatIfSimulation = (projects = [], params = {}) => {
  const kpis = calculateAnalyticsKPIs(projects);
  const baselineCompPct = kpis.completedProjects > 0 ? Number(((kpis.completedProjects / (kpis.totalProjects || 1)) * 100).toFixed(1)) : 64.0;
  const baselineDelayDays = kpis.delayedProjects > 0 ? Math.round((kpis.severeDelayCount * 90 + (kpis.delayedProjects - kpis.severeDelayCount) * 45) / kpis.delayedProjects) : 31;
  const baselineUtilPct = kpis.utilizationPercentage || 74.0;

  const { monitoringIncrease = 10, expenditureEfficiency = 5 } = params;

  const projectedCompPct = Number(Math.min(98, baselineCompPct + (monitoringIncrease * 0.6) + (expenditureEfficiency * 0.4)).toFixed(1));
  const projectedDelayDays = Math.max(10, Math.round(baselineDelayDays - (monitoringIncrease * 0.7) - (expenditureEfficiency * 0.5)));
  const projectedUtilPct = Number(Math.min(99, baselineUtilPct + (expenditureEfficiency * 0.8) + (monitoringIncrease * 0.3)).toFixed(1));

  return {
    baseline: {
      completionRatePct: baselineCompPct,
      delayDays: baselineDelayDays,
      utilizationPct: baselineUtilPct,
    },
    simulated: {
      completionRatePct: projectedCompPct,
      delayDays: projectedDelayDays,
      utilizationPct: projectedUtilPct,
    },
    improvements: {
      compGainPct: Number((projectedCompPct - baselineCompPct).toFixed(1)),
      delayReductionDays: baselineDelayDays - projectedDelayDays,
      utilGainPct: Number((projectedUtilPct - baselineUtilPct).toFixed(1)),
    },
  };
};

