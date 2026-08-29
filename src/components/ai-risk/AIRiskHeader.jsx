import { Bot, Activity, Clock, ShieldCheck } from 'lucide-react';

export const AIRiskHeader = ({
  totalActiveProjects = 0,
  lastAnalysisTime = 'Today, 10:42 AM',
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-slate-800 text-white ">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                AI RISK MONITOR
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>AI SYSTEM ACTIVE</span>
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              AI-powered early warning system for currently running MPLADS projects across India.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
          <Activity className="w-4 h-4 text-slate-700" />
          <span>Currently monitoring: <strong>{totalActiveProjects.toLocaleString()} active projects</strong></span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Last analysis: <strong>{lastAnalysisTime}</strong></span>
        </div>
      </div>
    </div>
  );
};
