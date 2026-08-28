import { useState, useMemo } from 'react';
import { Filter, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';
import { STATE_DISTRICT_MAP, MP_LOCATION_MAP } from '../../data/locationMappings';

const FY_OPTIONS = ['2026-27', '2025-26', '2024-25', '2023-24', 'All'];
const HOUSE_OPTIONS = ['All', 'Lok Sabha', 'Rajya Sabha'];
const PROJECT_TYPES = [
  'All Types',
  'Roads & Bridges',
  'Education',
  'Water Supply & Sanitation',
  'Health & Family Welfare',
  'Community Infrastructure',
  'Irrigation & Flood Control',
  'Electricity & Solar',
];
const AGENCIES = [
  'All Agencies',
  'Public Works Department (PWD)',
  'District Rural Development Agency (DRDA)',
  'Central Public Works Department (CPWD)',
  'Irrigation & Water Resources Dept',
  'Municipal Corporation Infrastructure Wing',
];
const STATUSES = ['All Statuses', 'COMPLETED', 'NEAR_COMPLETION', 'ONGOING', 'STARTING', 'DELAYED'];
const RISK_LEVELS = ['All Risk Levels', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const AnalyticsFilterBar = ({ filters, onFilterChange, onReset, activeCount = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Dynamic State options list
  const stateOptions = useMemo(() => ['All States', ...Object.keys(STATE_DISTRICT_MAP).sort()], []);

  // Dynamic District options list based on active state
  const districtOptions = useMemo(() => {
    if (!filters.state || filters.state === 'All States' || filters.state === 'All') {
      const allDists = new Set();
      Object.values(STATE_DISTRICT_MAP).forEach((arr) => arr.forEach((d) => allDists.add(d)));
      return ['All Districts', ...Array.from(allDists).sort()];
    }
    return ['All Districts', ...(STATE_DISTRICT_MAP[filters.state] || []).sort()];
  }, [filters.state]);

  // Dynamic MP options list based on active state/district
  const mpOptions = useMemo(() => {
    const mpSet = new Set();
    Object.entries(MP_LOCATION_MAP).forEach(([mpName, loc]) => {
      if (filters.state && filters.state !== 'All States' && filters.state !== 'All') {
        if (loc.state !== filters.state) return;
      }
      if (filters.district && filters.district !== 'All Districts' && filters.district !== 'All') {
        if (loc.district !== filters.district) return;
      }
      mpSet.add(mpName);
    });
    return ['All MPs', ...Array.from(mpSet).sort()];
  }, [filters.state, filters.district]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 mb-6 transition-all">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Global Filter Control Center
            </span>
            <span className="ml-2 text-[11px] font-semibold text-slate-500 hidden sm:inline">
              (Applies across all 18 analytics sections)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl flex items-center gap-1"
          >
            <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3 pt-3">
          {/* FY */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Financial Year
            </label>
            <select
              value={filters.financialYear}
              onChange={(e) => onFilterChange('financialYear', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FY_OPTIONS.map((fy) => (
                <option key={fy} value={fy}>
                  {fy === 'All' ? 'All Years' : `FY ${fy}`}
                </option>
              ))}
            </select>
          </div>

          {/* House */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              House
            </label>
            <select
              value={filters.house}
              onChange={(e) => onFilterChange('house', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {HOUSE_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => onFilterChange('state', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={filters.district}
              onChange={(e) => onFilterChange('district', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* MP */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              MP Name
            </label>
            <select
              value={filters.mp}
              onChange={(e) => onFilterChange('mp', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mpOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
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
              value={filters.projectType}
              onChange={(e) => onFilterChange('projectType', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Implementing Agency */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Agency
            </label>
            <select
              value={filters.agency}
              onChange={(e) => onFilterChange('agency', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AGENCIES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'All Statuses' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Risk Level
            </label>
            <select
              value={filters.riskLevel}
              onChange={(e) => onFilterChange('riskLevel', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {RISK_LEVELS.map((r) => (
                <option key={r} value={r}>
                  {r === 'All Risk Levels' ? 'All Risk Levels' : r}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
