import { useState, useMemo, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Card } from '../ui/Card';

export const StateRiskOverviewSection = ({
  data = [],
  selectedState = 'All States',
  onStateSelect,
  onResetState,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Reset pagination when search query or selected state changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState]);

  // Check if any filter is active (global state selection or local search filter)
  const isGlobalStateFiltered = selectedState && selectedState !== 'All States' && selectedState !== 'All';
  const isLocalFiltered = Boolean(searchQuery.trim());
  const isFilterActive = isGlobalStateFiltered || isLocalFiltered;

  // Filter & Automatically Sort States (Top risky to bottom risky)
  const filteredAndSortedStates = useMemo(() => {
    let result = [...data];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((st) => (st.state || '').toLowerCase().includes(q));
    }

    // Automatically sort top risky to bottom risky (highest risk score first, then high risk count)
    result.sort((a, b) => {
      const scoreDiff = (b.avgRiskScore || 0) - (a.avgRiskScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return (b.highRiskCount || 0) - (a.highRiskCount || 0);
    });

    return result;
  }, [data, searchQuery]);

  const totalCount = filteredAndSortedStates.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedStates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedStates.slice(start, start + pageSize);
  }, [filteredAndSortedStates, currentPage, pageSize]);

  const handleReset = (e) => {
    if (e) e.stopPropagation();
    setSearchQuery('');
    setCurrentPage(1);
    if (onResetState) onResetState();
  };

  // Dynamic pagination range builder matching default design
  const getPageItems = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set();
    pages.add(1);
    pages.add(total);
    pages.add(current);
    if (current - 1 > 1) pages.add(current - 1);
    if (current + 1 < total) pages.add(current + 1);

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const items = [];

    for (let i = 0; i < sortedPages.length; i++) {
      if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
        items.push(`ellipsis-${i}`);
      }
      items.push(sortedPages[i]);
    }

    return items;
  };

  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <Card header={
      <div className="flex flex-col gap-3 w-full">
        {/* Header Title & Reset Action */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-700 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                State Risk Overview
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Automatically sorted by top risky to bottom risky
              </span>
            </div>
          </div>

          {/* Reset Button (Appears when any filtration is active) */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleReset}
              className="h-[30px] px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none shrink-0  cursor-pointer animate-in fade-in duration-200"
              title="Reset state filtration"
            >
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Section Search Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 font-mono">
            <span>Showing {totalCount} of {data.length} States & UTs</span>
          </div>

          <div className="relative min-w-[200px] max-w-[320px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search state or UT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>


      </div>
    }>
      {totalCount === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs font-semibold">
          No state risk data available matching current search query.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedStates.map((st) => {
              const isSelected = isGlobalStateFiltered && (st.state || '').toLowerCase() === selectedState.toLowerCase();

              return (
                <div
                  key={st.state}
                  onClick={() => onStateSelect && onStateSelect(st.state)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100/90 border-slate-600 ring-2 ring-slate-500/30 '
                      : 'bg-white border-slate-200 hover:border-slate-400 hover:'
                  }`}
                  title={`Filter monitor by ${st.state}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {st.state}
                      </h4>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold bg-slate-800 text-white px-1.5 py-0.5 rounded-md">
                          Filtered
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                      st.avgRiskScore >= 60
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : st.avgRiskScore >= 35
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      Score: {st.avgRiskScore}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>High Risk Works:</span>
                    <strong className="text-rose-600 font-bold font-mono">
                      {st.highRiskCount} projects
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-1">
                    <span>Total Active Works:</span>
                    <span className="font-mono text-slate-700 font-semibold">{st.totalWorks}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls - Matching Default Design */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <div>
                Showing <strong className="text-slate-800 font-mono">{((currentPage - 1) * pageSize) + 1}</strong> to{' '}
                <strong className="text-slate-800 font-mono">{Math.min(totalCount, currentPage * pageSize)}</strong> of{' '}
                <strong className="text-slate-800 font-mono">{totalCount}</strong> States & UTs
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-full text-slate-800 hover:bg-slate-200/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageItems.map((item) => {
                  if (typeof item === 'string' && item.startsWith('ellipsis')) {
                    return (
                      <span key={item} className="px-1 text-slate-800 font-semibold select-none">
                        ...
                      </span>
                    );
                  }

                  const pageNum = item;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={`state-page-${pageNum}`}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] h-[32px] flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-slate-800 hover:bg-slate-200/70 bg-transparent'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-full text-slate-800 hover:bg-slate-200/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};


