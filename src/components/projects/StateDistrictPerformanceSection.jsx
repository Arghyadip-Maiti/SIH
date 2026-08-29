import { Card } from '../ui/Card';
import { Building2 } from 'lucide-react';

export const StateDistrictPerformanceSection = ({ statePerformance = [] }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">State-wise Project Performance</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {statePerformance.length} States / UTs
          </span>
        </div>
      }
    >
      {/* Scrollable Container with Vertical & Horizontal Scroll support */}
      <div className="max-h-[340px] overflow-auto border border-slate-200 rounded-xl bg-white">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-slate-700 font-bold text-xs">
              {/* Top-Left Pinned Intersection Cell (z-20, Solid Opaque bg-slate-100) */}
              <th className="sticky top-0 left-0 z-20 bg-slate-100 py-2.5 px-3.5 border-b border-r border-slate-200 min-w-[150px] -[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                State
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-2.5 px-3.5 text-center border-b border-slate-200 min-w-[120px]">
                Total Projects
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-2.5 px-3.5 text-center border-b border-slate-200 min-w-[110px]">
                Completed
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-2.5 px-3.5 text-center border-b border-slate-200 min-w-[110px]">
                Delayed
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-2.5 px-3.5 text-right border-b border-slate-200 min-w-[130px]">
                Expenditure
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-2.5 px-3.5 text-center border-b border-slate-200 min-w-[120px]">
                Utilization
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-2.5 px-3.5 text-center border-b border-slate-200 min-w-[120px]">
                Avg Risk
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {statePerformance.map((st) => (
              <tr key={st.state} className="group hover:bg-slate-50 transition-colors">
                {/* Left Pinned Sticky State Cell (z-10, Solid Opaque bg-white / bg-slate-50) */}
                <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 py-2.5 px-3.5 font-bold text-slate-900 border-r border-slate-200 -[3px_0_6px_-2px_rgba(0,0,0,0.08)] min-w-[150px]">
                  {st.state}
                </td>
                <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-800 bg-white group-hover:bg-slate-50 min-w-[120px]">
                  {st.totalProjects}
                </td>
                <td className="py-2.5 px-3.5 text-center font-mono font-bold text-emerald-700 bg-white group-hover:bg-slate-50 min-w-[110px]">
                  {st.completedProjects}
                </td>
                <td className="py-2.5 px-3.5 text-center font-mono font-bold text-rose-600 bg-white group-hover:bg-slate-50 min-w-[110px]">
                  {st.delayedProjects}
                </td>
                <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-800 bg-white group-hover:bg-slate-50 min-w-[130px]">
                  ₹{st.expenditureCr} Cr
                </td>
                <td className="py-2.5 px-3.5 text-center bg-white group-hover:bg-slate-50 min-w-[120px]">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      st.utilization >= 80
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}
                  >
                    {st.utilization}%
                  </span>
                </td>
                <td className="py-2.5 px-3.5 text-center font-mono font-bold bg-white group-hover:bg-slate-50 min-w-[120px]">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                      st.averageRiskScore <= 30
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : st.averageRiskScore <= 60
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}
                  >
                    {st.averageRiskScore}/100
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
