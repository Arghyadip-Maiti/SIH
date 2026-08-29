const fs = require('fs');
let content = fs.readFileSync('src/components/projects/ProjectFilterBar.jsx', 'utf8');

// 1. Add CustomSelect import
if (!content.includes('CustomSelect')) {
  content = content.replace("import { Filter, Search, RotateCcw, X } from 'lucide-react';", "import { Filter, Search, RotateCcw, X } from 'lucide-react';\nimport { CustomSelect } from '../ui/CustomSelect';");
}

// Replace select blocks
const replacements = [
  {
    regex: /<select\s+value=\{filters\.financialYear \|\| '2026-27'\}\s+onChange=\{\(e\) => onFilterChange\('financialYear', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
            value={filters.financialYear || '2026-27'}
            onChange={(val) => onFilterChange('financialYear', val)}
            options={[
              { value: '2026-27', label: '2026-27' },
              { value: '2025-26', label: '2025-26' },
              { value: '2024-25', label: '2024-25' }
            ]}
            className="w-full"
          />`
  },
  {
    regex: /<select\s+value=\{filters\.state \|\| ''\}\s+onChange=\{\(e\) => onFilterChange\('state', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
            value={filters.state || ''}
            onChange={(val) => onFilterChange('state', val)}
            options={[
              { value: '', label: 'All States' },
              ...STATES.map(st => ({ value: st, label: st }))
            ]}
            className="w-full"
          />`
  },
  {
    regex: /<select\s+value=\{filters\.district \|\| ''\}\s+onChange=\{\(e\) => onFilterChange\('district', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
            value={filters.district || ''}
            onChange={(val) => onFilterChange('district', val)}
            options={[
              { value: '', label: 'All Districts' },
              ...availableDistricts.map(d => ({ value: d, label: d }))
            ]}
            className="w-full"
          />`
  },
  {
    regex: /<select\s+value=\{filters\.house \|\| 'All'\}\s+onChange=\{\(e\) => onFilterChange\('house', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
            value={filters.house || 'All'}
            onChange={(val) => onFilterChange('house', val)}
            options={[
              { value: 'All', label: 'All Houses' },
              { value: 'Lok Sabha', label: 'Lok Sabha' },
              { value: 'Rajya Sabha', label: 'Rajya Sabha' }
            ]}
            className="w-full"
          />`
  },
  {
    regex: /<select\s+value=\{filters\.projectType \|\| ''\}\s+onChange=\{\(e\) => onFilterChange\('projectType', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
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
          />`
  },
  {
    regex: /<select\s+value=\{filters\.status \|\| ''\}\s+onChange=\{\(e\) => onFilterChange\('status', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
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
          />`
  },
  {
    regex: /<select\s+value=\{filters\.riskLevel \|\| ''\}\s+onChange=\{\(e\) => onFilterChange\('riskLevel', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
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
          />`
  },
  {
    regex: /<select\s+value=\{filters\.costRange \|\| ''\}\s+onChange=\{\(e\) => onFilterChange\('costRange', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
            value={filters.costRange || ''}
            onChange={(val) => onFilterChange('costRange', val)}
            options={[
              { value: '', label: 'All Costs' },
              { value: '<50L', label: '< ₹50 Lakhs' },
              { value: '50L-1Cr', label: '₹50L – ₹1 Cr' },
              { value: '>1Cr', label: '> ₹1 Cr' }
            ]}
            className="w-full"
          />`
  },
  {
    regex: /<select\s+value=\{filters\.progressRange \|\| ''\}\s+onChange=\{\(e\) => onFilterChange\('progressRange', e\.target\.value\)\}\s+className=".*?"\s*>[\s\S]*?<\/select>/,
    replace: `<CustomSelect
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
          />`
  }
];

replacements.forEach(r => {
  content = content.replace(r.regex, r.replace);
});

fs.writeFileSync('src/components/projects/ProjectFilterBar.jsx', content);
