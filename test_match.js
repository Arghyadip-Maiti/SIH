const { STATE_DISTRICT_MAP } = require('./src/data/locationMappings.js');
const fs = require('fs');

const data = fs.readFileSync('./src/data/mockOverview.js', 'utf8');
const statePerformanceMatch = data.match(/statePerformance:\s*\[([\s\S]*?)\]/);

// extract state names manually
const states = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Goa", "Uttar Pradesh", "Bihar", "West Bengal", "Rajasthan", "Kerala"];

const stName = "punjab";
const record = states.find(
    (s) => s.toLowerCase() === stName || s.toLowerCase().includes(stName) || stName.includes(s.toLowerCase())
);
console.log("Matched:", record);
