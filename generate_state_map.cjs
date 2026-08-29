const fs = require('fs');

let content = fs.readFileSync('src/components/maps/LokSabhaConstituencyMap.jsx', 'utf8');

// Replace GeoJSON URL
content = content.replace('/LGD_Parliament_Constituencies.geojson', '/india_states.geojson');

// Add statePerformance to props
content = content.replace('filters = {},', 'filters = {},\n  statePerformance = [],');

// Remove matchConstituencyData dependency and use a local matching function
content = content.replace('matchConstituencyData,', '');

// Add matching function for states
const matchStateData = `
const matchStateData = (feature, statePerformance) => {
  const p = feature.properties || {};
  const stName = String(p.ST_NM || '').trim().toLowerCase();
  
  if (!stName) return null;

  const record = statePerformance.find(
    (s) => s.state.toLowerCase() === stName || s.state.toLowerCase().includes(stName) || stName.includes(s.state.toLowerCase())
  );

  return record || null;
};
`;

content = content.replace('import ReactDOMServer from \'react-dom/server\';', 'import ReactDOMServer from \'react-dom/server\';\n' + matchStateData);

// Update style calculator
content = content.replace(/const record = matchConstituencyData\(feature, constituencyMap, filters\);/g, 'const record = matchStateData(feature, statePerformance);');

// Update feature click handler
content = content.replace(/const record = matchConstituencyData\(feature, constituencyMap, filters\);/g, 'const record = matchStateData(feature, statePerformance);'); // Note this might replace multiple instances, which is good.

// Rename component
content = content.replace(/LokSabhaConstituencyMap/g, 'StateMap');

// Write out StateMap.jsx
fs.writeFileSync('src/components/maps/StateMap.jsx', content);

