import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { BarChart3, Calendar, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const InteractiveTrendVisualizer = ({
  analyticsData,
  granularity = 'Monthly',
  onGranularityChange,
}) => {
  const [selectedMetric, setSelectedMetric] = useState('expenditure');

  if (!analyticsData) return null;

  const metricOptions = [
    { id: 'expenditure', label: 'Expenditure (₹ Cr)', color: '#0284C7' },
    { id: 'utilization', label: 'Fund Utilization Rate (%)', color: '#16A34A' },
    { id: 'completion', label: 'Project Completion Rate (%)', color: '#8B5CF6' },
    { id: 'sanctioned', label: 'Projects Sanctioned (Count)', color: '#0284C7' },
    { id: 'started', label: 'Projects Started (Count)', color: '#F59E0B' },
    { id: 'avgCost', label: 'Average Project Cost (₹ Lakhs)', color: '#EC4899' },
    { id: 'avgDelay', label: 'Average Delay (Days)', color: '#EF4444' },
  ];

  const activeMetricObj = metricOptions.find((m) => m.id === selectedMetric) || metricOptions[0];

  // Derive data points based on granularity and metric
  let chartRaw = analyticsData.expenditureTrend || [];
  if (selectedMetric === 'utilization') chartRaw = analyticsData.utilizationTrend || [];
  if (selectedMetric === 'completion' || selectedMetric === 'sanctioned' || selectedMetric === 'started') {
    chartRaw = analyticsData.implementationTrend || [];
  }
  if (selectedMetric === 'avgDelay') chartRaw = analyticsData.delayAnalytics?.trend || [];

  // Map to standardized format with calculated % change from previous period
  const formattedData = chartRaw.map((item, idx) => {
    let val = 0;
    let periodName = item.period || item.month || `P${idx + 1}`;

    if (selectedMetric === 'expenditure') val = item.value || item.expenditure || 0;
    else if (selectedMetric === 'utilization') val = item.currentPeriod || 0;
    else if (selectedMetric === 'completion') val = item.completed || item.completion || 0;
    else if (selectedMetric === 'sanctioned') val = item.sanctioned || 0;
    else if (selectedMetric === 'started') val = item.started || 0;
    else if (selectedMetric === 'avgCost') val = item.avgCostLakhs || 24.5;
    else if (selectedMetric === 'avgDelay') val = item.avgDelayDays || 0;

    const prevVal = idx > 0 ? (chartRaw[idx - 1].value || chartRaw[idx - 1].currentPeriod || chartRaw[idx - 1].completed || chartRaw[idx - 1].sanctioned || chartRaw[idx - 1].avgDelayDays || val) : val;
    const changePct = prevVal > 0 ? Number((((val - prevVal) / prevVal) * 100).toFixed(1)) : 0;

    return {
      period: periodName,
      value: val,
      prevValue: prevVal,
      changePct,
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Comprehensive Trend Analysis
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Interactive historical trajectory & period-over-period variance across core administrative metrics
            </p>
          </div>
        </div>

        {/* Time Granularity Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['Monthly', 'Quarterly', 'Yearly'].map((g) => (
              <button
                key={g}
                onClick={() => onGranularityChange && onGranularityChange(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  granularity === g
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {metricOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedMetric(opt.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedMetric === opt.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="period" stroke="#64748B" tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748B" tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  const isUp = d.changePct >= 0;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs border border-slate-800">
                      <div className="font-extrabold text-slate-300 mb-1">{d.period}</div>
                      <div className="text-base font-black text-white">
                        {activeMetricObj.label.split(' ')[0]}: {d.value}
                      </div>
                      <div className={`flex items-center gap-1 font-bold mt-1.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{isUp ? `+${d.changePct}%` : `${d.changePct}%`} from previous period</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={activeMetricObj.label}
              stroke={activeMetricObj.color}
              strokeWidth={3.5}
              dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InteractiveTrendVisualizer;
