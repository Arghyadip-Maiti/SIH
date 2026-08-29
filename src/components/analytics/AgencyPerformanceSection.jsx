import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Building2, ArrowRightLeft, ShieldAlert, Clock, CheckCircle2, Coins } from 'lucide-react';

export const AgencyPerformanceSection = ({
  agencyData = [],
  agencyA = '',
  agencyB = '',
  onAgencyAChange,
  onAgencyBChange,
  comparisonData = null,
}) => {
  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <SectionHeader
        title="Implementing Agency Performance & Comparison"
        subtitle="Audit nodal implementing departments and compare agency execution efficiency side-by-side"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Agency Table */}
        <div className="lg:col-span-7 overflow-x-auto">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Agency Performance Rankings
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Implementing Agency</th>
                <th className="py-2.5 px-3 text-right">Works</th>
                <th className="py-2.5 px-3 text-right">Completion</th>
                <th className="py-2.5 px-3 text-right">Avg Delay</th>
                <th className="py-2.5 px-3 text-right">Utilization</th>
                <th className="py-2.5 px-3 text-right">AI Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {agencyData.map((row) => (
                <tr key={row.agency} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>{row.agency}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-700">{row.totalProjects}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{row.completionRate}%</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-rose-600">{row.avgDelayDays}d</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800">{row.utilization}%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800">{row.avgRiskScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Head-to-Head Comparison Card */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">
              <ArrowRightLeft className="w-4 h-4 text-slate-700" />
              <span>Head-to-Head Agency Benchmark</span>
            </div>

            {/* Agency Selectors */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Agency A</label>
                <select
                  value={agencyA}
                  onChange={(e) => onAgencyAChange && onAgencyAChange(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl p-2 text-slate-900 focus:ring-2 focus:ring-slate-500"
                >
                  {agencyData.map((a) => (
                    <option key={`a-${a.agency}`} value={a.agency}>
                      {a.agency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Agency B</label>
                <select
                  value={agencyB}
                  onChange={(e) => onAgencyBChange && onAgencyBChange(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl p-2 text-slate-900 focus:ring-2 focus:ring-slate-500"
                >
                  {agencyData.map((a) => (
                    <option key={`b-${a.agency}`} value={a.agency}>
                      {a.agency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Metrics */}
            {comparisonData?.comparisonMetrics ? (
              <div className="space-y-2.5">
                {comparisonData.comparisonMetrics.map((m) => {
                  const isABetter = m.lowerIsBetter ? m.valueA < m.valueB : m.valueA > m.valueB;
                  const isBBetter = m.lowerIsBetter ? m.valueB < m.valueA : m.valueB > m.valueA;

                  return (
                    <div key={m.label} className="p-2.5 bg-white border border-slate-200 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">
                        {m.label}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-extrabold ${isABetter ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {m.format === 'percentage' ? `${m.valueA}%` : m.format === 'days' ? `${m.valueA} days` : m.valueA}
                        </span>

                        <span className="text-[10px] font-bold text-slate-300">VS</span>

                        <span className={`text-sm font-extrabold ${isBBetter ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {m.format === 'percentage' ? `${m.valueB}%` : m.format === 'days' ? `${m.valueB} days` : m.valueB}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};
