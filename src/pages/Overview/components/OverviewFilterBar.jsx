import { X, Filter } from 'lucide-react';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP, MP_LOCATION_MAP } from '../../../services/api/locationService';
import { useApp } from '../../../context/AppContext';

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
  const { dashboardPreferences } = useApp();
  const defaultFY = dashboardPreferences?.financialYear || '2026-27';

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
    if (!val) return false;
    if (key === 'financialYear') return val !== defaultFY && val !== '2026-27';
    if (key === 'house') return val !== 'All' && val !== 'All Houses';
    if (key === 'state') return val !== '' && val !== 'All States' && val !== 'All';
    if (key === 'district') return val !== '' && val !== 'All Districts' && val !== 'All';
    if (key === 'mp') return val !== '' && val !== 'All MPs' && val !== 'All';
    if (key === 'projectType') return val !== '' && val !== 'All Sectors' && val !== 'All Types' && val !== 'All';
    if (key === 'status') return val !== '' && val !== 'All Statuses' && val !== 'All';
    if (key === 'riskLevel') return val !== '' && val !== 'All Risk Levels' && val !== 'All';
    if (key === 'agency') return val !== '' && val !== 'All Agencies' && val !== 'All';
    return true;
  });

  return (
    <div className="mb-6 transition-all">
      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 items-end">
        {/* Financial Year */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Financial Year
          </label>
          <CustomSelect
            value={filters.financialYear}
            onChange={(val) => onFilterChange('financialYear', val)}
            options={[
              { value: '2026-27', label: '2026–27' },
              { value: '2025-26', label: '2025–26' },
              { value: '2024-25', label: '2024–25' }
            ]}
            defaultLabel="2026-27"
          />
        </div>

        {/* House */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            House
          </label>
          <CustomSelect
            value={filters.house}
            onChange={(val) => onFilterChange('house', val)}
            options={[
              { value: 'All', label: 'All' },
              { value: 'Lok Sabha', label: 'Lok Sabha' },
              { value: 'Rajya Sabha', label: 'Rajya Sabha' }
            ]}
            defaultLabel="All"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            State
          </label>
          <CustomSelect
            value={filters.state}
            onChange={(val) => onFilterChange('state', val)}
            options={[
              { value: '', label: 'All States' },
              ...STATES.map(st => ({ value: st, label: st }))
            ]}
            defaultLabel="All States"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            District
          </label>
          <CustomSelect
            value={filters.district}
            onChange={(val) => onFilterChange('district', val)}
            options={[
              { value: '', label: 'All Districts' },
              ...availableDistricts.map(dist => ({ value: dist, label: dist }))
            ]}
            defaultLabel="All Districts"
          />
        </div>

        {/* MP */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            MP
          </label>
          <CustomSelect
            value={filters.mp}
            onChange={(val) => onFilterChange('mp', val)}
            options={[
              { value: '', label: 'All MPs' },
              ...availableMPs.map(mp => ({ value: mp, label: mp }))
            ]}
            defaultLabel="All MPs"
          />
        </div>

        {/* Sector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sector
          </label>
          <CustomSelect
            value={filters.projectType}
            onChange={(val) => onFilterChange('projectType', val)}
            options={[
              { value: '', label: 'All Sectors' },
              ...SECTORS.map(sec => ({ value: sec, label: sec }))
            ]}
            defaultLabel="All Sectors"
          />
        </div>

        {/* Work Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Work Status
          </label>
          <CustomSelect
            value={filters.status}
            onChange={(val) => onFilterChange('status', val)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'ONGOING', label: 'Ongoing' },
              { value: 'NEAR_COMPLETION', label: 'Near Completion' },
              { value: 'STARTING', label: 'Starting' },
              { value: 'DELAYED', label: 'Delayed' }
            ]}
            defaultLabel="All Statuses"
          />
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
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-200 text-black px-2 py-0.5 rounded-full border border-black"
            >
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <strong className="font-semibold">{val}</strong>
              <button
                type="button"
                onClick={() => onFilterChange(key, key === 'financialYear' ? '2026-27' : key === 'house' ? 'All' : '')}
                className="hover:text-slate-600 ml-0.5"
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
