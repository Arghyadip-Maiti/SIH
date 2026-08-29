import { useMemo } from 'react';
import { UserCheck } from 'lucide-react';
import { Card } from '../ui/Card';

export const MPRiskOverviewSection = ({
  data = [],
  selectedMp = '',
  onMpSelect,
  onResetMp,
}) => {
  // Sort MPs strictly by highest risk score first
  const sortedMps = useMemo(() => {
    return [...data].sort((a, b) => (b.avgRiskScore || 0) - (a.avgRiskScore || 0) || (b.criticalRiskCount || 0) - (a.criticalRiskCount || 0));
  }, [data]);

  const isFilterActive = Boolean(selectedMp && selectedMp.trim() !== '');

  return (
    <Card header={
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-slate-700 shrink-0" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              MP Risk Overview
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold block">
              Sorted by highest risk score first
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
                if (onResetMp) onResetMp();
              }}
              className="h-[30px] px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none shrink-0  cursor-pointer"
              title="Reset MP filter"
            >
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    }>
      {/* Scrollable Container with Fixed Height & Sticky Header */}
      <div className="max-h-[340px] overflow-y-auto overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <th className="sticky top-0 z-10 bg-slate-100 py-3 px-3 border-b border-slate-200">
                Member of Parliament (MP)
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-3 px-3 text-center border-b border-slate-200">
                Active Projects
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-3 px-3 text-center border-b border-slate-200">
                High Risk
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-3 px-3 text-center border-b border-slate-200">
                Critical
              </th>
              <th className="sticky top-0 z-10 bg-slate-100 py-3 px-3 text-right border-b border-slate-200">
                Avg Risk Score ⚡
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sortedMps.map((m) => {
              const isSelected = isFilterActive && (
                (m.mpName || '').toLowerCase().includes(selectedMp.toLowerCase()) ||
                (m.mpId || '').toLowerCase().includes(selectedMp.toLowerCase())
              );

              return (
                <tr
                  key={m.mpId || m.mpName}
                  onClick={() => onMpSelect && onMpSelect(m.mpName)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100/90 font-bold border-l-4 border-l-blue-600'
                      : 'hover:bg-slate-100/60'
                  }`}
                  title={`Filter active monitor by ${m.mpName}`}
                >
                  <td className="py-2.5 px-3 font-extrabold text-slate-900">
                    {m.mpName}
                    <span className="block text-[10px] font-medium text-slate-400 font-mono">
                      ID: {m.mpId}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                    {m.totalWorks}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-orange-600">
                    {m.highRiskCount}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600">
                    {m.criticalRiskCount}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-extrabold text-slate-900">
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${
                      m.avgRiskScore >= 60
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : m.avgRiskScore >= 35
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {m.avgRiskScore}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
