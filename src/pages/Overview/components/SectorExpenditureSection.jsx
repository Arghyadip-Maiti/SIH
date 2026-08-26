import { Card } from '../../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const SectorExpenditureSection = ({ sectorDistribution = [] }) => {
  const data = sectorDistribution;

  const totalExpenditureCr = data.reduce(
    (sum, item) => sum + (Number(item.amountCr) || 0),
    0
  );

  return (
    <Card header={<h3 className="text-base font-bold text-slate-900">Sector-wise Expenditure</h3>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Donut Chart with Center Data */}
        <div className="relative h-56 flex items-center justify-center">
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
            <span className="text-base font-extrabold text-slate-900 font-mono leading-tight">
              ₹{totalExpenditureCr.toLocaleString('en-IN')} Cr
            </span>
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Total Expenditure
            </span>
          </div>
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
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#2563EB'} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 50 }}
                  formatter={(val, name, item) => [`${val}% (₹${item.payload.amountCr} Cr)`, 'Share']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px', zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2 text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-slate-500">{item.percentage}%</span>
                <span className="font-mono font-bold text-slate-900">₹{item.amountCr} Cr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
