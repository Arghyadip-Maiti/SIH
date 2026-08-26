import { mockOverview } from './mockOverview';
import { mockProjects } from './mockProjects';

/**
 * Computes filtered Overview Command Center dataset based on active filter params.
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

  // Check if any specific filter is active (other than defaults)
  const isFiltered =
    financialYear !== '2026-27' ||
    house !== 'All' ||
    Boolean(state) ||
    Boolean(district) ||
    Boolean(mp) ||
    Boolean(projectType) ||
    Boolean(status) ||
    Boolean(riskLevel) ||
    Boolean(agency);

  if (!isFiltered) {
    return { ...mockOverview };
  }

  // Filter raw mockProjects list
  let filtered = [...mockProjects];

  if (state) {
    filtered = filtered.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }
  if (district) {
    filtered = filtered.filter((p) => p.district.toLowerCase() === district.toLowerCase());
  }
  if (mp) {
    filtered = filtered.filter((p) => p.mp.toLowerCase().includes(mp.toLowerCase()));
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

  // Multipliers for Financial Year
  let yearMultiplier = 1.0;
  if (financialYear === '2025-26') yearMultiplier = 0.88;
  if (financialYear === '2024-25') yearMultiplier = 0.75;

  // Multiplier for House
  let houseMultiplier = 1.0;
  if (house === 'Lok Sabha') houseMultiplier = 0.77;
  if (house === 'Rajya Sabha') houseMultiplier = 0.23;

  const countScale = Math.max(1, filtered.length);
  const totalWorksBase = Math.round(countScale * 680 * yearMultiplier * houseMultiplier);
  
  const totalSanctionedAmount = Math.round(
    filtered.reduce((acc, p) => acc + p.sanctionedAmount, 0) * 115 * yearMultiplier * houseMultiplier
  );
  const totalExpenditure = Math.round(
    filtered.reduce((acc, p) => acc + p.expenditure, 0) * 115 * yearMultiplier * houseMultiplier
  );
  
  const totalAllocated = Math.round(totalSanctionedAmount * 1.05);
  const totalReleasedAmount = Math.round(totalSanctionedAmount * 0.92);
  const unutilizedFunds = Math.max(0, totalSanctionedAmount - totalExpenditure);
  const unsanctionedFunds = Math.max(0, totalAllocated - totalSanctionedAmount);
  const unspentReleased = Math.max(0, totalReleasedAmount - totalExpenditure);
  
  const utilizationPercentage = totalSanctionedAmount > 0
    ? Number(((totalExpenditure / totalSanctionedAmount) * 100).toFixed(1))
    : 72.5;

  // Status counts ratio
  const completedRatio = filtered.filter((p) => p.status === 'COMPLETED').length / countScale || 0.62;
  const ongoingRatio = filtered.filter((p) => p.status === 'ONGOING').length / countScale || 0.24;
  const nearCompRatio = filtered.filter((p) => p.status === 'NEAR_COMPLETION').length / countScale || 0.07;
  const startingRatio = filtered.filter((p) => p.status === 'STARTING').length / countScale || 0.03;
  const delayedRatio = filtered.filter((p) => p.status === 'DELAYED').length / countScale || 0.04;

  const completedWorks = Math.round(totalWorksBase * completedRatio);
  const ongoingWorks = Math.round(totalWorksBase * ongoingRatio);
  const nearCompletionWorks = Math.round(totalWorksBase * nearCompRatio);
  const startingWorks = Math.round(totalWorksBase * startingRatio);
  const delayedWorks = Math.round(totalWorksBase * delayedRatio);

  const criticalRiskCount = Math.round(filtered.filter((p) => p.riskScore >= 81).length * 15 * yearMultiplier);
  const highRiskCount = Math.round(filtered.filter((p) => p.riskScore >= 61 && p.riskScore <= 80).length * 28 * yearMultiplier);
  const avgRiskScore = Math.round(filtered.reduce((acc, p) => acc + p.riskScore, 0) / countScale);

  // Dynamic Sector Expenditure Computation
  const SECTOR_METRICS = [
    { key: 'Education & IT', name: 'Education & IT', color: '#2563EB' },
    { key: 'Roads & Bridges', name: 'Roads & Bridges', color: '#0284C7' },
    { key: 'Healthcare Infrastructure', name: 'Healthcare Infra', color: '#16A34A' },
    { key: 'Drinking Water Supply', name: 'Drinking Water Supply', color: '#06B6D4' },
    { key: 'Sanitation & Solid Waste', name: 'Sanitation & Waste', color: '#8B5CF6' },
    { key: 'Renewable Energy', name: 'Renewable Energy', color: '#F59E0B' },
    { key: 'Community Infrastructure', name: 'Community Infra', color: '#64748B' },
  ];

  const totalExpCr = Math.round(totalExpenditure / 10000000);

  // Group expenditure by sector from filtered project records
  const sectorExpSums = SECTOR_METRICS.map((sec) => {
    const secProjects = filtered.filter((p) =>
      p.projectType.toLowerCase().includes(sec.key.toLowerCase()) ||
      sec.key.toLowerCase().includes(p.projectType.toLowerCase())
    );
    const sumExp = secProjects.reduce((acc, p) => acc + p.expenditure, 0);
    return { ...sec, sumExp, count: secProjects.length };
  });

  const totalRawSectorExp = sectorExpSums.reduce((acc, s) => acc + s.sumExp, 0) || 1;

  let dynamicSectorExpenditure = sectorExpSums
    .map((s) => {
      const pct = (s.sumExp / totalRawSectorExp) * 100;
      const amountCr = Math.round((pct / 100) * totalExpCr);
      return {
        name: s.name,
        percentage: Number(pct.toFixed(1)),
        amountCr: amountCr,
        count: s.count,
        color: s.color,
      };
    })
    .filter((s) => s.percentage > 0);

  if (!dynamicSectorExpenditure.length) {
    dynamicSectorExpenditure = [
      {
        name: projectType || 'Selected Sector',
        percentage: 100,
        amountCr: totalExpCr,
        count: totalWorksBase,
        color: '#2563EB',
      },
    ];
  }

  // Filtered State Performance
  let filteredStates = mockOverview.statePerformance;
  if (state) {
    filteredStates = mockOverview.statePerformance.filter(
      (s) => s.state.toLowerCase() === state.toLowerCase()
    );
    if (!filteredStates.length) {
      filteredStates = [
        {
          state: state,
          lat: 20.5937,
          lng: 78.9629,
          totalWorks: totalWorksBase,
          expenditureCr: totalExpCr,
          utilization: utilizationPercentage,
          completionRate: Number((completedRatio * 100).toFixed(1)),
          avgRiskScore: avgRiskScore,
          delayedWorks: delayedWorks,
          completedWorks: completedWorks,
          inProgressWorks: ongoingWorks,
        },
      ];
    }
  }

  // Filtered Top Districts
  let filteredDistricts = mockOverview.topDistricts;
  if (district) {
    filteredDistricts = mockOverview.topDistricts.filter(
      (d) => d.district.toLowerCase() === district.toLowerCase()
    );
    if (!filteredDistricts.length) {
      filteredDistricts = [
        {
          rank: 1,
          district: district,
          state: state || 'Selected State',
          expenditureCr: totalExpCr,
        },
      ];
    }
  }

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
      utilizationTrend: Number((5.6 * yearMultiplier).toFixed(1)),
      allocatedTrend: Number((6.4 * yearMultiplier).toFixed(1)),
      releasedTrend: Number((7.8 * yearMultiplier).toFixed(1)),
      expenditureTrend: Number((8.2 * yearMultiplier).toFixed(1)),
      worksTrend: Number((5.1 * yearMultiplier).toFixed(1)),
      completedTrend: Number((6.3 * yearMultiplier).toFixed(1)),
      delayedTrend: -2.3,
      totalWorks: totalWorksBase,
      completedWorks,
      ongoingWorks,
      nearCompletionWorks,
      startingWorks,
      delayedWorks,
      criticalRiskCount,
      highRiskCount,
      mediumRiskCount: Math.round(totalWorksBase * 0.12),
      lowRiskCount: Math.round(totalWorksBase * 0.78),
      averageRiskScore: avgRiskScore || 42,
    },
    projectStatusDistribution: [
      { name: "Completed", key: "COMPLETED", count: completedWorks, percentage: Number((completedRatio * 100).toFixed(1)), color: "#16A34A" },
      { name: "Ongoing (In Progress)", key: "ONGOING", count: ongoingWorks, percentage: Number((ongoingRatio * 100).toFixed(1)), color: "#2563EB" },
      { name: "Near Completion", key: "NEAR_COMPLETION", count: nearCompletionWorks, percentage: Number((nearCompRatio * 100).toFixed(1)), color: "#F59E0B" },
      { name: "Starting", key: "STARTING", count: startingWorks, percentage: Number((startingRatio * 100).toFixed(1)), color: "#94A3B8" },
      { name: "Delayed", key: "DELAYED", count: delayedWorks, percentage: Number((delayedRatio * 100).toFixed(1)), color: "#DC2626" },
    ],
    sectorExpenditure: dynamicSectorExpenditure,
    statePerformance: filteredStates,
    topDistricts: filteredDistricts,
    houseExpenditure: {
      lokSabhaAmountCr: Math.round(totalExpCr * 0.768),
      lokSabhaPercentage: 76.8,
      rajyaSabhaAmountCr: Math.round(totalExpCr * 0.232),
      rajyaSabhaPercentage: 23.2,
      totalCr: totalExpCr,
    },
    highLevelAttention: [
      { id: 1, type: "CRITICAL", count: criticalRiskCount || 42, message: `projects showing unusual expenditure in ${state || 'selected scope'}`, icon: "AlertTriangle" },
      { id: 2, type: "HIGH", count: delayedWorks || 120, message: `projects delayed beyond completion target`, icon: "Clock" },
      { id: 3, type: "HIGH", count: Math.round(countScale * 3), message: "possible duplicate works flagged by spatial AI", icon: "Copy" },
      { id: 4, type: "MEDIUM", count: Math.round(countScale * 1.5), message: "districts with low fund utilization (< 50%)", icon: "AlertCircle" },
      { id: 5, type: "INFO", count: Math.round(countScale * 2), message: "agencies requiring milestone verification", icon: "Building2" },
    ],
    aiInsights: [
      {
        id: "INS-FLT-01",
        title: `Filtered Context: ${state || projectType || house || financialYear}`,
        description: `Active scope contains ${totalWorksBase.toLocaleString('en-IN')} works with ${utilizationPercentage}% financial utilization.`,
        type: utilizationPercentage > 80 ? "POSITIVE" : "WARNING",
        timestamp: "Just now",
      },
      {
        id: "INS-FLT-02",
        title: "Expenditure Velocity",
        description: `Expenditure trajectory is tracking ${yearMultiplier >= 1.0 ? '+8.2%' : '-4.5%'} relative to national benchmarks.`,
        type: "INFO",
        timestamp: "Just now",
      },
      {
        id: "INS-FLT-03",
        title: "Risk Projection",
        description: `${criticalRiskCount} projects require immediate nodal officer field verification.`,
        type: "CRITICAL",
        timestamp: "Just now",
      },
    ],
  };
};
