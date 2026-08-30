import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Briefcase,
  Search,
  X,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { CustomSelect } from '../ui/CustomSelect';
import { getStatusBadgeClass, getRiskColorClass } from '../../utils/projectAnalytics';

export const ProjectTableSection = ({
  projects = [],
  pagination = {},
  sortConfig = {},
  tableSearch = '',
  onSort,
  onTableSearchChange,
  onSelectProject,
}) => {
  const { currentPage = 1, totalPages = 1, totalCount = 0, setPage, pageSize = 25, setPageSize } = pagination;
  const { sortBy } = sortConfig;

  const renderSortHeader = (field, label) => {
    const isSorted = sortBy === field;
    return (
      <button
        onClick={() => onSort && onSort(field)}
        className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-slate-700 transition-colors uppercase tracking-wider text-xs"
      >
        <span>{label}</span>
        <ArrowUpDown className={`w-3.5 h-3.5 ${isSorted ? 'text-slate-700 font-bold' : 'text-slate-400'}`} />
      </button>
    );
  };

  const formatLakhsCr = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    return `₹${(amount / 100000).toFixed(1)} L`;
  };

  // Dynamic pagination range builder
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
    <Card
      noHeaderBorder={true}
      header={
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 w-full">
          {/* Left Title & Match Info */}
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-slate-700 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Projects Master Directory</h3>
              <span className="text-xs text-slate-500 font-medium font-mono block sm:inline">
                ({totalCount.toLocaleString('en-IN')} projects match search & filters)
              </span>
            </div>
          </div>

          {/* Right Search Input & Page Indicator */}
          <div className="flex items-center gap-3">
            {/* Search Input Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => onTableSearchChange && onTableSearchChange(e.target.value)}
                placeholder="Search by MP, Location, Project Name, ID..."
                className="w-full pl-9 pr-8 py-1.5 bg-transparent border border-slate-400 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 transition-all"
              />
              {tableSearch && (
                <button
                  type="button"
                  onClick={() => onTableSearchChange && onTableSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs font-semibold text-slate-600 font-mono shrink-0 hidden sm:block">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      }
    >
      {/* Scrollable Container with Doubled Height (h-[750px]) and Flush Top Header */}
      <div className="h-[750px] overflow-auto overscroll-x-none border border-slate-200 rounded-xl bg-white">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-slate-700 font-bold text-xs">
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 border-b border-slate-200 min-w-[140px]">
                {renderSortHeader('id', 'Project ID')}
              </th>
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 border-b border-slate-200 min-w-[280px]">
                {renderSortHeader('name', 'Project & Type')}
              </th>
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 border-b border-slate-200 min-w-[200px] text-xs font-bold text-slate-700 uppercase tracking-wider">
                Location & Constituency
              </th>
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 border-b border-slate-200 min-w-[170px] text-xs font-bold text-slate-700 uppercase tracking-wider">
                MP
              </th>
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 text-right border-b border-slate-200 min-w-[180px]">
                {renderSortHeader('sanctionedAmount', 'Sanctioned / Spent')}
              </th>
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 text-center border-b border-slate-200 min-w-[150px]">
                {renderSortHeader('progress', 'Progress %')}
              </th>
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 text-center border-b border-slate-200 min-w-[140px]">
                {renderSortHeader('status', 'Status')}
              </th>
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 text-center border-b border-slate-200 min-w-[130px]">
                {renderSortHeader('riskScore', 'Risk Score')}
              </th>
              <th className="sticky top-0 z-20 bg-white py-3.5 px-4 text-center border-b border-slate-200 min-w-[120px]">
                {renderSortHeader('daysDelayed', 'Delay')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium bg-white">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-base">No projects match the selected search or filters</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing the search box or adjusting active filters.</p>
                </td>
              </tr>
            ) : (
              projects.map((p) => {
                const statusBadge = getStatusBadgeClass(p.status);
                const riskBadge = getRiskColorClass(p.riskScore);

                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProject && onSelectProject(p)}
                    className="group even:bg-slate-50/60 hover:bg-blue-50/70 transition-all duration-150 cursor-pointer active:scale-[0.998]"
                    title="Click row to view full project details"
                  >
                    {/* Project ID */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-800 whitespace-nowrap min-w-[140px]">
                      {p.id}
                    </td>

                    {/* Project Name & Type */}
                    <td className="py-4 px-4 min-w-[280px]">
                      <span className="font-bold text-slate-900 text-sm block line-clamp-1 group-hover:text-slate-800 transition-colors">
                        {p.name}
                      </span>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">
                        {p.projectType}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 whitespace-nowrap min-w-[200px]">
                      <span className="font-bold text-slate-800 text-sm block">{p.district}, {p.state}</span>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">PC: {p.constituencyName}</span>
                    </td>

                    {/* MP */}
                    <td className="py-4 px-4 whitespace-nowrap min-w-[170px]">
                      <span className="font-bold text-slate-800 text-sm block">{p.mpName}</span>
                      <span className="text-[11px] text-slate-500 font-semibold uppercase">{p.house}</span>
                    </td>

                    {/* Cost & Spent */}
                    <td className="py-4 px-4 text-right font-mono whitespace-nowrap min-w-[180px]">
                      <span className="font-bold text-slate-900 text-sm block">{formatLakhsCr(p.sanctionedAmount)}</span>
                      <span className="text-xs text-emerald-700 font-bold block mt-0.5">
                        Spent: {formatLakhsCr(p.expenditure)}
                      </span>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-4 px-4 text-center min-w-[150px]">
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                        <span className="text-slate-800">{p.progress}%</span>
                        {p.paymentProgressMismatch && (
                          <span className="text-rose-600 font-bold text-[10px]" title="Financial vs Physical Mismatch">
                            ⚠️ Mismatch
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, p.progress)}%`,
                            backgroundColor: p.progress === 100 ? '#10B981' : p.paymentProgressMismatch ? '#F59E0B' : '#475569',
                          }}
                        />
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 text-center whitespace-nowrap min-w-[140px]">
                      <span className={`text-xs font-bold inline-flex items-center gap-1.5 ${statusBadge.bg.split(' ').find(c => c.startsWith('text-'))}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-4 px-4 text-center whitespace-nowrap min-w-[130px]">
                      <span className={`text-xs font-mono font-bold ${riskBadge.bg.split(' ').find(c => c.startsWith('text-'))}`}>
                        {p.riskScore}/100
                      </span>
                    </td>

                    {/* Days Delayed */}
                    <td className="py-4 px-4 text-center whitespace-nowrap min-w-[120px]">
                      {p.daysDelayed > 0 ? (
                        <span className="text-rose-600 font-mono font-bold text-xs flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          +{p.daysDelayed}d
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">On Time</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Footer Controls & Scalable Navigation */}
      {totalCount > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-3">
            <div>
              Showing <strong className="text-slate-800 font-mono">{((currentPage - 1) * pageSize) + 1}</strong> to{' '}
              <strong className="text-slate-800 font-mono">{Math.min(totalCount, currentPage * pageSize)}</strong> of{' '}
              <strong className="text-slate-800 font-mono">{totalCount.toLocaleString('en-IN')}</strong> projects
            </div>

            {/* Per-Page Rows Selector */}
            {setPageSize && (
              <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <span className="text-slate-500">Rows:</span>
                <CustomSelect
                  value={pageSize}
                  onChange={(val) => {
                    setPageSize(Number(val));
                    setPage(1);
                  }}
                  options={[
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' }
                  ]}
                  placement="top"
                />
              </div>
            )}
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
      )}
    </Card>
  );
};
