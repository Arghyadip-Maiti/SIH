import { Building, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AgencyOutlookSection = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="p-2 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200">
          <Building className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-slate-900">
          Agency / Contractor Intelligence & Performance Outlook
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((ag) => {
          const isDeclining = ag.trajectoryStatus === 'DECLINING';
          return (
            <div
              key={ag.agency}
              className="p-5 rounded-2xl border bg-slate-50/50 border-slate-200 flex flex-col justify-between hover:bg-slate-50 transition-colors"
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
                    <span className="text-base font-black text-slate-800">{ag.historicalRatePct}%</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current</span>
                    <span className="text-base font-black text-slate-800">{ag.currentRatePct}%</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Forecast
                    </span>
                    <span className="text-base font-black text-slate-800">
                      {ag.forecastRatePct}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Assigned Works: <strong className="text-slate-900">{ag.totalProjects} Works</strong></span>
                <span>Avg Delay: <strong className="text-slate-900">{ag.avgDelayDays} Days</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgencyOutlookSection;
