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

let filesModified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Regex to match Tailwind shadow classes
  // shadow, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-inner, shadow-none, drop-shadow-*, shadow-[...]
  // We want to remove these tokens entirely, leaving just a single space if it was between other classes.
  
  newContent = newContent.replace(/\bshadow(?:-[a-z0-9]+)*\b/g, '');
  newContent = newContent.replace(/\bdrop-shadow(?:-[a-z0-9]+)*\b/g, '');

  // After removing, we might have multiple spaces. Let's clean up multiple spaces inside classNames.
  // This is a bit tricky, but generally fine to just leave multiple spaces in className strings, React handles it perfectly.
  // Let's just fix up double spaces inside quotes to be clean.
  // Actually, standard `replace` is safe and React doesn't mind double spaces in `className`.

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    filesModified++;
  }
}

console.log(`Modified ${filesModified} files removing shadows.`);
