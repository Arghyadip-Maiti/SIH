const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Sidebar.jsx', 'utf8');

// Remove the floating toggle button
const regex = /\{\/\* Floating Toggle Button on Sidebar Border \*\/\}[\s\S]*?<\/button>/;
content = content.replace(regex, '');

fs.writeFileSync('src/components/layout/Sidebar.jsx', content);
console.log("Button removed");
