import { Building2 } from 'lucide-react';
import { Card } from '../ui/Card';

export const AgencyRiskOverviewSection = ({
  data = [],
  selectedAgency = 'All Agencies',
  onAgencySelect,
  onResetAgency,
}) => {
  const topAgencies = data.slice(0, 5);
  const isFilterActive = selectedAgency && selectedAgency !== 'All Agencies' && selectedAgency !== 'All';

  return (
    <Card header={
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4.5 h-4.5 text-slate-700 shrink-0" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Implementing Agency Risk
            </h3>
            <span className="text-[11px] font-medium text-slate-500 block">
              Baseline National Avg Delay: <strong className="font-semibold font-mono text-slate-700">31 days</strong>
            </span>
          </div>
        </div>

        {/* Top-Right Action Area */}
        {isFilterActive && (
          <div className="ml-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onResetAgency) onResetAgency();
              }}
              className="h-[30px] px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none shrink-0  cursor-pointer"
              title="Reset agency filter"
            >
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    }>
      <div className="space-y-3">
        {topAgencies.map((ag) => {
          const isSelected = isFilterActive && (ag.agency || '').toLowerCase() === selectedAgency.toLowerCase();

          return (
            <div
              key={ag.agency}
              onClick={() => onAgencySelect && onAgencySelect(ag.agency)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-slate-100/80 border-slate-500 '
                  : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-400 hover:'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {ag.agency}
                  </h4>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${ag.badgeStyle}`}>
                    {ag.riskTier} RISK
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-extrabold bg-slate-800 text-white px-2 py-0.5 rounded-md">
                      Filtered
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {ag.totalWorks} active projects under execution | Avg Risk Score: <strong className="text-slate-800 font-mono">{ag.avgRiskScore}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs">
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Avg Delay
                  </span>
                  <span className={`font-mono font-extrabold text-sm ${
                    ag.avgDelayDays > 45 ? 'text-rose-600' : ag.avgDelayDays > 30 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {ag.avgDelayDays} days
                  </span>
                </div>

                <div className="text-right pl-3 border-l border-slate-200">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    National Baseline
                  </span>
                  <span className="font-mono font-semibold text-slate-600 text-xs">
                    31 days
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
