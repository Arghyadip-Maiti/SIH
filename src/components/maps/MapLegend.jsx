import { getMetricLegend } from '../../utils/constituencyDataMapper';

export const MapLegend = ({ metric = 'utilization' }) => {
  const legend = getMetricLegend(metric);

  return (
    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/90  text-xs z-[1000] max-w-xs">
      <h5 className="font-bold text-slate-800 text-[11px] mb-2 uppercase tracking-wider">
        {legend.title}
      </h5>
      <div className="space-y-1.5 font-medium text-slate-700">
        {legend.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded  shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
