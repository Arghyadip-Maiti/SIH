import { useState } from 'react';
import { Card } from '../ui/Card';
import { ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const ProjectRiskSummarySection = ({ riskDistribution = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const totalProjects = riskDistribution.reduce(
    (sum, item) => sum + (Number(item.count) || 0),
    0
  );

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">Project Risk Distribution</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">AI Risk Classification</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Donut Chart with Center Text Overlay & Floating Tooltip Above */}
        <div className="md:col-span-5 h-56 relative flex items-center justify-center">
          {/* Center Text Overlay Layer (z-0) */}
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
            {hoveredIndex !== null && riskDistribution[hoveredIndex] ? (
              <>
                <span className="text-2xl font-extrabold text-slate-900 font-mono leading-none">
                  {riskDistribution[hoveredIndex].count.toLocaleString('en-IN')}
                </span>
                <span
                  className="text-[11px] font-bold truncate max-w-[110px] mt-1"
                  style={{ color: riskDistribution[hoveredIndex].color }}
                >
                  {riskDistribution[hoveredIndex].name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {riskDistribution[hoveredIndex].percentage}% of total
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-extrabold text-slate-900 font-mono leading-none">
                  {totalProjects.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Total Projects
                </span>
              </>
            )}
          </div>

          {/* Recharts Pie SVG & Tooltip Container (z-10 with zIndex 100 Tooltip floating above center text) */}
          <div className="relative z-10 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={2}
                  cornerRadius={6}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell
                      key={`risk-cell-${index}`}
                      fill={entry.color || '#475569'}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      onMouseEnter={() => setHoveredIndex(index)}
                      style={{
                        opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                        transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
                        transform: hoveredIndex === index ? 'scale(1.03)' : 'scale(1)',
                        transformOrigin: 'center center',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 100, pointerEvents: 'none' }}
                  formatter={(val, name) => [
                    `${val.toLocaleString('en-IN')} projects`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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

        {/* Risk Grid Cards */}
        <div className="md:col-span-7 grid grid-cols-2 gap-2.5">
          {riskDistribution.map((r, index) => (
            <div
              key={r.key || r.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                hoveredIndex === index
                  ? ' scale-[1.02] border-opacity-100 ring-2 ring-slate-500/30'
                  : 'hover:'
              }`}
              style={{
                backgroundColor: `${r.color}10`,
                borderColor: `${r.color}35`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: r.color }}
                  />
                  {r.name}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xl font-mono font-black text-slate-900">
                  {r.count.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  {r.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
