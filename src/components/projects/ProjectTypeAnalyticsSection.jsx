import { Card } from '../ui/Card';
import { PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const ProjectTypeAnalyticsSection = ({ projectTypeDistribution = [] }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Projects & Expenditure by Sector Type</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Sector Distribution</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Horizontal Bar Chart */}
        <div className="lg:col-span-7 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectTypeDistribution}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '11px',
                }}
                formatter={(val, name, item) => [
                  `${val} projects (₹${item.payload.amountCr} Cr)`,
                  'Sector Metrics',
                ]}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {projectTypeDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
          {projectTypeDistribution.map((sec) => (
            <div
              key={sec.name}
              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600" style={{ backgroundColor: sec.color }} />
                <span className="font-bold text-slate-800">{sec.name}</span>
              </div>
              <div className="text-right font-mono font-semibold text-slate-700">
                <span>{sec.count} works</span>
                <span className="text-slate-400 font-normal block text-[11px]">₹{sec.amountCr} Cr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
