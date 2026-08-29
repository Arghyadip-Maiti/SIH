const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/IndiaMapSection.jsx', 'utf8');

const btnBlock = `{zoomedState && (
              <Button onClick={handleBackToIndia} variant="outline" size="sm" className="hidden sm:flex">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to India Map
              </Button>
            )}`;

content = content.replace(btnBlock, '');

fs.writeFileSync('src/pages/Overview/components/IndiaMapSection.jsx', content);
