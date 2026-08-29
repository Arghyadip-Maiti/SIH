import { useState } from 'react';
import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';

export const ProjectStatusSection = ({ statusDistribution = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const totalProjects = statusDistribution.reduce(
    (sum, item) => sum + (Number(item.count) || 0),
    0
  );

  return (
    <Card
      header={
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">Project Status Distribution</h3>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Donut Chart with Center Text Overlay & Floating Tooltip Above */}
        <div className="md:col-span-5 h-56 relative flex items-center justify-center">
          {/* Center Text Overlay Layer (z-0) */}
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
            {hoveredIndex !== null && statusDistribution[hoveredIndex] ? (
              <>
                <span className="text-2xl font-extrabold text-slate-900 font-mono leading-none">
                  {statusDistribution[hoveredIndex].count.toLocaleString('en-IN')}
                </span>
                <span
                  className="text-[11px] font-bold truncate max-w-[110px] mt-1"
                  style={{ color: statusDistribution[hoveredIndex].color }}
                >
                  {statusDistribution[hoveredIndex].name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {statusDistribution[hoveredIndex].percentage}% of total
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-extrabold text-slate-900 font-mono leading-none">
                  {totalProjects.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Total Works
                </span>
              </>
            )}
          </div>

          {/* Recharts Pie SVG & Tooltip Container (z-10 with zIndex 100 Tooltip floating above center text) */}
          <div className="relative z-10 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
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
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`status-cell-${index}`}
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

        {/* Legend List */}
        <div className="md:col-span-7 space-y-2 text-xs">
          {statusDistribution.map((st, index) => (
            <div
              key={st.key || st.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                hoveredIndex === index
                  ? 'bg-slate-100/70 border-slate-300  scale-[1.01]'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center justify-between font-semibold mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: st.color }}
                  />
                  <span className="text-slate-700">{st.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    {st.count.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    ({st.percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${st.percentage}%`, backgroundColor: st.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
