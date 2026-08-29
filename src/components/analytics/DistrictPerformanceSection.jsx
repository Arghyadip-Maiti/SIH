import { useState } from 'react';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Award, AlertTriangle } from 'lucide-react';

export const DistrictPerformanceSection = ({ districtData = {} }) => {
  const [activeTab, setActiveTab] = useState('top');
  const { topPerforming = [], requiringAttention = [] } = districtData;

  const currentList = activeTab === 'top' ? topPerforming : requiringAttention;

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="District Performance Analytics"
          subtitle="Districts leading fund deployment vs districts flagged for high risk or delays"
        />

        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('top')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'top' ? 'bg-white text-emerald-700  font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Top Performing</span>
          </button>
          <button
            onClick={() => setActiveTab('attention')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'attention' ? 'bg-white text-rose-700  font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Attention</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3">State</th>
              <th className="py-2.5 px-3 text-right">Works</th>
              <th className="py-2.5 px-3 text-right">Expenditure</th>
              <th className="py-2.5 px-3 text-right">Utilization</th>
              <th className="py-2.5 px-3 text-right">Completion</th>
              <th className="py-2.5 px-3 text-right">AI Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {currentList.length > 0 ? (
              currentList.map((row) => (
                <tr key={`${row.district}_${row.state}`} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{row.district}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-500">{row.state}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700 text-right">{row.totalProjects}</td>
                  <td className="py-2.5 px-3 font-extrabold text-slate-900 text-right">₹{row.expenditureCr} Cr</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800">{row.utilization}%</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">{row.completionRate}%</td>
                  <td className="py-2.5 px-3 text-right font-extrabold">
                    <span className={`px-2 py-0.5 rounded-md ${row.avgRiskScore >= 60 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {row.avgRiskScore}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-400 font-semibold">
                  No district data available for selected filter scope.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
