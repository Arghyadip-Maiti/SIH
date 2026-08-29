import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const HouseExpenditureSection = ({ houseExpenditure = {} }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const lokSabha = houseExpenditure.lokSabhaAmountCr || 12168;
  const lokSabhaPct = houseExpenditure.lokSabhaPercentage || 76.8;
  const rajyaSabha = houseExpenditure.rajyaSabhaAmountCr || 3674;
  const rajyaSabhaPct = houseExpenditure.rajyaSabhaPercentage || 23.2;
  const total = houseExpenditure.totalCr || 15842;

  const data = [
    { name: 'Lok Sabha', value: lokSabha, percentage: lokSabhaPct, color: '#16A34A' },
    { name: 'Rajya Sabha', value: rajyaSabha, percentage: rajyaSabhaPct, color: '#475569' },
  ];

  return (
    <Card header={<h3 className="text-base font-bold text-slate-900">House-wise Expenditure</h3>}>
      <div className="flex flex-col items-center justify-center">
        {/* Half Donut Chart */}
        <div className="relative h-64 w-full flex items-center justify-center">
          {/* Center Text Overlay Layer (z-0) */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-0">
            {hoveredIndex !== null && data[hoveredIndex] ? (
              <>
                <span className="text-base font-extrabold text-slate-900 font-mono block leading-tight">
                  ₹{data[hoveredIndex].value.toLocaleString('en-IN')} Cr
                </span>
                <span
                  className="text-[10px] font-bold block truncate max-w-[110px]"
                  style={{ color: data[hoveredIndex].color }}
                >
                  {data[hoveredIndex].name} ({data[hoveredIndex].percentage}%)
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-extrabold text-slate-900 font-mono block leading-tight">
                  ₹{total.toLocaleString('en-IN')} Cr
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total
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
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={85}
                  outerRadius={115}
                  paddingAngle={3}
                  dataKey="value"
                  cornerRadius={6}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {data.map((entry, index) => (
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
                  formatter={(val, name, item) => [`₹${val.toLocaleString('en-IN')} Cr (${item.payload.percentage}%)`, name]}
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
    </Card>
  );
};
