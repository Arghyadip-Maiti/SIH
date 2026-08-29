import { Card } from '../../../components/ui/Card';
import { HouseExpenditureSection } from './HouseExpenditureSection';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ExpenditureTrendSection = ({
  expenditureTrend = [],
  worksCompletedTrend = [],
  houseExpenditure = {},
}) => {
  const expData = expenditureTrend;
  const worksData = worksCompletedTrend;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* 1. Expenditure Trend Over Years */}
      <Card header={<h3 className="text-base font-bold text-slate-900">Expenditure Trend Over Years (₹ Cr)</h3>}>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={expData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip
                formatter={(val) => [`₹${val?.toLocaleString('en-IN')} Cr`, 'Expenditure']}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#475569"
                strokeWidth={3}
                dot={{ r: 4, fill: '#475569' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      

      
      {/* 2. Works Completed Over Years */}
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
                stroke="#475569"
                strokeWidth={3}
                dot={{ r: 4, fill: '#475569' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      {/* 2. House-wise Expenditure Breakdown (Middle) */}
      <HouseExpenditureSection houseExpenditure={houseExpenditure} disableWrapper={true} />
    </div>
  );
};

