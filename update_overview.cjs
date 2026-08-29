const fs = require('fs');
let content = fs.readFileSync('src/pages/Overview/OverviewPage.jsx', 'utf8');

// Pass houseExpenditure to ExpenditureTrendSection
content = content.replace(
  /<ExpenditureTrendSection\s+expenditureTrend=\{expenditureTrend\}\s+worksCompletedTrend=\{worksCompletedTrend\}\s+\/>/,
  `<ExpenditureTrendSection
        expenditureTrend={expenditureTrend}
        worksCompletedTrend={worksCompletedTrend}
        houseExpenditure={houseExpenditure}
      />`
);

// Remove HouseExpenditureSection completely from JSX
content = content.replace(/\{\/\* 9\. House-wise Expenditure Breakdown \*\/\}\s*<HouseExpenditureSection houseExpenditure=\{houseExpenditure\} \/>/, '');

// Also remove import of HouseExpenditureSection from OverviewPage
content = content.replace(/import \{ HouseExpenditureSection \} from '\.\/components\/HouseExpenditureSection';\n/, '');

fs.writeFileSync('src/pages/Overview/OverviewPage.jsx', content);
