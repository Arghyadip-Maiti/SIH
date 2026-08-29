const fs = require('fs');

function processFile(file, titleStr) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove import Card
  content = content.replace("import { Card } from '../../../components/ui/Card';", "");
  content = content.replace("import { Card } from '../../../components/ui/Card';\n", "");

  // Replace <Card header={<h3 className="text-base font-bold text-slate-900">TITLE</h3>}>
  // with <div className="flex flex-col h-full"><h3 className="text-sm font-bold text-slate-900 mb-4 text-center">TITLE</h3>
  content = content.replace(/<Card header=\{<h3 className="[^"]+">([^<]+)<\/h3>\}>/, '<div className="flex flex-col h-full w-full"><h3 className="text-sm font-bold text-slate-900 mb-4 text-center">$1</h3>');

  // Replace </Card> with </div>
  content = content.replace(/<\/Card>/g, '</div>');

  fs.writeFileSync(file, content);
}

processFile('src/pages/Overview/components/FinancialOverviewSection.jsx');
processFile('src/pages/Overview/components/ProjectStatusSection.jsx');
processFile('src/pages/Overview/components/SectorExpenditureSection.jsx');

