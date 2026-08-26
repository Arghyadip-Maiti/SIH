import { Card } from '../../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../../utils/formatCurrency';

export const FinancialOverviewSection = ({ kpis = {} }) => {
  const allocated = kpis.totalAllocated || 200000000000;
  const released = kpis.totalReleasedAmount || 183200000000;
  const sanctioned = kpis.totalSanctionedAmount || 171200000000;
  const expenditure = kpis.totalExpenditure || 158420000000;
  const unspent = kpis.unspentReleased || 24780000000;
  const unsanctioned = kpis.unsanctionedFunds || 12000000000;
  const utilizationPct = (kpis.utilizationPercentage || 77.2).toFixed(1);

  const pieData = [
    { name: 'Expenditure', value: expenditure, color: '#16A34A' },
    { name: 'Unspent Released', value: unspent, color: '#F59E0B' },
    { name: 'Unsanctioned', value: unsanctioned, color: '#EF4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. Fund Utilization Overview Card */}
      <Card header={<h3 className="text-base font-bold text-slate-900">Fund Utilization Overview</h3>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Recharts Donut */}
          <div className="relative h-56 flex items-center justify-center">
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                {utilizationPct}%
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Utilized
              </span>
            </div>
            <div className="relative z-10 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    wrapperStyle={{ zIndex: 50 }}
                    formatter={(val) => [formatCurrency(val, true), 'Amount']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px', zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="font-semibold text-slate-700">Released</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{formatCurrency(released, true)}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="font-semibold text-slate-700">Sanctioned</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{formatCurrency(sanctioned, true)}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="font-semibold text-slate-700">Expenditure</span>
              </div>
              <span className="font-mono font-bold text-emerald-800">{formatCurrency(expenditure, true)} ({utilizationPct}%)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-slate-700">Unspent</span>
              </div>
              <span className="font-mono font-bold text-amber-800">{formatCurrency(unspent, true)}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 border border-rose-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                <span className="font-semibold text-slate-700">Unsanctioned</span>
              </div>
              <span className="font-mono font-bold text-rose-800">{formatCurrency(unsanctioned, true)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total Scheme Allocated: <strong className="text-slate-800 font-mono">{formatCurrency(allocated, true)}</strong></span>
          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">FY 2026-27</span>
        </div>
      </Card>

      {/* 2. Fund Flow Visualization Card */}
      <Card header={<h3 className="text-base font-bold text-slate-900">Fund Flow Diagram</h3>}>
        <div className="flex flex-col justify-between h-full py-2">
          {/* Main Flow Chain */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-6">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">Allocated</span>
              <span className="text-sm font-extrabold text-purple-900 font-mono block">{formatCurrency(allocated, true)}</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">Released</span>
              <span className="text-sm font-extrabold text-blue-900 font-mono block">{formatCurrency(released, true)}</span>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">Sanctioned</span>
              <span className="text-sm font-extrabold text-indigo-900 font-mono block">{formatCurrency(sanctioned, true)}</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Expenditure</span>
              <span className="text-sm font-extrabold text-emerald-900 font-mono block">{formatCurrency(expenditure, true)}</span>
            </div>
          </div>

          {/* Flow Connectors & Branching */}
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-center">
              <div className="text-xs font-semibold text-amber-900 mb-0.5">Unspent Released Balance</div>
              <div className="text-base font-extrabold text-amber-700 font-mono">{formatCurrency(unspent, true)}</div>
              <div className="text-[11px] text-amber-600 mt-1">Available with District Authorities</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-center">
              <div className="text-xs font-semibold text-rose-900 mb-0.5">Unsanctioned Allocation</div>
              <div className="text-base font-extrabold text-rose-700 font-mono">{formatCurrency(unsanctioned, true)}</div>
              <div className="text-[11px] text-rose-600 mt-1">Pending MP recommendations</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
