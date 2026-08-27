import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';

export const ProjectStatusSection = ({ statusDistribution = [] }) => {
  return (
    <Card
      header={
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Project Status Distribution</h3>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Recharts Donut */}
        <div className="md:col-span-5 h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="count"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '11px',
                }}
                formatter={(value, name) => [`${value} projects`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Items List */}
        <div className="md:col-span-7 space-y-2.5">
          {statusDistribution.map((st) => (
            <div key={st.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  {st.name}
                </span>
                <span className="font-mono text-slate-900">
                  {st.count.toLocaleString('en-IN')}{' '}
                  <span className="text-slate-400 font-normal text-[11px]">({st.percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${st.percentage}%`, backgroundColor: st.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
