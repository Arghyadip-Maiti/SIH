import {
  MapPin,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export const ConstituencyDetailsPanel = ({ selectedConstituency }) => {
  if (!selectedConstituency) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90  p-8 text-center text-slate-500 min-h-[580px] flex flex-col items-center justify-center animate-fadeIn">
        
        <h4 className="text-base font-bold text-slate-800">No Constituency Selected</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Click any state on the map to inspect complete financial, project status, risk, and performance metrics.
        </p>
      </div>
    );
  }

  const d = selectedConstituency;

  // Format currency helpers
  const formatCr = (amount) => `₹${(amount / 10000000).toFixed(1)} Cr`;
  const unutilized = Math.max(0, d.sanctionedAmount - d.expenditure);

  // Risk Badge helper
  const getRiskBadge = (score) => {
    if (score <= 30) {
      return { label: 'LOW RISK', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    }
    if (score <= 60) {
      return { label: 'MEDIUM RISK', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    }
    if (score <= 80) {
      return { label: 'HIGH RISK', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
    }
    return { label: 'CRITICAL RISK', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
  };

  const riskBadge = getRiskBadge(d.averageRiskScore);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90  p-5 h-[580px] overflow-y-auto space-y-5 animate-fadeIn">
      {/* 1. BASIC INFORMATION SECTION (ONLY Constituency Name & State Name) */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mb-1.5 inline-block">
          Region Details
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight capitalize leading-none">
          {d.constituencyName.toLowerCase()}
        </h3>
        <p className="text-sm font-semibold text-slate-500 mt-1 capitalize">
          {d.state.toLowerCase()}
        </p>
      </div>

      {/* 2. FINANCIAL SECTION */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
          <span>Financial</span>
        </h4>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-700 uppercase block">Sanctioned</span>
            <span className="text-base font-mono font-extrabold text-slate-950">{formatCr(d.sanctionedAmount)}</span>
          </div>

          <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <span className="text-[10px] font-semibold text-emerald-600 uppercase block">Spent</span>
            <span className="text-base font-mono font-extrabold text-emerald-950">{formatCr(d.expenditure)}</span>
          </div>

          <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl">
            <span className="text-[10px] font-semibold text-amber-600 uppercase block">Unutilized</span>
            <span className="text-base font-mono font-extrabold text-amber-950">{formatCr(unutilized)}</span>
          </div>

          <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-700 uppercase block">Utilization</span>
            <span className="text-base font-mono font-extrabold text-indigo-950">{d.utilization}%</span>
          </div>
        </div>

        {/* Progress Visualization Bar */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
            <span>Utilization Progress</span>
            <span className="font-mono text-slate-700 font-extrabold">{d.utilization}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-slate-800 transition-all duration-500"
              style={{ width: `${Math.min(100, d.utilization)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. PROJECTS SECTION */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-700" />
          <span>Projects ({d.totalProjects} Total)</span>
        </h4>

        {/* Visual Stacked Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 flex overflow-hidden p-0.5">
          <div
            style={{ width: `${(d.completedProjects / d.totalProjects) * 100}%` }}
            className="bg-emerald-500 h-full rounded-l-full"
            title={`Completed: ${d.completedProjects}`}
          />
          <div
            style={{ width: `${(d.nearCompletionProjects / d.totalProjects) * 100}%` }}
            className="bg-amber-400 h-full"
            title={`Near Completion: ${d.nearCompletionProjects}`}
          />
          <div
            style={{ width: `${(d.ongoingProjects / d.totalProjects) * 100}%` }}
            className="bg-slate-700 h-full"
            title={`Ongoing: ${d.ongoingProjects}`}
          />
          <div
            style={{ width: `${(d.startingProjects / d.totalProjects) * 100}%` }}
            className="bg-slate-400 h-full"
            title={`Starting: ${d.startingProjects}`}
          />
          <div
            style={{ width: `${(d.delayedProjects / d.totalProjects) * 100}%` }}
            className="bg-rose-500 h-full rounded-r-full"
            title={`Delayed: ${d.delayedProjects}`}
          />
        </div>

        {/* Breakdown Items List */}
        <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
          <div className="p-1.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg">
            <span className="text-[10px] font-bold text-emerald-700 block">Completed</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{d.completedProjects}</span>
          </div>
          <div className="p-1.5 bg-amber-50/70 border border-amber-200/60 rounded-lg">
            <span className="text-[10px] font-bold text-amber-700 block">Near Comp.</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{d.nearCompletionProjects}</span>
          </div>
          <div className="p-1.5 bg-slate-100/70 border border-slate-300/60 rounded-lg">
            <span className="text-[10px] font-bold text-slate-800 block">Ongoing</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{d.ongoingProjects}</span>
          </div>
          <div className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-lg">
            <span className="text-[10px] font-bold text-slate-600 block">Starting</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{d.startingProjects}</span>
          </div>
          <div className="p-1.5 bg-rose-50/70 border border-rose-200/60 rounded-lg col-span-2">
            <span className="text-[10px] font-bold text-rose-700 block">Delayed</span>
            <span className="font-mono font-extrabold text-rose-900 text-sm">{d.delayedProjects}</span>
          </div>
        </div>
      </div>

      {/* 4. RISK SECTION */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Risk Overview</span>
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 ${riskBadge.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`} />
            {riskBadge.label}
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Average Risk Score</span>
          <span className="text-base font-mono font-extrabold text-slate-900">
            {d.averageRiskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
          <div className="p-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg font-semibold">
            <span className="block font-bold">Critical</span>
            <span className="font-mono text-sm font-extrabold">{d.criticalProjects}</span>
          </div>
          <div className="p-1.5 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg font-semibold">
            <span className="block font-bold">High</span>
            <span className="font-mono text-sm font-extrabold">{d.highRiskProjects}</span>
          </div>
          <div className="p-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-semibold">
            <span className="block font-bold">Medium</span>
            <span className="font-mono text-sm font-extrabold">{d.mediumRiskProjects}</span>
          </div>
          <div className="p-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
            <span className="block font-bold">Low</span>
            <span className="font-mono text-sm font-extrabold">{d.lowRiskProjects}</span>
          </div>
        </div>
      </div>

      {/* 5. PERFORMANCE SECTION */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5 text-slate-700" />
          <span>Performance Indicators</span>
        </h4>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-[10px] text-slate-500 font-semibold block">Completion</span>
            <span className="font-mono font-extrabold text-slate-900">{d.completionRate}%</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-[10px] text-slate-500 font-semibold block">On-Time</span>
            <span className="font-mono font-extrabold text-slate-900">{d.onTimeCompletion}%</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-[10px] text-slate-500 font-semibold block">Avg Delay</span>
            <span className="font-mono font-extrabold text-slate-900">{d.averageDelay} d</span>
          </div>
        </div>
      </div>
    </div>
  );
};
