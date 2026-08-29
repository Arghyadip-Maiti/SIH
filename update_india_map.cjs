const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/IndiaMapSection.jsx', 'utf8');

if (!content.includes('METRIC_OPTIONS')) {
  content = content.replace("import { MapPin, ArrowLeft } from 'lucide-react';", "import { MapPin, ArrowLeft, ChevronDown } from 'lucide-react';\nimport { METRIC_OPTIONS } from '../../../utils/constituencyDataMapper';");
}

if (!content.includes('activeMetric')) {
  content = content.replace('const [selectedDistrict, setSelectedDistrict] = useState(null);', "const [selectedDistrict, setSelectedDistrict] = useState(null);\n  const [activeMetric, setActiveMetric] = useState('utilization');");
}

// Add dropdown next to the title
const headerTitleDiv = `<div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 ">
                <MapPin className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {zoomedState ? \`MPLADS Performance - \${zoomedState.state}\` : 'MPLADS Performance by State'}
              </h3>
              
              <div className="ml-2 relative hidden sm:block">
                <select
                  value={activeMetric}
                  onChange={(e) => setActiveMetric(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer"
                >
                  {METRIC_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>`;

content = content.replace(/<div className="flex items-center gap-2\.5">[\s\S]*?<\/h3>\n            <\/div>/, headerTitleDiv);

// Also we should put the select for mobile, but let's just make it visible
content = content.replace('hidden sm:block', 'sm:block');

// Pass activeMetric to DistrictMap and StateMap
content = content.replace('zoomedState={zoomedState}', 'zoomedState={zoomedState}\n                activeMetric={activeMetric}');
content = content.replace('selectedConstituency={selectedState}', 'selectedConstituency={selectedState}\n                activeMetric={activeMetric}');

fs.writeFileSync('src/pages/Overview/components/IndiaMapSection.jsx', content);
