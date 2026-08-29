import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Clock, AlertTriangle } from 'lucide-react';

export const DelayAnalyticsSection = ({ delayData = {} }) => {
  const {
    totalDelayed = 0,
    avgDelayDays = 0,
    severeDelayed = 0,
    trend = [],
    distribution = [],
  } = delayData;

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="Project Delay Trends"
          subtitle="Monitor timeline slippages and severe project execution bottlenecks"
        />

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Delay</div>
              <div className="text-sm font-extrabold text-slate-900">{avgDelayDays} Days</div>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Severe (&gt;90d)</div>
              <div className="text-sm font-extrabold text-rose-600">{severeDelayed} Works</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Trend Line Chart */}
        <div className="lg:col-span-7 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}d`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                formatter={(val) => [`${val} days`, 'Avg Delay']}
              />
              <Line type="monotone" name="Avg Delay Days" dataKey="avgDelayDays" stroke="#F97316" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution Bars */}
        <div className="lg:col-span-5 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                formatter={(val) => [`${val} works`, 'Volume']}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                {distribution.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
