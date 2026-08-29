import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

export const YearOverYearSection = ({ yoyData = [] }) => {
  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <SectionHeader
        title="Year-over-Year Comparative Performance"
        subtitle="Benchmark current financial year (FY 2026–27) against previous financial year (FY 2025–26)"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
        {yoyData.map((item) => (
          <div
            key={item.metric}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {item.metric}
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-extrabold text-slate-900">{item.currentYear}</span>
                <span className="text-xs text-slate-400 font-semibold">{item.previousYear}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">YoY Delta</span>
              <span className={`inline-flex items-center gap-0.5 text-xs font-extrabold ${item.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {item.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{item.change}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
