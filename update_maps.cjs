const fs = require('fs');

function processMap(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add activeMetric prop
  content = content.replace('filters = {},', 'filters = {},\n  activeMetric = \'utilization\',');
  content = content.replace('statePerformance = [],', 'statePerformance = [],\n  activeMetric = \'utilization\',');
  
  // Remove internal state
  content = content.replace(/const \[activeMetric, setActiveMetric\] = useState\([^)]+\);\n/, '');

  // Remove the metric selection UI
  const metricUIStart = content.indexOf('<div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-2 pointer-events-auto">');
  if (metricUIStart !== -1) {
    const metricUIEnd = content.indexOf('</div>\n        </div>', metricUIStart);
    if (metricUIEnd !== -1) {
      content = content.substring(0, metricUIStart) + content.substring(metricUIEnd + 15);
    }
  }

  // Remove the <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2"> around the remaining button
  // Or rather, let's just use regex to remove the metric options block.
  content = content.replace(/<div className="bg-white rounded-xl shadow-xs border border-slate-200\/80 p-2 pointer-events-auto">[\s\S]*?<\/div>\s*<\/div>/, '');
  content = content.replace(/<div className="bg-white rounded-xl shadow-xs border border-slate-200\/80 p-2 pointer-events-auto">[\s\S]*?<\/div>\n\s*<\/div>/, '');

  fs.writeFileSync(file, content);
}

processMap('src/components/maps/StateMap.jsx');
processMap('src/components/maps/DistrictMap.jsx');
