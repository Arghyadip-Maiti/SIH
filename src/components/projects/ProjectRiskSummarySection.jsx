import { Card } from '../ui/Card';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const ProjectRiskSummarySection = ({ riskDistribution = [] }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Project Risk Distribution</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">AI Risk Classification</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Recharts Pie */}
        <div className="md:col-span-5 h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="count"
                nameKey="name"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
              >
                {riskDistribution.map((entry, index) => (
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

        {/* Risk Grid Cards */}
        <div className="md:col-span-7 grid grid-cols-2 gap-2.5">
          {riskDistribution.map((r) => (
            <div
              key={r.key}
              className="p-3 rounded-xl border space-y-1"
              style={{
                backgroundColor: `${r.color}10`,
                borderColor: `${r.color}35`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.name}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xl font-mono font-black text-slate-900">
                  {r.count.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  {r.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
