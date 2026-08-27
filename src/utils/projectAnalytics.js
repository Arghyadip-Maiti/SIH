/**
 * Single source of truth calculation utilities for Projects section.
 * ALL component statistics (KPIs, Charts, Tables, MP Performance, State Ranking)
 * derive strictly from these functions operating on filteredProjects.
 */

export const getRiskLevel = (score) => {
  if (typeof score !== 'number') return score || 'LOW';
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
};

export const getRiskColorClass = (scoreOrLevel) => {
  const level = typeof scoreOrLevel === 'number' ? getRiskLevel(scoreOrLevel) : scoreOrLevel;
  switch (level) {
    case 'LOW':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', hex: '#10B981' };
    case 'MEDIUM':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', hex: '#F59E0B' };
    case 'HIGH':
      return { bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', hex: '#F97316' };
    case 'CRITICAL':
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', hex: '#EF4444' };
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500', hex: '#64748B' };
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'COMPLETED':
      return { label: 'Completed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', hex: '#16A34A' };
    case 'NEAR_COMPLETION':
      return { label: 'Near Completion', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', hex: '#F59E0B' };
    case 'ONGOING':
      return { label: 'Ongoing', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', hex: '#2563EB' };
    case 'STARTING':
      return { label: 'Starting', bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', hex: '#94A3B8' };
    case 'DELAYED':
      return { label: 'Delayed', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', hex: '#DC2626' };
    default:
      return { label: status, bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500', hex: '#64748B' };
  }
};

export const calculateProjectKPIs = (projects = []) => {
  const totalProjects = projects.length;
  if (totalProjects === 0) {
    return {
      totalProjects: 0,
      totalSanctionedAmount: 0,
      totalExpenditure: 0,
      unutilizedAmount: 0,
      utilizationPercentage: 0,
      completedCount: 0,
      ongoingCount: 0,
      nearCompletionCount: 0,
      startingCount: 0,
      delayedCount: 0,
      avgRiskScore: 0,
      criticalRiskCount: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      mismatchCount: 0,
      avgDelayDays: 0,
    };
  }

  const totalSanctionedAmount = projects.reduce((sum, p) => sum + (p.sanctionedAmount || 0), 0);
  const totalExpenditure = projects.reduce((sum, p) => sum + (p.expenditure || 0), 0);
  const unutilizedAmount = Math.max(0, totalSanctionedAmount - totalExpenditure);
  const utilizationPercentage = totalSanctionedAmount > 0
    ? Number(((totalExpenditure / totalSanctionedAmount) * 100).toFixed(1))
    : 0;

  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;
  const ongoingCount = projects.filter((p) => p.status === 'ONGOING').length;
  const nearCompletionCount = projects.filter((p) => p.status === 'NEAR_COMPLETION').length;
  const startingCount = projects.filter((p) => p.status === 'STARTING').length;
  const delayedCount = projects.filter((p) => p.status === 'DELAYED').length;

  const riskScoreSum = projects.reduce((sum, p) => sum + (p.riskScore || 0), 0);
  const avgRiskScore = Math.round(riskScoreSum / totalProjects);

  const criticalRiskCount = projects.filter((p) => p.riskScore >= 81).length;
  const highRiskCount = projects.filter((p) => p.riskScore >= 61 && p.riskScore <= 80).length;
  const mediumRiskCount = projects.filter((p) => p.riskScore >= 31 && p.riskScore <= 60).length;
  const lowRiskCount = projects.filter((p) => p.riskScore <= 30).length;

  const mismatchCount = projects.filter((p) => p.paymentProgressMismatch).length;
  const delayedItems = projects.filter((p) => p.daysDelayed > 0);
  const avgDelayDays = delayedItems.length > 0
    ? Math.round(delayedItems.reduce((sum, p) => sum + p.daysDelayed, 0) / delayedItems.length)
    : 0;

  return {
    totalProjects,
    totalSanctionedAmount,
    totalExpenditure,
    unutilizedAmount,
    utilizationPercentage,
    completedCount,
    ongoingCount,
    nearCompletionCount,
    startingCount,
    delayedCount,
    avgRiskScore,
    criticalRiskCount,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    mismatchCount,
    avgDelayDays,
  };
};

export const calculateStatusDistribution = (projects = []) => {
  const total = projects.length || 1;
  const completed = projects.filter((p) => p.status === 'COMPLETED').length;
  const nearCompletion = projects.filter((p) => p.status === 'NEAR_COMPLETION').length;
  const ongoing = projects.filter((p) => p.status === 'ONGOING').length;
  const starting = projects.filter((p) => p.status === 'STARTING').length;
  const delayed = projects.filter((p) => p.status === 'DELAYED').length;

  return [
    { name: 'Completed', key: 'COMPLETED', count: completed, percentage: Number(((completed / total) * 100).toFixed(1)), color: '#16A34A' },
    { name: 'Near Completion', key: 'NEAR_COMPLETION', count: nearCompletion, percentage: Number(((nearCompletion / total) * 100).toFixed(1)), color: '#F59E0B' },
    { name: 'Ongoing', key: 'ONGOING', count: ongoing, percentage: Number(((ongoing / total) * 100).toFixed(1)), color: '#2563EB' },
    { name: 'Starting', key: 'STARTING', count: starting, percentage: Number(((starting / total) * 100).toFixed(1)), color: '#94A3B8' },
    { name: 'Delayed', key: 'DELAYED', count: delayed, percentage: Number(((delayed / total) * 100).toFixed(1)), color: '#DC2626' },
  ];
};

export const calculateRiskDistribution = (projects = []) => {
  const total = projects.length || 1;
  const low = projects.filter((p) => p.riskScore <= 30).length;
  const medium = projects.filter((p) => p.riskScore >= 31 && p.riskScore <= 60).length;
  const high = projects.filter((p) => p.riskScore >= 61 && p.riskScore <= 80).length;
  const critical = projects.filter((p) => p.riskScore >= 81).length;

  return [
    { name: 'Low Risk (0-30)', key: 'LOW', count: low, percentage: Number(((low / total) * 100).toFixed(1)), color: '#10B981' },
    { name: 'Medium Risk (31-60)', key: 'MEDIUM', count: medium, percentage: Number(((medium / total) * 100).toFixed(1)), color: '#F59E0B' },
    { name: 'High Risk (61-80)', key: 'HIGH', count: high, percentage: Number(((high / total) * 100).toFixed(1)), color: '#F97316' },
    { name: 'Critical Risk (81-100)', key: 'CRITICAL', count: critical, percentage: Number(((critical / total) * 100).toFixed(1)), color: '#EF4444' },
  ];
};

export const calculateProjectTypeDistribution = (projects = []) => {
  const typeMap = {};
  projects.forEach((p) => {
    const t = p.projectType || 'Others';
    if (!typeMap[t]) {
      typeMap[t] = { name: t, count: 0, expenditure: 0, sanctioned: 0 };
    }
    typeMap[t].count += 1;
    typeMap[t].expenditure += p.expenditure || 0;
    typeMap[t].sanctioned += p.sanctionedAmount || 0;
  });

  const colors = ['#2563EB', '#0284C7', '#16A34A', '#06B6D4', '#8B5CF6', '#F59E0B', '#64748B', '#EC4899'];

  return Object.values(typeMap)
    .sort((a, b) => b.count - a.count)
    .map((item, idx) => ({
      ...item,
      amountCr: Number((item.expenditure / 10000000).toFixed(2)),
      color: colors[idx % colors.length],
    }));
};

export const calculateMPPerformance = (projects = []) => {
  const mpMap = {};
  projects.forEach((p) => {
    const mpName = p.mpName || p.mp || 'Member of Parliament';
    const key = p.mpId || mpName;
    if (!mpMap[key]) {
      mpMap[key] = {
        mpId: key,
        mpName: mpName,
        constituency: p.constituencyName || p.district || 'Constituency',
        state: p.state,
        house: p.house || 'Lok Sabha',
        totalProjects: 0,
        completedProjects: 0,
        ongoingProjects: 0,
        delayedProjects: 0,
        sanctionedAmount: 0,
        expenditure: 0,
        riskScoreSum: 0,
      };
    }

    const m = mpMap[key];
    m.totalProjects += 1;
    if (p.status === 'COMPLETED') m.completedProjects += 1;
    else if (p.status === 'DELAYED') m.delayedProjects += 1;
    else m.ongoingProjects += 1;

    m.sanctionedAmount += p.sanctionedAmount || 0;
    m.expenditure += p.expenditure || 0;
    m.riskScoreSum += p.riskScore || 0;
  });

  return Object.values(mpMap).map((m) => {
    const utilPct = m.sanctionedAmount > 0
      ? Number(((m.expenditure / m.sanctionedAmount) * 100).toFixed(1))
      : 0;
    const compRate = m.totalProjects > 0
      ? Number(((m.completedProjects / m.totalProjects) * 100).toFixed(1))
      : 0;
    const avgRisk = m.totalProjects > 0 ? Math.round(m.riskScoreSum / m.totalProjects) : 0;

    return {
      ...m,
      utilization: utilPct,
      completionRate: compRate,
      averageRiskScore: avgRisk,
      sanctionedCr: Number((m.sanctionedAmount / 10000000).toFixed(2)),
      expenditureCr: Number((m.expenditure / 10000000).toFixed(2)),
    };
  });
};

export const calculateStatePerformance = (projects = []) => {
  const stateMap = {};
  projects.forEach((p) => {
    const st = p.state || 'State';
    if (!stateMap[st]) {
      stateMap[st] = {
        state: st,
        totalProjects: 0,
        completedProjects: 0,
        delayedProjects: 0,
        sanctionedAmount: 0,
        expenditure: 0,
        riskScoreSum: 0,
      };
    }

    const s = stateMap[st];
    s.totalProjects += 1;
    if (p.status === 'COMPLETED') s.completedProjects += 1;
    if (p.status === 'DELAYED') s.delayedProjects += 1;
    s.sanctionedAmount += p.sanctionedAmount || 0;
    s.expenditure += p.expenditure || 0;
    s.riskScoreSum += p.riskScore || 0;
  });

  return Object.values(stateMap)
    .sort((a, b) => b.totalProjects - a.totalProjects)
    .map((s) => ({
      ...s,
      utilization: s.sanctionedAmount > 0 ? Number(((s.expenditure / s.sanctionedAmount) * 100).toFixed(1)) : 0,
      averageRiskScore: s.totalProjects > 0 ? Math.round(s.riskScoreSum / s.totalProjects) : 0,
      expenditureCr: Number((s.expenditure / 10000000).toFixed(2)),
    }));
};
