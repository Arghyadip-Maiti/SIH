import { RefreshCw, CheckCircle2 } from 'lucide-react';

export const AnalyticsHeader = ({
  lastUpdated,
  refreshing,
  onRefresh,
}) => {
  const formattedTime = lastUpdated
    ? new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(lastUpdated)
    : '26 Aug 2026, 10:32 AM';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
          Analytics & Trends
        </h1>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <div className="text-[11px] text-slate-400 font-medium">Last updated</div>
          <div className="text-xs font-semibold text-slate-800 font-mono">{formattedTime}</div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Data up to date</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="text-slate-500 hover:text-slate-800 transition-colors focus:outline-none ml-2"
          title="Refresh Data"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
