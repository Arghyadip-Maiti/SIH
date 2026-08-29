import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';

export const ProjectImplementationTrendSection = ({ data = [] }) => {
  const [activeSeries, setActiveSeries] = useState({
    sanctioned: true,
    started: true,
    ongoing: true,
    completed: true,
    delayed: true,
  });

  const toggleSeries = (key) => {
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="Project Implementation Trend"
          subtitle="Track lifecycle progression of MPLADS infrastructure works across months"
        />

        {/* Series Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {[
            { key: 'sanctioned', label: 'Sanctioned', color: '#64748B' },
            { key: 'started', label: 'Started', color: '#0284C7' },
            { key: 'ongoing', label: 'Ongoing', color: '#475569' },
            { key: 'completed', label: 'Completed', color: '#16A34A' },
            { key: 'delayed', label: 'Delayed', color: '#DC2626' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => toggleSeries(item.key)}
              className={`text-[11px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeSeries[item.key]
                  ? 'bg-white text-slate-900  font-bold'
                  : 'text-slate-400 hover:text-slate-600 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </button>
          ))}
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
            {activeSeries.sanctioned && (
              <Line type="monotone" name="Sanctioned" dataKey="sanctioned" stroke="#64748B" strokeWidth={2} dot={false} />
            )}
            {activeSeries.started && (
              <Line type="monotone" name="Started" dataKey="started" stroke="#0284C7" strokeWidth={2} dot={false} />
            )}
            {activeSeries.ongoing && (
              <Line type="monotone" name="Ongoing" dataKey="ongoing" stroke="#475569" strokeWidth={2.5} dot={{ r: 3 }} />
            )}
            {activeSeries.completed && (
              <Line type="monotone" name="Completed" dataKey="completed" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3 }} />
            )}
            {activeSeries.delayed && (
              <Line type="monotone" name="Delayed" dataKey="delayed" stroke="#DC2626" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
