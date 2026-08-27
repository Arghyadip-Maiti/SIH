import { Card } from '../ui/Card';
import { UserCheck, Award, ArrowUpRight } from 'lucide-react';

export const MPPerformanceSection = ({ mpPerformance = [], onFilterByMP }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Member of Parliament (MP) Performance Overview</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Calculated from filtered projects</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mpPerformance.slice(0, 6).map((mp) => (
          <div
            key={mp.mpId}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all space-y-3"
          >
            {/* MP Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{mp.mpName}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {mp.constituency}, {mp.state} ({mp.house})
                </p>
              </div>
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Award className="w-4 h-4" />
              </span>
            </div>

            {/* Financial & Utilization */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Utilization</span>
                <span className="text-sm font-mono font-extrabold text-blue-600">{mp.utilization}%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg Risk</span>
                <span className={`text-sm font-mono font-extrabold ${
                  mp.averageRiskScore <= 30 ? 'text-emerald-600' : mp.averageRiskScore <= 60 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {mp.averageRiskScore}/100
                </span>
              </div>
            </div>

            {/* Works Breakdown Pills */}
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold pt-1 border-t border-slate-200/60">
              <div className="p-1 bg-slate-100 rounded">
                <span className="text-slate-500 block">Total</span>
                <span className="font-mono font-bold text-slate-900">{mp.totalProjects}</span>
              </div>
              <div className="p-1 bg-emerald-50 text-emerald-800 rounded">
                <span className="block">Done</span>
                <span className="font-mono font-bold">{mp.completedProjects}</span>
              </div>
              <div className="p-1 bg-blue-50 text-blue-800 rounded">
                <span className="block">Ongoing</span>
                <span className="font-mono font-bold">{mp.ongoingProjects}</span>
              </div>
              <div className="p-1 bg-rose-50 text-rose-800 rounded">
                <span className="block">Delayed</span>
                <span className="font-mono font-bold">{mp.delayedProjects}</span>
              </div>
            </div>

            {/* Filter Action */}
            {onFilterByMP && (
              <button
                onClick={() => onFilterByMP(mp.mpName)}
                className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 flex items-center justify-center gap-1"
              >
                <span>Filter Projects for {mp.mpName}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
