import { UserCheck, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MpOutlookSection = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              MP Performance Outlook & Trajectories
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Evaluating Member of Parliament expenditure behavior and predicting performance trajectory direction
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          Top MPs Monitored
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.slice(0, 6).map((mp) => {
          const isUp = mp.trendDirection === 'UP';
          return (
            <div key={mp.mpId} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-100/60 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{mp.mpName}</h4>
                    <p className="text-xs font-semibold text-slate-500">{mp.constituency} ({mp.state})</p>
                  </div>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 border ${
                    isUp ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {isUp ? 'Improving' : 'Declining'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Utilization</span>
                    <span className="text-base font-black text-slate-800">{mp.utilization}%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Forecast Utilization</span>
                    <span className="text-base font-black text-indigo-700">{mp.forecastUtilization}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Completed Works: <strong className="text-slate-900">{mp.completionRate}%</strong></span>
                <span>Exp: <strong className="text-slate-900">₹{mp.expenditureCr} Cr</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MpOutlookSection;
