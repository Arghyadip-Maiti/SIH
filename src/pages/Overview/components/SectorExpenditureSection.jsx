import { useState } from 'react';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const SectorExpenditureSection = ({ sectorDistribution = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const data = sectorDistribution;

  const totalExpenditureCr = data.reduce(
    (sum, item) => sum + (Number(item.amountCr || item.expenditureCr) || 0),
    0
  );

  return (
    <div className="flex flex-col h-full w-full"><h3 className="text-sm font-bold text-slate-900 mb-4 text-center">Sector-wise Expenditure</h3>
      <div className="grid grid-cols-1 gap-4 items-center">
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
                  cornerRadius={6}
                  dataKey="percentage"
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
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

        </div>
    </div>
  );
};
