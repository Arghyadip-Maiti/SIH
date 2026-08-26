import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const StatePerformanceSection = ({
  statePerformance = [],
  topDistricts = [],
  filters = {},
}) => {
  // Sort states controls
  const [stateMetric, setStateMetric] = useState('utilization');
  const [stateOrder, setStateOrder] = useState('highest');

  // Sort districts controls
  const [districtMetric, setDistrictMetric] = useState('expenditure');
  const [districtOrder, setDistrictOrder] = useState('highest');

  // Dynamic Mathematical Sorting for States
  const sortedStates = [...statePerformance].sort((a, b) => {
    const valA = stateMetric === 'utilization' ? (a.utilization || 0) : (a.expenditureCr || 0);
    const valB = stateMetric === 'utilization' ? (b.utilization || 0) : (b.expenditureCr || 0);
    return stateOrder === 'highest' ? valB - valA : valA - valB;
  }).slice(0, 5);

  // Dynamic Mathematical Sorting for Districts
  const sortedDistricts = [...topDistricts].sort((a, b) => {
    const valA = districtMetric === 'utilization' ? (a.utilization || 0) : (a.expenditureCr || 0);
    const valB = districtMetric === 'utilization' ? (b.utilization || 0) : (b.expenditureCr || 0);
    return districtOrder === 'highest' ? valB - valA : valA - valB;
  });

  const finalDistricts = filters.district ? sortedDistricts : sortedDistricts.slice(0, 5);

  const getDistrictHeaderTitle = () => {
    if (filters.district) return `District Ranking: ${filters.district}`;
    if (filters.state) return `Top Districts in ${filters.state}`;
    return 'Top 5 Districts Breakdown';
  };

  const getStateHeaderTitle = () => {
    if (filters.state) return `State Performance: ${filters.state}`;
    return 'Top 5 States Breakdown';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. States Performance Table */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
            <h3 className="text-base font-bold text-slate-900">{getStateHeaderTitle()}</h3>
            <div className="flex items-center gap-1.5">
              <select
                value={stateMetric}
                onChange={(e) => setStateMetric(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="utilization">Utilization %</option>
                <option value="expenditure">Expenditure (₹ Cr)</option>
              </select>
              <select
                value={stateOrder}
                onChange={(e) => setStateOrder(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="highest">Highest First</option>
                <option value="lowest">Lowest First</option>
              </select>
            </div>
          </div>
        }
        footer={
          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-semibold">
              View All States
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2">Rank</th>
                <th className="py-2 px-2">State</th>
                <th className="py-2 px-2 text-right">Utilization %</th>
                <th className="py-2 px-2 text-right">Expenditure (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {sortedStates.map((st, idx) => (
                <tr key={st.state} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900">{st.state}</td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${stateMetric === 'utilization' ? 'text-blue-700 bg-blue-50/40 rounded' : 'text-slate-700'}`}>
                    {st.utilization}%
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${stateMetric === 'expenditure' ? 'text-blue-700 bg-blue-50/40 rounded' : 'text-slate-800'}`}>
                    ₹{st.expenditureCr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 2. Top Districts Table */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
            <h3 className="text-base font-bold text-slate-900">{getDistrictHeaderTitle()}</h3>
            <div className="flex items-center gap-1.5">
              <select
                value={districtMetric}
                onChange={(e) => setDistrictMetric(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="expenditure">Expenditure (₹ Cr)</option>
                <option value="utilization">Utilization %</option>
              </select>
              <select
                value={districtOrder}
                onChange={(e) => setDistrictOrder(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="highest">Highest First</option>
                <option value="lowest">Lowest First</option>
              </select>
            </div>
          </div>
        }
        footer={
          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-semibold">
              View All Districts
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2">Rank</th>
                <th className="py-2 px-2">District</th>
                <th className="py-2 px-2">State</th>
                <th className="py-2 px-2 text-right">Utilization %</th>
                <th className="py-2 px-2 text-right">Expenditure (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {finalDistricts.map((dist, idx) => (
                <tr key={dist.district} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900">{dist.district}</td>
                  <td className="py-2.5 px-2 text-slate-500">{dist.state}</td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${districtMetric === 'utilization' ? 'text-blue-700 bg-blue-50/40 rounded' : 'text-slate-700'}`}>
                    {dist.utilization || 78.5}%
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${districtMetric === 'expenditure' ? 'text-blue-700 bg-blue-50/40 rounded' : 'text-slate-800'}`}>
                    ₹{dist.expenditureCr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
