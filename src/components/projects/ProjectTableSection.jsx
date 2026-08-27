import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getStatusBadgeClass, getRiskColorClass } from '../../utils/projectAnalytics';

export const ProjectTableSection = ({
  projects = [],
  pagination = {},
  sortConfig = {},
  onSort,
  onSelectProject,
}) => {
  const { currentPage = 1, totalPages = 1, totalCount = 0, setPage } = pagination;
  const { sortBy, sortOrder } = sortConfig;

  const renderSortHeader = (field, label) => {
    const isSorted = sortBy === field;
    return (
      <button
        onClick={() => onSort && onSort(field)}
        className="flex items-center gap-1 font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider text-[11px]"
      >
        <span>{label}</span>
        <ArrowUpDown className={`w-3 h-3 ${isSorted ? 'text-blue-600 font-bold' : 'text-slate-400'}`} />
      </button>
    );
  };

  const formatLakhsCr = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    return `₹${(amount / 100000).toFixed(1)} L`;
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Projects Master Directory</h3>
            <span className="text-xs text-slate-500 font-medium font-mono">
              ({totalCount.toLocaleString('en-IN')} projects match active filters)
            </span>
          </div>

          {/* Table Pagination Info */}
          <div className="text-xs font-semibold text-slate-600 font-mono">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
              <th className="py-3 px-3.5">{renderSortHeader('id', 'Project ID')}</th>
              <th className="py-3 px-3.5">{renderSortHeader('name', 'Project & Type')}</th>
              <th className="py-3 px-3.5">{renderSortHeader('state', 'Location & Constituency')}</th>
              <th className="py-3 px-3.5">{renderSortHeader('mpName', 'MP')}</th>
              <th className="py-3 px-3.5 text-right">{renderSortHeader('sanctionedAmount', 'Sanctioned / Spent')}</th>
              <th className="py-3 px-3.5 text-center">{renderSortHeader('progress', 'Progress %')}</th>
              <th className="py-3 px-3.5 text-center">{renderSortHeader('status', 'Status')}</th>
              <th className="py-3 px-3.5 text-center">{renderSortHeader('riskScore', 'Risk Score')}</th>
              <th className="py-3 px-3.5 text-center">{renderSortHeader('daysDelayed', 'Delay')}</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No projects match the selected filters</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting search query or clearing active filters.</p>
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
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    {/* Project ID */}
                    <td className="py-3 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {p.id}
                    </td>

                    {/* Project Name & Type */}
                    <td className="py-3 px-3.5 max-w-xs">
                      <span className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        {p.projectType}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="font-bold text-slate-800 block">{p.district}, {p.state}</span>
                      <span className="text-[11px] text-slate-400 font-medium block">PC: {p.constituencyName}</span>
                    </td>

                    {/* MP */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{p.mpName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{p.house}</span>
                    </td>

                    {/* Cost & Spent */}
                    <td className="py-3 px-3.5 text-right font-mono whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{formatLakhsCr(p.sanctionedAmount)}</span>
                      <span className="text-[11px] text-emerald-700 font-bold block">
                        Spent: {formatLakhsCr(p.expenditure)}
                      </span>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3 px-3.5 text-center min-w-[120px]">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                        <span className="text-slate-700">{p.progress}%</span>
                        {p.paymentProgressMismatch && (
                          <span className="text-rose-600 font-bold text-[10px]" title="Financial vs Physical Mismatch">
                            ⚠️ Mismatch
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, p.progress)}%`,
                            backgroundColor: p.progress === 100 ? '#10B981' : p.paymentProgressMismatch ? '#F59E0B' : '#2563EB',
                          }}
                        />
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${statusBadge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${riskBadge.bg}`}>
                        {p.riskScore}/100
                      </span>
                    </td>

                    {/* Days Delayed */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      {p.daysDelayed > 0 ? (
                        <span className="text-rose-600 font-mono font-bold flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          +{p.daysDelayed}d
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">On Time</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectProject) onSelectProject(p);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Controls & Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
          <div>
            Showing <strong className="text-slate-800">{((currentPage - 1) * pagination.pageSize) + 1}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(totalCount, currentPage * pagination.pageSize)}</strong> of{' '}
            <strong className="text-slate-800">{totalCount.toLocaleString('en-IN')}</strong> projects
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="py-1 px-2 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <span className="px-3 font-mono font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>

            <Button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="py-1 px-2 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
