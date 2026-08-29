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

const colorsToReplace = ['sky', 'indigo', 'cyan'];
let filesModified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  for (const color of colorsToReplace) {
    // Replace text, bg, border, ring, from, to, via, fill
    newContent = newContent.replace(new RegExp(`text-${color}-50\\b`, 'g'), 'text-slate-50');
    newContent = newContent.replace(new RegExp(`text-${color}-100\\b`, 'g'), 'text-slate-100');
    newContent = newContent.replace(new RegExp(`text-${color}-200\\b`, 'g'), 'text-slate-200');
    newContent = newContent.replace(new RegExp(`text-${color}-300\\b`, 'g'), 'text-slate-400');
    newContent = newContent.replace(new RegExp(`text-${color}-400\\b`, 'g'), 'text-slate-500');
    newContent = newContent.replace(new RegExp(`text-${color}-500\\b`, 'g'), 'text-slate-600');
    newContent = newContent.replace(new RegExp(`text-${color}-600\\b`, 'g'), 'text-slate-700');
    newContent = newContent.replace(new RegExp(`text-${color}-700\\b`, 'g'), 'text-slate-800');
    newContent = newContent.replace(new RegExp(`text-${color}-800\\b`, 'g'), 'text-slate-900');
    newContent = newContent.replace(new RegExp(`text-${color}-900\\b`, 'g'), 'text-slate-950');

    newContent = newContent.replace(new RegExp(`bg-${color}-50\\b`, 'g'), 'bg-slate-100');
    newContent = newContent.replace(new RegExp(`bg-${color}-100\\b`, 'g'), 'bg-slate-200');
    newContent = newContent.replace(new RegExp(`bg-${color}-200\\b`, 'g'), 'bg-slate-300');
    newContent = newContent.replace(new RegExp(`bg-${color}-300\\b`, 'g'), 'bg-slate-400');
    newContent = newContent.replace(new RegExp(`bg-${color}-400\\b`, 'g'), 'bg-slate-500');
    newContent = newContent.replace(new RegExp(`bg-${color}-500\\b`, 'g'), 'bg-slate-700');
    newContent = newContent.replace(new RegExp(`bg-${color}-600\\b`, 'g'), 'bg-slate-800');
    newContent = newContent.replace(new RegExp(`bg-${color}-700\\b`, 'g'), 'bg-slate-900');
    newContent = newContent.replace(new RegExp(`bg-${color}-800\\b`, 'g'), 'bg-slate-900');
    newContent = newContent.replace(new RegExp(`bg-${color}-900\\b`, 'g'), 'bg-slate-950');

    newContent = newContent.replace(new RegExp(`border-${color}-50\\b`, 'g'), 'border-slate-100');
    newContent = newContent.replace(new RegExp(`border-${color}-100\\b`, 'g'), 'border-slate-200');
    newContent = newContent.replace(new RegExp(`border-${color}-200\\b`, 'g'), 'border-slate-300');
    newContent = newContent.replace(new RegExp(`border-${color}-300\\b`, 'g'), 'border-slate-400');
    newContent = newContent.replace(new RegExp(`border-${color}-400\\b`, 'g'), 'border-slate-500');
    newContent = newContent.replace(new RegExp(`border-${color}-500\\b`, 'g'), 'border-slate-600');
    newContent = newContent.replace(new RegExp(`border-${color}-600\\b`, 'g'), 'border-slate-700');
    newContent = newContent.replace(new RegExp(`border-${color}-700\\b`, 'g'), 'border-slate-800');

    newContent = newContent.replace(new RegExp(`ring-${color}-100\\b`, 'g'), 'ring-slate-200');
    newContent = newContent.replace(new RegExp(`ring-${color}-200\\b`, 'g'), 'ring-slate-300');
    newContent = newContent.replace(new RegExp(`ring-${color}-300\\b`, 'g'), 'ring-slate-400');
    newContent = newContent.replace(new RegExp(`ring-${color}-400\\b`, 'g'), 'ring-slate-500');
    newContent = newContent.replace(new RegExp(`ring-${color}-500\\b`, 'g'), 'ring-slate-500');
    newContent = newContent.replace(new RegExp(`ring-${color}-600\\b`, 'g'), 'ring-slate-600');

    newContent = newContent.replace(new RegExp(`from-${color}-50\\b`, 'g'), 'from-slate-100');
    newContent = newContent.replace(new RegExp(`from-${color}-100\\b`, 'g'), 'from-slate-200');
    newContent = newContent.replace(new RegExp(`from-${color}-500\\b`, 'g'), 'from-slate-600');
    newContent = newContent.replace(new RegExp(`from-${color}-600\\b`, 'g'), 'from-slate-700');
    newContent = newContent.replace(new RegExp(`to-${color}-50\\b`, 'g'), 'to-slate-100');
    newContent = newContent.replace(new RegExp(`to-${color}-100\\b`, 'g'), 'to-slate-200');
    newContent = newContent.replace(new RegExp(`to-${color}-500\\b`, 'g'), 'to-slate-600');
    newContent = newContent.replace(new RegExp(`to-${color}-600\\b`, 'g'), 'to-slate-700');
    newContent = newContent.replace(new RegExp(`via-${color}-50\\b`, 'g'), 'via-slate-100');
    newContent = newContent.replace(new RegExp(`via-${color}-100\\b`, 'g'), 'via-slate-200');
    newContent = newContent.replace(new RegExp(`via-${color}-500\\b`, 'g'), 'via-slate-600');

    newContent = newContent.replace(new RegExp(`fill-${color}-500\\b`, 'g'), 'fill-slate-600');
    newContent = newContent.replace(new RegExp(`fill-${color}-600\\b`, 'g'), 'fill-slate-700');
  }

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    filesModified++;
  }
}

console.log(`Modified ${filesModified} files replacing sky/indigo/cyan.`);
