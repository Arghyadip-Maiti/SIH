import { Card } from '../../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const HouseExpenditureSection = ({ houseExpenditure = {} }) => {
  const lokSabha = houseExpenditure.lokSabhaAmountCr || 12168;
  const lokSabhaPct = houseExpenditure.lokSabhaPercentage || 76.8;
  const rajyaSabha = houseExpenditure.rajyaSabhaAmountCr || 3674;
  const rajyaSabhaPct = houseExpenditure.rajyaSabhaPercentage || 23.2;
  const total = houseExpenditure.totalCr || 15842;

  const data = [
    { name: 'Lok Sabha', value: lokSabha, percentage: lokSabhaPct, color: '#16A34A' },
    { name: 'Rajya Sabha', value: rajyaSabha, percentage: rajyaSabhaPct, color: '#2563EB' },
  ];

  return (
    <Card header={<h3 className="text-base font-bold text-slate-900">House-wise Expenditure</h3>}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Half Donut Chart */}
        <div className="relative h-44 w-full sm:w-1/2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="70%"
                startAngle={180}
                endAngle={0}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name, item) => [`₹${val.toLocaleString('en-IN')} Cr (${item.payload.percentage}%)`, name]}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
            <span className="text-lg font-extrabold text-slate-900 font-mono block">
              ₹{total.toLocaleString('en-IN')} Cr
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        {/* Legend Box */}
        <div className="w-full sm:w-1/2 space-y-3 text-xs">
          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="font-semibold text-slate-800">Lok Sabha</span>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-emerald-900">₹{lokSabha.toLocaleString('en-IN')} Cr</div>
              <div className="text-[10px] text-slate-500">({lokSabhaPct}%)</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="font-semibold text-slate-800">Rajya Sabha</span>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-blue-900">₹{rajyaSabha.toLocaleString('en-IN')} Cr</div>
              <div className="text-[10px] text-slate-500">({rajyaSabhaPct}%)</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
