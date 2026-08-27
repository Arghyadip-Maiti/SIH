import { RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { STATE_DISTRICT_MAP, MP_LOCATION_MAP } from '../../services/api/locationService';

export const ProjectFilterBar = ({ filters = {}, onFilterChange, onReset }) => {
  const availableDistricts = filters.state ? STATE_DISTRICT_MAP[filters.state] || [] : [];
  const availableMPs = Object.keys(MP_LOCATION_MAP);

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => v && k !== 'financialYear' && k !== 'search'
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3.5">
      {/* Primary Actions / Header */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="text-xs font-bold text-slate-700">
            Active Filters ({activeFilterCount})
          </span>
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="text-slate-600 border-slate-200 hover:bg-slate-50 font-semibold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </Button>
        </div>
      )}

      {/* Grid of Dropdown Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
        {/* Financial Year */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Financial Year</label>
          <select
            value={filters.financialYear || '2026-27'}
            onChange={(e) => onFilterChange('financialYear', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="2026-27">2026-27</option>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">State</label>
          <select
            value={filters.state || ''}
            onChange={(e) => onFilterChange('state', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All States</option>
            {Object.keys(STATE_DISTRICT_MAP).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">District</label>
          <select
            value={filters.district || ''}
            onChange={(e) => onFilterChange('district', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Districts</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* MP Name */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">MP</label>
          <select
            value={filters.mp || ''}
            onChange={(e) => onFilterChange('mp', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All MPs</option>
            {availableMPs.map((mp) => (
              <option key={mp} value={mp}>
                {mp}
              </option>
            ))}
          </select>
        </div>

        {/* Project Type / Sector */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Project Type</label>
          <select
            value={filters.projectType || ''}
            onChange={(e) => onFilterChange('projectType', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

        {/* Status */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="ONGOING">Ongoing</option>
            <option value="NEAR_COMPLETION">Near Completion</option>
            <option value="STARTING">Starting</option>
            <option value="DELAYED">Delayed</option>
          </select>
        </div>

        {/* Risk Level */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Risk Level</label>
          <select
            value={filters.riskLevel || ''}
            onChange={(e) => onFilterChange('riskLevel', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">🔴 Critical (81-100)</option>
            <option value="HIGH">🟠 High (61-80)</option>
            <option value="MEDIUM">🟡 Medium (31-60)</option>
            <option value="LOW">🟢 Low (0-30)</option>
          </select>
        </div>

        {/* Cost Range */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cost Range</label>
          <select
            value={filters.costRange || ''}
            onChange={(e) => onFilterChange('costRange', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Costs</option>
            <option value="<50L">&lt; ₹50 Lakhs</option>
            <option value="50L-1Cr">₹50L – ₹1 Cr</option>
            <option value=">1Cr">&gt; ₹1 Cr</option>
          </select>
        </div>

        {/* Progress Range */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Progress Range</label>
          <select
            value={filters.progressRange || ''}
            onChange={(e) => onFilterChange('progressRange', e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Progress</option>
            <option value="0-30">0 – 30% (Starting)</option>
            <option value="30-80">30 – 80% (Ongoing)</option>
            <option value="80-99">80 – 99% (Near Comp.)</option>
            <option value="100">100% (Completed)</option>
          </select>
        </div>

        {/* Implementing Agency */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Agency</label>
          <input
            type="text"
            value={filters.agency || ''}
            onChange={(e) => onFilterChange('agency', e.target.value)}
            placeholder="Filter agency..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Contractor */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Contractor</label>
          <input
            type="text"
            value={filters.contractor || ''}
            onChange={(e) => onFilterChange('contractor', e.target.value)}
            placeholder="Filter contractor..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
