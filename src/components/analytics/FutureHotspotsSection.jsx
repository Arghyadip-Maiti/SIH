import { AlertOctagon, TrendingUp, TrendingDown, ArrowUpRight, Filter } from 'lucide-react';

export const FutureHotspotsSection = ({ data = [], onApplyFilter }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Future Problem Hotspots
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Forward-looking hotspot detector: Predicting where administrative bottlenecks and financial stress will emerge next
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          Click hotspot to filter dashboard
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((hot) => {
          const isUp = hot.trend === 'UP';
          return (
            <div
              key={hot.id}
              onClick={() => onApplyFilter && onApplyFilter(hot.filterKey, hot.filterValue)}
              className="bg-slate-50 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {hot.entityType} • {hot.state}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isUp ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isUp ? <TrendingUp className="w-3 h-3 text-rose-600" /> : <TrendingDown className="w-3 h-3 text-amber-600" />}
                    {hot.metric}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
                  {hot.entityName}
                </h4>
                <p className="text-xs font-bold text-rose-600 mt-0.5">{hot.title}</p>
                <p className="text-xs font-medium text-slate-600 mt-2 leading-relaxed">
                  {hot.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-extrabold text-slate-700 group-hover:text-rose-700">
                <span className="flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600" />
                  Filter Analytics View
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FutureHotspotsSection;
