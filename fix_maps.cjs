const fs = require('fs');

function fixMap(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the pattern and replace it
  const pattern = `<div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        </div>`;
  const pattern2 = `<div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        </div>`;
        
  content = content.replace(pattern, `<div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">`);
  content = content.replace(pattern2, `<div className="absolute top-4 right-4 z-50 flex flex-col gap-2">`);
  
  fs.writeFileSync(file, content);
}

fixMap('src/components/maps/StateMap.jsx');
fixMap('src/components/maps/DistrictMap.jsx');
