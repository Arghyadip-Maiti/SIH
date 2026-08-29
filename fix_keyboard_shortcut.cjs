const fs = require('fs');

let content = fs.readFileSync('src/components/layout/DashboardLayout.jsx', 'utf8');

// Add React hook imports if needed
if (!content.includes('import { useEffect }')) {
  content = content.replace("import { Outlet } from 'react-router-dom';", "import { useEffect } from 'react';\nimport { Outlet } from 'react-router-dom';");
}

// Extract toggle function
content = content.replace(
  'const { sidebarCollapsed } = useApp();',
  'const { sidebarCollapsed, toggleSidebarCollapse } = useApp();\n\n  useEffect(() => {\n    const handleKeyDown = (e) => {\n      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === \'b\') {\n        e.preventDefault();\n        toggleSidebarCollapse();\n      }\n    };\n    window.addEventListener(\'keydown\', handleKeyDown);\n    return () => window.removeEventListener(\'keydown\', handleKeyDown);\n  }, [toggleSidebarCollapse]);'
);

fs.writeFileSync('src/components/layout/DashboardLayout.jsx', content);
console.log("Keyboard shortcut added");
