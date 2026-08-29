import { IndianRupee, TrendingUp, AlertCircle, Percent, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const FinancialOutlookSection = ({ data }) => {
  if (!data) return null;

  const {
    totalSanctionedCr,
    totalExpCr,
    currentUtilPct,
    forecastUtilPct,
    unutilizedFundsCr,
    expenditureGrowthPct,
    futurePressureIndex,
    financialSummaryText,
  } = data;

  const getPressureBadge = (idx) => {
    switch (idx) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Financial Outlook & Expenditure Predictions
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Analyzing future fiscal disbursement behavior, utilization trajectories, and unutilized fund liability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Future Financial Pressure:</span>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getPressureBadge(futurePressureIndex)}`}>
            {futurePressureIndex} PRESSURE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Fund Utilization</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{currentUtilPct}%</div>
          <span className="text-[11px] font-semibold text-slate-500">Recorded Disbursed Ratio</span>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Forecast Fund Utilization</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{forecastUtilPct}%</div>
          <span className="text-[11px] font-semibold text-emerald-800">Predicted Fiscal Year-End</span>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Expected Unutilized Funds</span>
          <div className="text-2xl font-black text-amber-700 mt-1">₹{unutilizedFundsCr} Cr</div>
          <span className="text-[11px] font-semibold text-amber-800">Predicted Year-End Balance</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expenditure Growth</span>
          <div className="text-2xl font-black text-blue-600 mt-1 flex items-center gap-1">
            <span>+{expenditureGrowthPct}%</span>
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Quarter-on-Quarter Momentum</span>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-bold text-slate-200">{financialSummaryText}</p>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-300 px-3 py-1 rounded-xl border border-slate-700 hidden sm:inline-block">
          Financial Intelligence Model
        </span>
      </div>
    </div>
  );
};

export default FinancialOutlookSection;
