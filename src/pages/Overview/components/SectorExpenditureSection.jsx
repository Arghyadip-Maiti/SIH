import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const SectorExpenditureSection = ({ sectorDistribution = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const data = sectorDistribution;

  const totalExpenditureCr = data.reduce(
    (sum, item) => sum + (Number(item.amountCr || item.expenditureCr) || 0),
    0
  );

  return (
    <Card header={<h3 className="text-base font-bold text-slate-900">Sector-wise Expenditure</h3>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Donut Chart with Center Data Overlay & Floating Tooltip Above */}
        <div className="relative h-56 flex items-center justify-center">
          {/* Center Text Overlay Layer (z-0) */}
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
            {hoveredIndex !== null && data[hoveredIndex] ? (
              <>
                <span className="text-xl font-extrabold text-slate-900 font-mono leading-none">
                  ₹{data[hoveredIndex].amountCr || data[hoveredIndex].expenditureCr} Cr
                </span>
                <span
                  className="text-[11px] font-bold truncate max-w-[120px] mt-1"
                  style={{ color: data[hoveredIndex].color }}
                >
                  {data[hoveredIndex].name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {data[hoveredIndex].percentage}% share
                </span>
              </>
            ) : (
              <>
                <span className="text-xl font-extrabold text-slate-900 font-mono leading-none">
                  ₹{totalExpenditureCr.toLocaleString('en-IN')} Cr
                </span>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Total Expenditure
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
                  innerRadius={60}
                  outerRadius={82}
                  paddingAngle={2}
                  dataKey="percentage"
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
                  formatter={(val, name, item) => [`${val}% (₹${item.payload.amountCr || item.payload.expenditureCr} Cr)`, 'Share']}
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

        {/* Legend List with Hover Interactivity */}
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
                <span className="font-mono font-semibold text-slate-500">{item.percentage}%</span>
                <span className="font-mono font-bold text-slate-900">₹{item.amountCr || item.expenditureCr} Cr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
