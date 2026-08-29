import { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Search, ExternalLink, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MPPerformanceSection = ({ data = [] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMPs = useMemo(() => {
    if (!searchTerm) return data;
    const q = searchTerm.toLowerCase();
    return data.filter(
      (m) =>
        m.mpName.toLowerCase().includes(q) ||
        m.constituency.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q)
    );
  }, [data, searchTerm]);

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionHeader
          title="MP Performance Leaderboard"
          subtitle="Parliamentary MP track record across project completion, expenditure velocity, and risk management"
        />

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search MP or Constituency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
            <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3 text-center">Rank</th>
              <th className="py-2.5 px-3">Member of Parliament</th>
              <th className="py-2.5 px-3">Constituency</th>
              <th className="py-2.5 px-3">State</th>
              <th className="py-2.5 px-3 text-right">Works</th>
              <th className="py-2.5 px-3 text-right">Expenditure</th>
              <th className="py-2.5 px-3 text-right">Utilization</th>
              <th className="py-2.5 px-3 text-right">Completion</th>
              <th className="py-2.5 px-3 text-right">AI Risk</th>
              <th className="py-2.5 px-3 text-center">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredMPs.length > 0 ? (
              filteredMPs.map((mp, index) => (
                <tr
                  key={mp.mpId}
                  onClick={() => navigate(`/mp/${mp.mpId}`)}
                  className="hover:bg-slate-100/40 cursor-pointer transition-colors group"
                >
                  <td className="py-2.5 px-3 text-center font-extrabold text-slate-400">{index + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 group-hover:text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-extrabold shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span>{mp.mpName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{mp.constituency}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-semibold">{mp.state}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-700">{mp.totalProjects}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">₹{mp.expenditureCr} Cr</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-slate-800">{mp.utilization}%</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">{mp.completionRate}%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800">{mp.averageRiskScore || mp.avgRiskScore}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:underline">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-6 text-center text-slate-400 font-semibold">
                  No MP records matching search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
