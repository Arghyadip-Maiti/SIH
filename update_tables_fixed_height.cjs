const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/StatePerformanceSection.jsx', 'utf8');

// Import STATE_DISTRICT_MAP
if (!content.includes('STATE_DISTRICT_MAP')) {
  content = content.replace("import { CustomSelect } from '../../../components/ui/CustomSelect';", "import { CustomSelect } from '../../../components/ui/CustomSelect';\nimport { STATE_DISTRICT_MAP } from '../../../services/api/locationService';");
}

// Replace sort logic to include all states
const oldSortLogic = `  // Dynamic Mathematical Sorting for States
  const sortedStates = [...statePerformance].sort((a, b) => {
    const valA = stateMetric === 'utilization' ? (a.utilization || 0) : (a.expenditureCr || 0);
    const valB = stateMetric === 'utilization' ? (b.utilization || 0) : (b.expenditureCr || 0);
    return stateOrder === 'highest' ? valB - valA : valA - valB;
  });
  const displayedStates = showAllStates ? sortedStates : sortedStates.slice(0, 5);

  // Dynamic Mathematical Sorting for Districts
  const sortedDistricts = [...topDistricts].sort((a, b) => {
    const valA = districtMetric === 'utilization' ? (a.utilization || 0) : (a.expenditureCr || 0);
    const valB = districtMetric === 'utilization' ? (b.utilization || 0) : (b.expenditureCr || 0);
    return districtOrder === 'highest' ? valB - valA : valA - valB;
  });

  const finalDistricts = filters.district ? sortedDistricts : (showAllDistricts ? sortedDistricts : sortedDistricts.slice(0, 5));`;

const newSortLogic = `  // Dynamic Mathematical Sorting for States (All 28+ States)
  const allStates = Object.keys(STATE_DISTRICT_MAP).map(stateName => {
    const found = statePerformance.find(s => s.state.toLowerCase() === stateName.toLowerCase());
    return found || { state: stateName, utilization: null, expenditureCr: null };
  });

  const sortedStates = allStates.sort((a, b) => {
    const valA = stateMetric === 'utilization' ? (a.utilization || 0) : (a.expenditureCr || 0);
    const valB = stateMetric === 'utilization' ? (b.utilization || 0) : (b.expenditureCr || 0);
    if (valA === 0 && valB !== 0) return 1; // push null/0 to bottom
    if (valB === 0 && valA !== 0) return -1;
    return stateOrder === 'highest' ? valB - valA : valA - valB;
  });
  const displayedStates = showAllStates ? sortedStates : sortedStates.slice(0, 5);

  // Dynamic Mathematical Sorting for Districts (All Districts)
  const allDistricts = Object.entries(STATE_DISTRICT_MAP).flatMap(([stateName, districts]) => {
    return districts.map(districtName => {
      const found = topDistricts.find(d => d.district.toLowerCase() === districtName.toLowerCase() && d.state.toLowerCase() === stateName.toLowerCase());
      return found || { district: districtName, state: stateName, utilization: null, expenditureCr: null };
    });
  });
  
  const sortedDistricts = allDistricts.sort((a, b) => {
    const valA = districtMetric === 'utilization' ? (a.utilization || 0) : (a.expenditureCr || 0);
    const valB = districtMetric === 'utilization' ? (b.utilization || 0) : (b.expenditureCr || 0);
    if (valA === 0 && valB !== 0) return 1; // push null/0 to bottom
    if (valB === 0 && valA !== 0) return -1;
    return districtOrder === 'highest' ? valB - valA : valA - valB;
  });

  const filteredDistricts = filters.state ? sortedDistricts.filter(d => d.state.toLowerCase() === filters.state.toLowerCase()) : sortedDistricts;
  const finalDistricts = filters.district 
    ? filteredDistricts.filter(d => d.district.toLowerCase() === filters.district.toLowerCase()) 
    : (showAllDistricts ? filteredDistricts : filteredDistricts.slice(0, 5));`;

// Regex replacement for logic block (needs to be robust, since it spans multiple lines)
// Let's use string splitting or precise regex
content = content.replace(/ \/\/ Dynamic Mathematical Sorting for States[\s\S]*?(?=  const getDistrictHeaderTitle)/, newSortLogic + '\n\n');

// Update heights of wrappers
content = content.replace(/className=\{\`overflow-x-auto \$\{showAllStates \? 'max-h-\[250px\] overflow-y-auto' : ''\}\`\}/g, 'className="overflow-x-auto h-[260px] overflow-y-auto"');
content = content.replace(/className=\{\`overflow-x-auto \$\{showAllDistricts \? 'max-h-\[250px\] overflow-y-auto' : ''\}\`\}/g, 'className="overflow-x-auto h-[260px] overflow-y-auto"');

// Fix display of null values in map
content = content.replace(/\{st\.utilization\}%/g, '{st.utilization !== null ? `${st.utilization}%` : "-"}');
content = content.replace(/₹\{st\.expenditureCr\}/g, '{st.expenditureCr !== null ? `₹${st.expenditureCr}` : "-"}');

content = content.replace(/\{dist\.utilization \|\| 78\.5\}%/g, '{dist.utilization !== null ? `${dist.utilization}%` : "-"}');
content = content.replace(/₹\{dist\.expenditureCr\}/g, '{dist.expenditureCr !== null ? `₹${dist.expenditureCr}` : "-"}');

fs.writeFileSync('src/pages/Overview/components/StatePerformanceSection.jsx', content);
