import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const ProjectStatusSection = ({
  statusDistribution = [],
  totalWorks = 0,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const data = statusDistribution;

  return (
    <Card header={<h3 className="text-base font-bold text-slate-900">Project Status Overview</h3>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Donut Chart with Center Data Overlay & Tooltip Floating Above */}
        <div className="relative h-56 flex items-center justify-center">
          {/* Center Text Overlay Layer (z-0) */}
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
            {hoveredIndex !== null && data[hoveredIndex] ? (
              <>
                <span className="text-2xl font-extrabold text-slate-900 font-mono leading-none">
                  {data[hoveredIndex].count.toLocaleString('en-IN')}
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
                <span className="text-2xl font-extrabold text-slate-900 font-mono leading-none">
                  {totalWorks.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
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
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="count"
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || '#2563EB'}
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
                    `${(val || 0).toLocaleString('en-IN')} works`,
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

        {/* Legend Table with Hover Interaction */}
        <div className="space-y-2 text-xs">
          {data.map((item, index) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                hoveredIndex === index
                  ? 'bg-blue-50/70 border-blue-200 shadow-2xs scale-[1.01]'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">{item.count.toLocaleString('en-IN')}</span>
                <span className="text-slate-400 font-mono text-[11px]">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
