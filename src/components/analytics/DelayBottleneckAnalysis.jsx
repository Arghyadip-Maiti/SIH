import { Clock, ArrowRight, ShieldAlert } from 'lucide-react';

export const DelayBottleneckAnalysis = ({ data }) => {
  if (!data) return null;

  const {
    stageBreakdown = [],
    currentBottleneck,
    historicalBottleneck,
    predictedFutureBottleneck,
    forecastAlert,
  } = data;

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Delay & Bottleneck Analysis
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              MPLADS 6-Stage Project Lifecycle: Identifying stage dwell time and predicting future bottleneck shifts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <span>Active Bottleneck:</span>
          <span className="text-rose-700 font-extrabold">{currentBottleneck}</span>
        </div>
      </div>

      {/* Lifecycle Flow Stepper Header */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {stageBreakdown.map((st, idx) => (
          <div key={st.id} className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col items-center bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl min-w-[120px] text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Stage 0{idx + 1}
              </span>
              <span className="text-xs font-extrabold text-slate-900 mt-0.5">{st.name}</span>
              <span className="text-[11px] font-bold text-slate-600 mt-1">{st.calculatedDays} Days Avg</span>
            </div>
            {idx < stageBreakdown.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Stage Delay Percentage Visual Progress Bars */}
      <div className="space-y-4 mb-8">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
          Stage Time & Delay Contribution Breakdown
        </h4>
        {stageBreakdown.map((st) => (
          <div key={st.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }} />
                <span className="text-xs font-extrabold text-slate-900">{st.name} Stage</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(st.severity)}`}>
                  {st.severity} Bottleneck Risk
                </span>
              </div>
              <div className="text-xs font-bold text-slate-700">
                {st.calculatedDays} Days ({st.delaySharePct}% of Total Lifecycle)
              </div>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${st.delaySharePct * 2}%`,
                  backgroundColor: st.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottleneck Summary Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Historical Bottleneck</span>
          <div className="text-sm font-extrabold text-slate-900 mt-1">{historicalBottleneck}</div>
          <p className="text-[11px] text-slate-500 mt-1">Past quarter primary delay zone</p>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Current Active Bottleneck</span>
          <div className="text-sm font-extrabold text-rose-900 mt-1">{currentBottleneck}</div>
          <p className="text-[11px] text-rose-700 mt-1">Requires immediate administrative review</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Predicted Future Bottleneck</span>
          <div className="text-sm font-extrabold text-indigo-900 mt-1">{predictedFutureBottleneck}</div>
          <p className="text-[11px] text-indigo-700 mt-1">Predicted next quarter bottleneck shift</p>
        </div>
      </div>

      {/* Forecast Callout Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
            Predictive Lifecycle Alert
          </h5>
          <p className="text-xs font-semibold text-amber-800 mt-0.5 leading-relaxed">
            "{forecastAlert}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default DelayBottleneckAnalysis;
