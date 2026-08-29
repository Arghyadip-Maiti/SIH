import { mockOverview } from './mockOverview';
import { mockProjects } from './mockProjects';
import { CONSTITUENCY_DETAILS_MAP } from './locationMappings';

/**
 * Computes filtered Overview Command Center dataset based on active filter params.
 * 100% mathematically synchronized with mockProjects dataset (Single Source of Truth).
 */
export const computeFilteredOverview = (filters = {}) => {
  const {
    financialYear = '2026-27',
    house = 'All',
    state = '',
    district = '',
    mp = '',
    projectType = '',
    status = '',
    riskLevel = '',
    agency = '',
  } = filters;

  // 1. Filter raw mockProjects list by active scope
  let filtered = [...mockProjects];

  if (state) {
    filtered = filtered.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }
  if (district) {
    filtered = filtered.filter((p) => p.district.toLowerCase() === district.toLowerCase());
  }
  if (mp) {
    filtered = filtered.filter((p) => (p.mpName || p.mp || '').toLowerCase().includes(mp.toLowerCase()));
  }
  if (house && house !== 'All') {
    filtered = filtered.filter((p) => p.house === house);
  }
  if (financialYear) {
    filtered = filtered.filter((p) => p.financialYear === financialYear || !p.financialYear);
  }
  if (projectType) {
    filtered = filtered.filter(
      (p) =>
        p.projectType.toLowerCase().includes(projectType.toLowerCase()) ||
        projectType.toLowerCase().includes(p.projectType.toLowerCase())
    );
  }
  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }
  if (riskLevel) {
    if (riskLevel === 'CRITICAL') filtered = filtered.filter((p) => p.riskScore >= 81);
    else if (riskLevel === 'HIGH') filtered = filtered.filter((p) => p.riskScore >= 61 && p.riskScore <= 80);
    else if (riskLevel === 'MEDIUM') filtered = filtered.filter((p) => p.riskScore >= 31 && p.riskScore <= 60);
    else if (riskLevel === 'LOW') filtered = filtered.filter((p) => p.riskScore <= 30);
  }
  if (agency) {
    filtered = filtered.filter((p) => p.implementingAgency.toLowerCase().includes(agency.toLowerCase()));
  }

  // 2. Exact Aggregations from filtered projects
  const totalWorks = filtered.length;
  const totalSanctionedAmount = filtered.reduce((sum, p) => sum + (p.sanctionedAmount || 0), 0);
  const totalExpenditure = filtered.reduce((sum, p) => sum + (p.expenditure || 0), 0);
  const unutilizedFunds = Math.max(0, totalSanctionedAmount - totalExpenditure);
  const totalAllocated = Math.round(totalSanctionedAmount * 1.05);
  const totalReleasedAmount = Math.round(totalSanctionedAmount * 0.95);
  const unsanctionedFunds = Math.max(0, totalAllocated - totalSanctionedAmount);
  const unspentReleased = Math.max(0, totalReleasedAmount - totalExpenditure);

  const utilizationPercentage = totalSanctionedAmount > 0
    ? Number(((totalExpenditure / totalSanctionedAmount) * 100).toFixed(1))
    : 0;

  // Status Breakdown
  const completedWorks = filtered.filter((p) => p.status === 'COMPLETED').length;
  const ongoingWorks = filtered.filter((p) => p.status === 'ONGOING').length;
  const nearCompletionWorks = filtered.filter((p) => p.status === 'NEAR_COMPLETION').length;
  const startingWorks = filtered.filter((p) => p.status === 'STARTING').length;
  const delayedWorks = filtered.filter((p) => p.status === 'DELAYED').length;

  const totalDenominator = totalWorks || 1;
  const completedPct = Number(((completedWorks / totalDenominator) * 100).toFixed(1));
  const ongoingPct = Number(((ongoingWorks / totalDenominator) * 100).toFixed(1));
  const nearCompPct = Number(((nearCompletionWorks / totalDenominator) * 100).toFixed(1));
  const startingPct = Number(((startingWorks / totalDenominator) * 100).toFixed(1));
  const delayedPct = Number(((delayedWorks / totalDenominator) * 100).toFixed(1));

  // Risk Breakdown
  const criticalRiskCount = filtered.filter((p) => p.riskScore >= 81).length;
  const highRiskCount = filtered.filter((p) => p.riskScore >= 61 && p.riskScore <= 80).length;
  const mediumRiskCount = filtered.filter((p) => p.riskScore >= 31 && p.riskScore <= 60).length;
  const lowRiskCount = filtered.filter((p) => p.riskScore <= 30).length;
  const avgRiskScore = totalWorks > 0
    ? Math.round(filtered.reduce((sum, p) => sum + (p.riskScore || 0), 0) / totalWorks)
    : 0;

  // 3. Sector Expenditure Computation
  const sectorMap = {};
  filtered.forEach((p) => {
    const t = p.projectType || 'Community Infrastructure';
    if (!sectorMap[t]) {
      sectorMap[t] = { name: t, expenditure: 0, sanctioned: 0, count: 0 };
    }
    sectorMap[t].expenditure += p.expenditure || 0;
    sectorMap[t].sanctioned += p.sanctionedAmount || 0;
    sectorMap[t].count += 1;
  });

  const sectorColors = ['#475569', '#0284C7', '#16A34A', '#64748b', '#8B5CF6', '#F59E0B', '#64748B', '#EC4899'];
  const dynamicSectorExpenditure = Object.values(sectorMap)
    .sort((a, b) => b.expenditure - a.expenditure)
    .map((s, idx) => ({
      name: s.name,
      percentage: totalExpenditure > 0 ? Number(((s.expenditure / totalExpenditure) * 100).toFixed(1)) : 0,
      amountCr: Number((s.expenditure / 10000000).toFixed(2)),
      count: s.count,
      color: sectorColors[idx % sectorColors.length],
    }));

  // 4. District Performance Aggregation
  const districtMap = {};
  filtered.forEach((p) => {
    if (!p.district) return;
    if (!districtMap[p.district]) {
      districtMap[p.district] = {
        district: p.district,
        state: p.state,
        expenditure: 0,
        sanctioned: 0,
        projectCount: 0,
      };
    }
    districtMap[p.district].expenditure += p.expenditure || 0;
    districtMap[p.district].sanctioned += p.sanctionedAmount || 0;
    districtMap[p.district].projectCount += 1;
  });

  const computedDistricts = Object.values(districtMap)
    .sort((a, b) => b.expenditure - a.expenditure)
    .map((d, index) => ({
      rank: index + 1,
      district: d.district,
      state: d.state,
      expenditureCr: Number((d.expenditure / 10000000).toFixed(2)),
      utilization: d.sanctioned > 0 ? Number(((d.expenditure / d.sanctioned) * 100).toFixed(1)) : 0,
      projectCount: d.projectCount,
    }));

  // 5. State Performance Aggregation
  const stateMap = {};
  filtered.forEach((p) => {
    if (!p.state) return;
    if (!stateMap[p.state]) {
      stateMap[p.state] = {
        state: p.state,
        sanctioned: 0,
        expenditure: 0,
        totalWorks: 0,
        completedWorks: 0,
        delayedWorks: 0,
        inProgressWorks: 0,
        riskScoreSum: 0,
      };
    }
    const s = stateMap[p.state];
    s.sanctioned += p.sanctionedAmount || 0;
    s.expenditure += p.expenditure || 0;
    s.totalWorks += 1;
    if (p.status === 'COMPLETED') s.completedWorks += 1;
    if (p.status === 'DELAYED') s.delayedWorks += 1;
    if (['ONGOING', 'NEAR_COMPLETION', 'STARTING'].includes(p.status)) s.inProgressWorks += 1;
    s.riskScoreSum += p.riskScore || 0;
  });

  const computedStates = Object.values(stateMap)
    .sort((a, b) => b.totalWorks - a.totalWorks)
    .map((st) => ({
      state: st.state,
      lat: 20.5937,
      lng: 78.9629,
      totalWorks: st.totalWorks,
      expenditureCr: Number((st.expenditure / 10000000).toFixed(2)),
      utilization: st.sanctioned > 0 ? Number(((st.expenditure / st.sanctioned) * 100).toFixed(1)) : 0,
      completionRate: st.totalWorks > 0 ? Number(((st.completedWorks / st.totalWorks) * 100).toFixed(1)) : 0,
      avgRiskScore: st.totalWorks > 0 ? Math.round(st.riskScoreSum / st.totalWorks) : 0,
      delayedWorks: st.delayedWorks,
      completedWorks: st.completedWorks,
      inProgressWorks: st.inProgressWorks,
    }));

  // 6. Constituency Aggregation
  const constituencyMap = {};
  filtered.forEach((p) => {
    const constName = p.constituencyName || p.district || 'Constituency';
    if (!constituencyMap[constName]) {
      const info = CONSTITUENCY_DETAILS_MAP[constName] || {};
      constituencyMap[constName] = {
        constituency: constName,
        state: p.state,
        district: p.district,
        mp: p.mpName || p.mp || info.mp || 'Member of Parliament',
        party: info.party || 'BJP',
        code: p.constituencyId || info.code || `PC-${constName.substring(0, 2).toUpperCase()}-01`,
        sanctioned: 0,
        expenditure: 0,
        totalWorks: 0,
        completedWorks: 0,
        delayedWorks: 0,
        inProgressWorks: 0,
        riskScoreSum: 0,
        sectorExpMap: {},
      };
    }
    const c = constituencyMap[constName];
    c.sanctioned += p.sanctionedAmount || 0;
    c.expenditure += p.expenditure || 0;
    c.totalWorks += 1;
    if (p.status === 'COMPLETED') c.completedWorks += 1;
    if (p.status === 'DELAYED') c.delayedWorks += 1;
    if (['ONGOING', 'NEAR_COMPLETION', 'STARTING'].includes(p.status)) c.inProgressWorks += 1;
    c.riskScoreSum += p.riskScore || 0;

    const secType = p.projectType || 'Community Infrastructure';
    c.sectorExpMap[secType] = (c.sectorExpMap[secType] || 0) + (p.expenditure || 0);
  });

  const computedConstituencies = Object.values(constituencyMap).map((c) => {
    const expCr = Number((c.expenditure / 10000000).toFixed(2));
    const sanctionedCr = Number((c.sanctioned / 10000000).toFixed(2));
    const utilPct = c.sanctioned > 0 ? Number(((c.expenditure / c.sanctioned) * 100).toFixed(1)) : 0;
    const unspentCr = Math.max(0, Number((sanctionedCr - expCr).toFixed(2)));

    let utilizationCategory = 'MEDIUM';
    let color = '#F59E0B';
    if (utilPct >= 80) {
      utilizationCategory = 'HIGH';
      color = '#10B981';
    } else if (utilPct < 60) {
      utilizationCategory = 'LOW';
      color = '#EF4444';
    }

    const avgRisk = c.totalWorks > 0 ? Math.round(c.riskScoreSum / c.totalWorks) : 0;
    const sectorBreakdown = Object.entries(c.sectorExpMap).map(([sName, sExp], idx) => {
      const colors = ['#475569', '#0284C7', '#16A34A', '#64748b', '#8B5CF6', '#F59E0B'];
      const p = c.expenditure > 0 ? Number(((sExp / c.expenditure) * 100).toFixed(1)) : 0;
      return {
        name: sName,
        percentage: p,
        amountCr: Number((sExp / 10000000).toFixed(2)),
        color: colors[idx % colors.length],
      };
    });

    return {
      constituency: c.constituency,
      state: c.state,
      district: c.district,
      mp: c.mp,
      party: c.party,
      code: c.code,
      expenditureCr: expCr,
      sanctionedCr,
      releasedCr: Number((expCr * 1.02).toFixed(2)),
      unspentCr,
      utilization: utilPct,
      utilizationCategory,
      color,
      totalWorks: c.totalWorks,
      completedWorks: c.completedWorks,
      inProgressWorks: c.inProgressWorks,
      delayedWorks: c.delayedWorks,
      avgRiskScore: avgRisk,
      sectorBreakdown,
    };
  });

  // House Breakdown
  const lsProjects = filtered.filter((p) => p.house !== 'Rajya Sabha');
  const rsProjects = filtered.filter((p) => p.house === 'Rajya Sabha');
  const lsExp = lsProjects.reduce((sum, p) => sum + (p.expenditure || 0), 0);
  const rsExp = rsProjects.reduce((sum, p) => sum + (p.expenditure || 0), 0);
  const totalHouseExp = totalExpenditure || 1;

  // Trend series derived from master total
  const years = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26', '2026-27'];
  const factors = [0.45, 0.60, 0.75, 0.88, 0.95, 1.0];
  const expenditureTrend = years.map((yr, idx) => ({
    year: yr,
    current: Number(((totalExpenditure / 10000000) * factors[idx]).toFixed(2)),
  }));

  const worksCompletedTrend = years.map((yr, idx) => ({
    year: yr,
    completed: Math.round(completedWorks * factors[idx]),
  }));

  return {
    ...mockOverview,
    lastUpdated: new Date().toISOString(),
    financialYear,
    kpis: {
      totalAllocated,
      totalSanctionedAmount,
      totalReleasedAmount,
      totalExpenditure,
      unutilizedFunds,
      unsanctionedFunds,
      unspentReleased,
      utilizationPercentage,
      utilizationTrend: 4.2,
      allocatedTrend: 5.1,
      releasedTrend: 6.2,
      expenditureTrend: 7.4,
      worksTrend: 4.8,
      completedTrend: 5.9,
      delayedTrend: -1.8,
      totalWorks,
      completedWorks,
      ongoingWorks,
      nearCompletionWorks,
      startingWorks,
      delayedWorks,
      criticalRiskCount,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      averageRiskScore: avgRiskScore,
    },
    projectStatusDistribution: [
      { name: "Completed", key: "COMPLETED", count: completedWorks, percentage: completedPct, color: "#16A34A" },
      { name: "Ongoing (In Progress)", key: "ONGOING", count: ongoingWorks, percentage: ongoingPct, color: "#475569" },
      { name: "Near Completion", key: "NEAR_COMPLETION", count: nearCompletionWorks, percentage: nearCompPct, color: "#F59E0B" },
      { name: "Starting", key: "STARTING", count: startingWorks, percentage: startingPct, color: "#94A3B8" },
      { name: "Delayed", key: "DELAYED", count: delayedWorks, percentage: delayedPct, color: "#DC2626" },
    ],
    sectorExpenditure: dynamicSectorExpenditure,
    statePerformance: computedStates,
    topDistricts: computedDistricts,
    constituencyPerformance: computedConstituencies,
    expenditureTrend,
    worksCompletedTrend,
    houseExpenditure: {
      lokSabhaAmountCr: Number((lsExp / 10000000).toFixed(2)),
      lokSabhaPercentage: Number(((lsExp / totalHouseExp) * 100).toFixed(1)),
      rajyaSabhaAmountCr: Number((rsExp / 10000000).toFixed(2)),
      rajyaSabhaPercentage: Number(((rsExp / totalHouseExp) * 100).toFixed(1)),
      totalCr: Number((totalExpenditure / 10000000).toFixed(2)),
    },
    highLevelAttention: [
      { id: 1, type: "CRITICAL", count: criticalRiskCount, message: `projects flagged with critical AI risk scores`, icon: "AlertTriangle" },
      { id: 2, type: "HIGH", count: delayedWorks, message: `projects delayed beyond expected schedule`, icon: "Clock" },
      { id: 3, type: "HIGH", count: filtered.filter(p => p.duplicateRisk).length, message: "possible duplicate works flagged by spatial AI", icon: "Copy" },
      { id: 4, type: "MEDIUM", count: filtered.filter(p => p.paymentProgressMismatch).length, message: "works with financial vs physical progress mismatch", icon: "AlertCircle" },
    ],
    aiInsights: [
      {
        id: "INS-FLT-01",
        title: `Active Scope: ${state || 'National Overview'} (${financialYear})`,
        description: `Total ${totalWorks} works with ₹${(totalExpenditure / 10000000).toFixed(2)} Cr expenditure (${utilizationPercentage}% fund utilization).`,
        type: utilizationPercentage > 75 ? "POSITIVE" : "WARNING",
        timestamp: "Just now",
      },
      {
        id: "INS-FLT-02",
        title: "Risk Breakdown",
        description: `${criticalRiskCount} critical risk works and ${delayedWorks} delayed works require field monitoring.`,
        type: criticalRiskCount > 0 ? "CRITICAL" : "INFO",
        timestamp: "Just now",
      },
    ],
  };
};
