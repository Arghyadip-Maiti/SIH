const fs = require('fs');

let content = fs.readFileSync('src/components/maps/StateMap.jsx', 'utf8');

if (!content.includes('MapLoadingSkeleton')) {
  content = content.replace(
    "import { LoadingState } from '../ui/LoadingState';",
    "import { LoadingState } from '../ui/LoadingState';\nimport { MapLoadingSkeleton } from '../ui/MapLoadingSkeleton';"
  );
}

content = content.replace(
  '<LoadingState message="Loading India State GeoJSON Boundaries..." />',
  '<MapLoadingSkeleton message="Loading India map data..." />'
);

content = content.replace(
  'className="w-full h-[580px] bg-slate-50 z-0 relative"',
  'className="w-full h-[580px] bg-slate-50 z-0 relative animate-in fade-in duration-1000"'
);
content = content.replace(
  'className="w-full h-[580px] bg-slate-50 z-0"',
  'className="w-full h-[580px] bg-slate-50 z-0 animate-in fade-in duration-1000"'
);

fs.writeFileSync('src/components/maps/StateMap.jsx', content);
