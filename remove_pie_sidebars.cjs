const fs = require('fs');

const filesToProcess = [
  'src/pages/Overview/components/FinancialOverviewSection.jsx',
  'src/pages/Overview/components/ProjectStatusSection.jsx',
  'src/pages/Overview/components/SectorExpenditureSection.jsx',
  'src/pages/Overview/components/HouseExpenditureSection.jsx'
];

for (const file of filesToProcess) {
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove sm:grid-cols-2
  content = content.replace(/grid grid-cols-1 sm:grid-cols-2/g, 'grid grid-cols-1');

  // 2. Remove the Legend List div.
  // In all files, the legend is after the Recharts container.
  // It usually starts with something like {/* Breakdown Items */} or {/* Legend List with Hover Interactivity */}
  // and ends before </div>\n    </Card> or </div>\n        <div className="mt-4 pt-3
  
  // We can just find the end of the first child of the grid (the relative h-56 flex items-center justify-center div)
  // and remove everything after it until the end of the grid.
  // Since AST parsing is safer, but regex is faster for this specific format, let's just use string manipulation.

  const gridStart = content.indexOf('<div className="grid grid-cols-1');
  if (gridStart !== -1) {
    // We know the pie chart div starts with <div className="relative h-56 flex items-center justify-center">
    // and ends with </div> just before the legend comment.
    
    // Instead of complex matching, let's match the comment that introduces the legend and delete to the end of the grid div.
    let legendStartStr = '';
    if (content.includes('{/* Breakdown Items */}')) legendStartStr = '{/* Breakdown Items */}';
    else if (content.includes('{/* Legend Table with Hover Interaction */}')) legendStartStr = '{/* Legend Table with Hover Interaction */}';
    else if (content.includes('{/* Legend List with Hover Interactivity */}')) legendStartStr = '{/* Legend List with Hover Interactivity */}';
    else if (content.includes('{/* House List with Hover Interactivity */}')) legendStartStr = '{/* House List with Hover Interactivity */}';

    if (legendStartStr) {
      const legendStart = content.indexOf(legendStartStr);
      
      // We need to find the closing div of the grid.
      // The grid ends before </Card> or <div className="mt-4
      let gridEnd = content.indexOf('</Card>', legendStart);
      
      // For FinancialOverviewSection, there is a footer: <div className="mt-4 pt-3
      const footerStart = content.indexOf('<div className="mt-4 pt-3', legendStart);
      if (footerStart !== -1 && footerStart < gridEnd) {
        gridEnd = footerStart;
      } else {
        // Find the </div> right before </Card>
        gridEnd = content.lastIndexOf('</div>', gridEnd - 1);
      }

      // Cut out the legend
      if (legendStart !== -1 && gridEnd !== -1) {
        content = content.substring(0, legendStart) + content.substring(gridEnd);
      }
    }
  }

  fs.writeFileSync(file, content);
  console.log(`Processed ${file}`);
}
