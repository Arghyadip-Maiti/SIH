const fs = require('fs');

const content = `import { useState, useRef, useEffect } from 'react';
import { X, Filter, ChevronDown } from 'lucide-react';
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

const CustomSelect = ({ value, onChange, options, defaultLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || { label: defaultLabel, value: '' };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[34px] text-xs font-medium bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 flex items-center justify-between text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
      >
        <span className="truncate pr-2">{selectedOption.label}</span>
        <ChevronDown className={\`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 \${isOpen ? 'rotate-180' : ''}\`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={\`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors \${
                value === opt.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }\`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const OverviewFilterBar = ({
  filters,
  onFilterChange,
  onReset,
}) => {
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

  const activeTags = Object.entries(filters).filter(([key, val]) => {
    if (key === 'riskLevel' || key === 'agency') return false;
    if (key === 'financialYear') return val !== '2026-27';
    if (key === 'house') return val !== 'All';
    return Boolean(val);
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 mb-6 transition-all">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 items-end">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Financial Year
          </label>
          <CustomSelect
            value={filters.financialYear}
            onChange={(val) => onFilterChange('financialYear', val)}
            options={[
              { label: '2026–27', value: '2026-27' },
              { label: '2025–26', value: '2025-26' },
              { label: '2024–25', value: '2024-25' },
            ]}
            defaultLabel="2026–27"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            House
          </label>
          <CustomSelect
            value={filters.house}
            onChange={(val) => onFilterChange('house', val)}
            options={[
              { label: 'All', value: 'All' },
              { label: 'Lok Sabha', value: 'Lok Sabha' },
              { label: 'Rajya Sabha', value: 'Rajya Sabha' },
            ]}
            defaultLabel="All"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            State
          </label>
          <CustomSelect
            value={filters.state}
            onChange={(val) => onFilterChange('state', val)}
            options={[
              { label: 'All States', value: '' },
              ...STATES.map(st => ({ label: st, value: st }))
            ]}
            defaultLabel="All States"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            District
          </label>
          <CustomSelect
            value={filters.district}
            onChange={(val) => onFilterChange('district', val)}
            options={[
              { label: 'All Districts', value: '' },
              ...availableDistricts.map(d => ({ label: d, value: d }))
            ]}
            defaultLabel="All Districts"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            MP
          </label>
          <CustomSelect
            value={filters.mp}
            onChange={(val) => onFilterChange('mp', val)}
            options={[
              { label: 'All MPs', value: '' },
              ...availableMPs.map(m => ({ label: m, value: m }))
            ]}
            defaultLabel="All MPs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sector
          </label>
          <CustomSelect
            value={filters.projectType}
            onChange={(val) => onFilterChange('projectType', val)}
            options={[
              { label: 'All Sectors', value: '' },
              ...SECTORS.map(s => ({ label: s, value: s }))
            ]}
            defaultLabel="All Sectors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Work Status
          </label>
          <CustomSelect
            value={filters.status}
            onChange={(val) => onFilterChange('status', val)}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Ongoing', value: 'ONGOING' },
              { label: 'Near Completion', value: 'NEAR_COMPLETION' },
              { label: 'Starting', value: 'STARTING' },
              { label: 'Delayed', value: 'DELAYED' },
            ]}
            defaultLabel="All Statuses"
          />
        </div>
      </div>

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
`;

fs.writeFileSync('src/pages/Overview/components/OverviewFilterBar.jsx', content);
