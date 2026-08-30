import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { Shield, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';

export const RiskDistributionSection = ({ data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const totalWorks = data.reduce((sum, item) => sum + (item.count || 0), 0);

  const highItem = data.find((d) => d.key === 'HIGH') || { count: 0, percentage: 0 };
  const criticalItem = data.find((d) => d.key === 'CRITICAL') || { count: 0, percentage: 0 };
  const mediumItem = data.find((d) => d.key === 'MEDIUM') || { count: 0, percentage: 0 };

  const totalUrgentWorks = (highItem.count || 0) + (criticalItem.count || 0);
  const urgentPct = totalWorks > 0 ? ((totalUrgentWorks / totalWorks) * 100).toFixed(1) : '0';

  return (
    <Card header={
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-slate-700" />
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
          Risk Tier Volume Distribution
        </h3>
      </div>
    }>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Donut Chart */}
          <div className="relative h-52 flex items-center justify-center">
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
              {hoveredIndex !== null && data[hoveredIndex] ? (
                <>
                  <span className="text-xl font-extrabold text-slate-900 font-mono leading-none">
                    {data[hoveredIndex].count.toLocaleString()}
                  </span>
                  <span
                    className="text-[11px] font-bold truncate max-w-[120px] mt-1"
                    style={{ color: data[hoveredIndex].color }}
                  >
                    {data[hoveredIndex].name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {data[hoveredIndex].percentage}% of total
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-slate-900 font-mono leading-none">
                    {totalWorks.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    Active Projects
                  </span>
                </>
              )}
            </div>

            <div className="relative z-10 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={2}
                  cornerRadius={6}
                    dataKey="count"
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`risk-cell-${index}`}
                        fill={entry.color}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        onMouseEnter={() => setHoveredIndex(index)}
                        style={{
                          opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
                          transition: 'all 0.2s ease-in-out',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    wrapperStyle={{ zIndex: 100, pointerEvents: 'none' }}
                    formatter={(val, name, item) => [`${val.toLocaleString()} works (${item.payload.percentage}%)`, item.payload.name]}
                    contentStyle={{
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      padding: '8px 12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend List */}
          <div className="space-y-2 text-xs">
            {data.map((item, index) => (
              <div
                key={item.key}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  hoveredIndex === index
                    ? 'bg-slate-100/80 border-slate-300 '
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-500 font-medium">{item.percentage}%</span>
                  <span className="font-bold text-slate-900">{item.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Relevant Data Points (Fills bottom space with dynamic metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-0.5">
            <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">
              Urgent Audit Attention
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold font-mono text-rose-900">
                {totalUrgentWorks.toLocaleString()} works
              </span>
              <span className="text-[11px] font-bold text-rose-700 font-mono">
                {urgentPct}%
              </span>
            </div>
            <p className="text-[10px] text-rose-700/80 font-semibold">
              Combined High & Critical Risk works
            </p>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-0.5">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
              Moderate Watchlist
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold font-mono text-amber-900">
                {(mediumItem.count || 0).toLocaleString()} works
              </span>
              <span className="text-[11px] font-bold text-amber-700 font-mono">
                {mediumItem.percentage}%
              </span>
            </div>
            <p className="text-[10px] text-amber-700/80 font-semibold">
              Medium risk tier projects
            </p>
          </div>

          <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl space-y-0.5">
            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
              Cumulative Health Baseline
            </span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <Activity className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-extrabold text-slate-800">
                {totalWorks.toLocaleString()} Evaluated
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">
              Derived from master project dataset
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
