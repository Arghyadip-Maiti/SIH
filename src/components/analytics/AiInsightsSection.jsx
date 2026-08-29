import { Brain, AlertCircle, TrendingUp, CheckCircle, Lightbulb, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AiInsightsSection = ({ insights = [], kpis = {} }) => {
  if (!insights || insights.length === 0) return null;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50/80 hover:bg-rose-50',
          border: 'border-rose-200',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
          accent: 'text-rose-700',
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-50/80 hover:bg-amber-50',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
          accent: 'text-amber-700',
        };
      case 'POSITIVE':
        return {
          bg: 'bg-emerald-50/80 hover:bg-emerald-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
          accent: 'text-emerald-700',
        };
      default:
        return {
          bg: 'bg-slate-50/80 hover:bg-slate-100/80',
          border: 'border-slate-200',
          badge: 'bg-slate-200 text-slate-800 border-slate-300',
          icon: <Lightbulb className="w-5 h-5 text-slate-600" />,
          accent: 'text-slate-700',
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Key Analytical & AI Insights
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Synthesis of historical anomalies, active trends, and predicted administrative attention points
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 hidden sm:inline-block">
          {insights.length} Active Syntheses
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const style = getTypeStyles(item.type);
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border ${style.border} ${style.bg} transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {style.icon}
                    <h4 className={`text-base font-extrabold ${style.accent}`}>{item.title}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Supporting Metrics & Forecast Callout */}
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-slate-700">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                  <span>Forecast:</span>
                  <span className="text-slate-900 font-extrabold ml-1">
                    {item.type === 'CRITICAL' ? 'High Risk escalation' : item.type === 'WARNING' ? 'Escalation likely' : 'Stable progress'}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                  <span>View context</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AiInsightsSection;
