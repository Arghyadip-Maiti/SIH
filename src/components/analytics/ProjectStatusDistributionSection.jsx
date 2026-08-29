import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';

export const ProjectStatusDistributionSection = ({ data = [], onStatusClick }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <SectionHeader
        title="Project Status Distribution"
        subtitle="Breakdown of works by active implementation stage"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-2">
        {/* Donut Canvas */}
        <div className="md:col-span-5 h-56 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                  cornerRadius={6}
                onClick={(entry) => onStatusClick && onStatusClick(entry.key)}
                className="cursor-pointer"
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} stroke="#FFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
                formatter={(val, name, entry) => [`${val} works (${entry.payload.percentage}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-extrabold text-slate-900 leading-none">{total}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Works</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="md:col-span-7 space-y-2">
          {data.map((item) => (
            <button
              key={item.key}
              onClick={() => onStatusClick && onStatusClick(item.key)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-800">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900">{item.count}</span>
                <span className="text-[11px] font-semibold text-slate-500 w-12 text-right">
                  {item.percentage}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
