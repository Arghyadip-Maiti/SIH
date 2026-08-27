import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { UserCheck, Search, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

const DUMMY_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
];

export const MPPerformanceSection = ({ mpPerformance = [] }) => {
  const navigate = useNavigate();
  const [houseFilter, setHouseFilter] = useState('All'); // 'All' | 'Lok Sabha' | 'Rajya Sabha'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // 12, 24, 48, or All (999)

  // Filtered dataset by House (Lok Sabha/Rajya Sabha) & Search Query
  const filteredMPs = useMemo(() => {
    let list = mpPerformance;

    if (houseFilter !== 'All') {
      list = list.filter((mp) => (mp.house || '').toLowerCase() === houseFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (mp) =>
          (mp.mpName || '').toLowerCase().includes(q) ||
          (mp.constituency || '').toLowerCase().includes(q) ||
          (mp.state || '').toLowerCase().includes(q) ||
          (mp.house || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [mpPerformance, houseFilter, searchQuery]);

  // Pagination calculation
  const totalItems = filteredMPs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMPs = useMemo(() => {
    if (pageSize >= 999) return filteredMPs;
    const startIdx = (safeCurrentPage - 1) * pageSize;
    return filteredMPs.slice(startIdx, startIdx + pageSize);
  }, [filteredMPs, safeCurrentPage, pageSize]);

  const handleHouseChange = (h) => {
    setHouseFilter(h);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Member of Parliament (MP) Performance Overview
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Showing <strong>{filteredMPs.length} MPs</strong> ({houseFilter === 'All' ? 'Both Houses' : houseFilter})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* HOUSE FILTER TABS (Both Houses, Lok Sabha, Rajya Sabha) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => handleHouseChange('All')}
                className={`px-3 py-1.5 rounded-lg transition-all ${houseFilter === 'All' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Both Houses
              </button>
              <button
                onClick={() => handleHouseChange('Lok Sabha')}
                className={`px-3 py-1.5 rounded-lg transition-all ${houseFilter === 'Lok Sabha' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Lok Sabha
              </button>
              <button
                onClick={() => handleHouseChange('Rajya Sabha')}
                className={`px-3 py-1.5 rounded-lg transition-all ${houseFilter === 'Rajya Sabha' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Rajya Sabha
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search MP, constituency, state..."
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden w-56 shadow-2xs"
              />
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => { setPageSize(12); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg transition-all ${pageSize === 12 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                12 Cards
              </button>
              <button
                onClick={() => { setPageSize(24); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg transition-all ${pageSize === 24 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                24 Cards
              </button>
              <button
                onClick={() => { setPageSize(999); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg transition-all ${pageSize >= 999 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Show All ({filteredMPs.length})
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* MP Cards Grid */}
        {paginatedMPs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedMPs.map((mp, idx) => (
              <div
                key={mp.mpId}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-lg transition-all space-y-3 group"
              >
                {/* MP Header with Top-Right Profile Picture Avatar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {mp.mpName}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      {mp.constituency}, {mp.state}
                    </p>
                    <span className="inline-block text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 font-extrabold mt-1">
                      {mp.house}
                    </span>
                  </div>

                  {/* MP Profile Picture Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/80 shadow-md shrink-0 bg-slate-200 group-hover:scale-105 transition-transform">
                    <img
                      src={mp.avatarUrl || DUMMY_AVATARS[idx % DUMMY_AVATARS.length]}
                      alt={mp.mpName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Financial & Utilization */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Fund Utilization</span>
                    <span className="text-sm font-mono font-black text-blue-600">{mp.utilization}%</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Avg Risk Score</span>
                    <span className={`text-sm font-mono font-black ${
                      mp.averageRiskScore <= 30 ? 'text-emerald-600' : mp.averageRiskScore <= 60 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {mp.averageRiskScore}/100
                    </span>
                  </div>
                </div>

                {/* Works Breakdown Pills */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold pt-1.5 border-t border-slate-200/80">
                  <div className="p-1.5 bg-slate-100 rounded-xl">
                    <span className="text-slate-500 block text-[9px] uppercase">Total</span>
                    <span className="font-mono font-black text-slate-900">{mp.totalProjects}</span>
                  </div>
                  <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                    <span className="block text-[9px] uppercase">Done</span>
                    <span className="font-mono font-black">{mp.completedProjects}</span>
                  </div>
                  <div className="p-1.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                    <span className="block text-[9px] uppercase">Ongoing</span>
                    <span className="font-mono font-black">{mp.ongoingProjects}</span>
                  </div>
                  <div className="p-1.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-100">
                    <span className="block text-[9px] uppercase">Delayed</span>
                    <span className="font-mono font-black">{mp.delayedProjects}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => navigate(`/mp/${encodeURIComponent(mp.mpId)}`)}
                  className="w-full mt-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-xs hover:scale-[1.01]"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs font-semibold">
            No Member of Parliament found for filter &ldquo;{houseFilter}&rdquo; {searchQuery && `matching "${searchQuery}"`}.
          </div>
        )}

        {/* Pagination Bar (when pageSize is limited) */}
        {pageSize < 999 && totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs text-slate-600 font-semibold flex-wrap gap-2">
            <span>
              Showing <strong>{paginatedMPs.length}</strong> of <strong>{totalItems}</strong> MPs (Page {safeCurrentPage} of {totalPages})
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                    pg === safeCurrentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MPPerformanceSection;
