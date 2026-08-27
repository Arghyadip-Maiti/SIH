import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProjectHeader = ({ lastUpdated = '27 Aug 2026', refreshing = false, onRefresh }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
          Project Monitoring
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Monitor MPLADS works, project progress, financial utilization and execution performance.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <div className="text-[11px] text-slate-400 font-medium">Last updated</div>
          <div className="text-xs font-semibold text-slate-800 font-mono">{lastUpdated}</div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/80 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Data up to date</span>
        </div>

        {onRefresh && (
          <Button
            onClick={onRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
