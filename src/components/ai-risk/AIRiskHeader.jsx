import { Bot, Activity, Clock } from 'lucide-react';

export const AIRiskHeader = ({
  totalActiveProjects = 0,
  lastAnalysisTime = 'Today, 10:42 AM',
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16">
      {/* Left: Title + subtitle */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-slate-800 text-white">
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
          </div>
        </div>
      </div>

      {/* Right: Stacked stat rows — number wrapped in compact box */}
      <div className="flex flex-col gap-2">
        {/* Row 1: Currently monitoring */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Activity className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Currently monitoring:</span>
          <span className="font-mono font-black text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
            {totalActiveProjects.toLocaleString()} active projects
          </span>
        </div>

        {/* Row 2: Last analysis */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Last analysis:</span>
          <span className="font-mono font-black text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
            {lastAnalysisTime}
          </span>
        </div>
      </div>
    </div>
  );
};
