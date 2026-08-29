import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { AlertCircle, Coins, ShieldAlert } from 'lucide-react';

export const CostExpenditureAnalysisSection = ({ costData = {} }) => {
  const {
    totalSanctionedCr = 0,
    totalExpenditureCr = 0,
    avgProjectCostLakhs = 0,
    totalOverrunCount = 0,
    totalOverrunCr = 0,
    sectorCostBreakdown = [],
  } = costData;

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="Cost & Expenditure Analysis"
          subtitle="Compare sanctioned allocations versus actual spend and identify budget overrun risks"
        />

        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2">
            <Coins className="w-4 h-4 text-slate-700" />
            <span>Avg Cost: <strong>₹{avgProjectCostLakhs} Lakhs</strong></span>
          </div>

          <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Overruns: <strong>{totalOverrunCount} Works (₹{totalOverrunCr} Cr)</strong></span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sectorCostBreakdown} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 10, fill: '#475569' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}Cr`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '12px',
                color: '#FFF',
                fontSize: '12px',
              }}
              formatter={(val) => [`₹${val} Cr`]}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
            <Bar name="Sanctioned (₹ Cr)" dataKey="sanctionedCr" fill="#94A3B8" radius={[6, 6, 0, 0]} barSize={16} />
            <Bar name="Expenditure (₹ Cr)" dataKey="expenditureCr" fill="#475569" radius={[6, 6, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
