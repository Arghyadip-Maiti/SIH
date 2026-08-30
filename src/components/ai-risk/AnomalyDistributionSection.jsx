import { BarChart2 } from 'lucide-react';
import { Card } from '../ui/Card';

export const AnomalyDistributionSection = ({ data = [] }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card header={
      <div className="flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
          Anomaly Types Distribution
        </h3>
      </div>
    }>
      <div className="space-y-3 py-1">
        {data.map((item) => {
          const widthPct = Math.min(100, Math.max(8, (item.count / maxCount) * 100));

          return (
            <div
              key={item.key}
              className="p-2 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-800 font-bold">
                  {item.name}
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {item.count.toLocaleString()} works
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
