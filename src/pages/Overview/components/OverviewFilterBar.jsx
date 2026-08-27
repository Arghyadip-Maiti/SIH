import { RotateCcw, X, Filter } from 'lucide-react';
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP, MP_LOCATION_MAP } from '../../../services/api/locationService';

const STATES = [
  'Maharashtra',
  'Gujarat',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Bihar',
  'West Bengal',
  'Rajasthan',
  'Kerala',
  'Goa',
  'Punjab',
  'Madhya Pradesh',
  'Assam',
];

const SECTORS = [
  'Education & IT',
  'Roads & Bridges',
  'Healthcare Infrastructure',
  'Drinking Water Supply',
  'Sanitation & Solid Waste',
  'Renewable Energy',
  'Community Infrastructure',
];

export const OverviewFilterBar = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  // Compute dynamic options based on active interdependent selections
  const availableDistricts = filters.state
    ? (STATE_DISTRICT_MAP[filters.state] || [])
    : Object.keys(DISTRICT_STATE_MAP);

  const availableMPs = Object.entries(MP_LOCATION_MAP)
    .filter(([_, loc]) => {
      if (filters.state && loc.state !== filters.state) return false;
      if (filters.district && loc.district !== filters.district) return false;
      return true;
    })
    .map(([mpName]) => mpName);

  // Active non-default filter keys for tags display
  const activeTags = Object.entries(filters).filter(([key, val]) => {
    if (key === 'riskLevel' || key === 'agency') return false;
    if (key === 'financialYear') return val !== '2026-27';
    if (key === 'house') return val !== 'All';
    return Boolean(val);
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 mb-6 transition-all">
      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5 items-end">
        {/* Financial Year */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Financial Year
          </label>
          <select
            value={filters.financialYear}
            onChange={(e) => onFilterChange('financialYear', e.target.value)}
            className="w-full h-[34px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2026-27">2026–27</option>
            <option value="2025-26">2025–26</option>
            <option value="2024-25">2024–25</option>
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
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Lok Sabha">Lok Sabha</option>
            <option value="Rajya Sabha">Rajya Sabha</option>
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
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All States</option>
            {STATES.map((st) => (
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
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Districts</option>
            {availableDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* MP */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            MP
          </label>
          <select
            value={filters.mp}
            onChange={(e) => onFilterChange('mp', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All MPs</option>
            {availableMPs.map((mpName) => (
              <option key={mpName} value={mpName}>
                {mpName}
              </option>
            ))}
          </select>
        </div>

        {/* Sector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sector
          </label>
          <select
            value={filters.projectType}
            onChange={(e) => onFilterChange('projectType', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sectors</option>
            {SECTORS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Work Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Work Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="ONGOING">Ongoing</option>
            <option value="NEAR_COMPLETION">Near Completion</option>
            <option value="STARTING">Starting</option>
            <option value="DELAYED">Delayed</option>
          </select>
        </div>

        {/* Reset Action Button */}
        <div>
          <button
            type="button"
            onClick={onReset}
            className="w-full h-[34px] px-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips / Badges */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Active Filters:
          </span>
          {activeTags.map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200"
            >
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <strong className="font-semibold">{val}</strong>
              <button
                type="button"
                onClick={() => onFilterChange(key, key === 'financialYear' ? '2026-27' : key === 'house' ? 'All' : '')}
                className="hover:text-blue-900 ml-0.5"
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
