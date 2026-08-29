const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/IndiaMapSection.jsx', 'utf8');

if (!content.includes('MapLoadingSkeleton')) {
  content = content.replace(
    "import { LoadingState } from '../../../components/ui/LoadingState';",
    "import { LoadingState } from '../../../components/ui/LoadingState';\nimport { MapLoadingSkeleton } from '../../../components/ui/MapLoadingSkeleton';"
  );
  if (!content.includes('MapLoadingSkeleton')) {
    // maybe it wasn't there
    content = content.replace("import { Suspense } from 'react';", "import { Suspense } from 'react';\nimport { MapLoadingSkeleton } from '../../../components/ui/MapLoadingSkeleton';");
    content = content.replace("import { useState, lazy, Suspense } from 'react';", "import { useState, lazy, Suspense } from 'react';\nimport { MapLoadingSkeleton } from '../../../components/ui/MapLoadingSkeleton';");
  }
}

content = content.replace(
  '<Suspense fallback={<LoadingState message="Loading map..." />}>',
  '<Suspense fallback={<MapLoadingSkeleton message="Loading map modules..." />}>'
);

fs.writeFileSync('src/pages/Overview/components/IndiaMapSection.jsx', content);
