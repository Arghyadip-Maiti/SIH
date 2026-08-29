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
              Average Delay & Bottleneck Analysis
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <span>Active Bottleneck:</span>
          <span className="text-rose-700 font-extrabold">{currentBottleneck}</span>
        </div>
      </div>

      {/* Lifecycle Flow Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {stageBreakdown.map((st, idx) => (
          <div key={st.id} className="flex flex-col items-center bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 p-4 sm:p-5 rounded-2xl text-center transition-all">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Stage 0{idx + 1}
            </span>
            <span className="text-sm font-black text-slate-900 mt-1 truncate max-w-full">{st.name}</span>
            <div className="text-xl font-black text-slate-900 mt-2">
              {st.calculatedDays} <span className="text-xs font-bold text-slate-500">Days</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DelayBottleneckAnalysis;
