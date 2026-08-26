import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const StatePerformanceSection = ({
  statePerformance = [],
  topDistricts = [],
}) => {
  const [sortOrder, setSortOrder] = useState('highest');

  // Sort state performance data dynamically
  const sortedStates = [...statePerformance].sort((a, b) => {
    return sortOrder === 'highest' ? b.utilization - a.utilization : a.utilization - b.utilization;
  }).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. Top 5 States by Utilization % */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <h3 className="text-base font-bold text-slate-900">Top 5 States by Utilization %</h3>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold"
            >
              <option value="highest">Highest First</option>
              <option value="lowest">Lowest First</option>
            </select>
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
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-700">
                    {st.utilization}%
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-800">
                    ₹{st.expenditureCr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 2. Top 5 Districts by Expenditure */}
      <Card
        header={<h3 className="text-base font-bold text-slate-900">Top 5 Districts by Expenditure</h3>}
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
                <th className="py-2 px-2 text-right">Expenditure (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {topDistricts.map((dist, idx) => (
                <tr key={dist.district} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-slate-500 font-bold">{dist.rank || idx + 1}</td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900">{dist.district}</td>
                  <td className="py-2.5 px-2 text-slate-500">{dist.state}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-blue-700">
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
