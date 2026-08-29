const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/OverviewFilterBar.jsx', 'utf8');

// 1. Add ChevronDown to imports
content = content.replace(/import { RotateCcw, X, Filter } from 'lucide-react';/, "import { X, Filter, ChevronDown } from 'lucide-react';");

// 2. Remove the Reset Action Button block completely
content = content.replace(/\{\/\* Reset Action Button \*\/\}[\s\S]*?<\/div>\n      <\/div>/, "      </div>");

// 3. Update all <select> wrappers and add appearance-none, pr-7
// We will replace `<select` with `<div className="relative"><select className="appearance-none pr-7 ..."`
// And `</select>` with `</select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" /></div>`

// Wait, the className attribute is on the next few lines for select.
// Let's use string replace for the classNames first.
content = content.replace(/className="w-full h-\[34px\] text-xs font-semibold bg-slate-50/g, 'className="appearance-none pr-7 w-full h-[34px] text-xs font-semibold bg-slate-50');
content = content.replace(/className="w-full h-\[34px\] text-xs font-medium bg-slate-50/g, 'className="appearance-none pr-7 w-full h-[34px] text-xs font-medium bg-slate-50');

content = content.replace(/<select/g, '<div className="relative">\n            <select');
content = content.replace(/<\/select>/g, '</select>\n            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />\n          </div>');

// 4. Style options
content = content.replace(/<option/g, '<option className="bg-white text-slate-800 py-1 font-medium"');

fs.writeFileSync('src/pages/Overview/components/OverviewFilterBar.jsx', content);
