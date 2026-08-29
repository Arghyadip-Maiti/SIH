const fs = require('fs');
let content = fs.readFileSync('src/pages/Overview/components/ExpenditureTrendSection.jsx', 'utf8');

if (!content.includes('import { HouseExpenditureSection }')) {
  content = content.replace(
    "import { Card } from '../../../components/ui/Card';",
    "import { Card } from '../../../components/ui/Card';\nimport { HouseExpenditureSection } from './HouseExpenditureSection';"
  );
}

// Update props
content = content.replace(
  /export const ExpenditureTrendSection = \(\{\s*expenditureTrend = \[\],\s*worksCompletedTrend = \[\],\s*\}\) => \{/,
  `export const ExpenditureTrendSection = ({
  expenditureTrend = [],
  worksCompletedTrend = [],
  houseExpenditure = {},
}) => {`
);

// Change to grid-cols-3
content = content.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">/,
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">`
);

// Insert HouseExpenditureSection in the middle
const targetInsertionPoint = `</ResponsiveContainer>
        </div>
      </Card>`;
const replacement = `</ResponsiveContainer>
        </div>
      </Card>
      
      {/* 2. House-wise Expenditure Breakdown (Middle) */}
      <HouseExpenditureSection houseExpenditure={houseExpenditure} disableWrapper={true} />`;

content = content.replace(targetInsertionPoint, replacement);

fs.writeFileSync('src/pages/Overview/components/ExpenditureTrendSection.jsx', content);
