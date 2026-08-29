import { useState } from 'react';
import { Building2, ArrowUpDown, TrendingUp, AlertTriangle } from 'lucide-react';

export const StateOutlookSection = ({ data = [] }) => {
  const [sortField, setSortField] = useState('utilization');
  const [sortAsc, setSortAsc] = useState(false);

  if (!data || data.length === 0) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedList = [...data].sort((a, b) => {
    let valA = a[sortField] || 0;
    let valB = b[sortField] || 0;
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              State Performance & Forecast Outlook
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Comparing active state performance indicator status against predicted short-term trajectory (Current → Forecast)
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          {data.length} States Ranked
        </div>
      </div>

      {/* Sortable Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('state')}>
                <div className="flex items-center gap-1">
                  <span>State Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Current → Forecast Status</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('utilization')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Utilization</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('completionRate')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Completion</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('delayedProjects')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Delayed Works</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('expenditureCr')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Expenditure (₹ Cr)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
            {sortedList.map((st) => (
              <tr key={st.state} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{st.state}</td>
                <td className="py-3.5 px-4 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${st.currentBadge || 'bg-emerald-100 text-emerald-800'}`}>
                      {st.currentStatus}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${st.forecastBadge || 'bg-emerald-100 text-emerald-800'}`}>
                      {st.forecastStatus}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600">{st.utilization}%</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-blue-600">{st.completionRate}%</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-rose-600">{st.delayedProjects} Works</td>
                <td className="py-3.5 px-4 text-right font-black text-slate-900">₹{st.expenditureCr} Cr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StateOutlookSection;
