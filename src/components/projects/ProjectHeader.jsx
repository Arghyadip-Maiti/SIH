import { Calendar, RefreshCw, FolderKanban } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProjectHeader = ({ lastUpdated = '27 Aug 2026', refreshing = false, onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
      <div className="flex items-start gap-3.5">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 shadow-2xs">
          <FolderKanban className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Project Monitoring
            </h1>
            <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              MPLADS Master
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Monitor MPLADS works, project progress, financial utilization and execution performance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Last updated: <strong className="text-slate-800">{lastUpdated}</strong></span>
        </div>

        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        )}
      </div>
    </div>
  );
};
