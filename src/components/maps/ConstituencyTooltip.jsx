import { getMetricFormattedValue } from '../../utils/constituencyDataMapper';

export const ConstituencyTooltip = ({ data, metric = 'utilization' }) => {
  if (!data) return null;

  return (
    <div className="p-1 space-y-1 font-sans text-xs">
      <div className="border-b border-slate-700 pb-1 mb-1">
        <h4 className="font-extrabold text-blue-400 text-sm leading-tight uppercase">
          {data.constituencyName}
        </h4>
        <p className="text-[10px] text-slate-300 font-semibold">{data.state}</p>
      </div>

      <div className="space-y-0.5 text-[11px] text-slate-200">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-400">Metric:</span>
          <span className="font-bold text-amber-400">
            {getMetricFormattedValue(data, metric)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-400">Projects:</span>
          <span className="font-mono font-bold text-white">{data.totalProjects}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-400">Avg Risk:</span>
          <span className="font-mono font-bold text-white">{data.averageRiskScore}/100</span>
        </div>
      </div>
    </div>
  );
};
