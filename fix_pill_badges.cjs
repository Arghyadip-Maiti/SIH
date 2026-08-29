const fs = require('fs');

// 1. Topbar (Mock Mode)
let topbar = fs.readFileSync('src/components/layout/Topbar.jsx', 'utf8');
topbar = topbar.replace(
  'bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200',
  'text-amber-700'
);
fs.writeFileSync('src/components/layout/Topbar.jsx', topbar);

// 2. OverviewHeader (Data up to date)
let overviewHeader = fs.readFileSync('src/pages/Overview/components/OverviewHeader.jsx', 'utf8');
overviewHeader = overviewHeader.replace(
  'px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/80',
  'text-emerald-700 text-xs font-semibold'
);
fs.writeFileSync('src/pages/Overview/components/OverviewHeader.jsx', overviewHeader);

// 3. ProjectHeader (Data up to date)
let projectHeader = fs.readFileSync('src/components/projects/ProjectHeader.jsx', 'utf8');
projectHeader = projectHeader.replace(
  'px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/80',
  'text-emerald-700 text-xs font-semibold'
);
fs.writeFileSync('src/components/projects/ProjectHeader.jsx', projectHeader);

// 4. HighLevelAttentionSection (Logos and Number text colors)
let highLevel = fs.readFileSync('src/pages/Overview/components/HighLevelAttentionSection.jsx', 'utf8');
highLevel = highLevel.replace(
  /<div className="p-1\.5 rounded-md bg-white border border-slate-200 shrink-0">/g,
  '<div className="shrink-0 flex items-center justify-center">'
);

// update getBadgeStyle
const oldGetBadgeStyle = `  const getBadgeStyle = (type) => {
    switch (type) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-200 text-slate-900 border-slate-300';
    }
  };`;
const newGetBadgeStyle = `  const getBadgeStyle = (type) => {
    switch (type) {
      case 'CRITICAL':
        return 'text-red-700';
      case 'HIGH':
        return 'text-orange-700';
      case 'MEDIUM':
        return 'text-amber-700';
      default:
        return 'text-slate-700';
    }
  };`;
highLevel = highLevel.replace(oldGetBadgeStyle, newGetBadgeStyle);

// update span for numbers
highLevel = highLevel.replace(
  /<span className=\{\`inline-flex items-center px-1\.5 py-0\.5 rounded text-\[10px\] font-mono font-bold mr-2 border \$\{getBadgeStyle\(item\.type\)\}\`\}>/g,
  '<span className={`inline-flex items-center text-[11px] font-mono font-extrabold mr-1.5 ${getBadgeStyle(item.type)}`}>'
);
fs.writeFileSync('src/pages/Overview/components/HighLevelAttentionSection.jsx', highLevel);

console.log("Done");
