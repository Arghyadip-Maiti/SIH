import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { CustomSelect } from '../ui/CustomSelect';

export const ProjectsRequiringAttentionTable = ({
  projects = [],
  onProjectClick,
}) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting
  const sortedProjects = useMemo(() => {
    const arr = [...projects];
    arr.sort((a, b) => {
      let valA = a[sortField] ?? 0;
      let valB = b[sortField] ?? 0;

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [projects, sortField, sortOrder]);

  const totalCount = sortedProjects.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Paginated Projects subset
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProjects.slice(start, start + pageSize);
  }, [sortedProjects, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleRowClick = (project) => {
    if (onProjectClick) {
      onProjectClick(project);
    } else {
      // Encode route URL parameter safely for project IDs containing slashes (e.g. MP/BI/100/200)
      const encodedId = encodeURIComponent(project.id || project.projectId);
      navigate(`/ai-risk/${encodedId}`);
    }
  };

  // Dynamic pagination range builder matching Projects section
  const getPageItems = (current, total) => {
    if (total <= 9) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set();
    pages.add(1);
    pages.add(total);
    pages.add(current);
    if (current - 1 > 1) pages.add(current - 1);
    if (current + 1 < total) pages.add(current + 1);
    if (current - 2 > 1) pages.add(current - 2);
    if (current + 2 < total) pages.add(current + 2);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 ">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              🚨 Projects Requiring Attention
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Active MPLADS projects sorted by highest risk score first
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold font-mono">
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>
    }>
      {totalCount === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 my-2">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h4 className="text-sm font-extrabold text-slate-800">No Projects Match Selected Filters</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting scope filters to see active project risks.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto overscroll-x-none">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs bg-slate-50/80">
                  <th className="py-4 px-4 min-w-[240px]">Project & ID</th>
                  <th className="py-4 px-4 min-w-[180px]">Location</th>
                  <th className="py-4 px-4 min-w-[170px]">MP Name</th>
                  <th className="py-4 px-4 min-w-[180px]">Agency</th>
                  <th
                    onClick={() => handleSort('physicalProgress')}
                    className="py-4 px-4 min-w-[220px] cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Progress</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('riskScore')}
                    className="py-4 px-4 min-w-[140px] cursor-pointer hover:text-slate-900 transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Risk Score</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-4 px-4 min-w-[170px]">Primary Issue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium bg-white">
                {paginatedProjects.map((p) => {
                  const riskLevel = p.riskLevel || 'LOW';
                  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  let riskIcon = '🟢';
                  if (riskLevel === 'CRITICAL') {
                    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                    riskIcon = '🔴';
                  } else if (riskLevel === 'HIGH') {
                    badgeColor = 'bg-orange-50 text-orange-700 border-orange-200';
                    riskIcon = '🟠';
                  } else if (riskLevel === 'MEDIUM') {
                    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                    riskIcon = '🟡';
                  }

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleRowClick(p)}
                      className="hover:bg-slate-100/70 cursor-pointer transition-colors group"
                      title="Click row to view AI Project Investigation"
                    >
                      {/* Project & ID */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 group-hover:text-slate-800 transition-colors text-sm sm:text-base leading-snug">
                          {p.name}
                        </div>
                        <div className="text-xs font-mono text-slate-400 font-semibold mt-1">
                          ID: {p.id}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-slate-800 font-bold text-xs sm:text-sm">
                        {p.district}, {p.state}
                      </td>

                      {/* MP Name */}
                      <td className="py-4 px-4 text-slate-900 font-bold text-xs sm:text-sm">
                        {p.mpName || p.mp}
                      </td>

                      {/* Agency */}
                      <td className="py-4 px-4 text-slate-600 text-xs sm:text-sm font-semibold truncate max-w-[200px]">
                        {p.implementingAgency}
                      </td>

                      {/* Progress (Wider Progress Bar) */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-36 sm:w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden  shrink-0">
                            <div
                              className="h-full bg-slate-800 rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.max(0, p.physicalProgress || 0))}%` }}
                            />
                          </div>
                          <span className="font-mono font-extrabold text-slate-900 text-xs sm:text-sm shrink-0">
                            {p.physicalProgress}%
                          </span>
                        </div>
                      </td>

                      {/* Risk Score */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 font-mono font-black text-base">
                          <span className="text-base">{riskIcon}</span>
                          <span className={`px-2.5 py-1 rounded-xl border text-xs font-bold  ${badgeColor}`}>
                            {p.riskScore}
                          </span>
                        </div>
                      </td>

                      {/* Primary Issue */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200/80">
                          {p.primaryAnomaly || 'None'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Dynamic Footer Controls & Scalable Navigation (Matches Projects Section) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-3">
              <div>
                Showing <strong className="text-slate-800 font-mono">{((currentPage - 1) * pageSize) + 1}</strong> to{' '}
                <strong className="text-slate-800 font-mono">{Math.min(totalCount, currentPage * pageSize)}</strong> of{' '}
                <strong className="text-slate-800 font-mono">{totalCount.toLocaleString('en-IN')}</strong> projects
              </div>

              {/* Per-Page Rows Selector Dropdown */}
              <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <span className="text-slate-500">Rows:</span>
                <CustomSelect
                  value={pageSize}
                  onChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                    { value: 100, label: '100' },
                  ]}
                  placement="top"
                />
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                {/* Previous Page Arrow Button */}
              <button
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-full text-slate-800 hover:bg-slate-200/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dynamic Numbered Page Buttons with Ellipsis */}
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
                    key={`page-btn-${pageNum}`}
                    type="button"
                    onClick={() => setPage(pageNum)}
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

              {/* Next Page Arrow Button */}
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-full text-slate-800 hover:bg-slate-200/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};
