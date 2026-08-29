const fs = require('fs');
const file = 'src/components/overview/ConstituencyDetailsPanel.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center mb-4 ">
          <MapPin className="w-8 h-8 animate-pulse" />
        </div>`;

content = content.replace(target, '');
fs.writeFileSync(file, content);
