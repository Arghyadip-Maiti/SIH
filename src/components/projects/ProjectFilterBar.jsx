import { X, Filter } from 'lucide-react';
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP } from '../../services/api/locationService';
import { CustomSelect } from '../ui/CustomSelect';
import { useApp } from '../../context/AppContext';

export const ProjectFilterBar = ({ filters = {}, onFilterChange, onReset }) => {
  const { dashboardPreferences } = useApp();
  const defaultFY = dashboardPreferences?.financialYear || '2026-27';
  const defaultView = dashboardPreferences?.projectView || 'All Projects';

  let defaultStatus = '';
  let defaultRisk = '';
  if (defaultView === 'Completed') defaultStatus = 'Completed';
  else if (defaultView === 'Ongoing') defaultStatus = 'Ongoing';
  else if (defaultView === 'Delayed') defaultStatus = 'Delayed';
  else if (defaultView === 'High Risk') defaultRisk = 'High';

  const availableDistricts = filters.state
    ? (STATE_DISTRICT_MAP[filters.state] || [])
    : Object.keys(DISTRICT_STATE_MAP);

  // Active non-default filter keys for tags display
  const activeTags = Object.entries(filters).filter(([key, val]) => {
    if (!val) return false;
    if (key === 'search' || key === 'tableSearch') return false;
    if (key === 'financialYear') return val !== defaultFY && val !== '2026-27';
    if (key === 'house') return val !== 'All' && val !== 'All Houses';
    if (key === 'status') return val !== defaultStatus && val !== '' && val !== 'All Statuses' && val !== 'All';
    if (key === 'riskLevel') return val !== defaultRisk && val !== '' && val !== 'All Risk Levels' && val !== 'All';
    if (key === 'state') return val !== '' && val !== 'All States' && val !== 'All';
    if (key === 'district') return val !== '' && val !== 'All Districts' && val !== 'All';
    if (key === 'mp') return val !== '' && val !== 'All MPs' && val !== 'All';
    if (key === 'constituency') return val !== '';
    if (key === 'projectType') return val !== '' && val !== 'All Sectors' && val !== 'All Types' && val !== 'All';
    if (key === 'agency') return val !== '' && val !== 'All Agencies' && val !== 'All';
    if (key === 'contractor') return val !== '';
    if (key === 'costRange') return val !== '';
    if (key === 'progressRange') return val !== '';
    return true;
  });

  return (
    <div className="mb-6 transition-all">
      {/* Grid of 12 Filter Controls (6 cols x 2 rows) */}
      {/* Grid of Filter Controls */}
      {/* Grid of Filter Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-6 items-end">
        {/* 4 & 5. Location and MP Name (Stacked) */}
        <div className="flex flex-col justify-between h-full row-span-2 gap-4">
          <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
          <input
            type="text"
            value={filters.constituency || ''}
            onChange={(e) => onFilterChange('constituency', e.target.value)}
            placeholder="Constituency / Area..."
            className="w-full h-[34px] text-xs bg-transparent text-slate-700 border border-black rounded-lg px-2.5 focus:outline-none placeholder:text-slate-400 font-bold"
          />
        </div>
          <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">MP Name</label>
          <input
            type="text"
            value={filters.mp || ''}
            onChange={(e) => onFilterChange('mp', e.target.value)}
            placeholder="Search MP name..."
            className="w-full h-[34px] text-xs bg-transparent text-slate-700 border border-black rounded-lg px-2.5 focus:outline-none placeholder:text-slate-400 font-bold"
          />
        </div>
        </div>
        {/* 1. Financial Year */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Financial Year</label>
          <CustomSelect
            value={filters.financialYear || '2026-27'}
            onChange={(val) => onFilterChange('financialYear', val)}
            options={[
              { value: '2026-27', label: '2026-27' },
              { value: '2025-26', label: '2025-26' },
              { value: '2024-25', label: '2024-25' }
            ]}
            className="w-full"
          />
        </div>
        {/* 2. State */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">State</label>
          <CustomSelect
            value={filters.state || ''}
            onChange={(val) => onFilterChange('state', val)}
            options={[
              { value: '', label: 'All States' },
              ...Object.keys(STATE_DISTRICT_MAP).map(st => ({ value: st, label: st }))
            ]}
            className="w-full"
          />
        </div>
        {/* 3. District */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">District</label>
          <CustomSelect
            value={filters.district || ''}
            onChange={(val) => onFilterChange('district', val)}
            options={[
              { value: '', label: 'All Districts' },
              ...availableDistricts.map(d => ({ value: d, label: d }))
            ]}
            className="w-full"
          />
        </div>
        {/* 6. House */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">House</label>
          <CustomSelect
            value={filters.house || 'All'}
            onChange={(val) => onFilterChange('house', val)}
            options={[
              { value: 'All', label: 'All Houses' },
              { value: 'Lok Sabha', label: 'Lok Sabha' },
              { value: 'Rajya Sabha', label: 'Rajya Sabha' }
            ]}
            className="w-full"
          />
        </div>
        {/* 7. Project Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project Type</label>
          <CustomSelect
            value={filters.projectType || ''}
            onChange={(val) => onFilterChange('projectType', val)}
            options={[
              { value: '', label: 'All Types' },
              { value: 'Education & IT', label: 'Education & IT' },
              { value: 'Roads & Bridges', label: 'Roads & Bridges' },
              { value: 'Healthcare Infrastructure', label: 'Healthcare Infra' },
              { value: 'Drinking Water Supply', label: 'Drinking Water' },
              { value: 'Sanitation & Solid Waste', label: 'Sanitation & Waste' },
              { value: 'Renewable Energy', label: 'Renewable Energy' },
              { value: 'Community Infrastructure', label: 'Community Infra' },
              { value: 'Irrigation & Flood Control', label: 'Irrigation & Flood' },
              { value: 'Sports & Youth Welfare', label: 'Sports & Youth' }
            ]}
            className="w-full"
          />
        </div>
        
        {/* 8. Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <CustomSelect
            value={filters.status || ''}
            onChange={(val) => onFilterChange('status', val)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'ONGOING', label: 'Ongoing' },
              { value: 'NEAR_COMPLETION', label: 'Near Completion' },
              { value: 'STARTING', label: 'Starting' },
              { value: 'DELAYED', label: 'Delayed' }
            ]}
            className="w-full"
          />
        </div>
        {/* 9. Risk Level */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Risk Level</label>
          <CustomSelect
            value={filters.riskLevel || ''}
            onChange={(val) => onFilterChange('riskLevel', val)}
            options={[
              { value: '', label: 'All Risk Levels' },
              { value: 'CRITICAL', label: '🔴 Critical (81-100)' },
              { value: 'HIGH', label: '🟠 High (61-80)' },
              { value: 'MEDIUM', label: '🟡 Medium (31-60)' },
              { value: 'LOW', label: '🟢 Low (0-30)' }
            ]}
            className="w-full"
          />
        </div>
        {/* 10. Progress Range */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Progress Range</label>
          <CustomSelect
            value={filters.progressRange || ''}
            onChange={(val) => onFilterChange('progressRange', val)}
            options={[
              { value: '', label: 'All Progress' },
              { value: '0-30', label: '0 – 30% (Starting)' },
              { value: '30-80', label: '30 – 80% (Ongoing)' },
              { value: '80-99', label: '80 – 99% (Near Comp.)' },
              { value: '100', label: '100% (Completed)' }
            ]}
            className="w-full"
          />
        </div>
        {/* 11. Cost Range */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cost Range</label>
          <CustomSelect
            value={filters.costRange || ''}
            onChange={(val) => onFilterChange('costRange', val)}
            options={[
              { value: '', label: 'All Costs' },
              { value: '<50L', label: '< ₹50 Lakhs' },
              { value: '50L-1Cr', label: '₹50L – ₹1 Cr' },
              { value: '>1Cr', label: '> ₹1 Cr' }
            ]}
            className="w-full"
          />
        </div>
        {/* 13. Permanent Reset Action Button */}
        <div>
          <button
            type="button"
            onClick={onReset}
            className="h-[34px] px-5 text-xs font-medium text-black bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-xl inline-flex items-center justify-center transition-all shadow-2xs cursor-pointer focus:outline-none"
            title="Reset Filters"
          >
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
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-300"
            >
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <strong className="font-semibold">{val}</strong>
              <button
                type="button"
                onClick={() => onFilterChange(key, key === 'financialYear' ? '2026-27' : key === 'house' ? 'All' : '')}
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
