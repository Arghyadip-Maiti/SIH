import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../../utils/formatCurrency';

export const FinancialOverviewSection = ({ kpis = {} }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const allocated = kpis.totalAllocated || 200000000000;
  const released = kpis.totalReleasedAmount || 183200000000;
  const sanctioned = kpis.totalSanctionedAmount || 171200000000;
  const expenditure = kpis.totalExpenditure || 158420000000;
  const unspent = kpis.unspentReleased || 24780000000;
  const unsanctioned = kpis.unsanctionedFunds || 12000000000;
  const utilizationPct = (kpis.utilizationPercentage || 77.2).toFixed(1);

  const pieData = [
    { name: 'Expenditure', value: expenditure, color: '#16A34A' },
    { name: 'Unspent Released', value: unspent, color: '#F59E0B' },
    { name: 'Unsanctioned', value: unsanctioned, color: '#EF4444' },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="text-sm font-bold text-slate-900 mb-4 text-center">Fund Utilization Overview</h3>
      <div className="grid grid-cols-1 gap-4 items-center">
          {/* Recharts Donut */}
          <div className="relative h-56 w-full flex items-center justify-center">
            {/* Center Text Overlay Layer (z-0) */}
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
              {hoveredIndex !== null && pieData[hoveredIndex] ? (
                <>
                  <span className="text-lg font-extrabold text-slate-900 font-mono tracking-tight leading-none">
                    {formatCurrency(pieData[hoveredIndex].value, true)}
                  </span>
                  <span
                    className="text-[11px] font-bold truncate max-w-[120px] mt-1"
                    style={{ color: pieData[hoveredIndex].color }}
                  >
                    {pieData[hoveredIndex].name}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight leading-none">
                    {utilizationPct}%
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1">
                    Utilized
                  </span>
                </>
              )}
            </div>

            {/* Recharts Pie SVG & Tooltip Container (z-10 with zIndex 100 Tooltip floating above center text) */}
            <div className="relative z-10 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  cornerRadius={6}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
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
                    formatter={(val) => [formatCurrency(val, true), 'Amount']}
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

      <div className="mt-auto pt-4 flex flex-col justify-end border-t border-transparent">
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Allocated: <strong className="text-slate-800 font-mono">{formatCurrency(allocated, true)}</strong></span>
          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">FY 2026-27</span>
        </div>
      </div>
    </div>
  );
};
