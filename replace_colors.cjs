const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory()
        ? walkSync(dirFile, filelist)
        : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'OOM' || err.code === 'EMFILE') throw err;
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

const replacements = [
  // text
  { from: /text-blue-50\b/g, to: 'text-slate-50' },
  { from: /text-blue-100\b/g, to: 'text-slate-100' },
  { from: /text-blue-200\b/g, to: 'text-slate-200' },
  { from: /text-blue-300\b/g, to: 'text-slate-400' },
  { from: /text-blue-400\b/g, to: 'text-slate-500' },
  { from: /text-blue-500\b/g, to: 'text-slate-600' },
  { from: /text-blue-600\b/g, to: 'text-slate-700' },
  { from: /text-blue-700\b/g, to: 'text-slate-800' },
  { from: /text-blue-800\b/g, to: 'text-slate-900' },
  { from: /text-blue-900\b/g, to: 'text-slate-950' },
  { from: /text-blue-950\b/g, to: 'text-slate-950' },

  // bg
  { from: /bg-blue-50\b/g, to: 'bg-slate-100' },
  { from: /bg-blue-100\b/g, to: 'bg-slate-200' },
  { from: /bg-blue-200\b/g, to: 'bg-slate-300' },
  { from: /bg-blue-300\b/g, to: 'bg-slate-400' },
  { from: /bg-blue-400\b/g, to: 'bg-slate-500' },
  { from: /bg-blue-500\b/g, to: 'bg-slate-700' },
  { from: /bg-blue-600\b/g, to: 'bg-slate-800' },
  { from: /bg-blue-700\b/g, to: 'bg-slate-900' },
  { from: /bg-blue-800\b/g, to: 'bg-slate-900' },
  { from: /bg-blue-900\b/g, to: 'bg-slate-950' },

  // border
  { from: /border-blue-50\b/g, to: 'border-slate-100' },
  { from: /border-blue-100\b/g, to: 'border-slate-200' },
  { from: /border-blue-200\b/g, to: 'border-slate-300' },
  { from: /border-blue-300\b/g, to: 'border-slate-400' },
  { from: /border-blue-400\b/g, to: 'border-slate-500' },
  { from: /border-blue-500\b/g, to: 'border-slate-600' },
  { from: /border-blue-600\b/g, to: 'border-slate-700' },
  { from: /border-blue-700\b/g, to: 'border-slate-800' },

  // ring
  { from: /ring-blue-100\b/g, to: 'ring-slate-200' },
  { from: /ring-blue-200\b/g, to: 'ring-slate-300' },
  { from: /ring-blue-300\b/g, to: 'ring-slate-400' },
  { from: /ring-blue-400\b/g, to: 'ring-slate-500' },
  { from: /ring-blue-500\b/g, to: 'ring-slate-500' },
  { from: /ring-blue-600\b/g, to: 'ring-slate-600' },

  // from (gradient)
  { from: /from-blue-50\b/g, to: 'from-slate-100' },
  { from: /from-blue-100\b/g, to: 'from-slate-200' },
  { from: /from-blue-500\b/g, to: 'from-slate-600' },
  { from: /from-blue-600\b/g, to: 'from-slate-700' },

  // to (gradient)
  { from: /to-blue-50\b/g, to: 'to-slate-100' },
  { from: /to-blue-100\b/g, to: 'to-slate-200' },
  { from: /to-blue-500\b/g, to: 'to-slate-600' },
  { from: /to-blue-600\b/g, to: 'to-slate-700' },

  // via (gradient)
  { from: /via-blue-50\b/g, to: 'via-slate-100' },
  { from: /via-blue-100\b/g, to: 'via-slate-200' },
  { from: /via-blue-500\b/g, to: 'via-slate-600' },

  // fill
  { from: /fill-blue-500\b/g, to: 'fill-slate-600' },
  { from: /fill-blue-600\b/g, to: 'fill-slate-700' }
];

let filesModified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  for (const { from, to } of replacements) {
    newContent = newContent.replace(from, to);
  }

  // Handle any hover: bg-blue-*, focus: bg-blue-* etc by generic regex
  // The above regexes will match text-blue-50 inside hover:text-blue-50 because it's just a substring replace.

  // Recharts Stroke/Fill strings
  newContent = newContent.replace(/stroke="#[0-9a-fA-F]{6}"/g, (match) => {
    // If it's a blue hex code... this might be dangerous to replace all hex codes.
    return match;
  });

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    filesModified++;
  }
}

console.log(`Modified ${filesModified} files.`);
