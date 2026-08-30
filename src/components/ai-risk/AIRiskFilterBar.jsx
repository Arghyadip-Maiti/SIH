import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { STATE_DISTRICT_MAP } from '../../data/locationMappings';
import { CustomSelect } from '../ui/CustomSelect';

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

  // Active non-default filter tags
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
    <div className="mb-6 transition-all space-y-6">
      {/* Row 1: Search input */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Project ID, MP, Location..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full sm:w-80 h-[34px] text-xs bg-transparent text-slate-700 border border-black rounded-lg px-2.5 focus:outline-none placeholder:text-slate-400 font-bold"
        />
      </div>

      {/* Row 2: All dropdown filters + Reset */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-6 items-end">

        {/* State */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            State
          </label>
          <CustomSelect
            value={filters.state || 'All States'}
            onChange={(val) => onFilterChange('state', val)}
            options={stateOptions.map((st) => ({ value: st, label: st }))}
            className="w-full"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            District
          </label>
          <CustomSelect
            value={filters.district || 'All Districts'}
            onChange={(val) => onFilterChange('district', val)}
            options={districtOptions.map((d) => ({ value: d, label: d }))}
            className="w-full"
          />
        </div>

        {/* Project Type / Sector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sector / Type
          </label>
          <CustomSelect
            value={filters.projectType || 'All Types'}
            onChange={(val) => onFilterChange('projectType', val)}
            options={PROJECT_TYPES.map((t) => ({ value: t, label: t }))}
            className="w-full"
          />
        </div>

        {/* Agency */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Agency
          </label>
          <CustomSelect
            value={filters.agency || 'All Agencies'}
            onChange={(val) => onFilterChange('agency', val)}
            options={AGENCIES.map((a) => ({ value: a, label: a }))}
            className="w-full"
          />
        </div>

        {/* Anomaly Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Anomaly Type
          </label>
          <CustomSelect
            value={filters.anomalyType || 'All Anomalies'}
            onChange={(val) => onFilterChange('anomalyType', val)}
            options={ANOMALY_TYPES.map((a) => ({ value: a, label: a }))}
            className="w-full"
          />
        </div>

        {/* Reset */}
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

      {/* Active Filter Chips — always rendered to prevent layout shift */}
      <div className={`flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100 min-h-[36px] ${activeTags.length === 0 ? 'invisible' : ''}`}>
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
              onClick={() =>
                onFilterChange(
                  key,
                  key === 'state' ? 'All States'
                  : key === 'district' ? 'All Districts'
                  : key === 'projectType' ? 'All Types'
                  : key === 'agency' ? 'All Agencies'
                  : key === 'anomalyType' ? 'All Anomalies'
                  : ''
                )
              }
              className="hover:text-slate-950 ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {activeTags.length > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline font-medium ml-auto"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};
