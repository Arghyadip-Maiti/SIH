import { useMemo } from 'react';
import { X, Filter } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';
import { STATE_DISTRICT_MAP, MP_LOCATION_MAP } from '../../data/locationMappings';
import { useApp } from '../../context/AppContext';

const FY_OPTIONS = [
  { value: '2026-27', label: '2026–27' },
  { value: '2025-26', label: '2025–26' },
  { value: '2024-25', label: '2024–25' },
  { value: '2023-24', label: '2023–24' },
  { value: 'All', label: 'All Years' },
];

const HOUSE_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Lok Sabha', label: 'Lok Sabha' },
  { value: 'Rajya Sabha', label: 'Rajya Sabha' },
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

export const AnalyticsFilterBar = ({ filters, onFilterChange, onReset }) => {
  const { dashboardPreferences } = useApp();
  const defaultFY = dashboardPreferences?.financialYear || '2026-27';

  // Dynamic State options list
  const stateOptions = useMemo(
    () => [{ value: '', label: 'All States' }, ...Object.keys(STATE_DISTRICT_MAP).sort().map((st) => ({ value: st, label: st }))],
    []
  );

  // Dynamic District options list based on active state
  const districtOptions = useMemo(() => {
    if (!filters.state || filters.state === 'All States' || filters.state === 'All') {
      const allDists = new Set();
      Object.values(STATE_DISTRICT_MAP).forEach((arr) => arr.forEach((d) => allDists.add(d)));
      return [{ value: '', label: 'All Districts' }, ...Array.from(allDists).sort().map((d) => ({ value: d, label: d }))];
    }
    return [
      { value: '', label: 'All Districts' },
      ...(STATE_DISTRICT_MAP[filters.state] || []).sort().map((d) => ({ value: d, label: d })),
    ];
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
    return [{ value: '', label: 'All MPs' }, ...Array.from(mpSet).sort().map((m) => ({ value: m, label: m }))];
  }, [filters.state, filters.district]);

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2.5 items-end">
        {/* Financial Year */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Financial Year
          </label>
          <CustomSelect
            value={filters.financialYear}
            onChange={(val) => onFilterChange('financialYear', val)}
            options={FY_OPTIONS}
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
            options={HOUSE_OPTIONS}
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
            options={stateOptions}
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
            options={districtOptions}
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
            options={mpOptions}
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
              ...SECTORS.map((sec) => ({ value: sec, label: sec })),
            ]}
            defaultLabel="All Sectors"
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

export default AnalyticsFilterBar;
