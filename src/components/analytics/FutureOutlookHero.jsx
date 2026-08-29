import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { TrendingUp, Sparkles, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';

export const FutureOutlookHero = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('expenditure');

  if (!data || !data.timeline) return null;

  const { timeline, metricsSummary } = data;
  const currentMetricObj = metricsSummary?.[selectedMetric] || {};

  const metricConfigs = {
    expenditure: { label: 'Expenditure', unit: '₹ Cr', color: '#0284C7', key: 'expenditure' },
    utilization: { label: 'Fund Utilization', unit: '%', color: '#16A34A', key: 'utilization' },
    completion: { label: 'Project Completion Rate', unit: '%', color: '#8B5CF6', key: 'completion' },
    delayDays: { label: 'Average Delay', unit: 'Days', color: '#EF4444', key: 'delayDays' },
  };

  const activeConfig = metricConfigs[selectedMetric];

  // Prepare chart data with distinct actual vs forecast values
  const chartData = timeline.map((item) => ({
    period: item.period,
    label: item.label,
    type: item.type,
    actual: item.type === 'HISTORICAL' || item.type === 'CURRENT' ? item[activeConfig.key] : null,
    forecast: item.type === 'CURRENT' || item.type === 'FORECAST' ? item[activeConfig.key] : null,
  }));

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8 relative overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            MPLADS Future Outlook
          </h2>
        </div>

        {/* Metric Switcher Pills */}
        <div className="flex flex-nowrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 overflow-x-auto max-w-full shrink-0">
          {Object.entries(metricConfigs).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                selectedMetric === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Stage Indicators (HISTORICAL -> CURRENT -> FORECAST) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 relative z-10">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Historical Baseline
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {currentMetricObj.historical} <span className="text-xs font-semibold text-slate-400">{currentMetricObj.unit}</span>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-700/60 text-slate-300 border border-slate-600/40">
            Recorded
          </span>
        </div>

        <div className="bg-blue-950/60 backdrop-blur border border-blue-600/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Current Situation
            </div>
            <div className="text-2xl font-black text-blue-200 mt-1">
              {currentMetricObj.current} <span className="text-xs font-semibold text-blue-300/80">{currentMetricObj.unit}</span>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Live Active
          </span>
        </div>

        <div className="bg-indigo-950/60 backdrop-blur border border-indigo-500/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Forecast Horizon (Mar)
            </div>
            <div className="text-2xl font-black text-indigo-200 mt-1">
              {currentMetricObj.forecast} <span className="text-xs font-semibold text-indigo-300/80">{currentMetricObj.unit}</span>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Predicted
          </span>
        </div>
      </div>

      {/* Main Forecast Chart Box */}
      <div className="relative z-10 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Recorded Data
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-400 border border-dashed border-indigo-200 inline-block" /> Forecast Path
            </span>
          </div>
          <div className="text-xs text-slate-400 italic">
            Dashed line demarcation represents present transition point (NOW)
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="period" stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    const val = dataPoint.actual !== null ? dataPoint.actual : dataPoint.forecast;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
                        <div className="font-bold text-white mb-1">{dataPoint.label}</div>
                        <div className="text-slate-300">
                          {activeConfig.label}: <span className="font-extrabold text-blue-400">{val} {activeConfig.unit}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine x="Nov (Current)" stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'NOW', fill: '#F59E0B', fontSize: 10, fontWeight: 'bold', position: 'top' }} />
              <Area type="monotone" dataKey="actual" stroke={activeConfig.color} strokeWidth={3} fillOpacity={1} fill="url(#actualGrad)" />
              <Area type="monotone" dataKey="forecast" stroke="#818CF8" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#forecastGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FutureOutlookHero;
