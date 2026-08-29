import { IndianRupee, TrendingUp, CheckCircle2, Clock, Activity, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';

export const NationalSnapshotKPIs = ({ kpis = {} }) => {
  const {
    totalProjects = 0,
    totalExpenditureCr = 0,
    utilizationPercentage = 0,
    completedProjects = 0,
    delayedProjects = 0,
    avgProgress = 0,
    avgRiskScore = 0,
    expenditureGrowth = 8.2,
    utilizationGrowth = 4.4,
  } = kpis;

  const getRiskBadge = (score) => {
    if (score <= 30) return { label: 'LOW RISK', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score <= 60) return { label: 'MEDIUM RISK', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (score <= 80) return { label: 'HIGH RISK', bg: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { label: 'CRITICAL', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const riskBadge = getRiskBadge(avgRiskScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {/* 1. Total Expenditure */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Expenditure
          </span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-slate-900 tracking-tight">
          ₹{totalExpenditureCr.toLocaleString()} Cr
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>↑ {expenditureGrowth}% vs prev period</span>
        </div>
      </Card>

      {/* 2. Fund Utilization */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Fund Utilization
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-slate-900 tracking-tight">
          {utilizationPercentage}%
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{utilizationGrowth} percentage pts</span>
        </div>
      </Card>

      {/* 3. Projects Completed */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Projects Completed
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-slate-900 tracking-tight">
          {completedProjects.toLocaleString()}
        </div>
        <div className="text-[11px] font-semibold text-slate-500 mt-1.5">
          {totalProjects > 0 ? `${((completedProjects / totalProjects) * 100).toFixed(1)}% of filtered works` : '0% of works'}
        </div>
      </Card>

      {/* 4. Projects Delayed */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Projects Delayed
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-rose-600 tracking-tight">
          {delayedProjects.toLocaleString()}
        </div>
        <div className="text-[11px] font-semibold text-rose-600 mt-1.5">
          {totalProjects > 0 ? `${((delayedProjects / totalProjects) * 100).toFixed(1)}% require intervention` : 'No delays'}
        </div>
      </Card>

      {/* 5. Avg Physical Progress */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Avg Work Progress
          </span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-slate-900 tracking-tight">
          {avgProgress}%
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
          <div
            className="bg-slate-800 h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.max(0, avgProgress))}%` }}
          />
        </div>
      </Card>

      {/* 6. Avg Risk Score */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Avg Risk Score
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {avgRiskScore}
          </span>
          <span className="text-xs text-slate-400 font-semibold">/ 100</span>
        </div>
        <div className="mt-1">
          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${riskBadge.bg}`}>
            {riskBadge.label}
          </span>
        </div>
      </Card>
    </div>
  );
};
