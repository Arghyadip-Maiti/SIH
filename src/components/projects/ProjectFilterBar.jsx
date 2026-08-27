import { RotateCcw, X, Filter } from 'lucide-react';
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP } from '../../services/api/locationService';

export const ProjectFilterBar = ({ filters = {}, onFilterChange, onReset }) => {
  const availableDistricts = filters.state
    ? (STATE_DISTRICT_MAP[filters.state] || [])
    : Object.keys(DISTRICT_STATE_MAP);

  // Active non-default filter keys for tags display
  const activeTags = Object.entries(filters).filter(([key, val]) => {
    if (key === 'search') return false;
    if (key === 'financialYear') return val !== '2026-27';
    if (key === 'house') return val !== 'All';
    return Boolean(val);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 transition-all">
      {/* Grid of 12 Filter Controls (6 cols x 2 rows) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 items-end">
        {/* 1. Financial Year */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Financial Year</label>
          <select
            value={filters.financialYear || '2026-27'}
            onChange={(e) => onFilterChange('financialYear', e.target.value)}
            className="w-full h-[34px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2026-27">2026-27</option>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
          </select>
        </div>

        {/* 2. State */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">State</label>
          <select
            value={filters.state || ''}
            onChange={(e) => onFilterChange('state', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All States</option>
            {Object.keys(STATE_DISTRICT_MAP).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* 3. District */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">District</label>
          <select
            value={filters.district || ''}
            onChange={(e) => onFilterChange('district', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Districts</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Location Input Box */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
          <input
            type="text"
            value={filters.constituency || ''}
            onChange={(e) => onFilterChange('constituency', e.target.value)}
            placeholder="Constituency / Area..."
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* 5. MP Name Input Box */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">MP Name</label>
          <input
            type="text"
            value={filters.mp || ''}
            onChange={(e) => onFilterChange('mp', e.target.value)}
            placeholder="Search MP name..."
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* 6. House */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">House</label>
          <select
            value={filters.house || 'All'}
            onChange={(e) => onFilterChange('house', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Houses</option>
            <option value="Lok Sabha">Lok Sabha</option>
            <option value="Rajya Sabha">Rajya Sabha</option>
          </select>
        </div>

        {/* 7. Project Type / Sector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project Type</label>
          <select
            value={filters.projectType || ''}
            onChange={(e) => onFilterChange('projectType', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Education & IT">Education &amp; IT</option>
            <option value="Roads & Bridges">Roads &amp; Bridges</option>
            <option value="Healthcare Infrastructure">Healthcare Infra</option>
            <option value="Drinking Water Supply">Drinking Water</option>
            <option value="Sanitation & Solid Waste">Sanitation &amp; Waste</option>
            <option value="Renewable Energy">Renewable Energy</option>
            <option value="Community Infrastructure">Community Infra</option>
            <option value="Irrigation & Flood Control">Irrigation &amp; Flood</option>
            <option value="Sports & Youth Welfare">Sports &amp; Youth</option>
          </select>
        </div>

        {/* 8. Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <select
            value={filters.status || ''}
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

        {/* 9. Risk Level */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Risk Level</label>
          <select
            value={filters.riskLevel || ''}
            onChange={(e) => onFilterChange('riskLevel', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">🔴 Critical (81-100)</option>
            <option value="HIGH">🟠 High (61-80)</option>
            <option value="MEDIUM">🟡 Medium (31-60)</option>
            <option value="LOW">🟢 Low (0-30)</option>
          </select>
        </div>

        {/* 10. Cost Range */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cost Range</label>
          <select
            value={filters.costRange || ''}
            onChange={(e) => onFilterChange('costRange', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Costs</option>
            <option value="<50L">&lt; ₹50 Lakhs</option>
            <option value="50L-1Cr">₹50L – ₹1 Cr</option>
            <option value=">1Cr">&gt; ₹1 Cr</option>
          </select>
        </div>

        {/* 11. Progress Range */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Progress Range</label>
          <select
            value={filters.progressRange || ''}
            onChange={(e) => onFilterChange('progressRange', e.target.value)}
            className="w-full h-[34px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Progress</option>
            <option value="0-30">0 – 30% (Starting)</option>
            <option value="30-80">30 – 80% (Ongoing)</option>
            <option value="80-99">80 – 99% (Near Comp.)</option>
            <option value="100">100% (Completed)</option>
          </select>
        </div>

        {/* 12. Permanent Reset Action Button (Bottom Right Slot) */}
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
