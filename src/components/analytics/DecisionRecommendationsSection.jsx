import { Target, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const DecisionRecommendationsSection = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Administrative Decision Recommendations
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Translating predictive analytical findings into concrete, actionable government review steps
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          {data.length} Action Directives Formulated
        </div>
      </div>

      <div className="space-y-4">
        {data.map((rec) => (
          <div key={rec.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-lg flex items-center justify-center flex-shrink-0">
                {rec.code}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">{rec.title}</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    {rec.badge}
                  </span>
                </div>
                <p className="text-xs font-semibold text-rose-700">
                  <strong>Reason:</strong> {rec.reason}
                </p>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  <strong>Suggested Action:</strong> {rec.suggestedAction}
                </p>
              </div>
            </div>

            <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-center md:w-56 flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Domain</span>
              <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">{rec.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionRecommendationsSection;
