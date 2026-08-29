/**
 * Standard Metric Options supported by the map
 */
export const METRIC_OPTIONS = [
  { id: 'utilization', label: 'Fund Utilization (%)', unit: '%' },
  { id: 'completionRate', label: 'Project Completion (%)', unit: '%' },
  { id: 'delayedProjects', label: 'Project Delays (Count)', unit: '' },
  { id: 'averageRiskScore', label: 'Average Risk Score (0-100)', unit: '/100' },
  { id: 'expenditure', label: 'Expenditure (₹ Cr)', unit: ' Cr' },
  { id: 'totalProjects', label: 'Number of Projects', unit: '' },
];

/**
 * Calculates constituency choropleth color based on value and selected metric.
 */
export const getConstituencyColor = (value, metric = 'utilization') => {
  if (value === null || value === undefined || isNaN(value)) {
    return '#94A3B8'; // No Data Gray
  }

  switch (metric) {
    case 'utilization':
    case 'completionRate':
      if (value < 40) return '#EF4444'; // Red Low
      if (value < 70) return '#EAB308'; // Yellow Medium
      return '#10B981'; // Green High

    case 'delayedProjects':
      if (value <= 4) return '#10B981'; // Green Low
      if (value <= 10) return '#EAB308'; // Yellow Medium
      return '#EF4444'; // Red High

    case 'averageRiskScore':
      if (value <= 30) return '#10B981'; // Green Low
      if (value <= 60) return '#EAB308'; // Yellow Medium
      if (value <= 80) return '#F97316'; // Orange High
      return '#EF4444'; // Red Critical

    case 'expenditure': {
      const cr = value / 10000000;
      if (cr < 15) return '#EF4444';
      if (cr < 30) return '#EAB308';
      return '#10B981';
    }

    case 'totalProjects':
      if (value < 100) return '#EF4444';
      if (value < 160) return '#EAB308';
      return '#10B981';

    default:
      return '#64748b';
  }
};

/**
 * Returns legend configuration for the active map metric
 */
export const getMetricLegend = (metric = 'utilization') => {
  switch (metric) {
    case 'utilization':
      return {
        title: 'Fund Utilization (%)',
        items: [
          { color: '#EF4444', label: '0–40% (Low)' },
          { color: '#EAB308', label: '40–70% (Medium)' },
          { color: '#10B981', label: '70–100% (High)' },
          { color: '#94A3B8', label: 'No Data / Filtered' },
        ],
      };

    case 'completionRate':
      return {
        title: 'Project Completion Rate (%)',
        items: [
          { color: '#EF4444', label: '0–40% (Low)' },
          { color: '#EAB308', label: '40–70% (Medium)' },
          { color: '#10B981', label: '70–100% (High)' },
          { color: '#94A3B8', label: 'No Data' },
        ],
      };

    case 'delayedProjects':
      return {
        title: 'Project Delays (Count)',
        items: [
          { color: '#10B981', label: '0–4 Delays (Low)' },
          { color: '#EAB308', label: '5–10 Delays (Medium)' },
          { color: '#EF4444', label: '> 10 Delays (High)' },
          { color: '#94A3B8', label: 'No Data' },
        ],
      };

    case 'averageRiskScore':
      return {
        title: 'Average Risk Score (0-100)',
        items: [
          { color: '#10B981', label: '0–30 (Low Risk)' },
          { color: '#EAB308', label: '31–60 (Medium Risk)' },
          { color: '#F97316', label: '61–80 (High Risk)' },
          { color: '#EF4444', label: '81–100 (Critical)' },
          { color: '#94A3B8', label: 'No Data' },
        ],
      };

    case 'expenditure':
      return {
        title: 'Expenditure (₹ Cr)',
        items: [
          { color: '#EF4444', label: '< ₹15 Cr' },
          { color: '#EAB308', label: '₹15 Cr – ₹30 Cr' },
          { color: '#10B981', label: '> ₹30 Cr' },
          { color: '#94A3B8', label: 'No Data' },
        ],
      };

    case 'totalProjects':
      return {
        title: 'Total Projects Count',
        items: [
          { color: '#EF4444', label: '< 100 Projects' },
          { color: '#EAB308', label: '100 – 160 Projects' },
          { color: '#10B981', label: '> 160 Projects' },
          { color: '#94A3B8', label: 'No Data' },
        ],
      };

    default:
      return { title: 'Metric', items: [] };
  }
};

/**
 * Returns display value for a metric
 */
export const getMetricFormattedValue = (data, metric = 'utilization') => {
  if (!data) return 'No Data';

  switch (metric) {
    case 'utilization':
      return `${data.utilization}%`;
    case 'completionRate':
      return `${data.completionRate}%`;
    case 'delayedProjects':
      return `${data.delayedProjects} projects`;
    case 'averageRiskScore':
      return `${data.averageRiskScore} / 100`;
    case 'expenditure':
      return `₹${(data.expenditure / 10000000).toFixed(1)} Cr`;
    case 'totalProjects':
      return `${data.totalProjects} projects`;
    default:
      return data[metric] || 'N/A';
  }
};

/**
 * Joins a GeoJSON feature with MPLADS constituency dataset
 */
export const matchConstituencyData = (feature, constituencyMap = {}, filters = {}) => {
  const p = feature.properties || {};
  const pcId = String(p.pc_id || '');
  const pcName = String(p.pc_name || '').trim();
  const stName = String(p.st_name || '').trim();

  // Primary match by pcId
  let record = constituencyMap[pcId];

  // Secondary match by name & state if pcId fails
  if (!record && pcName) {
    record = Object.values(constituencyMap).find(
      (c) =>
        c.constituencyName.toLowerCase() === pcName.toLowerCase() &&
        (!stName || c.state.toLowerCase() === stName.toLowerCase())
    );
  }

  if (!record) {
    return null;
  }

  // Check if constituency matches active global filters
  if (filters.state && record.state.toLowerCase() !== filters.state.toLowerCase()) {
    return { ...record, isFilteredOut: true };
  }

  if (filters.riskLevel) {
    if (filters.riskLevel === 'CRITICAL' && record.averageRiskScore < 81) return { ...record, isFilteredOut: true };
    if (filters.riskLevel === 'HIGH' && (record.averageRiskScore < 61 || record.averageRiskScore > 80)) return { ...record, isFilteredOut: true };
    if (filters.riskLevel === 'MEDIUM' && (record.averageRiskScore < 31 || record.averageRiskScore > 60)) return { ...record, isFilteredOut: true };
    if (filters.riskLevel === 'LOW' && record.averageRiskScore > 30) return { ...record, isFilteredOut: true };
  }

  return record;
};
