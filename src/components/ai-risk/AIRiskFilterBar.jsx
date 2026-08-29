import { useState, useMemo } from 'react';
import { Filter, Search, ChevronDown, X } from 'lucide-react';
import { STATE_DISTRICT_MAP } from '../../data/locationMappings';

const PROJECT_TYPES = [
  'All Types',
  'Roads & Bridges',
  'Education & IT',
  'Drinking Water Supply',
  'Healthcare Infrastructure',
  'Community Infrastructure',
  'Irrigation & Flood Control',
  'Sanitation & Solid Waste',
  'Renewable Energy',
];

const AGENCIES = [
  'All Agencies',
  'Public Works Department (PWD)',
  'Jal Nigam State Division',
  'District Collectorate Development Wing',
  'Municipal Corporation Projects Division',
  'Agro Industries Corporation',
  'Renewable Energy Development Agency',
  'Health System Corporation',
  'Sports & Youth Affairs Dept',
];

const ANOMALY_TYPES = [
  'All Anomalies',
  'Financial',
  'Photo',
  'Location',
  'Duplicate Photo',
  'Timeline / Delay',
  'Payment-Progress Mismatch',
  'Multiple Anomalies',
];

export const AIRiskFilterBar = ({ filters = {}, onFilterChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Dynamic State options list
  const stateOptions = useMemo(() => ['All States', ...Object.keys(STATE_DISTRICT_MAP).sort()], []);

  // Dynamic District options list
  const districtOptions = useMemo(() => {
    if (!filters.state || filters.state === 'All States' || filters.state === 'All') {
      const allDists = new Set();
      Object.values(STATE_DISTRICT_MAP).forEach((arr) => arr.forEach((d) => allDists.add(d)));
      return ['All Districts', ...Array.from(allDists).sort()];
    }
    return ['All Districts', ...(STATE_DISTRICT_MAP[filters.state] || []).sort()];
  }, [filters.state]);

  // Active non-default filter tags display
  const activeTags = useMemo(() => {
    return Object.entries(filters).filter(([key, val]) => {
      if (!val) return false;
      if (key === 'state' && (val === 'All States' || val === 'All')) return false;
      if (key === 'district' && (val === 'All Districts' || val === 'All')) return false;
      if (key === 'projectType' && (val === 'All Types' || val === 'All')) return false;
      if (key === 'agency' && (val === 'All Agencies' || val === 'All')) return false;
      if (key === 'anomalyType' && (val === 'All Anomalies' || val === 'All')) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl  p-4 mb-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              AI Anomaly & Risk Scope Controls
            </span>
            <span className="ml-2 text-[11px] font-semibold text-slate-500 hidden sm:inline">
              (Filter currently running active projects)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative min-w-[200px] sm:min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search Project ID, MP Name, Location..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded-xl flex items-center gap-1 shrink-0"
          >
            <span>{isExpanded ? 'Hide' : 'Filters'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end pt-3">
          {/* State */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              State
            </label>
            <select
              value={filters.state || 'All States'}
              onChange={(e) => onFilterChange('state', e.target.value)}
              className="w-full h-[34px] text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {stateOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              District
            </label>
            <select
              value={filters.district || 'All Districts'}
              onChange={(e) => onFilterChange('district', e.target.value)}
              className="w-full h-[34px] text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sector / Type
            </label>
            <select
              value={filters.projectType || 'All Types'}
              onChange={(e) => onFilterChange('projectType', e.target.value)}
              className="w-full h-[34px] text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Agency */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Agency
            </label>
            <select
              value={filters.agency || 'All Agencies'}
              onChange={(e) => onFilterChange('agency', e.target.value)}
              className="w-full h-[34px] text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {AGENCIES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Anomaly Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Anomaly Type
            </label>
            <select
              value={filters.anomalyType || 'All Anomalies'}
              onChange={(e) => onFilterChange('anomalyType', e.target.value)}
              className="w-full h-[34px] text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {ANOMALY_TYPES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Grid Reset Action Button (Matches Overview Section) */}
          <div>
            <button
              type="button"
              onClick={onReset}
              className="w-full h-[34px] px-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
              title="Reset Filters"
            >
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips / Badges */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Active Filters:
          </span>
          {activeTags.map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-300"
            >
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <strong className="font-semibold">{val}</strong>
              <button
                type="button"
                onClick={() => onFilterChange(key, key === 'state' ? 'All States' : key === 'district' ? 'All Districts' : key === 'projectType' ? 'All Types' : key === 'agency' ? 'All Agencies' : key === 'anomalyType' ? 'All Anomalies' : '')}
                className="hover:text-slate-950 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline font-medium ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
