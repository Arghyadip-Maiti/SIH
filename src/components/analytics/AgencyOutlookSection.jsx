import { Building, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AgencyOutlookSection = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Agency / Contractor Intelligence & Performance Outlook
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Analyzing implementing agency track record across historical, current, and forecasted project cycles
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          {data.length} Agencies Evaluated
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((ag) => {
          const isDeclining = ag.trajectoryStatus === 'DECLINING';
          return (
            <div
              key={ag.agency}
              className={`p-5 rounded-2xl border ${
                isDeclining ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-200'
              } flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h4 className="text-base font-black text-slate-900">{ag.agency}</h4>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-xl flex items-center gap-1.5 border ${
                    isDeclining ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {isDeclining ? <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {ag.badgeText}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Historical</span>
                    <span className="text-base font-black text-slate-700">{ag.historicalRatePct}%</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Current</span>
                    <span className="text-base font-black text-blue-700">{ag.currentRatePct}%</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDeclining ? 'text-rose-500' : 'text-emerald-500'}`}>
                      Forecast
                    </span>
                    <span className={`text-base font-black ${isDeclining ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {ag.forecastRatePct}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Assigned Works: <strong className="text-slate-900">{ag.totalProjects} Works</strong></span>
                <span>Avg Delay: <strong className="text-rose-700">{ag.avgDelayDays} Days</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgencyOutlookSection;
