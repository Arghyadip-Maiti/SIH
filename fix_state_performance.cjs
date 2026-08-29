const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/StatePerformanceSection.jsx', 'utf8');

// Import CustomSelect
if (!content.includes('import { CustomSelect }')) {
  content = content.replace("import { Button } from '../../../components/ui/Button';", "import { Button } from '../../../components/ui/Button';\nimport { CustomSelect } from '../../../components/ui/CustomSelect';");
}

// Replace State Metric Dropdown
const stateMetricSelect = `<select
                value={stateMetric}
                onChange={(e) => setStateMetric(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="utilization">Utilization %</option>
                <option value="expenditure">Expenditure (₹ Cr)</option>
              </select>`;
const customStateMetric = `<CustomSelect
                value={stateMetric}
                onChange={setStateMetric}
                options={[{value: 'utilization', label: 'Utilization %'}, {value: 'expenditure', label: 'Expenditure (₹ Cr)'}]}
                defaultLabel="Metric"
              />`;
content = content.replace(stateMetricSelect, customStateMetric);

// Replace State Order Dropdown
const stateOrderSelect = `<select
                value={stateOrder}
                onChange={(e) => setStateOrder(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="highest">Highest First</option>
                <option value="lowest">Lowest First</option>
              </select>`;
const customStateOrder = `<CustomSelect
                value={stateOrder}
                onChange={setStateOrder}
                options={[{value: 'highest', label: 'Highest First'}, {value: 'lowest', label: 'Lowest First'}]}
                defaultLabel="Order"
              />`;
content = content.replace(stateOrderSelect, customStateOrder);

// Replace District Metric Dropdown
const districtMetricSelect = `<select
                value={districtMetric}
                onChange={(e) => setDistrictMetric(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="expenditure">Expenditure (₹ Cr)</option>
                <option value="utilization">Utilization %</option>
              </select>`;
const customDistrictMetric = `<CustomSelect
                value={districtMetric}
                onChange={setDistrictMetric}
                options={[{value: 'expenditure', label: 'Expenditure (₹ Cr)'}, {value: 'utilization', label: 'Utilization %'}]}
                defaultLabel="Metric"
              />`;
content = content.replace(districtMetricSelect, customDistrictMetric);

// Replace District Order Dropdown
const districtOrderSelect = `<select
                value={districtOrder}
                onChange={(e) => setDistrictOrder(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="highest">Highest First</option>
                <option value="lowest">Lowest First</option>
              </select>`;
const customDistrictOrder = `<CustomSelect
                value={districtOrder}
                onChange={setDistrictOrder}
                options={[{value: 'highest', label: 'Highest First'}, {value: 'lowest', label: 'Lowest First'}]}
                defaultLabel="Order"
              />`;
content = content.replace(districtOrderSelect, customDistrictOrder);

fs.writeFileSync('src/pages/Overview/components/StatePerformanceSection.jsx', content);
