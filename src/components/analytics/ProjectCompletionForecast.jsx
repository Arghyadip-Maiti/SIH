import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { History, CheckCircle2 } from 'lucide-react';

export const ProjectCompletionForecast = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('expenditure');

  if (!data || !data.metrics) return null;

  const { metrics, statusMessage } = data;

  const metricConfigs = {
    expenditure: { label: 'Expenditure', key: 'expenditure' },
    utilization: { label: 'Fund Utilization', key: 'utilization' },
    completion: { label: 'Project Completion Rate', key: 'completion' },
    delayDays: { label: 'Average Delay', key: 'delayDays' },
  };

  const activeMetric = metrics[selectedMetric] || metrics.expenditure;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      {/* Header & Metric Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Historic Comparison
            </h3>
          </div>
        </div>

        {/* Metric Switcher Filter Pills in One Line */}
        <div className="flex flex-nowrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto max-w-full shrink-0">
          {Object.entries(metricConfigs).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedMetric === key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">This Year {activeMetric.label}</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {activeMetric.thisYearVal} <span className="text-xs font-semibold text-slate-500">{activeMetric.unit}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Active Fiscal Period</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">5-Yr Historical Avg</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {activeMetric.histAvgVal} <span className="text-xs font-semibold text-slate-500">{activeMetric.unit}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Historic Benchmark</span>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Historical Variance</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {activeMetric.diffText}
          </div>
          <span className="text-[11px] font-semibold text-emerald-700">Variance to 5-Yr Benchmark</span>
        </div>
      </div>

      {/* Monthly Historic Comparison Chart */}
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Monthly Benchmark Comparison: This Year (─) vs 5-Yr Historical Avg (---)
          </h4>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeMetric.monthlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="thisYearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="histAvgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64748B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="thisYear" name={`This Year ${activeMetric.label}`} stroke="#0284C7" strokeWidth={3} fill="url(#thisYearGrad)" connectNulls={false} />
              <Area type="monotone" dataKey="historicalAverage" name={`5-Yr Historical Avg ${activeMetric.label}`} stroke="#64748B" strokeWidth={2} strokeDasharray="4 4" fill="url(#histAvgGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProjectCompletionForecast;
