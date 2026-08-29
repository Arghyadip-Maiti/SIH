import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';

export const PerformanceMatrixSection = ({
  data = [],
  entityType = 'State',
  onEntityTypeChange,
}) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW':
        return '#10B981';
      case 'MEDIUM':
        return '#F59E0B';
      case 'HIGH':
        return '#F97316';
      case 'CRITICAL':
        return '#EF4444';
      default:
        return '#475569';
    }
  };

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="Performance Matrix"
          subtitle="4-Quadrant bubble chart mapping Fund Utilization vs Completion Rate (Bubble size = Works count, Color = Risk)"
        />

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entity Level:</label>
          <select
            value={entityType}
            onChange={(e) => onEntityTypeChange && onEntityTypeChange(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="State">State Level</option>
            <option value="District">District Level</option>
            <option value="MP">MP Level</option>
            <option value="Agency">Implementing Agency</option>
          </select>
        </div>
      </div>

      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              type="number"
              dataKey="xUtilization"
              name="Utilization Rate"
              unit="%"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              label={{ value: 'Fund Utilization Rate (%) →', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 11, fontWeight: 700 }}
            />
            <YAxis
              type="number"
              dataKey="yCompletion"
              name="Completion Rate"
              unit="%"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              label={{ value: '↑ Completion Rate (%)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11, fontWeight: 700 }}
            />
            <ZAxis type="number" dataKey="size" range={[60, 400]} name="Works Volume" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '12px',
                color: '#FFF',
                fontSize: '12px',
              }}
              formatter={(val, name, entry) => {
                if (name === 'Utilization Rate') return [`${val}%`, 'Utilization'];
                if (name === 'Completion Rate') return [`${val}%`, 'Completion Rate'];
                if (name === 'Works Volume') return [`${val} works`, 'Volume'];
                return [val, name];
              }}
            />
            <Scatter name="Entities" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskLevel)} fillOpacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Quadrant Guide Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
        <div className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100 text-[11px] font-semibold text-emerald-800">
          Top Right: High Utilization + High Completion (Ideal)
        </div>
        <div className="p-2 rounded-xl bg-amber-50/50 border border-amber-100 text-[11px] font-semibold text-amber-800">
          Top Left: Low Utilization + High Completion
        </div>
        <div className="p-2 rounded-xl bg-slate-100/50 border border-slate-200 text-[11px] font-semibold text-slate-900">
          Bottom Right: High Utilization + Low Completion
        </div>
        <div className="p-2 rounded-xl bg-rose-50/50 border border-rose-100 text-[11px] font-semibold text-rose-800">
          Bottom Left: Low Utilization + Low Completion (Critical)
        </div>
      </div>
    </Card>
  );
};
