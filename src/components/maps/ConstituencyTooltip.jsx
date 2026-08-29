import { getMetricFormattedValue } from '../../utils/constituencyDataMapper';

export const ConstituencyTooltip = ({ feature, data, metric = 'utilization', isState = false }) => {
  const p = feature?.properties || {};
  
  // Extract names from feature if data is missing
  const name = isState 
    ? (data?.state || p.ST_NM || 'Unknown State') 
    : (data?.constituencyName || p.NAME_2 || 'Unknown District');
    
  const subName = isState 
    ? 'State' 
    : (data?.state || p.NAME_1 || 'Unknown State');

  const projects = isState ? data?.totalWorks : data?.totalProjects;
  const risk = isState ? data?.avgRiskScore : data?.averageRiskScore;

  // Render Metric Value
  const renderMetric = () => {
    if (!data) return '-';
    if (isState) {
      if (metric === 'delayedProjects') return `${data.delayedWorks} projects`;
      if (metric === 'expenditure') return `₹${data.expenditureCr} Cr`;
      if (metric === 'averageRiskScore') return `${data.avgRiskScore} / 100`;
      if (metric === 'totalProjects') return `${data.totalWorks} projects`;
    }
    return getMetricFormattedValue(data, metric);
  };

  return (
    <div className="p-1 space-y-1 font-sans text-xs">
      <div className="border-b border-slate-200 pb-1 mb-1">
        <h4 className="font-extrabold text-slate-900 text-sm leading-tight uppercase">
          {name}
        </h4>
        <p className="text-[10px] text-slate-500 font-semibold">{subName}</p>
      </div>

      <div className="space-y-0.5 text-[11px] text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600">Metric:</span>
          <span className="font-bold text-slate-900">
            {renderMetric()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600">Projects:</span>
          <span className="font-mono font-bold text-slate-900">{data ? projects : '-'}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600">Avg Risk:</span>
          <span className="font-mono font-bold text-slate-900">{data && risk !== undefined ? `${risk}/100` : '-'}</span>
        </div>
      </div>
    </div>
  );
};
