import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { TrendingUp } from 'lucide-react';

export const ExpenditureTrendSection = ({
  data = [],
  granularity = 'Monthly',
  onGranularityChange,
  metric = 'expenditure',
  onMetricChange,
}) => {
  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <SectionHeader
            title="Expenditure Trend"
            subtitle="Track cumulative MPLADS funds utilization and disbursement over time"
          />
          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>↑ 8.2% expenditure acceleration compared with previous period</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Granularity Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            {['Monthly', 'Quarterly', 'Yearly'].map((g) => (
              <button
                key={g}
                onClick={() => onGranularityChange && onGranularityChange(g)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  granularity === g
                    ? 'bg-white text-slate-800  font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <select
            value={metric}
            onChange={(e) => onMetricChange && onMetricChange(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="expenditure">Expenditure (₹ Cr)</option>
            <option value="released">Released Funds (₹ Cr)</option>
            <option value="sanctioned">Sanctioned Amount (₹ Cr)</option>
          </select>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#475569" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#475569" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
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
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              }}
              formatter={(value) => [`₹${value} Cr`, metric.toUpperCase()]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#475569"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorExp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
