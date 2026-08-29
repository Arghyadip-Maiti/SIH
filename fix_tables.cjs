const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/StatePerformanceSection.jsx', 'utf8');

// 1. Add states
if (!content.includes('showAllStates')) {
  content = content.replace("const [districtOrder, setDistrictOrder] = useState('highest');", "const [districtOrder, setDistrictOrder] = useState('highest');\n  const [showAllStates, setShowAllStates] = useState(false);\n  const [showAllDistricts, setShowAllDistricts] = useState(false);");
}

// 2. Fix sorting slice
const oldStateSort = `}).slice(0, 5);`;
const newStateSort = `});\n  const displayedStates = showAllStates ? sortedStates : sortedStates.slice(0, 5);`;
if (content.includes(oldStateSort)) {
  content = content.replace(oldStateSort, newStateSort);
}

const oldDistSort = `const finalDistricts = filters.district ? sortedDistricts : sortedDistricts.slice(0, 5);`;
const newDistSort = `const finalDistricts = filters.district ? sortedDistricts : (showAllDistricts ? sortedDistricts : sortedDistricts.slice(0, 5));`;
if (content.includes(oldDistSort)) {
  content = content.replace(oldDistSort, newDistSort);
}

// 3. Update table map to use displayedStates instead of sortedStates
content = content.replace(/\{sortedStates\.map/g, '{displayedStates.map');

// 4. Update the container to have max height when showAll is true
content = content.replace(
  /<div className="overflow-x-auto">\s*<table className="w-full text-xs text-left">\s*<thead>\s*<tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-\[10px\]">\s*<th className="py-2 px-2">Rank<\/th>\s*<th className="py-2 px-2">State<\/th>/g, 
  `<div className={\`overflow-x-auto \${showAllStates ? 'max-h-[250px] overflow-y-auto' : ''}\`}>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2 sticky top-0 bg-white">Rank</th>
                <th className="py-2 px-2 sticky top-0 bg-white">State</th>`
);

content = content.replace(
  /<th className="py-2 px-2 text-right">Utilization %<\/th>\s*<th className="py-2 px-2 text-right">Expenditure \(₹ Cr\)<\/th>/g, 
  `<th className="py-2 px-2 text-right sticky top-0 bg-white">Utilization %</th>
                <th className="py-2 px-2 text-right sticky top-0 bg-white">Expenditure (₹ Cr)</th>`
);


content = content.replace(
  /<div className="overflow-x-auto">\s*<table className="w-full text-xs text-left">\s*<thead>\s*<tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-\[10px\]">\s*<th className="py-2 px-2">Rank<\/th>\s*<th className="py-2 px-2">District<\/th>/g, 
  `<div className={\`overflow-x-auto \${showAllDistricts ? 'max-h-[250px] overflow-y-auto' : ''}\`}>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2 sticky top-0 bg-white">Rank</th>
                <th className="py-2 px-2 sticky top-0 bg-white">District</th>`
);

content = content.replace(
  /<th className="py-2 px-2">State<\/th>\s*<th className="py-2 px-2 text-right sticky top-0 bg-white">Utilization %<\/th>\s*<th className="py-2 px-2 text-right sticky top-0 bg-white">Expenditure \(₹ Cr\)<\/th>/g, 
  `<th className="py-2 px-2 sticky top-0 bg-white">State</th>
                <th className="py-2 px-2 text-right sticky top-0 bg-white">Utilization %</th>
                <th className="py-2 px-2 text-right sticky top-0 bg-white">Expenditure (₹ Cr)</th>`
);



// 5. Update Buttons
const oldStateBtn = `<Button variant="ghost" size="sm" className="text-slate-700 text-xs font-semibold">
              View All States
            </Button>`;
const newStateBtn = `<Button onClick={() => setShowAllStates(!showAllStates)} variant="ghost" size="sm" className="text-slate-700 text-xs font-semibold">
              {showAllStates ? 'View Top 5 States' : 'View All States'}
            </Button>`;
content = content.replace(oldStateBtn, newStateBtn);

const oldDistBtn = `<Button variant="ghost" size="sm" className="text-slate-700 text-xs font-semibold">
              View All Districts
            </Button>`;
const newDistBtn = `<Button onClick={() => setShowAllDistricts(!showAllDistricts)} variant="ghost" size="sm" className="text-slate-700 text-xs font-semibold">
              {showAllDistricts ? 'View Top 5 Districts' : 'View All Districts'}
            </Button>`;
content = content.replace(oldDistBtn, newDistBtn);


fs.writeFileSync('src/pages/Overview/components/StatePerformanceSection.jsx', content);
