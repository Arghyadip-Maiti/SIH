import { Sparkles, Clock, TrendingUp, Camera, DollarSign, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';

export const EarlyWarningPanel = ({ earlyWarnings = {}, onWarningClick }) => {
  const {
    delayLikelyCount = 0,
    costExceedLikelyCount = 0,
    photoIrregularityCount = 0,
    paymentMismatchCount = 0,
  } = earlyWarnings;

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-slate-900 text-white  mb-6 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-slate-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-700/20 text-slate-500 border border-slate-600/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>🔮 AI EARLY WARNING SYSTEM</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Predictive risk indicators for proactive intervention before milestone failure
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          Real-time Predictive Analytics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Warning 1: Likely to be Delayed */}
        <div
          onClick={() => onWarningClick && onWarningClick('anomalyType', 'Timeline / Delay')}
          className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-rose-500/50 hover:bg-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Delay Risk</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight group-hover:text-rose-300 transition-colors">
            {delayLikelyCount.toLocaleString()} works
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Likely to be delayed</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Warning 2: Likely to Exceed Cost */}
        <div
          onClick={() => onWarningClick && onWarningClick('anomalyType', 'Financial')}
          className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 hover:bg-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Cost Overrun Risk</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight group-hover:text-amber-300 transition-colors">
            {costExceedLikelyCount.toLocaleString()} works
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Likely to exceed sanctioned cost</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Warning 3: Photo Irregularities */}
        <div
          onClick={() => onWarningClick && onWarningClick('anomalyType', 'Photo')}
          className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-purple-500/50 hover:bg-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              <span>Photo Irregularities</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors">
            {photoIrregularityCount.toLocaleString()} works
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Duplicate / location mismatch</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Warning 4: Payment vs Physical Progress Mismatch */}
        <div
          onClick={() => onWarningClick && onWarningClick('anomalyType', 'Payment-Progress Mismatch')}
          className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600/50 hover:bg-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              <span>Payment Mismatch</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-slate-700" />
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight group-hover:text-slate-400 transition-colors">
            {paymentMismatchCount.toLocaleString()} works
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Disbursement &gt; physical progress</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>
    </Card>
  );
};
