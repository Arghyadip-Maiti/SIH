import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { STATE_DISTRICT_MAP } from '../../../services/api/locationService';

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
  const [showAllStates, setShowAllStates] = useState(false);
  const [showAllDistricts, setShowAllDistricts] = useState(false);

   // Dynamic Mathematical Sorting for States (All 28+ States)
  const allStates = Object.keys(STATE_DISTRICT_MAP).map(stateName => {
    const found = statePerformance.find(s => s.state.toLowerCase() === stateName.toLowerCase());
    return found || { state: stateName, utilization: null, expenditureCr: null };
  });

  const sortedStates = allStates.sort((a, b) => {
    const valA = stateMetric === 'utilization' ? (a.utilization || 0) : (a.expenditureCr || 0);
    const valB = stateMetric === 'utilization' ? (b.utilization || 0) : (b.expenditureCr || 0);
    if (valA === 0 && valB !== 0) return 1; // push null/0 to bottom
    if (valB === 0 && valA !== 0) return -1;
    return stateOrder === 'highest' ? valB - valA : valA - valB;
  });
  const displayedStates = showAllStates ? sortedStates : sortedStates.slice(0, 5);

  // Dynamic Mathematical Sorting for Districts (All Districts)
  const allDistricts = Object.entries(STATE_DISTRICT_MAP).flatMap(([stateName, districts]) => {
    return districts.map(districtName => {
      const found = topDistricts.find(d => d.district.toLowerCase() === districtName.toLowerCase() && d.state.toLowerCase() === stateName.toLowerCase());
      return found || { district: districtName, state: stateName, utilization: null, expenditureCr: null };
    });
  });
  
  const sortedDistricts = allDistricts.sort((a, b) => {
    const valA = districtMetric === 'utilization' ? (a.utilization || 0) : (a.expenditureCr || 0);
    const valB = districtMetric === 'utilization' ? (b.utilization || 0) : (b.expenditureCr || 0);
    if (valA === 0 && valB !== 0) return 1; // push null/0 to bottom
    if (valB === 0 && valA !== 0) return -1;
    return districtOrder === 'highest' ? valB - valA : valA - valB;
  });

  const filteredDistricts = filters.state ? sortedDistricts.filter(d => d.state.toLowerCase() === filters.state.toLowerCase()) : sortedDistricts;
  const finalDistricts = filters.district 
    ? filteredDistricts.filter(d => d.district.toLowerCase() === filters.district.toLowerCase()) 
    : (showAllDistricts ? filteredDistricts : filteredDistricts.slice(0, 5));

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
              <CustomSelect
                value={stateMetric}
                onChange={setStateMetric}
                options={[{value: 'utilization', label: 'Utilization %'}, {value: 'expenditure', label: 'Expenditure (₹ Cr)'}]}
                defaultLabel="Metric"
              />
              <CustomSelect
                value={stateOrder}
                onChange={setStateOrder}
                options={[{value: 'highest', label: 'Highest First'}, {value: 'lowest', label: 'Lowest First'}]}
                defaultLabel="Order"
              />
            </div>
          </div>
        }
        footer={
          <div className="text-center">
            <Button onClick={() => setShowAllStates(!showAllStates)} variant="ghost" size="sm" className="text-slate-700 text-xs font-semibold">
              {showAllStates ? 'View Top 5 States' : 'View All States'}
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto h-[260px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2 sticky top-0 bg-white">Rank</th>
                <th className="py-2 px-2 sticky top-0 bg-white">State</th>
                <th className="py-2 px-2 text-right sticky top-0 bg-white">Utilization %</th>
                <th className="py-2 px-2 text-right sticky top-0 bg-white">Expenditure (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {displayedStates.map((st, idx) => (
                <tr key={st.state} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900">{st.state}</td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${stateMetric === 'utilization' ? 'text-slate-800 bg-slate-100/40 rounded' : 'text-slate-700'}`}>
                    {st.utilization !== null ? `${st.utilization}%` : "-"}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${stateMetric === 'expenditure' ? 'text-slate-800 bg-slate-100/40 rounded' : 'text-slate-800'}`}>
                    {st.expenditureCr !== null ? `₹${st.expenditureCr}` : "-"}
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
              <CustomSelect
                value={districtMetric}
                onChange={setDistrictMetric}
                options={[{value: 'expenditure', label: 'Expenditure (₹ Cr)'}, {value: 'utilization', label: 'Utilization %'}]}
                defaultLabel="Metric"
              />
              <CustomSelect
                value={districtOrder}
                onChange={setDistrictOrder}
                options={[{value: 'highest', label: 'Highest First'}, {value: 'lowest', label: 'Lowest First'}]}
                defaultLabel="Order"
              />
            </div>
          </div>
        }
        footer={
          <div className="text-center">
            <Button onClick={() => setShowAllDistricts(!showAllDistricts)} variant="ghost" size="sm" className="text-slate-700 text-xs font-semibold">
              {showAllDistricts ? 'View Top 5 Districts' : 'View All Districts'}
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto h-[260px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2 sticky top-0 bg-white">Rank</th>
                <th className="py-2 px-2 sticky top-0 bg-white">District</th>
                <th className="py-2 px-2 sticky top-0 bg-white">State</th>
                <th className="py-2 px-2 text-right sticky top-0 bg-white">Utilization %</th>
                <th className="py-2 px-2 text-right sticky top-0 bg-white">Expenditure (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {finalDistricts.map((dist, idx) => (
                <tr key={dist.district} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900">{dist.district}</td>
                  <td className="py-2.5 px-2 text-slate-500">{dist.state}</td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${districtMetric === 'utilization' ? 'text-slate-800 bg-slate-100/40 rounded' : 'text-slate-700'}`}>
                    {dist.utilization !== null ? `${dist.utilization}%` : "-"}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono font-bold ${districtMetric === 'expenditure' ? 'text-slate-800 bg-slate-100/40 rounded' : 'text-slate-800'}`}>
                    {dist.expenditureCr !== null ? `₹${dist.expenditureCr}` : "-"}
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
