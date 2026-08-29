import { useState } from 'react';
import { Card } from '../ui/Card';
import { Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const ProjectTypeAnalyticsSection = ({ projectTypeDistribution = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">Projects & Expenditure by Sector Type</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Sector Distribution</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Sleek, Thinner Horizontal Bar Chart */}
        <div className="lg:col-span-7 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectTypeDistribution}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                width={135}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                wrapperStyle={{ zIndex: 100, pointerEvents: 'none' }}
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
                formatter={(val, name, item) => [
                  `${val} projects (₹${item.payload.amountCr} Cr)`,
                  item.payload.name,
                ]}
              />
              <Bar dataKey="count" barSize={12} radius={[0, 4, 4, 0]}>
                {projectTypeDistribution.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={entry.color || '#475569'}
                    onMouseEnter={() => setHoveredIndex(index)}
                    style={{
                      opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.45,
                      transition: 'opacity 0.2s ease-in-out',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clean Sector Breakdown Cards */}
        <div className="lg:col-span-5 space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {projectTypeDistribution.map((sec, index) => (
            <div
              key={sec.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer text-xs ${
                hoveredIndex === index
                  ? 'bg-slate-100/70 border-slate-300  scale-[1.01]'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: sec.color }}
                />
                <span className="font-semibold text-slate-700">{sec.name}</span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-slate-900 block">{sec.count} works</span>
                <span className="text-slate-500 text-[10px]">₹{sec.amountCr} Cr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
