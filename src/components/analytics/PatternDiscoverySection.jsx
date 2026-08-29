import { Search, Compass, AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const PatternDiscoverySection = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Pattern Discovery & Relationship Detection
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Empirical pattern mining: Identifying non-obvious operational dependencies across sectors, regions, and vendors
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          {data.length} Patterns Mining Confirmed
        </div>
      </div>

      <div className="space-y-4">
        {data.map((pat) => (
          <div key={pat.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">{pat.affectedDomain}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {pat.confidencePct}% Confidence Rating
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900">{pat.title}</h4>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{pat.pattern}</p>
              <p className="text-[11px] font-medium text-slate-500 italic">Supporting Data: {pat.supportingData}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 md:w-72 flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Potential Future Implication</span>
              <p className="text-xs font-bold text-slate-800 leading-snug">{pat.futureImplication}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternDiscoverySection;
