const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/OverviewPage.jsx', 'utf8');

// 1. Add imports
if (!content.includes('import { useState, useEffect }')) {
  content = content.replace("import { useOverview } from '../../hooks/useOverview';", "import { useState, useEffect } from 'react';\nimport { useOverview } from '../../hooks/useOverview';");
}

// 2. Add local state for transition
const hookCall = '} = useOverview();';
const stateCode = `} = useOverview();

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading && overviewData) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000); // Wait for the fade out transition
      return () => clearTimeout(timer);
    } else if (loading && !overviewData) {
      setShowSkeleton(true);
      setIsFadingOut(false);
    }
  }, [loading, overviewData]);`;
content = content.replace(hookCall, stateCode);

// 3. Remove old loading state
content = content.replace(/  if \(loading && !overviewData\) \{\n    return <LoadingState message="Loading MPLADS Command Center metrics\.\.\." \/>;\n  \}\n/g, '');

// 4. Change the return wrapper
const oldReturn = '  return (\n    <div className="space-y-6 pb-12 animate-in fade-in duration-1000 zoom-in-[0.99] slide-in-from-bottom-2">';
const newReturn = `  return (
    <div className="relative min-h-full">
      {/* Skeleton Overlay */}
      {showSkeleton && (
        <div 
          className={\`absolute inset-0 z-50 transition-opacity duration-1000 bg-white \${
            isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }\`}
        >
          <LoadingState message="Loading MPLADS Command Center metrics..." />
        </div>
      )}

      {/* Real Content */}
      {overviewData && (
        <div 
          className={\`space-y-6 pb-12 transition-opacity duration-1000 \${
            isFadingOut ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }\`}
        >`;
content = content.replace(oldReturn, newReturn);

// 5. Wrap the bottom div
const oldEnd = '      <IndiaMapSection filters={filters} />\n    </div>\n  );\n};\n';
const newEnd = '      <IndiaMapSection filters={filters} />\n        </div>\n      )}\n    </div>\n  );\n};\n';
// wait, we need a regex for the end of the file.
content = content.replace(/      <IndiaMapSection filters=\{filters\} \/>\n    <\/div>\n  \);\n\};(\n)?$/, '      <IndiaMapSection filters={filters} />\n        </div>\n      )}\n    </div>\n  );\n};\n');


fs.writeFileSync('src/pages/Overview/OverviewPage.jsx', content);
console.log("Rewrote OverviewPage.jsx");
