import { Card } from '../ui/Card';
import { Building2, ArrowUpRight } from 'lucide-react';

export const StateDistrictPerformanceSection = ({ statePerformance = [], onSelectState }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">State-wise Project Performance Ranking</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Aggregated from active dataset</span>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
              <th className="py-2.5 px-3">State</th>
              <th className="py-2.5 px-3 text-center">Total Projects</th>
              <th className="py-2.5 px-3 text-center">Completed</th>
              <th className="py-2.5 px-3 text-center">Delayed</th>
              <th className="py-2.5 px-3 text-right">Expenditure</th>
              <th className="py-2.5 px-3 text-center">Utilization</th>
              <th className="py-2.5 px-3 text-center">Avg Risk</th>
              {onSelectState && <th className="py-2.5 px-3 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {statePerformance.slice(0, 8).map((st) => (
              <tr key={st.state} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">{st.state}</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                  {st.totalProjects}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-emerald-700 font-bold">
                  {st.completedProjects}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-rose-600 font-bold">
                  {st.delayedProjects}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                  ₹{st.expenditureCr} Cr
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    st.utilization >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {st.utilization}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                    st.averageRiskScore <= 30 ? 'bg-emerald-50 text-emerald-700' :
                    st.averageRiskScore <= 60 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {st.averageRiskScore}/100
                  </span>
                </td>
                {onSelectState && (
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectState(st.state)}
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-0.5 ml-auto"
                    >
                      Filter <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
