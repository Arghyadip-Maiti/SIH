import { useState, useMemo } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';

export const StateRiskOverviewSection = ({ data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalCount = data.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedStates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  return (
    <Card header={
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            State Risk Overview
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-mono">
          <span>All {totalCount} States & UTs</span>
        </div>
      </div>
    }>
      {totalCount === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs font-semibold">
          No state risk data available for current selection.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedStates.map((st) => (
              <div
                key={st.state}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {st.state}
                  </h4>
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
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <div>
                Showing <strong className="text-slate-800 font-mono">{((currentPage - 1) * pageSize) + 1}</strong> to{' '}
                <strong className="text-slate-800 font-mono">{Math.min(totalCount, currentPage * pageSize)}</strong> of{' '}
                <strong className="text-slate-800 font-mono">{totalCount}</strong> States & UTs
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={`state-page-${pageNum}`}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[32px] h-[32px] px-2 rounded-lg text-xs font-bold font-mono transition-all ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white shadow-xs scale-105 border border-blue-600'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
