const fs = require('fs');

function removeCustomSelect(file, importPath) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Regex to remove the CustomSelect definition
  const pattern = /const CustomSelect = \(\{[\s\S]*?\}\) => \{[\s\S]*?^};\n/m;
  content = content.replace(pattern, '');
  
  if (!content.includes('import { CustomSelect }')) {
    content = content.replace("import { Button }", `import { CustomSelect } from '${importPath}';\nimport { Button }`);
  }
  
  fs.writeFileSync(file, content);
}

removeCustomSelect('src/pages/Overview/components/IndiaMapSection.jsx', '../../../components/ui/CustomSelect');
removeCustomSelect('src/pages/Overview/components/OverviewFilterBar.jsx', '../../../components/ui/CustomSelect');

