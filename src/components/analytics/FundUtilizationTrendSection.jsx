import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';

export const FundUtilizationTrendSection = ({ data = [] }) => {
  const currentUtil = data.length ? data[data.length - 1]?.currentPeriod || 0 : 0;
  const prevUtil = data.length ? data[data.length - 1]?.previousPeriod || 0 : 0;
  const diffPctPts = Number((currentUtil - prevUtil).toFixed(1));

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="Fund Utilization Over Time"
          subtitle="Percentage of sanctioned MPLADS funds drawn and disbursed across months"
        />

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Scope</div>
            <div className="text-sm font-extrabold text-slate-800">{currentUtil}%</div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">YoY Change</div>
            <div className="text-sm font-extrabold text-emerald-600">+{diffPctPts} pct pts</div>
          </div>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '12px',
                color: '#FFF',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />
            <Line
              type="monotone"
              name="Current Period"
              dataKey="currentPeriod"
              stroke="#475569"
              strokeWidth={3}
              dot={{ r: 3, fill: '#475569' }}
            />
            <Line
              type="monotone"
              name="Previous Period"
              dataKey="previousPeriod"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              name="National Target (85%)"
              dataKey="target"
              stroke="#16A34A"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
