import { AlertTriangle, ArrowUpRight, DollarSign } from 'lucide-react';

export const CostPressureAnalysis = ({ data }) => {
  if (!data) return null;

  const { sectorBreakdown = [], highestInflationSector } = data;

  const getPressureBadge = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Average Cost Pressure Analysis
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectorBreakdown.map((sec) => {
          const badge = getPressureBadge(sec.pressureLevel);
          return (
            <div key={sec.type} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-100/60 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h4 className="text-sm font-extrabold text-slate-900">{sec.type}</h4>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badge}`}>
                    {sec.pressureLevel} PRESSURE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Avg</span>
                    <span className="text-base font-black text-slate-800">₹{sec.currentAvgLakhs} L</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Forecast Avg</span>
                    <span className="text-base font-black text-indigo-700">₹{sec.forecastAvgLakhs} L</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Predicted Inflation Rate:</span>
                <span className="text-rose-600 flex items-center gap-1 font-extrabold">
                  +{sec.inflationRatePct}%
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CostPressureAnalysis;
