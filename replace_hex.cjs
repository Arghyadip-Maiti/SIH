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
  { from: /#eff6ff/gi, to: '#f8fafc' },
  { from: /#dbeafe/gi, to: '#f1f5f9' },
  { from: /#bfdbfe/gi, to: '#e2e8f0' },
  { from: /#93c5fd/gi, to: '#cbd5e1' },
  { from: /#60a5fa/gi, to: '#94a3b8' },
  { from: /#3b82f6/gi, to: '#64748b' },
  { from: /#2563eb/gi, to: '#475569' },
  { from: /#1d4ed8/gi, to: '#334155' },
  { from: /#1e40af/gi, to: '#1e293b' },
  { from: /#1e3a8a/gi, to: '#0f172a' }
];

let filesModified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  for (const { from, to } of replacements) {
    newContent = newContent.replace(from, to);
  }

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    filesModified++;
  }
}

console.log(`Modified ${filesModified} files with hex codes.`);
