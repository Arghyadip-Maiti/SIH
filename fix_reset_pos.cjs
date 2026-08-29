const fs = require('fs');
const path = require('path');

const p = path.resolve('src/components/projects/ProjectFilterBar.jsx');
let content = fs.readFileSync(p, 'utf8');

const resetRegex = /\{\/\* 12\. Permanent Reset Action Button[\s\S]*?<\/div>\n\n        \{\/\* 11\. Cost Range \*\//;
// Wait, the comment says {/* 11. Cost Range */} but it's actually after the reset button because of my previous swap.
// Let's just extract the components individually by using split and indexOf.
