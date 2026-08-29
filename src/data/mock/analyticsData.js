/**
 * Centralized MPLADS Analytics Data Repository.
 * Serves as single source of truth for mock data calculations,
 * baseline metrics, lifecycle definitions, pattern templates,
 * hotspot criteria, and recommendation mappings.
 */

export const LIFECYCLE_STAGES = [
  { id: 'proposal', name: 'Proposal', avgDays: 18, color: '#64748B' },
  { id: 'sanction', name: 'Sanction', avgDays: 24, color: '#0284C7' },
  { id: 'implementation', name: 'Implementation', avgDays: 45, color: '#F59E0B' },
  { id: 'construction', name: 'Construction', avgDays: 90, color: '#8B5CF6' },
  { id: 'verification', name: 'Verification', avgDays: 30, color: '#06B6D4' },
  { id: 'completion', name: 'Completion', avgDays: 15, color: '#16A34A' },
];

export const COST_PRESSURE_SECTORS = [
  { type: 'Roads & Bridges', currentAvgLakhs: 24.5, forecastAvgLakhs: 27.2, inflationRatePct: 11.0, pressureLevel: 'HIGH' },
  { type: 'Education & Schools', currentAvgLakhs: 35.2, forecastAvgLakhs: 37.8, inflationRatePct: 7.4, pressureLevel: 'MEDIUM' },
  { type: 'Drinking Water & Sanitation', currentAvgLakhs: 18.0, forecastAvgLakhs: 19.5, inflationRatePct: 8.3, pressureLevel: 'MEDIUM' },
  { type: 'Healthcare Infrastructure', currentAvgLakhs: 42.0, forecastAvgLakhs: 48.5, inflationRatePct: 15.5, pressureLevel: 'CRITICAL' },
  { type: 'Community Halls & Facilities', currentAvgLakhs: 22.0, forecastAvgLakhs: 23.1, inflationRatePct: 5.0, pressureLevel: 'LOW' },
];

export const PATTERN_TEMPLATES = [
  {
    id: 'PAT-01',
    title: 'High-Cost Road Works Schedule Slippage',
    pattern: 'Road projects exceeding ₹30 Lakhs show a 42% higher probability of sanction-to-implementation delay.',
    supportingData: 'Based on analysis of 148 road infrastructure works across 12 states.',
    confidencePct: 89,
    affectedDomain: 'Roads & Bridges Sector',
    futureImplication: 'Average completion timelines for road works could expand by 35 days in the upcoming fiscal quarter.',
    severity: 'WARNING',
  },
  {
    id: 'PAT-02',
    title: 'Agency Workload Saturation Bottleneck',
    pattern: 'Implementing agencies handling >15 simultaneous works experience an average 68-day delay escalation.',
    supportingData: 'Correlation detected between PWD vendor capacity limits and verification stage delays.',
    confidencePct: 94,
    affectedDomain: 'PWD & Rural Works Agencies',
    futureImplication: 'Project throughput will decline by 18% unless works are redistributed across secondary nodal agencies.',
    severity: 'CRITICAL',
  },
  {
    id: 'PAT-03',
    title: 'Low Utilization Early-Stage Stagnation',
    pattern: 'Constituencies with fund utilization below 60% exhibit an average 90-day lag in initial proposal approvals.',
    supportingData: 'Strong statistical link between delayed proposal submission and year-end unutilized fund spikes.',
    confidencePct: 86,
    affectedDomain: 'Selected Parliamentary Constituencies',
    futureImplication: 'Unutilized funds may grow by ₹45 Cr across underperforming districts if unaddressed.',
    severity: 'INFO',
  },
];

export const HOTSPOT_TEMPLATES = [
  {
    id: 'HOT-01',
    entityName: 'Gaya District',
    entityType: 'District',
    state: 'Bihar',
    type: 'DELAY_RISK',
    title: 'Expected Project Delays',
    description: 'Implementation stage bottleneck predicted to increase average delay to 48 days.',
    metric: '48 Days Avg Delay Forecast',
    trend: 'UP',
    filterKey: 'district',
    filterValue: 'Gaya',
  },
  {
    id: 'HOT-02',
    entityName: 'Varanasi District',
    entityType: 'District',
    state: 'Uttar Pradesh',
    type: 'EXPENDITURE_PRESSURE',
    title: 'Rising Expenditure Pressure',
    description: 'Road & Healthcare sector inflation driving 14% forecast cost overruns.',
    metric: '14.2% Cost Overrun Expected',
    trend: 'UP',
    filterKey: 'district',
    filterValue: 'Varanasi',
  },
  {
    id: 'HOT-03',
    entityName: 'Bihar State',
    entityType: 'State',
    state: 'Bihar',
    type: 'UTILIZATION_DROPDOWN',
    title: 'Declining Utilization Trajectory',
    description: 'Current 64.2% utilization trajectory forecasted to drop to 58.5% next quarter.',
    metric: '58.5% Projected Utilization',
    trend: 'DOWN',
    filterKey: 'state',
    filterValue: 'Bihar',
  },
  {
    id: 'HOT-04',
    entityName: 'State PWD Division 2',
    entityType: 'Agency',
    state: 'Multiple',
    type: 'AGENCY_DECLINE',
    title: 'Declining Agency Performance',
    description: 'Completion rate dropped from 82% to 68% with 5 severely delayed works.',
    metric: '68% Forecast Completion',
    trend: 'DOWN',
    filterKey: 'agency',
    filterValue: 'Public Works Department (PWD)',
  },
];

export const RECOMMENDATION_TEMPLATES = [
  {
    id: 'REC-01',
    code: '01',
    title: 'Accelerate Sanction-to-Implementation Stage Reviews',
    target: 'Gaya & East Champaran Districts',
    reason: 'Predicted 35% increase in implementation stage delay over the next quarter.',
    suggestedAction: 'Deploy dedicated technical verification teams to clear pending sanction approvals within 14 days.',
    priority: 'HIGH',
    badge: 'AI/Analytics Suggested Action',
  },
  {
    id: 'REC-02',
    code: '02',
    title: 'Conduct Performance Review for Overloaded PWD Agencies',
    target: 'Public Works Department (PWD)',
    reason: 'Contractor workload saturation detected across 18 concurrent high-value works.',
    suggestedAction: 'Cap maximum active project allocation per agency division and reassign pending tenders to Rural Engineering Services.',
    priority: 'CRITICAL',
    badge: 'AI/Analytics Suggested Action',
  },
  {
    id: 'REC-03',
    code: '03',
    title: 'Establish Cost-Control Benchmark for Healthcare Infrastructure',
    target: 'Healthcare Sector Projects',
    reason: 'Escalating cost inflation (15.5%) causing recurring budget revisions.',
    suggestedAction: 'Standardize schedule of rates (SoR) and mandate pre-sanction financial audit for works exceeding ₹40 Lakhs.',
    priority: 'MEDIUM',
    badge: 'AI/Analytics Suggested Action',
  },
];
