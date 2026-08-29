import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProjectHeader = ({ lastUpdated = '27 Aug 2026', refreshing = false, onRefresh }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
          Project Monitoring
        </h1>
        
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <div className="text-[11px] text-slate-400 font-medium">Last updated</div>
          <div className="text-xs font-semibold text-slate-800 font-mono">{lastUpdated}</div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-emerald-700 text-sm font-semibold ">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Data up to date</span>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="text-slate-500 hover:text-slate-800 transition-colors focus:outline-none ml-2"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
