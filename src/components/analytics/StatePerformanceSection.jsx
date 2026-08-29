import { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Search, ArrowUpDown } from 'lucide-react';

export const StatePerformanceSection = ({ data = [], onStateSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('utilization');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const processedData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      result = result.filter((item) => item.state.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [data, searchTerm, sortField, sortAsc]);

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="State Performance Rankings"
          subtitle="Comparative ranking of States and Union Territories based on fund utilization and completion rates"
        />

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search State..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3 text-center">Rank</th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('state')}>
                <div className="flex items-center gap-1">
                  <span>State / UT</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('totalProjects')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Works</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('expenditureCr')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Spend (₹ Cr)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('utilization')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Utilization</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('completionRate')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Completion</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('delayedPercentage')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Delayed %</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-900 text-right" onClick={() => handleSort('avgRiskScore')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Avg Risk</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {processedData.length > 0 ? (
              processedData.map((row, index) => (
                <tr
                  key={row.state}
                  onClick={() => onStateSelect && onStateSelect(row.state)}
                  className="hover:bg-slate-100/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-extrabold text-slate-400 text-center">{index + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{row.state}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700 text-right">{row.totalProjects}</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 text-right">₹{row.expenditureCr} Cr</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`font-extrabold ${row.utilization >= 80 ? 'text-emerald-600' : row.utilization < 65 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {row.utilization}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 text-right">{row.completionRate}%</td>
                  <td className="py-3 px-3 font-semibold text-rose-600 text-right">{row.delayedPercentage}%</td>
                  <td className="py-3 px-3 font-bold text-slate-800 text-right">{row.avgRiskScore}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${row.performanceBadge}`}>
                      {row.performanceCategory}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-6 text-center text-slate-400 font-semibold">
                  No states found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
