const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/ExpenditureTrendSection.jsx', 'utf8');

const houseSection = `{/* 2. House-wise Expenditure Breakdown (Middle) */}
      <HouseExpenditureSection houseExpenditure={houseExpenditure} disableWrapper={true} />`;

const worksSection = `{/* 2. Works Completed Over Years */}
      <Card header={<h3 className="text-base font-bold text-slate-900">Works Completed Over Years</h3>}>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={worksData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip
                formatter={(val) => [val?.toLocaleString('en-IN'), 'Completed Works']}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#16A34A"
                strokeWidth={3}
                dot={{ r: 4, fill: '#16A34A' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>`;

// Replace both with empty, then put them back in the new order
content = content.replace(houseSection, '');
content = content.replace(worksSection, '');

content = content.replace('    </div>\n  );\n};', `      ${worksSection}\n      ${houseSection}\n    </div>\n  );\n};\n`);

fs.writeFileSync('src/pages/Overview/components/ExpenditureTrendSection.jsx', content);
