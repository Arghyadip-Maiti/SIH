import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';

export const AIRiskTrendSection = ({ data = [] }) => {
  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="AI Risk Trend"
          subtitle="AI anomaly score evolution and risk tier volume breakdown across months"
        />

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low (0-30)
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Med (31-60)
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> High (61-80)
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Crit (81-100)
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '12px',
                color: '#FFF',
                fontSize: '12px',
              }}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
            <Area type="monotone" name="Low Risk" dataKey="lowRisk" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.7} />
            <Area type="monotone" name="Medium Risk" dataKey="mediumRisk" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.7} />
            <Area type="monotone" name="High Risk" dataKey="highRisk" stackId="1" stroke="#F97316" fill="#F97316" fillOpacity={0.7} />
            <Area type="monotone" name="Critical Risk" dataKey="criticalRisk" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
