import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';

export const ProjectTypeAnalysisSection = ({ data = [], onSectorClick }) => {
  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <SectionHeader
        title="Projects by Sector / Type"
        subtitle="Sectoral distribution of MPLADS infrastructure works and capital allocation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center mt-3">
        {/* Chart View */}
        <div className="lg:col-span-7 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}Cr`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} width={150} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                formatter={(val, name, entry) => [`₹${val} Cr (${entry.payload.count} works)`, 'Expenditure']}
              />
              <Bar
                dataKey="expenditureCr"
                fill="#475569"
                radius={[0, 8, 8, 0]}
                barSize={18}
                onClick={(entry) => onSectorClick && onSectorClick(entry.name)}
                className="cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Summary List */}
        <div className="lg:col-span-5 space-y-2 max-h-64 overflow-y-auto pr-1">
          {data.map((sector) => (
            <button
              key={sector.name}
              onClick={() => onSectorClick && onSectorClick(sector.name)}
              className="w-full p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800 group-hover:text-slate-800">
                  {sector.name}
                </span>
                <span className="text-xs font-extrabold text-slate-800">
                  ₹{sector.expenditureCr} Cr
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>{sector.count} Works</span>
                <span>Avg: ₹{sector.avgCostLakhs} L</span>
                <span className="text-emerald-600">{sector.utilization}% Utilized</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
