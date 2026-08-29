import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Sparkles, AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const TrendInsightsSection = ({ insights = [] }) => {
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'POSITIVE':
        return {
          icon: CheckCircle2,
          border: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
          badge: 'bg-emerald-100 text-emerald-800',
          iconColor: 'text-emerald-600',
        };
      case 'CRITICAL':
        return {
          icon: AlertTriangle,
          border: 'border-rose-200 bg-rose-50/60 text-rose-900',
          badge: 'bg-rose-100 text-rose-800',
          iconColor: 'text-rose-600',
        };
      case 'WARNING':
        return {
          icon: AlertCircle,
          border: 'border-amber-200 bg-amber-50/60 text-amber-900',
          badge: 'bg-amber-100 text-amber-800',
          iconColor: 'text-amber-600',
        };
      default:
        return {
          icon: Info,
          border: 'border-slate-300 bg-slate-100/60 text-slate-950',
          badge: 'bg-slate-200 text-slate-900',
          iconColor: 'text-slate-700',
        };
    }
  };

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
          <Sparkles className="w-5 h-5" />
        </div>
        <SectionHeader
          title="Key Intelligence Insights"
          subtitle="Real-time analytical anomalies, progress alerts, and financial insights synthesized from active scope data"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((item) => {
          const style = getBadgeStyle(item.type);
          const Icon = style.icon;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border ${style.border} flex items-start gap-3 transition-all`}
            >
              <div className={`p-2 rounded-xl bg-white  shrink-0 ${style.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${style.badge}`}>
                    {item.category || item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
