import { Activity, ShieldAlert, AlertTriangle, IndianRupee, Camera, Award } from 'lucide-react';
import { Card } from '../ui/Card';

export const RiskKpiCards = ({ kpis = {} }) => {
  const {
    totalActiveProjects = 0,
    highRiskCount = 0,
    criticalRiskCount = 0,
    avgRiskScore = 0,
    financialFlagsCount = 0,
    photoFlagsCount = 0,
  } = kpis;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {/* 1. Active Projects */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Active Projects
          </span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {totalActiveProjects.toLocaleString()}
        </div>
        <div className="text-[11px] font-semibold text-slate-500 mt-1">
          Currently monitored by AI
        </div>
      </Card>

      {/* 2. High Risk */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            High Risk (61-80)
          </span>
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-orange-600 tracking-tight">
          {highRiskCount.toLocaleString()}
        </div>
        <div className="text-[11px] font-semibold text-orange-600 mt-1">
          {totalActiveProjects > 0 ? `${((highRiskCount / totalActiveProjects) * 100).toFixed(1)}% of active works` : '0%'}
        </div>
      </Card>

      {/* 3. Critical Risk */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Critical Risk (81-100)
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-rose-600 tracking-tight">
          {criticalRiskCount.toLocaleString()}
        </div>
        <div className="text-[11px] font-semibold text-rose-600 mt-1">
          Requires urgent field audit
        </div>
      </Card>

      {/* 4. Average Risk Score */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Average Risk Score
          </span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {avgRiskScore}
          </span>
          <span className="text-xs text-slate-400 font-bold">/ 100</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
          <div
            className={`h-1.5 rounded-full transition-all ${
              avgRiskScore >= 60 ? 'bg-rose-500' : avgRiskScore >= 35 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, avgRiskScore))}%` }}
          />
        </div>
      </Card>

      {/* 5. Financial Flags */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Financial Flags
          </span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {financialFlagsCount.toLocaleString()}
        </div>
        <div className="text-[11px] font-semibold text-slate-500 mt-1">
          Cost / Progress mismatch
        </div>
      </Card>

      {/* 6. Photo Flags */}
      <Card className="p-4 border border-slate-200 rounded-2xl bg-white  hover: transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Photo & Location Flags
          </span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Camera className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-purple-700 tracking-tight">
          {photoFlagsCount.toLocaleString()}
        </div>
        <div className="text-[11px] font-semibold text-purple-700 mt-1">
          Duplicate / GPS anomalies
        </div>
      </Card>
    </div>
  );
};
