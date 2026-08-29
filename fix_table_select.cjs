const fs = require('fs');
let content = fs.readFileSync('src/components/projects/ProjectTableSection.jsx', 'utf8');

if (!content.includes('CustomSelect')) {
  content = content.replace("import { Card } from '../ui/Card';", "import { Card } from '../ui/Card';\nimport { CustomSelect } from '../ui/CustomSelect';");
}

const regex = /<select[\s\S]*?<\/select>/;
const replacement = `<CustomSelect
                  value={pageSize}
                  onChange={(val) => {
                    setPageSize(Number(val));
                    setPage(1);
                  }}
                  options={[
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' }
                  ]}
                />`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/projects/ProjectTableSection.jsx', content);
